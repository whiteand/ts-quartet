import { addTabs } from "./addTabs";
import { compileIfNotValidReturnFalse } from "./compileIfNotValidReturnFalse";
import {
  CompilationResult,
  Prepare,
  Schema,
  TypedCompilationResult
} from "./types";

export function compileArrayOf<T = any>(
  c: (schema: Schema) => CompilationResult,
  schema: Schema
): TypedCompilationResult<T[]> {
  // compileArrayOf([])
  if (Array.isArray(schema) && schema.length === 0) {
    return Object.assign(
      (value: any): value is T[] =>
        value && Array.isArray(value) && value.length === 0,
      { explanations: [], pure: true }
    );
  }
  const preparations: Prepare[] = [];
  const [forLoopBody, pure] = compileIfNotValidReturnFalse(c, 'elem', 'validator', schema, preparations);

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
