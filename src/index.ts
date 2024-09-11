import { getSchema, TableDescription } from './get-schema'
import { createDatabase } from './database'
import { format } from './format'
import { createRepository } from './repository'
import { parseConfig } from './config'
import * as File from './file'

export const generateDocumentation = async (
  configPath: string,
  outputPath: string,
  schema?: string,
  includeTables?: string[],
  excludeTables?: string[],
  includeTypes?: boolean
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
    await File.write(outputPath, format(schemaData, includeTypesFlag))
    console.log(`\nDocumentation written to ${outputPath}`)
  } catch (e) {
    throw e
  } finally {
    await database.disconnect()
  }
}