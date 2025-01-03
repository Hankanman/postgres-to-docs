import { getSchema, TableDescription } from './get-schema'
import { createDatabase } from './database'
import { format } from './format'
import { createRepository } from './repository'
import { parseConfig } from './config'
import * as File from './file'
import * as path from 'path'

export const generateDocumentation = async (
  configPath: string,
  outputPath?: string,
  schema?: string,
  includeTables?: string[],
  excludeTables?: string[],
  includeTypes?: boolean,
  pureMarkdown?: boolean,
  includeRLS?: boolean,
  includeToc?: boolean,
  includeFunctions?: boolean
) => {
  const config = parseConfig(await File.read(configPath))
  const database = await createDatabase(config)
  const repository = createRepository(
    database.query, 
    schema || config.schema,
    includeTables || config.includeTables,
    excludeTables || config.excludeTables
  )
  try {
    let schemaData = await getSchema(repository)
    
    // Print list of tables
    console.log('Tables included in documentation:')
    if (schemaData.tables.length === 0) {
      console.log('None')
    } else {
      schemaData.tables.forEach(table => {
        console.log(`- ${table.name}`)
      })
    }
    
    // Print list of views
    console.log('\nViews found:')
    if (schemaData.views.length === 0) {
      console.log('None')
    } else {
      schemaData.views.forEach(view => {
        console.log(`- ${view.name}`)
      })
    }

    // Print list of functions
    const includeFunctionsFlag = includeFunctions !== undefined ? includeFunctions : config.includeFunctions
    if (includeFunctionsFlag) {
      console.log('\nFunctions found:')
      if (schemaData.functions.length === 0) {
        console.log('None')
      } else {
        schemaData.functions.forEach(func => {
          console.log(`- ${func.name}(${func.arguments}) -> ${func.returnType}`)
        })
      }
    }

    // Print list of RLS policies
    console.log('\nRow Level Security policies found:')
    if (schemaData.rlsPolicies.length === 0) {
      console.log('None')
    } else {
      schemaData.rlsPolicies.forEach(policy => {
        console.log(`- ${policy.table}: ${policy.name} (${policy.command})`)
      })
    }

    const includeTypesFlag = includeTypes !== undefined ? includeTypes : config.includeTypes
    const pureMarkdownFlag = pureMarkdown !== undefined ? pureMarkdown : config.pureMarkdown
    const includeRLSFlag = includeRLS !== undefined ? includeRLS : config.includeRLS
    const includeTocFlag = includeToc !== undefined ? includeToc : config.includeToc
    const finalOutputPath = outputPath || config.output || `schema-${config.database}.md`
    
    // Ensure the output directory exists
    const outputDir = path.dirname(finalOutputPath)
    await File.ensureDirectoryExists(outputDir)
    
    await File.write(
      finalOutputPath, 
      format(schemaData, includeTypesFlag, pureMarkdownFlag, includeRLSFlag, includeTocFlag, includeFunctionsFlag)
    )
    console.log(`\nDocumentation written to ${finalOutputPath}`)
  } catch (e) {
    throw e
  } finally {
    await database.disconnect()
  }
}