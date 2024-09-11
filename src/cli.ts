#!/usr/bin/env node

import { generateDocumentation } from '.'
import { parseArguments } from './arguments'
import { getDefaultConfigPath } from './config'
import * as fs from 'fs'

const run = async () => {
  const rawArguments = parseArguments(process.argv)
  const configPath = rawArguments.config || getDefaultConfigPath()

  if (!fs.existsSync(configPath)) {
    console.error(`Error: Config file not found at ${configPath}`)
    process.exit(1)
  }

  try {
    console.log('Generating documentation...')
    await generateDocumentation(
      configPath,
      rawArguments.output,
      rawArguments.schema,
      rawArguments.includeTables ? rawArguments.includeTables.split(',') : undefined,
      rawArguments.excludeTables ? rawArguments.excludeTables.split(',') : undefined,
      rawArguments.includeTypes !== undefined ? rawArguments.includeTypes === 'true' : undefined,
      rawArguments.pureMarkdown !== undefined ? rawArguments.pureMarkdown === 'true' : undefined
    )
    console.log('Documentation generated successfully!')
  } catch (e: unknown) {
    console.error('Error generating documentation:', e instanceof Error ? e.message : String(e))
    if (e instanceof Error && e.stack) {
      console.error('Stack trace:', e.stack)
    }
    process.exit(1)
  }
}

run()