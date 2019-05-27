# Quartet 8

[![Build Status](https://travis-ci.com/whiteand/ts-quartet.svg?branch=master)](https://travis-ci.com/whiteand/ts-quartet)
[![Coverage Status](https://coveralls.io/repos/github/whiteand/ts-quartet/badge.svg?branch=master)](https://coveralls.io/github/whiteand/ts-quartet?branch=master)

- [Quartet 8](#quartet-8)
  - [Examples](#examples)
  - [Goals](#goals)
  - [Concepts](#concepts)
  - [Just Validator](#just-validator)
  - [Concept of Validator](#concept-of-validator)
  - [Quartet Instance](#quartet-instance)
    - [Example 1](#example-1)
  - [Concept of schema](#concept-of-schema)
    - [Example 2](#example-2)
    - [Example 3](#example-3)
    - [Example 4](#example-4)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API](#api)
  - [Validator](#validator)
    - [Example 5](#example-5)
  - [Schema](#schema)
  - [Quartet](#quartet)
  - [InstanceSettings](#instancesettings)
  - [QuartetInstance](#quartetinstance)
  - [Methods](#methods)
    - [`and`](#and)
    - [`array`](#array)
    - [`arrayOf`](#arrayof)
    - [`boolean`](#boolean)
    - [`dictionaryOf`](#dictionaryof)
    - [`enum`](#enum)
    - [`explain`](#explain)
    - [`just`](#just)
    - [`max` and `min`](#max-and-min)
    - [`negative`, `nonPositive`, `nonNegative`, `positive`](#negative-nonpositive-nonnegative-positive)
    - [`safeInteger`](#safeinteger)
    - [`test`](#test)
    - [`throwError`](#throwerror)

## Examples

If you want to see examples - look [here](https://github.com/whiteand/ts-quartet/tree/master/examples).

## Goals

Today more than ever there is a need to verify data coming from third parties. When you need to have guarantees that the structure and content of the data this library will provide you with these guarantees.

## Concepts

## Just Validator

A **Just Validator** is a function that determines whether data has a suitable structure and content.

This concept can be represent by such Typescript definition:

```typescript
type JustValidator = (value: any) => boolean
```

As we see from this description JustValidator takes value of any type and returns `true` if value is valid and `false` if value is not valid.

## Concept of Validator

But `quartet` library uses a little bit wider concept of *explanatory validator*

The [Explanatory]**Validator** is like a just validator but it also explains the reason for the invalidity of the data.

This concept can be represent by such Typescript definition:

```typescript
type Validator = (value: any, explanations?: any[]) => boolean
```

As we see from this description Validator takes value of any type and returns `true` if the value is valid, and `false` if the value is not valid. But additionaly it pushes explanation of the invalidity into `explanations` parameter(if value is invalid and `explanations` parameter is passed).

## Quartet Instance

Quartet instance - is an concept that represents function that takes schema of validation and returns Validator.

In typescript we can represent it by such definition:
```typescript
type QuartetInstance = (schema: Schema, explanation?: Explanation) => Validator
```

As we can see from this definition - quartet instance is a function that takes schema of validation(all schema types described in the next concept) and explanation optionally and creates validator defined by schema.

Explanation is the value that can describe what is went wrong.

### Example 1
```typescript
const v = quartet() // creating of quartet instance
const numberSchema = __SCHEMA__ // what will be a schema described in the next concept
const numberValidator = v(numberSchema, 'not number passed')

const explanations = []
numberValidator(1, explanations) // => true
console.log(explanations) // => []
numberValidator('1', explanations) // => false
console.log(explanations) // => ['not number passed']


```

## Concept of schema

A **schema** is a value that explains what the validator should check. *`quartet` instance* uses schemas to create (compile) validators.

This concept can be represent by such Typescript definition:

```typescript
type Schema =
  | Validator;     // (value: any, explanations?: any[]) => boolean
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined
  | IVariantSchema // Schema[] <- [Schema, Schema, ...]
  | IObjectSchema  // { [key: string]: Schema }
```

- The best definition of what must be checked by Validator is the Validator itself.

### Example 2

```typescript
const numberSchema = value => typeof value === 'number'
const stringSchema = value => typeof value === 'string'
const sexSchema = value => ['male', 'female'].includes(value)
// etc
const explainedSexSchema = (value, explanations) => {
  const isSex = ['male', 'female'].includes(value)
  if (!isSex && explanations) {
    explanations.push(`${value} is not a valid value of the sex`)
  }
  return isSex
}
```

As we can see such type of schema is the most wordy variant of possible schemas.

- If schema is a value of primitive types (`boolean`, `null`, `number`, `string`, `symbol`, `undefined`) it explains that created validator should check if the value that is being validated should be equal to schema.

### Example 3

| Schema  |  Validator explained by schema |
|:-:|:-:|
| `null` | `value => value === null`  |
| `2`  | `value => value === 2`  |
| `'male'`  | `value => value === 'male'`  |
| `undefined`  | `value => value === undefined`  |
| `Symbol.for('test')`  | `value => value === Symbol.for('test')` |
| `primitive_type_value`  |  `value => value === primitive_type_value` |

- When a schema is an array of schemas(`IVariantSchema`), this means that the validator created by this schema must determine if there is such a schema within this array, according to which the value is valid

### Example 4

| Schema  |  Validator explained by schema |
|:-:|:-:|
| `[null, 2]` | `value => value === null || value === 2`  |
| `['male', 'female', undefined]`  | `value => value === 'male'`<br>`|| value === 'female'`<br>`|| value === undefined`  |

- When schema is an object, it explains Validator for the objects. Better to explain by example:

```typescript
const personSchema = { // object schema
  name: name => typeof name === 'string', // means value.name must be string
  sex: ['male','female'] // means value.sex must be one of 'male' or 'female'
}
const checkPerson = v(personSchema) // v - is an instance quartet

const person = {
  name: 'Andrew',
  sex: 'male'
}

const isPersonValid = checkPerson(person) // => true
```

## Installation

```bash
npm i -S quartet
```

## Usage

1) Import quartet library and instantiate quartet instance

```typescript
import { quartet } from 'quartet'
const v = quartet()

// or use default instance

import { v } from 'quartet'
```

2) Write schema of the validation

```typescript
const personSchema = {
  name: v.string,  // name: string
  age: v.and(      // integer value >= 0
    v.safeInteger,     // integer
    v.nonNegative      // >= 0
  ),
  sex: ['male', 'female'], // age: 'male' | 'female'
  house: [                 // null | { address: string }
    null,                        // null
    { address: v.string }        // { address: string }
  ],
  money: v.number // money: number
}
```

3) Create Validator using quartet instance

```typescript
const personValidator = v(personSchema)
```

4) Use validator

```typescript
const actualPerson = {
  name: 'Andrew Beletskiy',
  age: 22,
  sex: 'male',
  house: null,
  money: 132
}
personValidator(actualPerson) // => true
```

## API

## Validator

Validator - function that defines if value is valid

```typescript
type Validator = (
  value?: any,
  explanations?: any[],
  parents?: IKeyParentSchema[]
) => boolean;

```

TypeGuardValidator - function that defines if value has passed type `T`

```typescript
type TypeGuardValidator<T = any> = (
  value: any,
  explanations?: any[],
  parents?: IKeyParentSchema[]
) => value is T;
```

IKeyParentSchema - is an item of `parents` array passed into all validators.

It contains of the information of the parents of the value.

```typescript
interface IKeyParentSchema {
  key: any;
  parent: any;
  schema: any;
}
```

### Example 5

```typescript
const checkAge = (age, explanations, parents) => {
  console.log(parents)
  return typeof age === 'number' && age > 0
}
const agedSchema = {
  age: checkAge
}

const checkAged = v(agedSchema)

checkAged({
  age: 122
})
// => true
// console: [{ key: 'age', parent: { age: 122 }, schema: { age: checkAge }]

```

## Schema

```typescript
type Schema =
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined
  | IObjectSchema
  | IVariantSchema
  | Validator;
```

## Quartet

```typescript
export type Quartet = (settings?: InstanceSettings) => QuartetInstance;
export const quartet: Quartet
```

`quartet` - is the "constructor" for quartet instances.

You can get it by import from 'quartet':

```typescript
import { quartet } from 'quartet'
```

## InstanceSettings

```typescript
type InstanceSettings = {
  defaultExplanation?: Explanation;
  allErrors?: boolean;
}
```

| Schema  |  Validator explained by schema |
|:-:|:-:|
| **`defaultExplanation`** | explanation that will be added for to all validators created by instance. Default value: `undefined` |
| **`allErrors`** | if `allErrors` is `true`, it means that validator will collect all invalidation errors. If `allErrors` is `false` it means that validator will push first error explanation into `explanations` parameter if it's passed. Default value: `true` |

## QuartetInstance

```typescript
export type QuartetInstance =
  <T = any>(
    schema?: Schema,
    explanation?: Explanation,
    innerSettings?: InstanceSettings
  ) => TypeGuardValidator<T>
  & IMethods // All methods will be described below
  & {
    rest: string
  }
```

Quartet instance is a function, with additional methods.
Quartet instance parameters described below:

| Parameter | Description |
|:-:|:-:|
| schema | Schema of validator to be created by quartet instance |
| explanation | Explanation that must be pushed into `explanations` parameter of created validator |
| innerSettings | Specification of settings if necessary |

## Methods

### `and`

```typescript
type AndMethod = (...schemas: Schema[]) => Validator;
```

This method takes as input a set of validation schemes and returns a validator that checks if the specified value matches **ALL** passed schemes.

**Example:**

```javascript
const checkPositiveInteger = v.and(
  v.safeInteger,
  v.positive
)

[1, 2, 3].every(checkPositiveInteger)   // => true
[1.2, 0, -1].some(checkPositiveInteger) // => false
```

### `array`

```typescript
type ArrayMethod = TypeGuardValidator<any[]>
```

This method is a validator that determines whether a `value` is an array.

**Example:**

```javascript
// Simple
v.array([]) // true
v.array([1,2,3]) // true
v.array('string') // false

// Not so simple
const response = {
  users: [{ id: 1 }, { uid: 2}, {}, 'Andrew' ] // array of different types
}

const checkResponse = v({
  users: v.array
})

checkResponse(response) // true
```

### `arrayOf`

```typescript
type ArrayOfMethod = <T = any>(
  elementSchema: Schema
) => TypeGuardValidator<T[]>
```

This method is a validator that determines whether a `value` is an array consisting of elements that can be described by the passed `schema`. It can take a type parameter - thus prompting the typescript of the valid value.

**Example:**

```typescript
// Simple
const isNumberArray = v.arrayOf(v.number)
isNumberArray([])          // true
isNumberArray([1, 2, 3])   // true
isNumberArray([1, 2, '3']) // false, because it has element '3', that is not a number

// Not so simple
type Person = {
  name: string
}

const checkPersonArray = v.arrayOf<Person>({
  name: v.string
})

const persons: any = [
  { name: 'Vlad' },
  { name: 'Petya' },
  { name: 'Batya' },
  { name: 'Viktor' },
  { name: 'Leonid' }
]
// persons: any
if (checkPersonArray(persons)) {
  // persons: Person[]
  console.log(persons.map(e => e.name).join(', '))
}
// persons: any
```

### `boolean`

```typescript
type BooleanMethod = TypeGuardValidator<boolean>
```

This method is a validator that determines whether the 'value' is a boolean type (`true` or `false`)

**Example:**

```typescript
// Simple
v.boolean(true)    // true
v.boolean(false)   // true
v.boolean('false') // false, because 'false' is not a boolean value

// Not so simple
const validateBooleanArray = v.explain(
  v.arrayOf(
     v(
      v.boolean,
      value => `${JSON.stringify(value)} is not a boolean`
    )
  )
)
const explanations = validateBooleanArray([true, false, 'not a boolean'])
console.log(explanations) // ['"not a boolean" is not a boolean']

const explanations2 = validateBooleanArray([true, false])
console.log(explanations2) // null
```

### `dictionaryOf`

```typescript
type DictionaryOfMethod = <T = any>(
  schema: Schema
) => TypeGuardValidator<{ [key: string]: T }>
```

This method accepts a validation scheme and returns a validator of the object `value`, which determines whether all values of this object are valid with respect to the passed scheme. Also it can take type parameter of type of values.

**Example:**

```typescript
const checkStringDictionary = v.dictionaryOf(v.string)
// Simple
checkStringDictionary({})    // true
checkStringDictionary({      // true
  andrew: 'Andrew',
  bohdan: 'Bohdan'
})
checkStringDictionary({      // false
  andrew: 'Andrew',
  bohdan: null // not a string
})

// Not so simple
const Sex = {
  male: 'male',
  female: 'female'
}

const sexOfPersonsDict = {
  andrew: 'male',
  lena: 'female',
  leonid: 'male',
  vasilina: 'female'
}

const checkSexOfPersonsDict = v.dictionaryOf(
  Object.values(Sex)
)
checkSexOfPersonsDict(sexOfPersonsDict) // true

checkSexOfPersonsDict({ // false, because of invalidity of `null` value
  ...sexOfPersonsDict,
  sasha: null // invalid
})
```

### `enum`

```typescript
type EnumMethod = (...values: any) => Validator
```

This method accepts all valid values and returns a validator, which determines whether the `value` is one of `values`.

The best explanation is code:

```typescript
enum: (...values) => value => values.includes(value)
```

**Example:**

```typescript
const firstValidValue = { a: 1 }
const secondValidValue = [1,2,3]
const thirdValidValue = 42

const isValid = v.enum(
  firstValidValue,
  secondValidValue,
  thirdValidValue
)

isValid(firstValidValue)  // true
isValid(secondValidValue) // true
isValid(42)               // true
isValid({ a: 1 }) // false, because of strict comparison
isValid([1,2,3])  // false, because of strict comparison
isValid('42')     // false
```

### `explain`

```typescript
type ExplainMethod = (
  schema?: Schema,
  explanation?: Explanation
) => (value: any) => null | any[]
```

This method take `schema` and explanation for `schema`(optionally) and returns function that returns `null` if value is valid, or array of explanations if `value` is invalid.

**Example:**

```typescript
const checkPerson = v({ // validator of person
  name: v( // validator 
    v.and(v.string, v.min(1))
    'wrong name' // explanation
  ),
  age: v(
    v.and( // validator
      v.safeInteger
      v.min(0),
      v.max(140)
    ),
    'wrong age' // explanation
  )
})

const validPerson = {
  name: 'andrew',
  age: 22
}
const invalidPerson = {
  name: '',
  age: 32
}

const getExplanation = v.explain(checkPerson, 'wrong person')
getExplanation(validPerson)   // null
getExplanation(invalidPerson) // ['wrong name', 'wrong person']
```

### `just`

```typescript
type JustMethod = <T = any>(schema?: Schema) => (value: any) => value is T
```

This method accepts a scheme and simply returns a JustValidator, that is, a function with a single parameter — a validated `value`. Has a type parameter of the validated `value` type.

**Example:**

```typescript
v(v.number) // (value: any, explanations?: any[], parents?: IKeyParentSchema[] ) => boolean
v.just(v.number) // (value: any): boolean

v<number>(v.number)
// (
//    value: any,
//    explanations?: any[],
//    parents?: IKeyParentSchema[]
// ) => value is number
v.just<number>(v.number)
// (value: any): value is number
```

### `max` and `min`

```typescript
type MaxMethod = (
  maxValue: number,
  exclusive?: boolean
) => TypeGuardValidator<string | number | any[]>

type MinMethod = (
  maxValue: number,
  exclusive?: boolean
) => TypeGuardValidator<string | number | any[]>

```

These methods take a limit value as an input, and return a validator that checks according to the following order:

1) If the `value` is a number, then this number must correspond to the given limit
2) If the `value` is an array or a string, then the length of this string or array must match the specified limit.

**Example:**

```typescript
const checkNegative = v.max(0, true) // check [-Infinity, 0)
[-1, 0, 1].map(checkNegative) // [true, false, false]

const checkNonPositive = v.max(0)    // check [-Infinity, 0]
[-1, 0, 1].map(checkNonPositive) // [true, true, false]

const checkNonNegative = v.min(0)    // check [0, Infinity]
[-1, 0, 1].map(checkNonNegative) // [false, true, true]

const checkPositive = v.min(0, true) // check (0, Infinity]
[-1, 0, 1].map(checkPositive) // [false, false, true]

// Not so simple
const checkRating = v.and( // Only 1, 2, 3, 4, 5 are valid
  v.safeInteger,
  v.min(1),
  v.max(5)
)
checkRating(0) // false
checkRating(1) // true
checkRating(1.2) // false
checkRating(2) // true
checkRating(3) // true
checkRating(4) // true
checkRating(5) // true
checkRating(6) // false

// Tip: checkRating = v([1,2,3,4,5])
```

### `negative`, `nonPositive`, `nonNegative`, `positive`

```typescript
type Negative = TypeGuardValidator<number>
type NonPositive = TypeGuardValidator<number>
type NonNegative = TypeGuardValidator<number>
type Positive = TypeGuardValidator<number>
```

These methods are validators that determine whether a value refers to certain sets of numbers.

The best explanation is code:
```javascript
{
  negative: value => typeof value === 'number' && value < 0,
  nonPositive: value => typeof value === 'number' && value <= 0,
  nonNegative: value => typeof value === 'number' && value >= 0,
  positive: value => typeof value === 'number' && value > 0,
}
```

**Example:**

```typescript
[-1, 0, 1].map(v.negative) // [true, false, false]
[-1, 0, 1].map(v.nonPositive) // [true, true, false]
[-1, 0, 1].map(v.nonNegative) // [false, true, true]
[-1, 0, 1].map(v.positive) // [false, false, true]

// Not so simple
const isValidAge = v.and(
  v.safeInteger,
  v.positive
)

isValidAge(0)    // false
isValidAge('22') // false
isValidAge(22)   // true
```

### `safeInteger`

```typescript
type SafeInteger = TypeGuardValidator<number>
```

This method is a validator that determines whether passed `value` is a number is an integer

The best explanation is code:
```javascript
{
  safeInteger: value => Number.isSafeInteger(value),
}
```

**Example:**

```typescript
v.safeInteger(1.5)      // false
v.safeInteger(NaN)      // false
v.safeInteger(1e102)    // false
v.safeInteger(Infinity) // false
v.safeInteger(-1)       // true
v.safeInteger(0)       // true
v.safeInteger(1)       // true

// Not so simple
const isValidAge = v.and(
  v.safeInteger,
  v.positive
)

isValidAge(0)    // false
isValidAge('22') // false
isValidAge(22)   // true
```

### `test`

```typescript
type  TestMethod = (
  test: { test(value: any): boolean }
) => Validator
```

This method takes an object with `test` method(ex. RegExp) that will  be called on the `value` passed into Validator. If `test` returns `true`: `value` is valid, otherwise: `value` is invalid

The best explanation is code:
```javascript
{
  test: testObj => value => testObj.test(value),
}
```

**Example:**

```typescript
const checkWord = v.test(/^\w+$/)
checkWord(' abc ')    // false
checkWord('testtest') // true
checkWord('test test') // false

// Not so simple
const checkPassword = v.and(
  v.string,
  v.min(8),
  v.test(/[0-9]/),
  v.test(/[a-z]/)
  v.test(/[A-Z]/)
)
checkPassword('123123')    // false, because of absense of letters,
checkPassword(123)         // false, because 123 is not a string
checkPassword('123qwe')    // false, because of absence of big letter
checkPassword('123qweQWE') // true
```

### `throwError`

```typescript
type ThrowErrorMethod = <T = any>(
  schema: Schema,
  errorMessage: string | ((value: any) => string)
) => (value: any) => T
```

This method accepts a validation schema and an error message (or a function that will accept an invalid value and return an error message). And returns this transmitted value if it is valid, otherwise it throws an error with the transmitted message. If before the type parameter, the return value will be cast to this type.

**Example:**

```typescript
const throwIfNotString = v.throwError(
  v.string,
  value => `${value} is not a string`
)
throwIfNotString('123') // => '123'
throwIfNotString(123)   // throws new TypeError('123 is not a string')
```