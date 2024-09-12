import {
  ColumnDescription,
  Schema,
  TableDescription,
  CompositeTypeDescription,
} from './get-schema'
import { CustomType, RLSPolicy } from './repository'
import json2md from 'json2md'
import typeDocumentation from './postgre-data-types.json'

const TYPES = typeDocumentation as any

type TocItem = string;

export const format = (
  schema: Schema,
  includeTypes: boolean = true,
  pureMarkdown: boolean = false,
  includeRLS: boolean = true,
  includeToc: boolean = true
) => {
  const customTypeNames = schema.customTypes.map((t) => t.name)
  const compositeTypeNames = schema.compositeTypes.map((t) => t.name)
  const typeNames = new Set(customTypeNames.concat(compositeTypeNames))

  const sections = [
    generateTableSection(schema.tables, typeNames, schema.rlsPolicies, pureMarkdown, includeRLS),
    generateViewsSection(schema.views, typeNames, pureMarkdown),
    ...(includeTypes ? [generateTypesSection(
      schema.customTypes,
      schema.compositeTypes,
      typeNames,
      pureMarkdown
    )] : []),
  ].flat()

  if (includeToc) {
    const toc = generateTableOfContents(sections)
    return json2md([
      { h1: 'Database Schema Documentation' },
      { h2: 'Table of Contents' },
      ...toc.map(item => item === '' ? { p: '' } : { p: item }),
      { hr: '' },
      ...sections
    ])
  }
  else {
    return json2md([
      { h1: 'Database Schema Documentation' },
      { hr: '' },
      ...sections
    ])
  }
}

const generateTableOfContents = (sections: any[]): TocItem[] => {
  const toc: TocItem[] = [];
  let currentH2: string | null = null;

  for (const section of sections) {
    if (section.h2) {
      currentH2 = section.h2;
      toc.push(`- [${section.h2}](#${section.h2.toLowerCase().replace(/\s+/g, '-')})`);
    } else if (section.h3) {
      toc.push(`  - [${section.h3}](#${section.h3.toLowerCase().replace(/\s+/g, '-')})`);
    }
  }

  return toc;
}


const generateTableSection = (
  tables: TableDescription[],
  typeNames: Set<string>,
  rlsPolicies: RLSPolicy[],
  pureMarkdown: boolean,
  includeRLS: boolean
) => {
  if (tables.length === 0) {
    return []
  }

  return [{ h2: 'Tables' }, ...tables.flatMap(table =>
    generateTableDescription(table, typeNames, rlsPolicies, pureMarkdown, includeRLS)
  )]
}

const generateViewsSection = (views: TableDescription[], typeNames: Set<string>, pureMarkdown: boolean) => {
  if (views.length === 0) {
    return []
  }

  return [{ h2: 'Views' }, generateTablesMarkdown(views, typeNames, pureMarkdown)]
}

const generateTypesSection = (
  customTypes: CustomType[],
  compositeTypes: CompositeTypeDescription[],
  typeNames: Set<string>,
  pureMarkdown: boolean
) => {
  if (customTypes.length === 0 && compositeTypes.length === 0) {
    return []
  }

  return [
    { h2: 'Types' },
    generateTypesMarkdown(customTypes, compositeTypes, typeNames, pureMarkdown),
  ]
}

const generateTablesMarkdown = (
  tables: TableDescription[],
  typeNames: Set<string>,
  pureMarkdown: boolean,
  rlsPolicies: RLSPolicy[] = [],
  includeRLS: boolean = true
) => tables.map((t) => generateTableDescription(t, typeNames, rlsPolicies, pureMarkdown, includeRLS))

const generateTypesMarkdown = (
  customTypes: CustomType[],
  compositeTypes: CompositeTypeDescription[],
  typeNames: Set<string>,
  pureMarkdown: boolean
) =>
  [
    generateCustomTypesMarkdown(customTypes, pureMarkdown),
    generateCompositeTypesMarkdown(compositeTypes, typeNames, pureMarkdown),
  ].flat()

const generateCustomTypesMarkdown = (
  customTypes: CustomType[],
  pureMarkdown: boolean
) => {
  return customTypes
    .map((custom) => generateCustomTypeMarkdown(custom, pureMarkdown))
    .flat()
}

const generateCustomTypeMarkdown = (
  custom: CustomType,
  pureMarkdown: boolean
) => {
  let nameWithAnchor = pureMarkdown
    ? custom.name
    : '<a name="' + custom.name + '" > </a>' + custom.name
  return [
    { h3: nameWithAnchor },
    { ul: custom.elements.map((elem) => elem.trim()) },
  ]
}

const generateCompositeTypesMarkdown = (
  compositeTypes: CompositeTypeDescription[],
  customTypeNames: Set<string>,
  pureMarkdown: boolean
) => {
  return compositeTypes
    .map((composite) =>
      generateCompositeTypeMarkdown(composite, customTypeNames, pureMarkdown)
    )
    .flat()
}

