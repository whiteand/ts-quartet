import { CompilationResult, IObjectSchema, Schema, Prepare } from "./types";
import { compileIfNotValidReturnFalse } from "./compileIfNotValidReturnFalse";
import { addTabs } from "./addTabs";

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
  for (let i = 0; i < preparations.length; i++) {
    preparations[i](ctx)
  }
  return ctx;
}
