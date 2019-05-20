# Quartet 8

## Goals

Today more than ever there is a need to verify data coming from third parties. When you need to have guarantees that the structure and content of the data this library will provide you with these guarantees.

## Concepts

### Just Validator

A **Just Validator** is a function that determines whether data has a suitable structure and content.

This concept can be represent by such Typescript definition:

```typescript
type JustValidator = (value: any) => boolean
```

As we see from this description JustValidator takes value of any type and returns `true` if value is valid and `false` if value is not valid.

### Validator

But `quartet` library uses a little bit wider concept of *explanatory validator*

The [Explanatory]**Validator** is like a just validator but it also explains the reason for the invalidity of the data.

This concept can be represent by such Typescript definition:

```typescript
type Validator = (value: any, explanations?: any[]) => boolean
```

As we see from this description Validator takes value of any type and returns `true` if the value is valid, and `false` if the value is not valid. But additionaly it pushes explanation of the invalidity into `explanations` parameter(if value is invalid and `explanations` parameter is passed).

### Quartet Instance

Quartet instance - is an concept that represents function that takes schema of validation and returns Validator.

In typescript we can represent it by such definition: 
```typescript
type QuartetInstance = (schema: Schema, explanation?: Explanation) => Validator
```

As we can see from this definition - quartet instance is a function that takes schema of validation(all schema types described in the next concept) and explanation optionally and creates validator defined by schema.

Explanation is the value that can describe what is went wrong.

Examples:
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

### Schema

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

**Examples:**

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

**Examples**:

| Schema  |  Validator explained by schema |
|:-:|:-:|
| `null` | `value => value === null`  |
| `2`  | `value => value === 2`  |
| `'male'`  | `value => value === 'male'`  |
| `undefined`  | `value => value === undefined`  |
| `Symbol.for('test')`  | `value => value === Symbol.for('test')` |
| `primitive_type_value`  |  `value => value === primitive_type_value` |

- When a schema is an array of schemas(`IVariantSchema`), this means that the validator created by this schema must determine if there is such a schema within this array, according to which the value is valid

**Examples**:

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

1. Import quartet library and instantiate quartet instance

```typescript
import quartet from 'quartet'
const v = quartet()

// or use default instance

import { v } from 'quartet'
```

2. Write schema of the validation

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

3. Create Validator using quartet instance

```typescript
const personValidator = v(personSchema)
```

4. Use validator

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

### Quartet

