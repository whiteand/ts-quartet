import { addTabs } from "./addTabs";
import { compileIfNotValidReturnFalse } from "./compileIfNotValidReturnFalse";
import { CompilationResult, Prepare, QuartetInstance, Schema } from "./types";

export function compileAnd(
  v: QuartetInstance,
  schemas: Schema[]
): CompilationResult {
  if (schemas.length === 0) {
    return Object.assign(() => true, { explanations: [], pure: true });
  }
  if (schemas.length === 1) {
    return v.pureCompile(schemas[0]);
  }

  const preparations: Prepare[] = [];
  let [bodyCode, isPure] = compileIfNotValidReturnFalse(
    v,
    "value",
    "validator",
    schemas[0],
    preparations,
    null
  );
  for (let i = 1; i < schemas.length; i++) {
    const [anotherBodyCode, anotherIsPure] = compileIfNotValidReturnFalse(
      v,
      "value",
      "validator",
      schemas[i],
      preparations,
      null
    );
    bodyCode += "\n" + anotherBodyCode;
    isPure = isPure && anotherIsPure;
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
