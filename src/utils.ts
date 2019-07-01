import { ParserIdentifier, Parser } from "./types"
import ParserResolver from "./context"

export function resolveParser<T>(
  parserId: ParserIdentifier<T>,
  resolver: ParserResolver
): Parser<T> {
  return typeof parserId === "string" ? resolver.get(parserId) : parserId
}