const generateCompositeTypeMarkdown = (
  composite: CompositeTypeDescription,
  customTypeNames: Set<string>,
  pureMarkdown: boolean
) => {
  const headers = ['column name', 'type', 'position', 'required?']
  let nameWithAnchor = pureMarkdown
    ? composite.name
    : '<a name="' + composite.name + '" > </a>' + composite.name
  let rows = composite.fields.map((field) => {
    const typeWithLink = maybeCreateTypeLink(field.dataType, customTypeNames, pureMarkdown)
    return [
      field.name,
      typeWithLink,
      field.position,
      field.isRequired.toString(),
    ]
  })
  return [
    { h3: nameWithAnchor },
    {
      table: {
        headers: headers,
        rows: rows,
      },
    },
  ]
}

const maybeCreateTypeLink = (type: string, customTypeNames: Set<string>, pureMarkdown: boolean) => {
  if (customTypeNames.has(type)) return pureMarkdown ? type : `[${type}](#${type})`
  const docsUrl = type.match(/character \(\d+\)/) ? TYPES['character'] : TYPES[type]
  if (docsUrl) return pureMarkdown ? type : `<a href="${docsUrl}">${type}</a>`
  return type
}

const generateTableDescription = (
  tableDescription: TableDescription,
  typeNames: Set<string>,
  rlsPolicies: RLSPolicy[],
  pureMarkdown: boolean,
  includeRLS: boolean
) => {
  const nameWithAnchor = pureMarkdown
    ? tableDescription.name
    : `<a name="${tableDescription.name}"></a>${tableDescription.name}`

  const tablePolicies = rlsPolicies.filter(policy => policy.table === tableDescription.name)

  return [
    { h3: nameWithAnchor },
    generateMarkdownTable(tableDescription.columns, typeNames, pureMarkdown),
    ...(includeRLS && tablePolicies.length > 0 ? generateRLSPoliciesSection(tablePolicies, pureMarkdown) : []),
  ]
}

const generateRLSPoliciesSection = (policies: RLSPolicy[], pureMarkdown: boolean) => {
  return [
    { h4: 'Row-Level Security Policies' },
    ...policies.map(policy => generateRLSPolicyDescription(policy, pureMarkdown))
  ]
}

const generateRLSPolicyDescription = (policy: RLSPolicy, pureMarkdown: boolean) => {
  return [
    { p: `**Policy**: ${policy.name}` },
    { p: `**Command**: ${policy.command}` },
    { p: `**Roles**: ${policy.roles.join(', ')}` },
    { p: '**Definition**:' },
    { code: { language: 'sql', content: policy.definition } },
    ...(policy.using ? [
      { p: '**USING expression**:' },
      { code: { language: 'sql', content: policy.using } }
    ] : []),
    ...(policy.withCheck ? [
      { p: '**WITH CHECK expression**:' },
      { code: { language: 'sql', content: policy.withCheck } }
    ] : []),
  ]
}

const generateMarkdownTable = (
  columns: ColumnDescription[],
  typeNames: Set<string>,
  pureMarkdown: boolean
) => {
  const headers = ['Name', 'Type', 'Default', 'Nullable', 'References']
  const rows = columns.map((column) => [
    formatColumnName(column.name, column.isPrimaryKey, pureMarkdown),
    formatDataType(column.dataType, typeNames, pureMarkdown),
    formatDefault(column.default),
    formatIsNullable(column.isNullable),
    formatForeignKey(pureMarkdown, column.foreignKey),
  ])

  return {
    table: {
      aligns: 'left',
      headers: headers,
      rows: rows,
    },
  }
}

const formatColumnName = (name: string, isPrimaryKey: boolean, pureMarkdown: boolean) =>
  isPrimaryKey
    ? pureMarkdown
      ? `${name} (PK)`
      : `${name} <span style="background: #ddd; padding: 2px; font-size: 0.75rem; color: black">PK</span>`
    : name

const formatDataType = (type: string, typeNames: Set<string>, pureMarkdown: boolean) =>
  maybeCreateTypeLink(type, typeNames, pureMarkdown)

const formatDefault = (def?: string) => def || ''

const formatIsNullable = (isNullable: boolean) =>
  isNullable ? 'True' : 'False'

const formatForeignKey = (pureMarkdown: boolean, foreignKey?: string) =>
  foreignKey ? formatForeignKeyLink(foreignKey, pureMarkdown) : ''

const formatForeignKeyLink = (foreignKey: string, pureMarkdown: boolean) => {
  const otherTable = foreignKey.split('.')[0]
  return pureMarkdown ? foreignKey : `[${foreignKey}](#${otherTable})`
}