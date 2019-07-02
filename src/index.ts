export { literal } from "./components/literal"
export { or } from "./components/or"
export { anyChar } from "./components/any"
export * from "./components/utils"
export { sequence } from "./components/sequence"
export { repeat, repeat0, repeat1 } from "./components/repeat"
export { andPredicate, notPredicate } from "./components/predicate"

export default () => {
  console.log("hello")
  return 1
}
