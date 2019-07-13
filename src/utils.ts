import { ParserResolver } from "./context"
import { Parser } from "./types"

// TODO: utils.refに統合？
export const resolveParser = <T>(
  parserId: string,
  resolver: ParserResolver
) => {
  const res = resolver.get(parserId)
  if (!res) {
    throw new Error("undefined parser: " + parserId)
  }
  return res as Parser<T>
  //   if (typeof parserId === "string") {
  //     const res = resolver.get(parserId)
  //     if (!res) {
  //       throw new Error("undefined parser: " + parserId)
  //     }
  //     return res
  //   }
  //   if (!parserId) {
  //     throw new Error(`undefined parser`)
  //   }
  //   return parserId
}

export const pickCenter = <T1, T2, T3>(v: [T1, T2, T3]) => v[1]
export const pickFirst = <T1, T2>(v: [T1, T2]) => v[0]
export const pickSecond = <T1, T2>(v: [T1, T2]) => v[1]
