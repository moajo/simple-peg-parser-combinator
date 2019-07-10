import { literal, or, repeat1 } from "../src/index"
import ParserResolver, { ParseContext, ParserCache } from "../src/context"
import { sequence } from "../src/components/sequence"
import { zeroOrOne, repeat0 } from "../src/components/repeat"
import { whitespace, anyCharacterOf } from "../src/components/utils"

// see: https://github.com/pegjs/pegjs/blob/master/examples/json.pegjs

describe("json", () => {
  let c = new ParserResolver()
  c.add("[", sequence(whitespace, literal("["), whitespace))
  c.add("]", sequence(whitespace, literal("]"), whitespace))
  c.add("{", sequence(whitespace, literal("{"), whitespace))
  c.add("}", sequence(whitespace, literal("}"), whitespace))
  c.add(",", sequence(whitespace, literal(","), whitespace))
  c.add(":", sequence(whitespace, literal(":"), whitespace))

  c.add("JSON", sequence(whitespace, "value", whitespace).map(vs => vs[1]))

  c.add(
    "value",
    or("false", "null", "true", "object", "array", "number", "string")
  )
  c.add(
    "false",
    sequence(whitespace, literal("false").map(_ => false), whitespace).map(
      ([_, value, __]) => value
    )
  )
  c.add(
    "null",
    sequence(whitespace, literal("null").map(_ => null), whitespace).map(
      ([_, value, __]) => value
    )
  )
  c.add(
    "true",
    sequence(whitespace, literal("true").map(_ => true), whitespace).map(
      ([_, value, __]) => value
    )
  )

  // 4. object
  const member = sequence("string", ":", "value").map(([key, _, value]) => ({
    key,
    value
  }))
  const objectValues = zeroOrOne(
    sequence(member, repeat0(sequence(",", member).map(vs => vs[1]))).map(
      vs => {
        return [vs[0]].concat(vs[1])
      }
    )
  ).map(v => (v == null ? [] : v))
  c.add(
    "object",
    sequence("{", objectValues, "}").map(vs => {
      const a = vs[1]
      let obj: { [key: string]: any } = {}
      a.forEach((member: { key: string; value: any }) => {
        obj[member.key] = member.value
      })
      return obj
    })
  )

  // 5. array
  c.add("array", sequence("[", "arrayValues", "]").map(vs => vs[1]))
  const arrayTail = repeat0(sequence(",", "value").map(vs => vs[1]))
  const arrayValues1 = sequence("value", arrayTail).map(vs =>
    [vs[0]].concat(vs[1])
  )
  c.add("arrayValues", zeroOrOne(arrayValues1).map(v => (v == null ? [] : v)))

  // 6. number
  const digits = repeat1(
    or(
      ...[...Array(10).keys()].map(i =>
        literal(`${i}`).map(s => parseInt(s, 10))
      )
    )
  ).map(arr => (arr as number[]).reduce((prev, current) => prev * 10 + current))
  c.add("number", digits) //TODO: more detail

  //7. string
  const quote = literal('"')
  const char = anyCharacterOf("abcdefghijklmnopqrstuvwyz") //TODO: more detail
  const chars = repeat0(char)
  c.add("string", sequence(quote, chars, quote).map(vs => vs[1].join("")))

  test("literals", () => {
    let json = c.get("value")
    const pc = new ParseContext(new ParserCache(), c)
    expect(json.parse(pc, "1")!.value).toBe(1)
    expect(json.parse(pc, '"asd"')!.value).toBe("asd")
    expect(json.parse(pc, "true")!.value).toBe(true)
    expect(json.parse(pc, "false")!.value).toBe(false)
    expect(json.parse(pc, "null")!.value).toBe(null)
  })

  test("array", () => {
    let json = c.get("value")
    const pc = new ParseContext(new ParserCache(), c)
    expect(json.parse(pc, "[]")!.value).toStrictEqual([])
    expect(json.parse(pc, "[1]")!.value).toStrictEqual([1])
    expect(json.parse(pc, "[1,2,3]")!.value).toStrictEqual([1, 2, 3])
    expect(json.parse(pc, "[1,2,true]")!.value).toStrictEqual([1, 2, true])
    expect(json.parse(pc, '["hoge",2,null]')!.value).toStrictEqual([
      "hoge",
      2,
      null
    ])
  })

  test("object", () => {
    const json = c.get("value")
    const pc = new ParseContext(new ParserCache(), c)
    expect(json.parse(pc, "{}")!.value).toStrictEqual({})
    expect(json.parse(pc, '{"a":2}')!.value).toStrictEqual({ a: 2 })
    expect(json.parse(pc, '{"a":true, "bbb":"hoge"}')!.value).toStrictEqual({
      a: true,
      bbb: "hoge"
    })
  })

  test("complex", () => {
    const json = c.get("JSON")
    const pc = new ParseContext(new ParserCache(), c)
    expect(
      json.parse(pc, '  {"a":[4,  6, {"ttt":[true,null,45]}], "bbb":"hoge"}  ')!
        .value
    ).toStrictEqual({ a: [4, 6, { ttt: [true, null, 45] }], bbb: "hoge" })
  })
})
