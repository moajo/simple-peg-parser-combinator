import { literal, or } from "../index"
import { sequence } from "../components/sequence"
import { zeroOrOne } from "../components/repeat"
import * as unicode from "./00.unicode"
import { __, _ } from "./03.spaces"
import { SingleLineComment } from "./02.comment"
import { LineTerminatorSequence, semicolon } from "./01.literal"
import { EOF } from "../components/utils"

export const WhiteSpace = or(
  literal("\t"),
  literal("\v"),
  literal("\f"),
  literal(" "),
  literal("\u00A0"),
  literal("\uFEFF"),
  unicode.Zs
)

export const init_tmp = () => {
  {
    // // Used as a shorthand property name for `LabeledExpression`
    // const pick = true;
    // // Used by `LabelIdentifier` to disallow the use of certain words as labels
    // const RESERVED_WORDS = {};
    // // Populate `RESERVED_WORDS` using the optional option `reservedWords`
    // const reservedWords = options.reservedWords || util.reservedWords;
    // if ( Array.isArray( reservedWords ) ) reservedWords.forEach( word => {
    //     RESERVED_WORDS[ word ] = true;
    // } );
    // // Helper to construct a new AST Node
    // function createNode( type, details ) {
    //     const node = new ast.Node( type, location() );
    //     if ( details === null ) return node;
    //     util.extend( node, details );
    //     return util.enforceFastProperties( node );
    // }
    // // Used by `addComment` to store comments for the Grammar AST
    // const comments = options.extractComments ? {} : null;
    // // Helper that collects all the comments to pass to the Grammar AST
    // function addComment( text, multiline ) {
    //     if ( options.extractComments ) {
    //         const loc = location();
    //         comments[ loc.start.offset ] = {
    //             text: text,
    //             multiline: multiline,
    //             location: loc,
    //         };
    //     }
    //     return text;
    // }
  }
}
