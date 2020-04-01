# Quartet 9: Allegro

[![Build Status](https://travis-ci.com/whiteand/ts-quartet.svg?branch=master)](https://travis-ci.com/whiteand/ts-quartet)
[![Coverage Status](https://coveralls.io/repos/github/whiteand/ts-quartet/badge.svg?branch=master)](https://coveralls.io/github/whiteand/ts-quartet?branch=master)

**Size: 5.52 KB** (minified and gzipped). No dependencies. [Size Limit](https://github.com/ai/size-limit) controls the size.

It is a declarative and fast tool for data validation.

- [Quartet 9: Allegro](#quartet-9-allegro)
  - [Examples](#examples)
  - [Benchmarks](#benchmarks)
  - [Is there extra word in this list?](#is-there-extra-word-in-this-list)
  - [Objections](#objections)
  - [Confession](#confession)
  - [How to use it?](#how-to-use-it)
  - [What could be a validation scheme?](#what-could-be-a-validation-scheme)
    - [Primitives](#primitives)
    - [Schemas out of the box](#schemas-out-of-the-box)
      - [`v.boolean: Schema`](#vboolean-schema)
      - [`v.finite: Schema`](#vfinite-schema)
      - [`v.function: Schema`](#vfunction-schema)
      - [`v.negative: Schema`](#vnegative-schema)
      - [`v.number: Schema`](#vnumber-schema)
      - [`v.positive: Schema`](#vpositive-schema)
      - [`v.safeInteger: Schema`](#vsafeinteger-schema)
      - [`v.string: Schema`](#vstring-schema)
      - [`v.symbol: Schema`](#vsymbol-schema)
    - [Schemas created using quartet methods](#schemas-created-using-quartet-methods)
      - [`v.and(...schemas: Schema[]): Schema`](#vandschemas-schema-schema)
      - [`v.arrayOf(elemSchema: Schema): Schema`](#varrayofelemschema-schema-schema)
      - [`v.custom(checkFunction: (x: any) => boolean): Schema`](#vcustomcheckfunction-x-any--boolean-schema)
      - [`v.errorBoundary(schema: Schema, errorBoundary?: ErrorBoundary): Schema`](#verrorboundaryschema-schema-errorboundary-errorboundary-schema)
      - [`v.max(maxValue: number, isExclusive?: boolean): Schema`](#vmaxmaxvalue-number-isexclusive-boolean-schema)
      - [`v.maxLength(maxLength: number, isExclusive?: boolean): Schema`](#vmaxlengthmaxlength-number-isexclusive-boolean-schema)
      - [`v.min(minValue: number, isExclusive?: boolean): Schema`](#vminminvalue-number-isexclusive-boolean-schema)
      - [`v.minLength(minLength: number, isExclusive?: number): Schema`](#vminlengthminlength-number-isexclusive-number-schema)
      - [`v.not(schema: Schema): Schema`](#vnotschema-schema-schema)
      - [`v.test(tester: { test(x: any) => boolean }): Schema`](#vtesttester--testx-any--boolean--schema)
    - [Variant schemas](#variant-schemas)
    - [The schema for an object is an object](#the-schema-for-an-object-is-an-object)
  - [Conclusions](#conclusions)
  - [Configuring](#configuring)
    - [`errorBoundary`](#errorboundary)
  - [Advanced Quartet](#advanced-quartet)
  - [Ajv vs Quartet 9: Allegro](#ajv-vs-quartet-9-allegro)

## Examples

See examples [here](https://github.com/whiteand/ts-quartet/tree/master/examples/javascript).

## Benchmarks

[`Ajv` vs `quartet` 9: Allegro](#ajv-vs-quartet-9-allegro)

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
    id: number;
    name: string;
    age: number;
    gender: "Male" | "Female";
    friendsIds: number[];
  };
}
```

To achieve **Confidence** we will write a function that tells us whether the answer is of type `Response`.

```typescript
// More details about such functions google
// "Typescript Custom Type Guards"
function checkResponse(response: any): response is Response {
  if (response == null) return false;

  if (response.user == null) return false;

  if (typeof response.user.id !== "number") return false;

  if (typeof response.user.name !== "string") return false;

  if (typeof response.user.age !== "number") return false;

  if (VALID_GENDERS_DICT[response.user.gender] !== true) return false;

  if (!response.user.friendsIds || !Array.isArray(response.user.friendsIds))
    return false;
  for (let i = 0; i < response.user.friendsIds.length; i++) {
    const id = response.user.friendsIds[i];
    if (typeof id !== "number") return false;
  }

  return true;
}

const VALID_GENDERS_DICT = {
  Male: true,
  Female: true
};
```

Now in the place where we make the request, we will check:

```typescript
// ...
const userResponse = await GET("http://api.com/user/1");
if (!checkResponse(userResponse)) {
  throw new Error("API response is invalid");
}
const { user } = userResponse; // has type Response
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
    gender: ["Male", "Female"],
    friendsIds: v.arrayOf(v.number)
  }
});
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
import { v } from "quartet";
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
const checkMyType = v<MyType>(myTypeSchema);
```

or the same without TypeScript type parameter:

```typescript
const checkMyType = v(myTypeSchema);
```

- Use `checkMyType` on data that you are not sure about. It will return `true` if the data is valid. It will return `false` if the data is not valid.

![Flow](https://raw.githubusercontent.com/whiteand/ts-quartet/master/infographic/flow.jpg)

## What could be a validation scheme?

![Flow](https://raw.githubusercontent.com/whiteand/ts-quartet/master/infographic/schema.jpg)

### Primitives

Each primitive Javascript value is its own validation scheme.

I will give an example:

```typescript
const isNull = v(null);
// same as
const isNull = x => x === null;
```

or

```typescript
const is42 = v(42);
// same as
const is42 = x => x === 42;
```

Primitives are all Javascript values, with the exception of objects (including arrays) and functions. That is: `undefined`,`null`, `false`,`true`, numbers (`NaN`,`Infinity`, `-Infinity` including) and strings.

![Flow](https://raw.githubusercontent.com/whiteand/ts-quartet/master/infographic/primitive_schema.jpg)

### Schemas out of the box

Quartet provides pre-defined schemas for specific checks. They are in the properties of the `v` compiler function.

#### `v.boolean: Schema`

```typescript
const checkBoolean = v(v.boolean);
// same as
const checkBoolean = x => typeof x === "boolean";
```

#### `v.finite: Schema`

```typescript
const checkFinite = v(v.finite);
// same as
const checkFinite = x => Number.isFinite(x);
```

#### `v.function: Schema`

```typescript
const checkFunction = v(v.function);
// same as
const checkFunction = x => typeof x === "function";
```

#### `v.negative: Schema`

```typescript
const checkNegative = v(v.negative);
// same as
const checkNegative = x => x < 0;
```

#### `v.number: Schema`

```typescript
const checkNumber = v(v.number);
// same as
const checkNumber = x => typeof x === "number";
```

#### `v.positive: Schema`

```typescript
const checkPositive = v(v.positive);
// same as
const checkPositive = x => x > 0;
```

#### `v.safeInteger: Schema`

```typescript
const checkSafeInteger = v(v.safeInteger);
// same as
const checkSafeInteger = x => Number.isSafeInteger(x);
```

#### `v.string: Schema`

```typescript
const checkString = v(v.string);
// same as
const checkString = x => typeof x === "string";
```

#### `v.symbol: Schema`

```typescript
const checkSymbol = v(v.symbol);
// same as
const checkSymbol = x => typeof x === "symbol";
```

### Schemas created using quartet methods

The compiler function also has methods that return schemas.

#### `v.and(...schemas: Schema[]): Schema`

It creates a kind of connection schemas using a logical AND (like the operator `&&`)

```typescript
const positiveNumberSchema = v.and(v.number, v.positive);
const isPositiveNumber = v(positiveNumberSchema);

// same as

const isPositiveNumber = x => {
  if (typeof x !== "number") return false;
  if (x <= 0) return false;
  return true;
};
```

#### `v.arrayOf(elemSchema: Schema): Schema`

According to the element scheme, it creates a validation scheme for an array of these elements:

```typescript
const elemSchema = v.and(v.number, v.positive);
const arraySchema = v.arrayOf(elemSchema);
const checkPositiveNumbersArray = v(arraySchema);

// same as

const checkPositiveNumbersArray = x => {
  if (!x || !Array.isArray(x)) return false;
  for (let i = 0; i < 0; i++) {
    const elem = x[i];
    if (typeof elem !== "number") return false;
    if (elem <= 0) return false;
  }
  return true;
};
```

#### `v.custom(checkFunction: (x: any) => boolean): Schema`

From the validation function, it creates a schema.

```typescript
function checkEven(x) {
  return x % 2 === 0;
}

const evenSchema = v.custom(isEven);
const checkPositiveEvenNumber = v(v.and(v.number, v.positive, evenSchema));

// same as

const checkPositiveEvenNumber = x => {
  if (typeof x !== "number") return false;
  if (x <= 0) return false;
  if (!checkEven(x)) return false;
  return true;
};
```

(See [Advanced Quartet](#advanced-quartet) for more.)

#### `v.errorBoundary(schema: Schema, errorBoundary?: ErrorBoundary): Schema`

Returns an equivalent schema to the one passed, but with additional behavior. If validation fails, the `errorBoundary` function is called.

This function inserts the necessary explanations into the array passed to it by the first parameter.

This function has the following type:

```typescript
type ErrorBoundary = (
  explanations: any[],
  data: {
    value: any;
    schema: Schema;
    innerExplanations: any[];
    id: string | number;
  }
) => void;
```

Where

- `explanations` - an array into which we must insert explanations
- `value` - invalid value
- `schema` - schema that was cause invalidation
- `innerExplanations` - explanations of internal invalidations
- `id` - name of invalid value in validator code

If the parameter `errorBoundary` is not forwarded, the default `errorBoundary` from this quartet instance will be used. (See [Configuration](#configuring))

If the parameter `errorBoundary` is not forwarded and there is no `errorBoundary` by default, the scheme will return without any changes.

Example:

```typescript
const errorBoundaryHandler = (explanations, { value }) =>
  explanations.push(value);

const elementSchema = v.errorBoundary(v.number, errorBoundaryHandler);

const checkNumbers = v(v.arrayOf(elementSchema));

checkNumbers([]); // true
checkNumbers.explanations; // []

checkNumbers([1, 2, 3, 4]); // true
checkNumbers.explanations; // []

checkNumbers([1, 2, 3, "4"]);
checkNumbers.explanations; // ['4']
```

#### `v.max(maxValue: number, isExclusive?: boolean): Schema`

By the maximum (or boundary) number returns the corresponding validation scheme.

```typescript
const checkLessOrEqualToFive = v(v.max(5));
// same as
const checkLessOrEqualToFive = x => x <= 5;
```

```typescript
const checkLessThanFive = v(v.max(5, true));
// same as
const checkLessThanFive = x => x < 5;
```

#### `v.maxLength(maxLength: number, isExclusive?: boolean): Schema`

By the maximum (or boundary) value of the length, returns the corresponding schema.

```typescript
const checkTwitterText = v(v.maxLength(140));
// same as
const checkTwitterText = x => x != null && x.length <= 140;
const checkTwitterText = v({ length: v.max(140) });
```

```typescript
const checkSmallArray = v(v.maxLength(20, true));
// same as
const checkSmallArray = x => x != null && x.length < 140;
const checkTwitterText = v({ length: v.max(20, true) });
```

#### `v.min(minValue: number, isExclusive?: boolean): Schema`

By the minimum (or boundary) number returns the corresponding validation scheme.

```typescript
const checkNonNegative = v(v.min(0));
// same as
const checkNonNegative = x => x >= 0;
```

```typescript
const checkPositive = v(v.min(0, true));
// same as
const checkPositive = x => x > 0;
const checkPositive = v(v.positive);
```

#### `v.minLength(minLength: number, isExclusive?: number): Schema`

By the minimum (or boundary) value of the length, returns the corresponding schema.

```typescript
const checkLargeArrayOrString = v(v.minLength(1024));
// same as
const checkLargeArrayOrString = x => x != null && x.length >= 1024;
const checkLargeArrayOrString = v({ length: v.min(1024) });
```

```typescript
const checkNotEmptyStringOrArray = v(v.minLength(0, true));
// same as
const checkNotEmptyStringOrArray = x => x != null && x.length > 0;
const checkNotEmptyStringOrArray = v({ length: v.min(0, true) });
```

#### `v.not(schema: Schema): Schema`

Applies logical negation (like the `!` Operator) to the passed schema. Returns the inverse schema to the passed one.

```typescript
const checkNonPositive = v(v.not(v.positive));
const checkNot42 = v(v.not(42));
const checkIsNotNullOrUndefined = v(v.and(v.not(null), v.not(undefined)));
```

#### `v.test(tester: { test(x: any) => boolean }): Schema`

On an object with the `test` method, returns a schema that checks whether the given `test` method returns `true` on the checked value .

Most commonly used with Regular Expressions.

`v.test(tester) === v.custom(x => tester.test(x))`

```typescript
const checkIntegerNumberString = v(v.test(/[1-9]\d*/));
// same as
const checkIntegerNumberString = x => /[1-9]\d*/.test(x);
```

### Variant schemas

An array of schemas acts as a connection of schemas using the logical operation OR (operator `||`)

```typescript
const checkStringOrNull = v([v.string, null]);
// same as
const checkStringOrNull = x => {
  if (typeof x === "string") return true;
  if (x === null) return true;
  return false;
};
```

```typescript
const checkGender = v(["male", "female"]);
// same as
const VALID_GENDERS = { male: true, female: true };
const checkStringOrNull = x => {
  if (VALID_GENDERS[x] === true) return true;
  return false;
};
```

```typescript
const checkRating = v([1, 2, 3, 4, 5]);
// same as
const checkRating = x => {
  if (x === 1) return true;
  if (x === 2) return true;
  if (x === 3) return true;
  if (x === 4) return true;
  if (x === 5) return true;
  return false;
};
```

### The schema for an object is an object

An object whose values are schemas is an object validation schema. Where the appropriate fields are validated by the appropriate schemas.

```typescript
const checkHelloWorld = v({ hello: "World" });
// same as
const checkHelloWorld = x => {
  if (x == null) return false;
  if (x.hello !== "World") return false;
  return true;
};
```

If you want to validate objects with previously unknown fields, use `v.rest`

```typescript
interface PhoneBook {
  [name: string]: string;
}
```

```typescript
const checkPhoneBook = v({
  [v.rest]: v.string
});
```

The scheme from the `v.rest` key will validate all unspecified fields.

```typescript
interface PhoneBookWithAuthorId {
  authorId: number;
  [name: string]: string;
}
```

```typescript
const checkPhoneBookWithAuthorId = v({
  authorId: v.number,
  [v.rest]: v.string
});
```

## Conclusions

Using these schemes and combining them, you can declaratively describe validation functions, and the `v` compiler function will create a function that imperatively checks the value against your scheme.

## Configuring

`v` that is used in this documentation is an zero-configured "instance" of `quartet`.

```typescript
export const v = quartet();
```

You can create your own customized instances of `quartet`

```typescript
import { quartet } from "quartet";

const config = {
  // ...
};
const myV = quartet(config);
```

`config` can contain such props:

### `errorBoundary`

This field describes default errorBoundary that will be applied for each compiled schema(Each function that will be generated by `quartet` will have this error boundary by default).

(Look more [here](#verrorboundaryschema-schema-errorboundaryhandler-errorboundary-schema))

Example:

```typescript
const exp = quartet({
  errorBoundary(explanations, { id, value, schema, innerExplanations }) {
    if (innerExplanations.length > 0) {
      explanations.push(...innerExplanations);
    } else {
      explanations.push({ id, value, schema });
    }
  }
});

const nameSchema = exp.and(exp.string, exp.minLength(1));
const idSchema = v.safeInteger;
const schema = {
  name: exp.errorBoundary(nameSchema), // apply default error boundary for name property
  id: exp.errorBoundary(idSchema) // apply default error boundary for id property
};
const checkPerson = exp(schema);

checkPerson(null); // false
console.log(checkPerson.explanations);
// [{ value: null, schema: { name: ..., id: ... }, id: "value" }]

checkPerson({});
console.log(checkPerson.explanations);
// [{ value: undefined, schema: nameSchema, id: "value.name" }]

checkPerson({ name: "Andrew", id: "1" });
console.log(checkPerson.explanations);
// [{ value: '1', schema: v.safeInteger, id: "value.id" }]
```

## Advanced Quartet

`// TODO: Write it!`

## Ajv vs Quartet 9: Allegro

I wrote a benchmark in order to compare one of the fastest `ajv` validation libraries with my example from the introduction.

```javascript
const Benchmark = require("benchmark");

const { v } = require("quartet");
const validator = v({
  user: {
    id: v.number,
    name: v.string,
    age: v.number,
    gender: ["Male", "Female"],
    friendsIds: v.arrayOf(v.number)
  }
});

const Ajv = require("ajv");
const ajv = new Ajv();

const ajvValidator = ajv.compile({
  type: "object",
  required: ["user"],
  properties: {
    user: {
      type: "object",
      required: ["id", "name", "age", "gender", "friendsIds"],
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        age: { type: "number" },
        gender: { type: "string", enum: ["Male", "Female"] },
        friendsIds: { type: "array", items: { type: "number" } }
      }
    }
  }
});

const positive = [
  {
    user: { id: 1, name: "Andrew", age: 23, gender: "Male", friendsIds: [2, 3] }
  },
  {
    user: {
      id: 2,
      name: "Vasilina",
      age: 20,
      gender: "Female",
      friendsIds: [1]
    }
  },
  { user: { id: 3, name: "Bohdan", age: 23, gender: "Male", friendsIds: [1] } },
  { user: { id: 4, name: "Siroja", age: 99, gender: "Male", friendsIds: [] } }
];
const negative = [
  null,
  false,
  undefined,
  {},
  { user: null },
  { user: false },
  { user: undefined },
  {
    user: {
      id: "1",
      name: "Andrew",
      age: 23,
      gender: "Male",
      friendsIds: [2, 3]
    }
  },
  {
    user: {
      id: 1,
      name: undefined,
      age: 23,
      gender: "Male",
      friendsIds: [2, 3]
    }
  },
  {
    user: {
      id: 1,
      name: "Andrew",
      age: undefined,
      gender: "Male",
      friendsIds: [2, 3]
    }
  },
  {
    user: {
      id: 1,
      name: "Andrew",
      age: 23,
      gender: undefined,
      friendsIds: [2, 3]
    }
  },
  {
    user: { id: 1, name: "Andrew", age: 23, gender: "male", friendsIds: [2, 3] }
  },
  {
    user: {
      id: 1,
      name: "Andrew",
      age: 23,
      gender: "Male",
      friendsIds: undefined
    }
  }
];
const suite = new Benchmark.Suite();
suite
  .add("ajv", function() {
    for (let i = 0; i < positive.length; i++) {
      ajvValidator(positive[i]);
    }
    for (let i = 0; i < negative.length; i++) {
      ajvValidator(negative[i]);
    }
  })
  .add("Quartet 9: Allegro", function() {
    for (let i = 0; i < positive.length; i++) {
      validator(positive[i]);
    }
    for (let i = 0; i < negative.length; i++) {
      validator(negative[i]);
    }
  })
  .on("cycle", function(event) {
    console.log(String(event.target));
  })
  .on("complete", function() {
    console.log(
      this.filter("fastest")
        .map("name")
        .toString()
    );
  })
  .run();
```

And the result is this:

```
ajv                x 1,670,584 ops/sec ±0.79% (90 runs sampled)
Quartet 9: Allegro x 3,587,787 ops/sec ±9.26% (66 runs sampled)
```
