import { addTabs } from "./addTabs";
import { compileIfNotValidReturnFalse } from "./compileIfNotValidReturnFalse";
import {
  Prepare,
  Schema,
  TypedCompilationResult,
  QuartetInstance
} from "./types";
import { handleSchema } from "./handleSchema";

function getOptimizedOrNull<T = any>(schema: Schema) {
  return handleSchema<null | TypedCompilationResult<T[]>>({
    variant: schemas => {
      if (Array.isArray(schemas) && schemas.length === 0) {
        return Object.assign((value: any): value is T[] => value && Array.isArray(value) && value.length === 0, { explanations: [], pure: true });
      }
      return null;
    },
    constant: () => null,
    function: () => null,
    object: () => null,
    objectRest: () => null
  })(schema);
}


export function compileArrayOf<T = any>(
  v: QuartetInstance,
  schema: Schema
): TypedCompilationResult<T[]> {
  // compileArrayOf([])
  const optimizedOrNull = getOptimizedOrNull<T>(schema);

  if (optimizedOrNull) {
    return optimizedOrNull
  }

  const preparations: Prepare[] = [];
  const [forLoopBody, pure] = compileIfNotValidReturnFalse(
    v,
    "elem",
    "validator",
    schema,
    preparations
  );

  const code = `
    (() => {function validator(value) {${
      pure ? "" : "\n  validator.explanations = []"
    }\n  if (!value || !Array.isArray(value)) return false\n  for (let i = 0; i < value.length; i++) {\n    const elem = value[i]\n${addTabs(
    forLoopBody,
    2
  )}\n  }\n  return true\n}
        return validator
    })()
  `.trim();

  // tslint:disable-next-line
  const ctx = eval(code);

  for (const prepare of preparations) {
    prepare(ctx);
  }

  ctx.explanations = [];
  ctx.pure = pure;

  return ctx;
}

