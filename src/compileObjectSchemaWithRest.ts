import { addTabs } from "./addTabs";
import { compileIfNotValidReturnFalse } from "./compileIfNotValidReturnFalse";
import { CompilationResult, IObjectSchema, Prepare, Schema } from "./types";

export function compileObjectSchemaWithRest(
  c: (schema: Schema) => CompilationResult,
  s: IObjectSchema
): CompilationResult {
  const preparations: Prepare[] = []
  const [funcBodyCode, isPure] = compileIfNotValidReturnFalse(c, 'value', 'validator', s, preparations)
  // tslint:disable-next-line
  const ctx = eval(
    `
      (()=>{
        function validator(value) {${isPure ? '' : '\n  validator.explanations = []'}\n${addTabs(funcBodyCode)}\n  return true\n}
        return validator
      })()
    `
  );
  ctx.explanations = [];
  ctx.pure = isPure;
  // tslint:disable-next-line
  for (let i = 0; i < preparations.length; i++) {
    preparations[i](ctx)
  }
  return ctx;
}
