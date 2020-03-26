import { addTabs } from "./addTabs";
import { CompilationResult, Prepare, Schema } from "./types";
import { compileIfNotValidReturnFalse } from "./compileIfNotValidReturnFalse";

export function compileAnd(
  c: (schema: Schema) => CompilationResult,
  schemas: Schema[]
): CompilationResult {
  if (schemas.length === 0) {
    return Object.assign(() => true, { explanations: [], pure: true });
  }
  if (schemas.length === 1) {
    return c(schemas[0]);
  }

  const preparations: Prepare[] = [];
  let [bodyCode, isPure] = compileIfNotValidReturnFalse(
    c,
    "value",
    "validator",
    schemas[0],
    preparations
  )
  for (let i = 1; i < schemas.length; i++) {
    const [anotherBodyCode, anotherIsPure] = compileIfNotValidReturnFalse(
      c,
      "value",
      "validator",
      schemas[i],
      preparations
    )
    bodyCode += '\n' + anotherBodyCode
    isPure = isPure && anotherIsPure
  }

  const code = `(() => {\nfunction validator(value) {${
    isPure ? "" : "\n  validator.explanations = []"
  }\n${addTabs(bodyCode)}\n  return true\n}
    return validator
  })()`;

  // tslint:disable-next-line
  const ctx = eval(code);
  for (const prepare of preparations) {
    prepare(ctx);
  }
  ctx.explanations = [];
  ctx.pure = isPure;
  return ctx as any;
}
