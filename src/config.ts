import { Decoder } from 'elm-decoders'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

// Load .env files in order of precedence
const loadEnvFiles = () => {
  const envFiles = [
    '.env.local',
    '.env'
  ]

  for (const file of envFiles) {
    const envPath = path.join(process.cwd(), file)
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath })
    }
  }
}

// Load environment files
loadEnvFiles()

export type Config = {
  connectionString?: string
  host?: string
  user?: string
  password?: string
  database?: string
  port?: number
  schema?: string
  includeTables?: string[]
  excludeTables?: string[]
  includeTypes: boolean
  pureMarkdown: boolean
  output?: string
  includeRLS?: boolean
  includeToc?: boolean
  includeFunctions?: boolean
}

const configDecoder = Decoder.object({
  connectionString: Decoder.optional(Decoder.string),
  host: Decoder.optional(Decoder.string),
  user: Decoder.optional(Decoder.string),
  password: Decoder.optional(Decoder.string),
  database: Decoder.optional(Decoder.string),
  port: Decoder.optional(Decoder.number),
  schema: Decoder.optional(Decoder.string),
  includeTables: Decoder.optional(Decoder.array(Decoder.string)),
  excludeTables: Decoder.optional(Decoder.array(Decoder.string)),
  includeTypes: Decoder.optional(Decoder.boolean).map(x => x ?? true),
  pureMarkdown: Decoder.optional(Decoder.boolean).map(x => x ?? false),
  output: Decoder.optional(Decoder.string),
  includeRLS: Decoder.optional(Decoder.boolean).map(x => x ?? true),
  includeToc: Decoder.optional(Decoder.boolean).map(x => x ?? false),
  includeFunctions: Decoder.optional(Decoder.boolean).map(x => x ?? true)
})

export const parseConfig = (environment: any): Config => {
  const config = configDecoder.guard(environment)
  
  // Check for DB_STRING in .env
  if (process.env.DB_STRING) {
    config.connectionString = process.env.DB_STRING
  }

  if (!config.output && config.database) {
    config.output = `schema-${config.database}.md`
  } else if (!config.output) {
    config.output = 'schema.md'
  }

  return config
}

export const getDefaultConfigPath = () => path.join(process.cwd(), 'postgrestodocs.json')