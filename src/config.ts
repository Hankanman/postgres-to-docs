import { Decoder } from 'elm-decoders'
import * as path from 'path'

export type Config = {
  host: string
  user: string
  password: string
  database: string
  port: number
  schema?: string
  includeTables?: string[]
  excludeTables?: string[]
  includeTypes: boolean
  pureMarkdown: boolean
  output?: string
  includeRLS?: boolean
  includeToc?: boolean
}

const configDecoder = Decoder.object({
  host: Decoder.string,
  user: Decoder.string,
  password: Decoder.string,
  database: Decoder.string,
  port: Decoder.number,
  schema: Decoder.optional(Decoder.string),
  includeTables: Decoder.optional(Decoder.array(Decoder.string)),
  excludeTables: Decoder.optional(Decoder.array(Decoder.string)),
  includeTypes: Decoder.optional(Decoder.boolean).map(value => value ?? true),
  pureMarkdown: Decoder.optional(Decoder.boolean).map(value => value ?? false),
  output: Decoder.optional(Decoder.string),
  includeRLS: Decoder.optional(Decoder.boolean).map(value => value ?? true),
  includeToc: Decoder.optional(Decoder.boolean).map(value => value ?? true),
})

export const parseConfig = (environment: any): Config => {
  const config = configDecoder.guard(environment)
  if (!config.output) {
    config.output = `schema-${config.database}.md`
  }
  return config
}

export const getDefaultConfigPath = () => path.join(process.cwd(), 'postgrestodocs.json')