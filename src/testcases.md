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

00. v.compileArrayOf(null)
01. v.compileArrayOf(undefined)
02. v.compileArrayOf(42)
03. v.compileArrayOf(NaN)
04. v.compileArrayOf("true")
05. v.compileArrayOf("false")
06. v.compileArrayOf(true)
07. v.compileArrayOf(false)
08. v.compileArrayOf(Symbol.for('test'))
09. v.compileArrayOf(funcWithPrepare)
10. v.compileArrayOf(funcWithoutPrepare)
11. v.compileArrayOf(funcWithNot)
12. v.compileArrayOf(funcWithoutNot)
13. v.compileArrayOf(funcWithHandle)
14. v.compileArrayOf(funcWithoutHandle)
15. v.compileArrayOf({ a: 42 })
16. v.compileArrayOf({ a: funcWithHandle })
17. v.compileArrayOf({ a: 41, [v.rest]: funcWithHandle })
18. v.compileArrayOf({ a: 41, [v.rest]: funcWithoutHandle })
19. v.compileArrayOf([])
20. v.compileArrayOf([42])
21. v.compileArrayOf([funcSchema, 42])
22. v.compileArrayOf([funcSchemaWithHandle, 42])

## Compile Constant

- v(42)
- v(NaN)

## Func

- v(funcs)
- v(funcsWithHandle)
  ...

## Not

00. v.not(undefined)
01. v.not(null)
02. v.not(NaN)
03. v.not(42)
04. v.not(true)
05. v.not(false)
06. v.not(Symbol.for('test'))
07. v.not("test")
08. v.not(funcWithNot)
09. v.not(funcWithoutNot)
10. v.not({ a: 42 })

## Object

00. v({})
01. v({ a: null })
02. v({ a: undefined })
03. v({ a: NaN })
04. v({ a: 42 })
05. v({ a: 'true' })
06. v({ a: 'false' })
07. v({ a: 'test' })
08. v({ a: Symbol.for('test') })
09. v({ a: true })
10. v({ a: false })
11. v({ a: funcWithPrepare })
12. v({ a: funcWithoutPrepare })
13. v({ a: funcWithHandle })
14. v({ a: funcWithoutHandle })
15. v({ a: { b: pureFunc } })
16. v({ a: { b: impureFunc } })
17. v({ a: { b: pureFunc }, c: pureFunc })
18. v({ a: { b: impureFunc }, c: pureFunc })
19. v({ a: { b: pureFunc }, c: impureFunc })
20. v({ a: { b: impureFunc }, c: impureFunc })
21. v({ a: { b: 42 }})
22. v({ a: { b: 42, c: pureFunc }})
23. v({ a: { b: 42, c: impureFunc }})
24. v({ a: { b: 42, [v.rest]: pureFunc }})
25. v({ a: { b: 42, [v.rest]: impureFunc }})
26. v({ a: [] })
27. v({ a: [42] })
28. v({ a: [pureFunc, pureFunc] })
29. v({ a: [impureFunc, pureFunc] })
30. v({ a: 41, b: 42 })

## With Rest

- v({ [v.rest]: pureFunc })
- v({ [v.rest]: impureFunc })
- v({ a: 42, [v.rest]: pureFunc })
- v({ a: 42 [v.rest]: impureFunc })
- v({ a: impureFunc, [v.rest]: pureFunc })
- v({ a: impureFunc, [v.rest]: impureFunc })

## Variants

- v([])
- v([pureFunc])
- v([pureFunc, impureFunc])
- v([pureFunc, pureFunc])
- v([1,2,3,4,5])
- v(["A", "B"])

## getKeyAccessor

- getKeyAccessor('')
- getKeyAccessor('a')
- getKeyAccessor('1a')
- getKeyAccessor('a1')
- getKeyAccessor('a-1')

## handleSchema

- handleSchema(pureFunc)
- handleSchema(null)
- handleSchema(all primitives)
- handleSchema([])
- handleSchema({ a: 1 })
- handleSchema({ a: 1, [v.rest]: 2 })

## has

- has(null, 'Andrew')
- has({}, 'toString')
- has({}, 'toString2')
- has({ toString: 'toString' }, 'toString')
- has({ a: 1 }, 'a')

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
