#!/usr/bin/env node

import { generateDocumentation } from '.'
import { parseArguments } from './arguments'

const run = async () => {
  const rawArguments = parseArguments(process.argv)
  if (!rawArguments.config || !rawArguments.output) {
    console.log('Error: "--config" and "--output" are required')
    process.exit(1)
  }

  try {
    console.log('Generating documentation...')
    await generateDocumentation(
      rawArguments.config, 
      rawArguments.output, 
      rawArguments.schema,
      rawArguments.includeTables ? rawArguments.includeTables.split(',') : undefined,
      rawArguments.excludeTables ? rawArguments.excludeTables.split(',') : undefined,
      rawArguments.includeTypes !== undefined ? rawArguments.includeTypes === 'true' : undefined
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