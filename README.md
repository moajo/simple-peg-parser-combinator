# simple-peg-parser-combinator

peg 対応のパーサコンビネータ・パーサジェネレータ。  
[pegjs](https://github.com/pegjs/pegjs)互換  
`.pegjs`ファイルからパーサを生成できる。

```js
// .pegjs形式のファイルをパースしてpeg astを作成
const js_syntax_definition = fs.readFileSync("./sample_files/peg/javascript.pegjs")
const ast = Grammar.parse(pc, js_syntax_definition)!.value

// peg astからパーサオブジェクトを生成
const js_parser = compile(ast)

// パーサオブジェクトでjavascriptをパースしてjavascript astを得る
expect(js_parser.parse("1+1")!.value).toStrictEqual({
  type: "Program",
  body: [
    {
      type: "ExpressionStatement",
      expression: {
        type: "BinaryExpression",
        operator: "+",
        left: {
          type: "Literal",
          value: 1
        },
        right: {
          type: "Literal",
          value: 1
        }
      }
    }
  ]
})
```

# setup

```
npm i
```

# test

```
npm t
```

# examples

see: `/test/*`

# reference

https://github.com/sap/chevrotain/blob/gh-pages/performance/samples/1K_json.js
