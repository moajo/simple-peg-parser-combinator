import { or } from "./or"
import { literal } from "./literal"
import { repeat0 } from "./repeat"

export const anyCharactorOf = (charactors: string) =>
  or(...Array.from(charactors).map(literal))

export const whitespace = repeat0(anyCharactorOf(" \t\n\r"))
