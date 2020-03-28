# Quartet 9: Allegro

[![Build Status](https://travis-ci.com/whiteand/ts-quartet.svg?branch=master)](https://travis-ci.com/whiteand/ts-quartet)
[![Coverage Status](https://coveralls.io/repos/github/whiteand/ts-quartet/badge.svg?branch=master)](https://coveralls.io/github/whiteand/ts-quartet?branch=master)

- [Quartet 9: Allegro](#quartet-9-allegro)
  - [Примеры](#%d0%9f%d1%80%d0%b8%d0%bc%d0%b5%d1%80%d1%8b)
  - [Benchmarks](#benchmarks)
  - [Найди лишнее слово в списке](#%d0%9d%d0%b0%d0%b9%d0%b4%d0%b8-%d0%bb%d0%b8%d1%88%d0%bd%d0%b5%d0%b5-%d1%81%d0%bb%d0%be%d0%b2%d0%be-%d0%b2-%d1%81%d0%bf%d0%b8%d1%81%d0%ba%d0%b5)
  - [Возражения](#%d0%92%d0%be%d0%b7%d1%80%d0%b0%d0%b6%d0%b5%d0%bd%d0%b8%d1%8f)
  - [Признание](#%d0%9f%d1%80%d0%b8%d0%b7%d0%bd%d0%b0%d0%bd%d0%b8%d0%b5)
  - [Как этим пользоваться?](#%d0%9a%d0%b0%d0%ba-%d1%8d%d1%82%d0%b8%d0%bc-%d0%bf%d0%be%d0%bb%d1%8c%d0%b7%d0%be%d0%b2%d0%b0%d1%82%d1%8c%d1%81%d1%8f)
  - [Какие бывают схемы?](#%d0%9a%d0%b0%d0%ba%d0%b8%d0%b5-%d0%b1%d1%8b%d0%b2%d0%b0%d1%8e%d1%82-%d1%81%d1%85%d0%b5%d0%bc%d1%8b)
    - [Примитивы](#%d0%9f%d1%80%d0%b8%d0%bc%d0%b8%d1%82%d0%b8%d0%b2%d1%8b)
    - [Готовые схемы из коробки](#%d0%93%d0%be%d1%82%d0%be%d0%b2%d1%8b%d0%b5-%d1%81%d1%85%d0%b5%d0%bc%d1%8b-%d0%b8%d0%b7-%d0%ba%d0%be%d1%80%d0%be%d0%b1%d0%ba%d0%b8)
    - [Схемы созданные с помощью методов quartet](#%d0%a1%d1%85%d0%b5%d0%bc%d1%8b-%d1%81%d0%be%d0%b7%d0%b4%d0%b0%d0%bd%d0%bd%d1%8b%d0%b5-%d1%81-%d0%bf%d0%be%d0%bc%d0%be%d1%89%d1%8c%d1%8e-%d0%bc%d0%b5%d1%82%d0%be%d0%b4%d0%be%d0%b2-quartet)
    - [Вариантные схемы](#%d0%92%d0%b0%d1%80%d0%b8%d0%b0%d0%bd%d1%82%d0%bd%d1%8b%d0%b5-%d1%81%d1%85%d0%b5%d0%bc%d1%8b)
    - [Cхема Валидации Объекта](#c%d1%85%d0%b5%d0%bc%d0%b0-%d0%92%d0%b0%d0%bb%d0%b8%d0%b4%d0%b0%d1%86%d0%b8%d0%b8-%d0%9e%d0%b1%d1%8a%d0%b5%d0%ba%d1%82%d0%b0)
  - [Выводы](#%d0%92%d1%8b%d0%b2%d0%be%d0%b4%d1%8b)
  - [Advanced Quartet](#advanced-quartet)

## Примеры

Примеры смотрите [здесь](https://github.com/whiteand/ts-quartet/tree/master/examples).

## Benchmarks

`// TODO: Write it!`


## Найди лишнее слово в списке

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

## Возражения

Вы можете сказать: Как же вы можете называть функцию `checkResponse` простой?
Мы бы согласились, если бы она была такой же декларативной как сам тип `Response`. Что то на подобие:

```typescript
const checkResponse = v<Response>({
  user: {
    id: v.number,
    name: v.string,
    age: v.number,
    gender: [Gender.Male, Gender.Female],
    friendsIds: v.arrayOf(v.number)
  }
});
```

Да! Любой бы с этим согласился. Такой подход был бы крайне удобным. Но только при условии, что производительность останется на том же уровне, что и у императивной версии.

## Признание

Это именно то, что предоставляет вам эта библиотека. Надеюсь этот пример вас воодушевит читать дальше и в последствии начать пользоваться данной библиотекой.

## Как этим пользоваться?

Первое что нужно усвоить это основной порядок действий:

1. Установка

```
npm i -S quartet
```

2. Импортируйте "компилятор" схем:

```typescript
import { v } from 'quartet'
```

3. Опишите тип значения, который вы хотите проверить.
   
Этот шаг не обязательный, и если вы не пользуетесь TypeScript - можете его смело пропускать. Просто он вам поможет написать схему валидации.

```typescript
type MyType = // ...
```

4. Создайте схему валидации

```typescript
const myTypeSchema = // ...
```

5. "Скомпилируйте" эту схему в функцию валидации

```typescript
const checkMyType = v<MyType>(myTypeSchema)
```

или тоже самое без параметра типа TypeScript:

```typescript
const checkMyType = v(myTypeSchema)
```

6. Используйте `checkMyType` на тех данных, в которых вы не уверены. Она вернёт `true`, если данные валидны. Она вернёт `false` если данные не валидны.

(Смотрите пункт "Advanced Quartet" если хотите большего)

## Какие бывают схемы?

### Примитивы

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

### Готовые схемы из коробки

В `quartet` предусмотрены заготовленные схемы для определённых проверок. Они находятся в свойствах функции-компилятора `v`.

1. `v.boolean: Schema`

```typescript
const checkBoolean = v(v.boolean)
// то же, что
const checkBoolean = x => typeof x === 'boolean'
```

2. `v.finite: Schema`

```typescript
const checkFinite = v(v.finite)
// то же, что
const checkFinite = x => Number.isFinite(x)
```

3. `v.function: Schema`

```typescript
const checkFunction = v(v.function)
// то же, что
const checkFunction = x => typeof x === 'function'
```

4. `v.negative: Schema`

```typescript
const checkNegative = v(v.negative)
// то же, что
const checkNegative = x => x < 0
```

5. `v.number: Schema`

```typescript
const checkNumber = v(v.number)
// то же, что
const checkNumber = x => typeof x === 'number'
```

6. `v.positive: Schema`

```typescript
const checkPositive = v(v.positive)
// то же, что
const checkPositive = x => x > 0
```

7. `v.safeInteger: Schema`

```typescript
const checkSafeInteger = v(v.safeInteger)
// то же, что
const checkSafeInteger = x => Number.isSafeInteger(x)
```

8. `v.string: Schema`

```typescript
const checkString = v(v.string)
// то же, что
const checkString = x => typeof x === 'string'
```

9. `v.symbol: Schema`

```typescript
const checkSymbol = v(v.symbol)
// то же, что
const checkSymbol = x => typeof x === 'symbol'
```

### Схемы созданные с помощью методов quartet

У функции-компилятора также есть методы

1. `v.and(...schemas: Schema[]): Schema`

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

2. `v.arrayOf(elemSchema: Schema): Schema`

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

3. `v.custom(checkFunction: (x: any) => boolean): Schema`

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

4. `v.max(maxValue: number, isExclusive?: boolean): Schema`

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

5. `v.maxLength(maxLength: number, isExclusive?: boolean): Schema`

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

6. `v.min(minValue: number, isExclusive?: boolean): Schema`

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

7. `v.minLength(minLength: number, isExclusive?: number): Schema`

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

8. `v.not(schema: Schema): Schema`
   
Как бы применяет логическое отрицание(оператор `!`) к переданной схеме. Возвращает схему "обратную" к переданной

```typescript
const checkNonPositive = v(v.not(v.positive))
const checkNot42 = v(v.not(42))
const checkIsNotNullOrUndefined = v(
  v.and(v.not(null), v.not(undefined))
)
```

9. `v.test(tester: { test(x: any) => boolean }): Schema`

По объекту с методом `test` возвращает схему, которая проверяет возвращает ли данные метод на проверяемом значении `true`.

Чаще всего используется с Regular Expressions.

`v.test(tester) === v.custom(x => tester.test(x))`

```typescript
const checkIntegerNumberString = v(v.test(/[1-9]\d*/))
// то же, что
const checkIntegerNumberString = x => /[1-9]\d*/.test(x)
```

### Вариантные схемы

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

### Cхема Валидации Объекта

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

## Выводы

Используя эти схемы и комбинируя их вы можете декларативно описывать функции валидации, а функция-компилятор `v` создаст функцию, которая в императивном стиле проверит значение на соответствие вашей схеме.

## Advanced Quartet

`// TODO: Write it!`
