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
  pureMarkdown?: boolean
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
    schemaData.tables.forEach(table => {
      console.log(`- ${table.name}`)
    })
    
    // Print list of views
    console.log('\nViews found:')
    schemaData.views.forEach(view => {
      console.log(`- ${view.name}`)
    })

    const includeTypesFlag = includeTypes !== undefined ? includeTypes : config.includeTypes
    const pureMarkdownFlag = pureMarkdown !== undefined ? pureMarkdown : config.pureMarkdown
    const finalOutputPath = outputPath || config.output || `schema-${config.database}.md`
    
    // Ensure the output directory exists
    const outputDir = path.dirname(finalOutputPath)
    await File.ensureDirectoryExists(outputDir)
    
    await File.write(finalOutputPath, format(schemaData, includeTypesFlag, pureMarkdownFlag))
    console.log(`\nDocumentation written to ${finalOutputPath}`)
  } catch (e) {
    throw e
  } finally {
    await database.disconnect()
  }
}