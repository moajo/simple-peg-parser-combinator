import { sequence } from "../index"
import { CodeBlock } from "./01.1.codeblock"
import { EOS } from "./03.spaces"
import { pickFirst } from "../utils"

export const Initializer = sequence(CodeBlock, EOS).map(pickFirst)
