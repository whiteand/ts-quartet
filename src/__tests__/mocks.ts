import {
  FunctionSchema,
  IVariantSchema,
  Schema,
  IObjectSchema
} from "../types";
import { v } from "../index";

export const primitives: any[] = [
  undefined,
  null,
  true,
  false,
  0,
  1,
  NaN,
  Infinity,
  -Infinity,
  "",
  "Andrew",
  Symbol.for("test")
];

export const funcSchema: FunctionSchema = () => ({
  check: value => `typeof ${value} === 'number' && ${value} % 2 === 0`
});
export const funcSchemaWithNot: FunctionSchema = () => ({
  check: value => `typeof ${value} === 'number' && ${value} % 2 === 0`,
  not: value => `(typeof ${value} !== 'number' || ${value} % 2 !== 0)`
});
export const funcSchemaWithHandleError: FunctionSchema = () => ({
  check: value => `typeof ${value} === 'number' && ${value} % 2 === 0`,
  handleError: (value, ctx) => `${ctx}.explanations.push(${value})`
});
export const funcSchemaWithNotHandleError: FunctionSchema = () => ({
  check: value => `typeof ${value} === 'number' && ${value} % 2 === 0`,
  not: value => `(typeof ${value} !== 'number' || ${value} % 2 !== 0)`,
  handleError: (value, ctx) => `${ctx}.explanations.push(${value})`
});
export const funcSchemaWithPrepare: FunctionSchema = () => ({
  check: (value, ctx) =>
    `typeof ${value} === 'number' && ${value} % ${ctx}.divider === 0`,
  prepare: ctx => {
    ctx.divider = 2;
  }
});
export const funcSchemaWithNotWithPrepare: FunctionSchema = () => ({
  check: (value, ctx) =>
    `typeof ${value} === 'number' && ${value} % ${ctx}.divider === 0`,
  not: (value, ctx) =>
    `(typeof ${value} !== 'number' || ${value} % ${ctx}.divide !== 0)`,
  prepare: ctx => {
    ctx.divider = 2;
  }
});
export const funcSchemaWithHandleErrorWithPrepare: FunctionSchema = () => ({
  check: (value, ctx) =>
    `typeof ${value} === 'number' && ${value} % ${ctx}.divider === 0`,
  handleError: (value, ctx) => `${ctx}.explanations.push(${value})`,
  prepare: ctx => {
    ctx.divider = 2;
  }
});
export const funcSchemaWithNotHandleErrorWithPrepare: FunctionSchema = () => ({
  check: (value, ctx) =>
    `typeof ${value} === 'number' && ${value} % ${ctx}.divider === 0`,
  handleError: (value, ctx) => `${ctx}.explanations.push(${value})`,
  not: (value, ctx) =>
    `(typeof ${value} !== 'number' || ${value} % ${ctx}.divider !== 0)`,
  prepare: ctx => {
    ctx.divider = 2;
  }
});

export const funcSchemas: FunctionSchema[] = [
  funcSchema,
  funcSchemaWithNot,
  funcSchemaWithHandleError,
  funcSchemaWithNotHandleError,
  funcSchemaWithPrepare,
  funcSchemaWithNotWithPrepare,
  funcSchemaWithHandleErrorWithPrepare,
  funcSchemaWithNotHandleErrorWithPrepare
];

const has = (obj: any, key: string | number) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

export function* objects(
  level: number = 0,
  maxLevel: number = 2
): Iterable<object | any[]> {
  if (level > maxLevel) return;
  yield {};
  yield [];
  for (const obj of objects(level + 1, maxLevel)) {
    if (has(obj, "push")) {
      for (const primitive of primitives) {
        yield [...(obj as any), primitive];
      }
      for (const o of objects(level + 1, maxLevel)) {
        yield [...(obj as any), o];
      }
    } else {
      for (const primitive of primitives) {
        if (!has(obj, "even")) {
          yield { ...obj, even: primitive };
        }
        if (!has(obj, "another")) {
          yield { ...obj, another: primitive };
        }
      }
      for (const o of objects(level + 1, maxLevel)) {
        if (!has(obj, "even")) {
          yield { ...obj, even: o };
        }
        if (!has(obj, "another")) {
          yield { ...obj, another: o };
        }
        if (!has(obj, "nested")) {
          yield { ...obj, nested: o };
        }
      }
    }
  }
}

export function* variants(
  level: number = 0,
  maxLevel: number = 2
): Iterable<IVariantSchema> {
  if (level > maxLevel) {
    return;
  }
  yield [];
  for (const variant of variants(level + 1)) {
    for (const primitive of primitives) {
      yield [...variant, primitive];
    }
    for (const funcSchema of funcSchemas) {
      yield [...variant, funcSchema];
    }
    for (const obj of objectSchemas(level + 1, maxLevel)) {
      yield [...variant, obj];
    }
    for (const variant2 of variants(level + 1, maxLevel)) {
      yield [...variant, variant2];
    }
  }
}

export function* objectSchemas(
  level: number = 0,
  maxLevel: number = 2
): Iterable<IObjectSchema> {
  if (level > maxLevel) return;
  yield {};
  for (const obj of objectSchemas(level + 1, maxLevel)) {
    if (!has(obj, "even")) {
      for (const primitive of primitives) {
        yield { ...obj, even: primitive };
      }
      for (const funcSchema of funcSchemas) {
        yield { ...obj, even: funcSchema };
      }
      for (const obj of objectSchemas(level + 1, maxLevel)) {
        yield { ...obj, even: obj };
      }
      for (const obj of variants(level + 1, maxLevel)) {
        yield { ...(obj as any), even: obj };
      }
    }
    if (!has(obj, "nested")) {
      for (const primitive of primitives) {
        yield { ...obj, nested: primitive };
      }
      for (const funcSchema of funcSchemas) {
        yield { ...obj, nested: funcSchema };
      }
      for (const obj of objectSchemas(level + 1, maxLevel)) {
        yield { ...obj, nested: obj };
      }
      for (const obj of variants(level + 1, maxLevel)) {
        yield { ...(obj as any), nested: obj };
      }
    }
    if (!has(obj, v.rest)) {
      for (const primitive of primitives) {
        yield { ...obj, [v.rest]: primitive };
      }
      for (const funcSchema of funcSchemas) {
        yield { ...obj, [v.rest]: funcSchema };
      }
      for (const obj of objectSchemas(level + 1, maxLevel)) {
        yield { ...obj, [v.rest]: obj };
      }
      for (const obj of variants(level + 1, maxLevel)) {
        yield { ...(obj as any), [v.rest]: obj };
      }
    }
  }
}

export function* schemas(maxLevel: number): Iterable<Schema> {
  yield* primitives[Symbol.iterator]();
  yield* funcSchemas[Symbol.iterator]();
  yield* objectSchemas(0, maxLevel);
  yield* variants(0, maxLevel);
}

export function* values(maxLevel: number) {
  yield* primitives[Symbol.iterator]();
  yield* objects(0, maxLevel);
}
