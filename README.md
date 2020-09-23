# Quartet 10

[![Build Status](https://travis-ci.com/whiteand/ts-quartet.svg?branch=master)](https://travis-ci.com/whiteand/ts-quartet)
[![Coverage Status](https://coveralls.io/repos/github/whiteand/ts-quartet/badge.svg?branch=master)](https://coveralls.io/github/whiteand/ts-quartet?branch=master)

**Size: 3.52 KB** (minified and gzipped). No dependencies. [Size Limit](https://github.com/ai/size-limit) controls the size.

It is a declarative and fast tool for data validation.

- [Quartet 10](#quartet-10)
  - [Examples](#examples)
  - [Is there extra word in this list?](#is-there-extra-word-in-this-list)
  - [Objections](#objections)
  - [Confession](#confession)
  - [How to use it?](#how-to-use-it)
    - [Primitives](#primitives)
    - [Schemas out of the box](#schemas-out-of-the-box)
      - [`v.any: Schema`](#vany-schema)
      - [`v.array: Schema`](#varray-schema)
      - [`v.boolean: Schema`](#vboolean-schema)
      - [`v.finite: Schema`](#vfinite-schema)
      - [`v.function: Schema`](#vfunction-schema)
      - [`v.negative: Schema`](#vnegative-schema)
      - [`v.never: Schema`](#vnever-schema)
      - [`v.number: Schema`](#vnumber-schema)
      - [`v.positive: Schema`](#vpositive-schema)
      - [`v.safeInteger: Schema`](#vsafeinteger-schema)
      - [`v.string: Schema`](#vstring-schema)
      - [`v.symbol: Schema`](#vsymbol-schema)
    - [Schemas created using quartet methods](#schemas-created-using-quartet-methods)
      - [`v.and(...schemas: Schema[]): Schema`](#vandschemas-schema-schema)
      - [`v.arrayOf(elemSchema: Schema): Schema`](#varrayofelemschema-schema-schema)
      - [`v.custom(checkFunction: (x: any) => boolean): Schema`](#vcustomcheckfunction-x-any--boolean-schema)
      - [`v.max(maxValue: number, isExclusive?: boolean): Schema`](#vmaxmaxvalue-number-isexclusive-boolean-schema)
      - [`v.maxLength(maxLength: number, isExclusive?: boolean): Schema`](#vmaxlengthmaxlength-number-isexclusive-boolean-schema)
      - [`v.min(minValue: number, isExclusive?: boolean): Schema`](#vminminvalue-number-isexclusive-boolean-schema)
      - [`v.minLength(minLength: number, isExclusive?: number): Schema`](#vminlengthminlength-number-isexclusive-number-schema)
      - [`v.not(schema: Schema): Schema`](#vnotschema-schema-schema)
      - [`v.pair(keyValueSchema: Schema): Schema`](#vpairkeyvalueschema-schema-schema)
      - [`v.test(tester: { test(x: any) => boolean }): Schema`](#vtesttester--testx-any--boolean--schema)
    - [Variant schemas](#variant-schemas)
    - [The schema for an object is an object](#the-schema-for-an-object-is-an-object)
    - [Conclusions](#conclusions)
  - [Explanations](#explanations)
  - [Predefined Instances](#predefined-instances)
  - [Advanced Quartet](#advanced-quartet)

## Examples

See examples [here](https://github.com/whiteand/ts-quartet/tree/master/examples/javascript).

## Is there extra word in this list?

- 3rd-party API
- Typescript
- Confidence
- Simplicity
- Performance

In our opinion, there is no extra word. Let's take a look at the following situation.

We request information about the user from the **3rd-party API**.

This data has a certain type, we write it in the **TypeScript** language in this way:

```typescript
interface Response {
  user: {
    id: number
    name: string
    age: number
    gender: 'Male' | 'Female'
    friendsIds: number[]
  }
}
```

To achieve **Confidence** we will write a function that tells us whether the answer is of type `Response`.

```typescript
// More details about such functions google
// "Typescript Custom Type Guards"
function checkResponse(response: any): response is Response {
  if (response == null) return false

  if (response.user == null) return false

  if (typeof response.user.id !== 'number') return false

  if (typeof response.user.name !== 'string') return false

  if (typeof response.user.age !== 'number') return false

  if (VALID_GENDERS_DICT[response.user.gender] !== true) return false

  if (!response.user.friendsIds || !Array.isArray(response.user.friendsIds)) return false
  for (let i = 0; i < response.user.friendsIds.length; i++) {
    const id = response.user.friendsIds[i]
    if (typeof id !== 'number') return false
  }

  return true
}

const VALID_GENDERS_DICT = {
  Male: true,
  Female: true,
}
```

Now in the place where we make the request, we will check:

```typescript
// ...
const userResponse = await GET('http://api.com/user/1')
if (!checkResponse(userResponse)) {
  throw new Error('API response is invalid')
}
const { user } = userResponse // has type Response
// ...
```

This approach, with a stretch, but can be called **Simple**.

It's pretty hard to come up with a faster option to provide a type guarantee. Therefore, this code has sufficient **Performance**.

We got everything we wanted!

## Objections

You can say: How can you call the function `checkResponse` simple?
We would agree if it were as declarative as the type of `Response` itself. Something like:

```typescript
const checkResponse = v<Response>({
  user: {
    id: v.number,
    name: v.string,
    age: v.number,
    gender: ['Male', 'Female'],
    friendsIds: v.arrayOf(v.number),
  },
})
```

Yes! Anyone would agree with that. Such an approach would be extremely convenient. But only on condition that the performance remains at the same level as the imperative version.

## Confession

This is exactly what this library provides you. I hope this example inspires you to read further and subsequently start using this library.

## How to use it?

Here's what you need to do to use this library.:

- Install

```
npm i -S quartet
```

- Import the "compiler" of schemas:

```typescript
import { v } from 'quartet'
```

- Describe the type of value you want to check.

This step is optional, and if you do not use TypeScript, you can safely skip it. It just helps you write a validation scheme.

```typescript
type MyType = // ...
```

- Create a validation scheme

```typescript
const myTypeSchema = // ...
```

- Compile this schema into a validation function

```typescript
const checkMyType = v<MyType>(myTypeSchema)
```

or the same without TypeScript type parameter:

```typescript
const checkMyType = v(myTypeSchema)
```

- Use `checkMyType` on data that you are not sure about. It will return `true` if the data is valid. It will return `false` if the data is not valid.

### Primitives

Each primitive Javascript value is its own validation scheme.

I will give an example:

```typescript
const isNull = v(null)
// same as
const isNull = x => x === null
```

or

```typescript
const is42 = v(42)
// same as
const is42 = x => x === 42
```

Primitives are all Javascript values, with the exception of objects (including arrays) and functions. That is: `undefined`,`null`, `false`,`true`, numbers (`NaN`,`Infinity`, `-Infinity` including) and strings.

### Schemas out of the box

Quartet provides pre-defined schemas for specific checks. They are in the properties of the `v` compiler function.

#### `v.any: Schema`

```typescript
const checkBoolean = v(v.any)
// same as
const checkBoolean = () => true
```

#### `v.array: Schema`

```typescript
const checkBoolean = v(v.array)
// same as
const checkBoolean = value => Array.isArray(v)
```

#### `v.boolean: Schema`

```typescript
const checkBoolean = v(v.boolean)
// same as
const checkBoolean = x => typeof x === 'boolean'
```

#### `v.finite: Schema`

```typescript
const checkFinite = v(v.finite)
// same as
const checkFinite = x => Number.isFinite(x)
```

#### `v.function: Schema`

```typescript
const checkFunction = v(v.function)
// same as
const checkFunction = x => typeof x === 'function'
```

#### `v.negative: Schema`

```typescript
const checkNegative = v(v.negative)
// same as
const checkNegative = x => x < 0
```

#### `v.never: Schema`

```typescript
const checkNegative = v(v.never)
// same as
const checkNegative = () => false
```

#### `v.number: Schema`

```typescript
const checkNumber = v(v.number)
// same as
const checkNumber = x => typeof x === 'number'
```

#### `v.positive: Schema`

```typescript
const checkPositive = v(v.positive)
// same as
const checkPositive = x => x > 0
```

#### `v.safeInteger: Schema`

```typescript
const checkSafeInteger = v(v.safeInteger)
// same as
const checkSafeInteger = x => Number.isSafeInteger(x)
```

#### `v.string: Schema`

```typescript
const checkString = v(v.string)
// same as
const checkString = x => typeof x === 'string'
```

#### `v.symbol: Schema`

```typescript
const checkSymbol = v(v.symbol)
// same as
const checkSymbol = x => typeof x === 'symbol'
```

### Schemas created using quartet methods

The compiler function also has methods that return schemas.

#### `v.and(...schemas: Schema[]): Schema`

It creates a kind of connection schemas using a logical AND (like the operator `&&`)

```typescript
const positiveNumberSchema = v.and(v.number, v.positive)
const isPositiveNumber = v(positiveNumberSchema)

// same as

const isPositiveNumber = x => {
  if (typeof x !== 'number') return false
  if (x <= 0) return false
  return true
}
```

#### `v.arrayOf(elemSchema: Schema): Schema`

According to the element scheme, it creates a validation scheme for an array of these elements:

```typescript
const elemSchema = v.and(v.number, v.positive)
const arraySchema = v.arrayOf(elemSchema)
const checkPositiveNumbersArray = v(arraySchema)

// same as

const checkPositiveNumbersArray = x => {
  if (!x || !Array.isArray(x)) return false
  for (let i = 0; i < 0; i++) {
    const elem = x[i]
    if (typeof elem !== 'number') return false
    if (elem <= 0) return false
  }
  return true
}
```

#### `v.custom(checkFunction: (x: any) => boolean): Schema`

From the validation function, it creates a schema.

```typescript
function checkEven(x) {
  return x % 2 === 0
}

const evenSchema = v.custom(checkEven)
const checkPositiveEvenNumber = v(v.and(v.number, v.positive, evenSchema))

// same as

const checkPositiveEvenNumber = x => {
  if (typeof x !== 'number') return false
  if (x <= 0) return false
  if (!checkEven(x)) return false
  return true
}
```

(See [Advanced Quartet](#advanced-quartet) for more.)

#### `v.max(maxValue: number, isExclusive?: boolean): Schema`

By the maximum (or boundary) number returns the corresponding validation scheme.

```typescript
const checkLessOrEqualToFive = v(v.max(5))
// same as
const checkLessOrEqualToFive = x => x <= 5
```

```typescript
const checkLessThanFive = v(v.max(5, true))
// same as
const checkLessThanFive = x => x < 5
```

#### `v.maxLength(maxLength: number, isExclusive?: boolean): Schema`

By the maximum (or boundary) value of the length, returns the corresponding schema.

```typescript
const checkTwitterText = v(v.maxLength(140))
// same as
const checkTwitterText = x => x != null && x.length <= 140
const checkTwitterText = v({ length: v.max(140) })
```

```typescript
const checkSmallArray = v(v.maxLength(20, true))
// same as
const checkSmallArray = x => x != null && x.length < 140
const checkTwitterText = v({ length: v.max(20, true) })
```

#### `v.min(minValue: number, isExclusive?: boolean): Schema`

By the minimum (or boundary) number returns the corresponding validation scheme.

```typescript
const checkNonNegative = v(v.min(0))
// same as
const checkNonNegative = x => x >= 0
```

```typescript
const checkPositive = v(v.min(0, true))
// same as
const checkPositive = x => x > 0
const checkPositive = v(v.positive)
```

#### `v.minLength(minLength: number, isExclusive?: number): Schema`

By the minimum (or boundary) value of the length, returns the corresponding schema.

```typescript
const checkLargeArrayOrString = v(v.minLength(1024))
// same as
const checkLargeArrayOrString = x => x != null && x.length >= 1024
const checkLargeArrayOrString = v({ length: v.min(1024) })
```

```typescript
const checkNotEmptyStringOrArray = v(v.minLength(0, true))
// same as
const checkNotEmptyStringOrArray = x => x != null && x.length > 0
const checkNotEmptyStringOrArray = v({ length: v.min(0, true) })
```

#### `v.not(schema: Schema): Schema`

Applies logical negation (like the `!` Operator) to the passed schema. Returns the inverse schema to the passed one.

```typescript
const checkNonPositive = v(v.not(v.positive))
const checkNot42 = v(v.not(42))
const checkIsNotNullOrUndefined = v(v.and(v.not(null), v.not(undefined)))
```

#### `v.pair(keyValueSchema: Schema): Schema`

It's a method that returns a special kind of Schema that can be used only as a single parameter of `v.arrayOf` and `[v.rest]` prop in object schema.

It is used to get access to index or prop name of validated value.

`keyValueSchema` is a schema that should validate an object with two props `key`(in which index or prop name will be stored) and `value`(in which value will be stored)

The main goal is to validate dictionaries.

```typescript
const validPersonsNames = ['Andrew', 'Vasilina', 'Bohdan', 'TF']
const checkPhoneBook = v({
  [v.rest]: {
    key: validPersonsNames,
    value: v.string,
  },
})

checkPhoneBook({}) // will be true
checkPhoneBook({
  Andrew: '0975017374',
  Vasilina: '23123123',
}) // will be true
checkPhoneBook({
  NotAnAndrew: '0975017374',
  Vasilina: '23123123',
}) // will be false
```

Example with `v.arrayOf`

```typescript
const isSquaresOfIndices = v.arrayOf(
  v.pair(v.custom(({ key, value }) => value === key * key)),
)

isSquaresOfIndices([]) // true
isSquaresOfIndices([0]) // true, because 0 = 0 * 0
isSquaresOfIndices([0, 1]) // true, because 1 = 1 * 1
isSquaresOfIndices([0, 1, 4]) // true, because 4 = 2 * 2

isSquaresOfIndices([0, 1, 4, 10]) // false, because 10 !== 3 * 3
```

```typescript
const checkShortArrayOfStrings = v(v.and(v.arrayOf(v.string), v.minLength(10)))

// the same as

const checkShortArrayOfStrings = v(
  v.arrayOf(
    v.pair({
      key: v.max(9),
      value: v.string,
    }),
  ),
)
```

Good to mention that:

```typescript
const valueSchema = v.string

const checkPhoneBook = v({
  [v.rest]: valueSchema,
})

// is the same as

const checkPhoneBook = v({
  [v.rest]: v.pair({
    value: valueSchema,
  }),
})
```

WARNING: there is only two ways to use v.pair according to its rules:

```javascript
const schemaOfArray = v.arrayOf(v.pair(...))
const schemaWithRest = {
  // ...
  [v.rest]: v.pair(...)
}
```

Any other usage either will throw error or will have undefined behavior.

#### `v.test(tester: { test(x: any) => boolean }): Schema`

On an object with the `test` method, returns a schema that checks whether the given `test` method returns `true` on the checked value .

Most commonly used with Regular Expressions.

`v.test(tester) === v.custom(x => tester.test(x))`

```typescript
const checkIntegerNumberString = v(v.test(/[1-9]\d*/))
// same as
const checkIntegerNumberString = x => /[1-9]\d*/.test(x)
```

### Variant schemas

An array of schemas acts as a connection of schemas using the logical operation OR (operator `||`)

```typescript
const checkStringOrNull = v([v.string, null])
// same as
const checkStringOrNull = x => {
  if (typeof x === 'string') return true
  if (x === null) return true
  return false
}
```

```typescript
const checkGender = v(['male', 'female'])
// same as
const VALID_GENDERS = { male: true, female: true }
const checkStringOrNull = x => {
  if (VALID_GENDERS[x] === true) return true
  return false
}
```

```typescript
const checkRating = v([1, 2, 3, 4, 5])
// same as
const checkRating = x => {
  if (x === 1) return true
  if (x === 2) return true
  if (x === 3) return true
  if (x === 4) return true
  if (x === 5) return true
  return false
}
```

### The schema for an object is an object

An object whose values are schemas is an object validation schema. Where the appropriate fields are validated by the appropriate schemas.

```typescript
const checkHelloWorld = v({ hello: 'World' })
// same as
const checkHelloWorld = x => {
  if (x == null) return false
  if (x.hello !== 'World') return false
  return true
}
```

If you want to validate objects with previously unknown fields, use `v.rest`

```typescript
interface PhoneBook {
  [name: string]: string
}
```

```typescript
const checkPhoneBook = v({
  [v.rest]: v.string,
})
```

The scheme from the `v.rest` key will validate all unspecified fields.

```typescript
interface PhoneBookWithAuthorId {
  authorId: number
  [name: string]: string
}
```

```typescript
const checkPhoneBookWithAuthorId = v({
  authorId: v.number,
  [v.rest]: v.string,
})
```

### Conclusions

Using these schemes and combining them, you can declaratively describe validation functions, and the `v` compiler function will create a function that imperatively checks the value against your scheme.

## Explanations

If you need explanations of validation just use `e` instance instead of `v` instance.

```javascript
import { e as v } from 'quartet'

const checkPerson = v({
  name: v.string,
})

checkPerson({ name: 1 }) // false
checkPerson.explanations
/*
[
  {
    path: ["name"],
    schema: {
      type: "String",
    },
    value: 1,
  },
]
*/
```

## Predefined Instances

There is two predefined instances of quartet:

```typescript
import { v } from 'quartet' // Zero-configured instance, without explanations

import { e } from 'quartet' // Instance with explanations.
```

## Advanced Quartet

`// TODO: Write it!`
