import { ParserIdentifier, Parser } from "./types"
import ParserResolver from "./context"

export function resolveParser<T>(
  parserId: ParserIdentifier<T>,
  resolver: ParserResolver
): Parser<T> {
  return typeof parserId === "string" ? resolver.get(parserId) : parserId
}

export const pickCenter = <T1, T2, T3>(v: [T1, T2, T3]) => v[1]
export const pickSecond = <T1, T2>(v: [T1, T2]) => v[1]
