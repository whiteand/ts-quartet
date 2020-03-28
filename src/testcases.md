# Test Cases

## Compile And

- v.compileAnd()
- v.compileAnd(1)
- v.compileAnd(1, 1)
- v.compileAnd(1, 2)
- v.compileAnd(1, 1, 2)
- v.compileAnd(1, isNotOne)
- v.compileAnd(funcWithPrepare, funcWithoutPrepare)
- v.compileAnd(funcWithNot, funcWithoutNot)
- v.compileAnd(funcWithHandle, funcWithoutHandle)
- v.compileAnd({ a: funcWithoutHandle }, { b: funcWithHandle })
- v.compileAnd({ a: funcWithoutHandle, [v.rest]: funcWithoutHandle }, { b: funcWithHandle, [v.rest]: funcWithHandle })
- v.compileAnd(func, [])
- v.compileAnd(func, [func])
- v.compileAnd(func, [funcWithHandle, funcWithoutHandle])
- v.compileAnd(func, [funcWithoutHandle, funcWithoutHandle])

## Compile Array

0.  v.compileArrayOf(null)
1.  v.compileArrayOf(undefined)
1.  v.compileArrayOf(42)
1.  v.compileArrayOf(NaN)
1.  v.compileArrayOf("true")
1.  v.compileArrayOf("false")
1.  v.compileArrayOf(true)
1.  v.compileArrayOf(false)
1.  v.compileArrayOf(Symbol.for('test'))
1.  v.compileArrayOf(funcWithPrepare)
1.  v.compileArrayOf(funcWithoutPrepare)
1.  v.compileArrayOf(funcWithNot)
1.  v.compileArrayOf(funcWithoutNot)
1.  v.compileArrayOf(funcWithHandle)
1.  v.compileArrayOf(funcWithoutHandle)
1.  v.compileArrayOf({ a: 42 })
1.  v.compileArrayOf({ a: funcWithHandle })
1.  v.compileArrayOf({ a: 41, [v.rest]: funcWithHandle })
1.  v.compileArrayOf({ a: 41, [v.rest]: funcWithoutHandle })
1.  v.compileArrayOf([])
1.  v.compileArrayOf([42])
1.  v.compileArrayOf([funcSchema, 42])
1.  v.compileArrayOf([funcSchemaWithHandle, 42])

## Compile Constant

- v(42)
- v(NaN)

## Func

- v(funcs)
- v(funcsWithHandle)
  ...

## Not

0.  v.not(undefined)
1.  v.not(null)
1.  v.not(NaN)
1.  v.not(42)
1.  v.not(true)
1.  v.not(false)
1.  v.not(Symbol.for('test'))
1.  v.not("test")
1.  v.not(funcWithNot)
1.  v.not(funcWithoutNot)
1.  v.not({ a: 42 })

## Object

0.  v({})
1.  v({ a: null })
1.  v({ a: undefined })
1.  v({ a: NaN })
1.  v({ a: 42 })
1.  v({ a: 'true' })
1.  v({ a: 'false' })
1.  v({ a: 'test' })
1.  v({ a: Symbol.for('test') })
1.  v({ a: true })
1.  v({ a: false })
1.  v({ a: funcWithPrepare })
1.  v({ a: funcWithoutPrepare })
1.  v({ a: funcWithHandle })
1.  v({ a: funcWithoutHandle })
1.  v({ a: { b: pureFunc } })
1.  v({ a: { b: impureFunc } })
1.  v({ a: { b: pureFunc }, c: pureFunc })
1.  v({ a: { b: impureFunc }, c: pureFunc })
1.  v({ a: { b: pureFunc }, c: impureFunc })
1.  v({ a: { b: impureFunc }, c: impureFunc })
1.  v({ a: { b: 42 }})
1.  v({ a: { b: 42, c: pureFunc }})
1.  v({ a: { b: 42, c: impureFunc }})
1.  v({ a: { b: 42, [v.rest]: pureFunc }})
1.  v({ a: { b: 42, [v.rest]: impureFunc }})
1.  v({ a: [] })
1.  v({ a: [42] })
1.  v({ a: [pureFunc, pureFunc] })
1.  v({ a: [impureFunc, pureFunc] })
1.  v({ a: 41, b: 42 })

## With Rest

- v({ [v.rest]: pureFunc })
- v({ [v.rest]: impureFunc })
- v({ a: 42, [v.rest]: pureFunc })
- v({ a: 42 [v.rest]: impureFunc })
- v({ a: impureFunc, [v.rest]: pureFunc })
- v({ a: impureFunc, [v.rest]: impureFunc })

## Variants

1.  v([])
2.  v([pureFunc])
3.  v([pureFunc, impureFunc])
4.  v([pureFunc, pureFunc])
5.  v([1,2,3,4,5])
6.  v(["A", "B"])

## getKeyAccessor

1.  getKeyAccessor('')
2.  getKeyAccessor('a')
3.  getKeyAccessor('1a')
4.  getKeyAccessor('1')
5.  getKeyAccessor('a1')
6.  getKeyAccessor('a-1')

## handleSchema

01. handleSchema(pureFunc)
02. handleSchema(all primitives)
03. handleSchema([])
04. handleSchema({ a: 1 })
05. handleSchema({ a: 1, [v.rest]: 2, [v.restOmit]: ['a'] })
06. handleSchema({ a: 1, [v.restOmit]: ['a'] })

## has







## index

- v.method is a function
- v.rest is a string

## v.bigint

- v.bigint(1)
- v.bigint(1n)

## boolean

- v.boolean(true)
- v.boolean(false)
- v.boolean('false')
- v.boolean('true')
- v.boolean(1)
- v.boolean(0)

## v.custom

- v.custom(func)
- v.custom(func, simple explanation)
- v.custom(func, func explanation)
- v.custom(v(impure func))
- v.custom(v(pure func))

## v.function

- v.function(function(x) { return x})
- v.function(x => x)

## v.negative

- v.negative(-0)
- v.negative(-1)
- v.negative(1)

## v.number

- v.number(0)
- v.number(3.14)
- v.number(NaN)
- v.number(Infinity)
- v.number(-Infinity)

## v.positive

- v.positive(-1)
- v.positive(-0)
- v.positive(1)

## safeInteger

## string

## symbol

## test
