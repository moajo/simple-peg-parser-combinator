import { ParserIdentifier, Parser } from "./types"
import { ParserResolver } from "./context"

// TODO: utils.refに統合？
export const resolveParser = <T>(
  parserId: ParserIdentifier<T>,
  resolver: ParserResolver
) =>
  (typeof parserId === "string" ? resolver.get(parserId) : parserId) as Parser<
    T
  >

export const pickCenter = <T1, T2, T3>(v: [T1, T2, T3]) => v[1]
export const pickFirst = <T1, T2>(v: [T1, T2]) => v[0]
export const pickSecond = <T1, T2>(v: [T1, T2]) => v[1]
