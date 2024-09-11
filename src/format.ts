import {
  ColumnDescription,
  Schema,
  TableDescription,
  CompositeTypeDescription,
} from './get-schema'
import { CustomType } from './repository'
import json2md from 'json2md'
import typeDocumentation from './postgre-data-types.json'

const TYPES = typeDocumentation as any

export const format = (schema: Schema, includeTypes: boolean = true, pureMarkdown: boolean = false) => {
  const customTypeNames = schema.customTypes.map((t) => t.name)
  const compositeTypeNames = schema.compositeTypes.map((t) => t.name)
  const typeNames = new Set(customTypeNames.concat(compositeTypeNames))
  return json2md(
    [
      generateTableSection(schema.tables, typeNames, pureMarkdown),
      generateViewsSection(schema.views, typeNames, pureMarkdown),
      ...(includeTypes ? [generateTypesSection(
        schema.customTypes,
        schema.compositeTypes,
        typeNames,
        pureMarkdown
      )] : []),
    ].flat()
  )
}

const generateTableSection = (tables: TableDescription[], typeNames: Set<string>, pureMarkdown: boolean) => {
  if (tables.length === 0) {
    return []
  }

  return [{ h1: 'Tables' }, generateTablesMarkdown(tables, typeNames, pureMarkdown)]
}

const generateViewsSection = (views: TableDescription[], typeNames: Set<string>, pureMarkdown: boolean) => {
  if (views.length === 0) {
    return []
  }

  return [{ h1: 'Views' }, generateTablesMarkdown(views, typeNames, pureMarkdown)]
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
    { h1: 'Types' },
    generateTypesMarkdown(customTypes, compositeTypes, typeNames, pureMarkdown),
  ]
}

const generateTablesMarkdown = (
  tables: TableDescription[],
  typeNames: Set<string>,
  pureMarkdown: boolean
) => tables.map((t) => generateTableDescription(t, typeNames, pureMarkdown))

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
  pureMarkdown: boolean
) => {
  const nameWithAnchor = pureMarkdown 
    ? tableDescription.name
    : `<a name="${tableDescription.name}"></a>${tableDescription.name}`
  return [
    { h3: nameWithAnchor },
    generateMarkdownTable(tableDescription.columns, typeNames, pureMarkdown),
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