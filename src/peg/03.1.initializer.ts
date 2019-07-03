import { sequence } from "../index"
import { CodeBlock } from "./01.1.codeblock"
import { EOS } from "./03.spaces"

export const Initializer = sequence(CodeBlock, EOS).map(a => {
  // return createNode( "initializer", { code } );
  return a
})
