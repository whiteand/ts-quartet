# Quartet 9: Allegro

[![Build Status](https://travis-ci.com/whiteand/ts-quartet.svg?branch=master)](https://travis-ci.com/whiteand/ts-quartet)
[![Coverage Status](https://coveralls.io/repos/github/whiteand/ts-quartet/badge.svg?branch=master)](https://coveralls.io/github/whiteand/ts-quartet?branch=master)

## Примеры

Примеры смотрите [здесь](https://github.com/whiteand/ts-quartet/tree/master/examples).

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

(Смотрите статью "Advanced Quartet" если хотите большего)

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

Создаёт как бы соединение схем с помощью логического И (как оператор &&)

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

(Читайте Advanced Quartet если хотите большего)

4. `v.max(maxValue: number, isExclusive?: boolean): Schema`

По максимальному(или граничному) числу возвращает соответствующую схему валидации

```typescript
const checkLessOrEqualToFive = v(v.max(5))
// то же, что
const checkLessOrEqualToFive = x => x <= 5


const checkLessThanFive = v(v.max(5, true))
// то же, что
const checkLessThanFive = x => x < 5
```

5. `v.maxLength(maxLength: number, isExclusive?: boolean): Schema`

По максимальному(или граничному) значению длинны возвращает соответствующую функцию

```typescript
const checkTwitterText = v(v.maxLength(140))
// то же, что
const checkTwitterText = x => x.length <= 140

const checkSmallArray = v(v.maxLength(20, true))
// то же, что
const checkSmallArray = x => x.length < 140
```

1. `v.min(minValue: number, isExclusive?: boolean): Schema`

По максимальному(или граничному) числу возвращает соответствующую схему валидации

```typescript


```

7. `v.minLength`

```typescript


```

8. `v.not`

```typescript


```

9. `v.test`

```typescript


```
