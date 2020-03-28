# Quartet 9: Allegro

[![Build Status](https://travis-ci.com/whiteand/ts-quartet.svg?branch=master)](https://travis-ci.com/whiteand/ts-quartet)
[![Coverage Status](https://coveralls.io/repos/github/whiteand/ts-quartet/badge.svg?branch=master)](https://coveralls.io/github/whiteand/ts-quartet?branch=master)

Это декларативный и быстрый инструмент для валидации данных.

- [Quartet 9: Allegro](#quartet-9-allegro)
  - [Examples](#examples)
  - [Benchmarks](#benchmarks)
  - [Is there extra word in this list?](#is-there-extra-word-in-this-list)
  - [Objections](#objections)
  - [Confession](#confession)
  - [How to use it?](#how-to-use-it)
  - [What could be a validation scheme?](#what-could-be-a-validation-scheme)
    - [Primitives](#primitives)
    - [Schemes out of the box](#schemes-out-of-the-box)
      - [`v.boolean: Schema`](#vboolean-schema)
      - [`v.finite: Schema`](#vfinite-schema)
      - [`v.function: Schema`](#vfunction-schema)
      - [`v.negative: Schema`](#vnegative-schema)
      - [`v.number: Schema`](#vnumber-schema)
      - [`v.positive: Schema`](#vpositive-schema)
      - [`v.safeInteger: Schema`](#vsafeinteger-schema)
      - [`v.string: Schema`](#vstring-schema)
      - [`v.symbol: Schema`](#vsymbol-schema)
    - [Schemes created using quartet methods](#schemes-created-using-quartet-methods)
      - [`v.and(...schemes: Schema[]): Schema`](#vandschemes-schema-schema)
      - [`v.arrayOf(elemSchema: Schema): Schema`](#varrayofelemschema-schema-schema)
      - [`v.custom(checkFunction: (x: any) => boolean): Schema`](#vcustomcheckfunction-x-any--boolean-schema)
      - [`v.max(maxValue: number, isExclusive?: boolean): Schema`](#vmaxmaxvalue-number-isexclusive-boolean-schema)
      - [`v.maxLength(maxLength: number, isExclusive?: boolean): Schema`](#vmaxlengthmaxlength-number-isexclusive-boolean-schema)
      - [`v.min(minValue: number, isExclusive?: boolean): Schema`](#vminminvalue-number-isexclusive-boolean-schema)
      - [`v.minLength(minLength: number, isExclusive?: number): Schema`](#vminlengthminlength-number-isexclusive-number-schema)
      - [`v.not(schema: Schema): Schema`](#vnotschema-schema-schema)
      - [`v.test(tester: { test(x: any) => boolean }): Schema`](#vtesttester--testx-any--boolean--schema)
    - [Variant schemes](#variant-schemes)
    - [The schema for an object is an object](#the-schema-for-an-object-is-an-object)
  - [Conclusions](#conclusions)
  - [Advanced Quartet](#advanced-quartet)
  - [Ajv vs Quartet 9: Allegro](#ajv-vs-quartet-9-allegro)

## Examples

Примеры смотрите [здесь](https://github.com/whiteand/ts-quartet/tree/master/examples/javascript).

## Benchmarks

[`Ajv` vs `quartet` 9: Allegro](#ajv-vs-quartet-9-allegro)


## Is there extra word in this list?

- Чужое API
- Typescript
- Уверенность
- Простота
- Производительность

На наш взгляд здесь нет лишнего слова. Давайте взглянем на следующую ситуацию.

Мы запрашиваем с **Чужого API** информацию про пользователя.

Эта информация имеет определённый тип, запишем его на языке **TypeScript**:

```typescript
interface Response {
  user: {
    id: number;
    name: string;
    age: number;
    gender: 'Male' | 'Female';
    friendsIds: number[];
  }
}
```

Чтобы добиться **Уверенности** мы напишем функцию, которая сообщит нам действительно ли ответ имеет тип `Response`.

```typescript
// Подробнее о таких функциях гуглите "Typescript Custom Type Guards"
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

Теперь в том месте где мы делаем запрос сделаем проверку:

```typescript
// ...
const userResponse = await GET("http://api.com/user/1");
if (!checkResponse(userResponse)) {
  throw new Error("API response is invalid");
}
const { user } = userResponse; // имеет тип Response
// ...
```

Данный подход, с натяжкой, но можно назвать **Простым**.

Довольно сложно придумать более быстрый вариант обеспечить гарантию типа. Поэтому этот код обладает достаточной **Производительностью**.

Мы получили всё то, что хотели!

## Objections

Вы можете сказать: Как же вы можете называть функцию `checkResponse` простой?
Мы бы согласились, если бы она была такой же декларативной как сам тип `Response`. Что то на подобие:

```typescript
const checkResponse = v<Response>({
  user: {
    id: v.number,
    name: v.string,
    age: v.number,
    gender: ['Male', 'Female'],
    friendsIds: v.arrayOf(v.number)
  }
});
```

Да! Любой бы с этим согласился. Такой подход был бы крайне удобным. Но только при условии, что производительность останется на том же уровне, что и у императивной версии.

## Confession

Это именно то, что предоставляет вам эта библиотека. Надеюсь этот пример вас воодушевит читать дальше и в последствии начать пользоваться данной библиотекой.

## How to use it?

Первое что нужно усвоить это основной порядок действий:

- Установка

```
npm i -S quartet
```

- Импортируйте "компилятор" схем:

```typescript
import { v } from 'quartet'
```

- Опишите тип значения, который вы хотите проверить.
   
Этот шаг не обязательный, и если вы не пользуетесь TypeScript - можете его смело пропускать. Просто он вам поможет написать схему валидации.

```typescript
type MyType = // ...
```

- Создайте схему валидации

```typescript
const myTypeSchema = // ...
```

- "Скомпилируйте" эту схему в функцию валидации

```typescript
const checkMyType = v<MyType>(myTypeSchema)
```

или тоже самое без параметра типа TypeScript:

```typescript
const checkMyType = v(myTypeSchema)
```

- Используйте `checkMyType` на тех данных, в которых вы не уверены. Она вернёт `true`, если данные валидны. Она вернёт `false` если данные не валидны.

(Смотрите пункт "Advanced Quartet" если хотите большего)

## What could be a validation scheme?

### Primitives

Каждое примитивное значение Javascript является собственной схемой валидации.

Приведу пример:

```typescript
const isNull = v(null)
// то же, что
const isNull = x => x === null
```

или

```typescript
const is42 = v(42)
// то же, что
const is42 = x => x === 42
```

Примитивами считаются все значения Javascript, за исключением объектов(массивов в том числе) и функций. То есть: `undefined`, `null`, `false`, `true`, числа(`NaN`, `Infinity`, `-Infinity` в том числе) и строки.

### Schemes out of the box

В `quartet` предусмотрены заготовленные схемы для определённых проверок. Они находятся в свойствах функции-компилятора `v`.

#### `v.boolean: Schema`

```typescript
const checkBoolean = v(v.boolean)
// то же, что
const checkBoolean = x => typeof x === 'boolean'
```

#### `v.finite: Schema`

```typescript
const checkFinite = v(v.finite)
// то же, что
const checkFinite = x => Number.isFinite(x)
```

#### `v.function: Schema`

```typescript
const checkFunction = v(v.function)
// то же, что
const checkFunction = x => typeof x === 'function'
```

#### `v.negative: Schema`

```typescript
const checkNegative = v(v.negative)
// то же, что
const checkNegative = x => x < 0
```

#### `v.number: Schema`

```typescript
const checkNumber = v(v.number)
// то же, что
const checkNumber = x => typeof x === 'number'
```

#### `v.positive: Schema`

```typescript
const checkPositive = v(v.positive)
// то же, что
const checkPositive = x => x > 0
```

#### `v.safeInteger: Schema`

```typescript
const checkSafeInteger = v(v.safeInteger)
// то же, что
const checkSafeInteger = x => Number.isSafeInteger(x)
```

#### `v.string: Schema`

```typescript
const checkString = v(v.string)
// то же, что
const checkString = x => typeof x === 'string'
```

#### `v.symbol: Schema`

```typescript
const checkSymbol = v(v.symbol)
// то же, что
const checkSymbol = x => typeof x === 'symbol'
```

### Schemes created using quartet methods

У функции-компилятора также есть методы

#### `v.and(...schemes: Schema[]): Schema`

Создаёт как бы соединение схем с помощью логического И (как оператор `&&`)

```typescript
const positiveNumberSchema = v.and(v.number, v.positive)
const isPositiveNumber = v(positiveNumberSchema)

// то же, что

const isPositiveNumber = x => {
  if (typeof x !== 'number') return false
  if (x <= 0) return false
  return true
}
```

#### `v.arrayOf(elemSchema: Schema): Schema`

По схеме елемента создаёт схему валидации массива этих елементов:

```typescript
const elemSchema = v.and(v.number, v.positive)
const arraySchema = v.arrayOf(elemSchema)
const checkPositiveNumbersArray = v(arraySchema)

// то же, что

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

По функции валидации создаёт схему.

```typescript
function checkEven(x) {
  return x % 2 === 0
}

const evenSchema = v.custom(isEven)
const checkPositiveEvenNumber = v.and(v.number, v.positive, evenSchema)

// то же, что

const checkPositiveEvenNumber = x => {
  if (typeof x !== 'number') return false
  if (x <= 0) return false
  if (!checkEven(x)) return false
  return true
}

```

(Смотрите пункт "Advanced Quartet" если хотите большего)

#### `v.max(maxValue: number, isExclusive?: boolean): Schema`

По максимальному(или граничному) числу возвращает соответствующую схему валидации

```typescript
const checkLessOrEqualToFive = v(v.max(5))
// то же, что
const checkLessOrEqualToFive = x => x <= 5
```

```typescript
const checkLessThanFive = v(v.max(5, true))
// то же, что
const checkLessThanFive = x => x < 5
```

#### `v.maxLength(maxLength: number, isExclusive?: boolean): Schema`

По максимальному(или граничному) значению длинны возвращает соответствующую cхему

```typescript
const checkTwitterText = v(v.maxLength(140))
// то же, что
const checkTwitterText = x => x != null && x.length <= 140
const checkTwitterText = v({ length: v.max(140) })
```
```typescript
const checkSmallArray = v(v.maxLength(20, true))
// то же, что
const checkSmallArray = x => x != null && x.length < 140
const checkTwitterText = v({ length: v.max(20, true) })
```

#### `v.min(minValue: number, isExclusive?: boolean): Schema`

По минимальному(или граничному) числу возвращает соответствующую схему валидации

```typescript
const checkNonNegative = v(v.min(0))
// то же, что
const checkNonNegative = x => x >= 0
```
```typescript
const checkPositive = v(v.min(0, true))
// то же, что
const checkPositive = x => x > 0
const checkPositive = v(v.positive)
```

#### `v.minLength(minLength: number, isExclusive?: number): Schema`

По максимальному(или граничному) значению длинны возвращает соответствующую cхему.

```typescript
const checkLargeArrayOrString = v(v.minLength(1024))
// то же, что
const checkLargeArrayOrString = x => x != null && x.length >= 1024
const checkLargeArrayOrString = v({ length: v.min(1024) })
```
```typescript
const checkNotEmptyStringOrArray = v(v.minLength(0, true))
// то же, что
const checkNotEmptyStringOrArray = x => x != null && x.length > 0
const checkNotEmptyStringOrArray = v({ length: v.min(0, true) })

```

#### `v.not(schema: Schema): Schema`
   
Как бы применяет логическое отрицание(оператор `!`) к переданной схеме. Возвращает схему "обратную" к переданной

```typescript
const checkNonPositive = v(v.not(v.positive))
const checkNot42 = v(v.not(42))
const checkIsNotNullOrUndefined = v(
  v.and(v.not(null), v.not(undefined))
)
```

#### `v.test(tester: { test(x: any) => boolean }): Schema`

По объекту с методом `test` возвращает схему, которая проверяет возвращает ли данные метод на проверяемом значении `true`.

Чаще всего используется с Regular Expressions.

`v.test(tester) === v.custom(x => tester.test(x))`

```typescript
const checkIntegerNumberString = v(v.test(/[1-9]\d*/))
// то же, что
const checkIntegerNumberString = x => /[1-9]\d*/.test(x)
```

### Variant schemes

Массив схем выступает как бы соединением схем с помощью логической операции ИЛИ(оператор `||`)

```typescript
const checkStringOrNull = v([v.string, null])
// то же, что
const checkStringOrNull = x => {
  if (typeof x === 'string') return true
  if (x === null) return true
  return false
}
```

```typescript
const checkGender = v(['male', 'female'])
// то же, что
const VALID_GENDERS = { male: true, female: true }
const checkStringOrNull = x => {
  if (VALID_GENDERS[x] === true) return true
  return false
}
```

```typescript
const checkRating = v([1,2,3,4,5])
// то же, что
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

Объект, где значения являются схемами выступает схемой валидации объекта. Где соответствующие поля валидируется соответствующими схемами.

```typescript
const checkHelloWorld = v({ hello: 'World' })
// то же, что
const checkHelloWorld = x => {
  if (x == null) return false
  if (x.hello !== 'World') return false
  return true
}
```

Если вы хотите валидировать объекты с неизвестными заранее полями - используйте `v.rest`

```typescript
interface PhoneBook {
  [name: string]: string
}
```

```typescript
const checkPhoneBook = v({
  [v.rest]: v.string
})
```

Схема по ключу `v.rest` будет валидировать все неуказанные поля.

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

## Conclusions

Используя эти схемы и комбинируя их вы можете декларативно описывать функции валидации, а функция-компилятор `v` создаст функцию, которая в императивном стиле проверит значение на соответствие вашей схеме.

## Advanced Quartet

`// TODO: Write it!`

## Ajv vs Quartet 9: Allegro

Я написал бенчмарк для того, чтобы сравнить одну из самых быстрых библиотек валидации `ajv` с моей на примере из вступления.

```javascript

const Benchmark = require("benchmark");

const { v } = require("quartet");
const validator = v({
  user: {
    id: v.number,
    name: v.string,
    age: v.number,
    gender: ['Male', 'Female'],
    friendsIds: v.arrayOf(v.number)
  }
})

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

И результат такой:

```
ajv                x 1,670,584 ops/sec ±0.79% (90 runs sampled)
Quartet 9: Allegro x 3,587,787 ops/sec ±9.26% (66 runs sampled)
```
