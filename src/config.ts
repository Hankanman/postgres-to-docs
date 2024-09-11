import { Decoder } from 'elm-decoders'

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
  pureMarkdown: boolean // New option for pure Markdown output
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
  pureMarkdown: Decoder.optional(Decoder.boolean).map(value => value ?? false) // Default to false if not specified
})

export const parseConfig = (environment: any): Config =>
  configDecoder.guard(environment)