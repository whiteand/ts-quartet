import { addTabs } from "./addTabs";
import { compileIfNotValidReturnFalse } from "./compileIfNotValidReturnFalse";
import { CompilationResult, IObjectSchema, Prepare, Schema } from "./types";

export function compileObjectSchema(
  c: (schema: Schema) => CompilationResult,
  s: IObjectSchema
): CompilationResult {
  const keys = Object.keys(s);
  if (keys.length === 0) {
    return Object.assign((v: any) => v != null, {
      explanations: [],
      pure: true
    });
  }
  const bodyCodeLines = [];
  const preparations: Prepare[] = [];
  const ctxId = "validator";
  const [bodyCode, isPure] = compileIfNotValidReturnFalse(
    c,
    "value",
    ctxId,
    s,
    preparations
  );
  if (!isPure) {
    bodyCodeLines.push("validator.explanations = []");
  }
  bodyCodeLines.push(bodyCode);
  const code = `
    (() => {\nfunction validator(value) {\n${addTabs(
      bodyCodeLines.join("\n")
    )}\n  return true\n}
      return validator
    })()
  `.trim();

  // tslint:disable-next-line
  const ctx = eval(code);

  for (const prepare of preparations) {
    prepare(ctx);
  }

  ctx.explanations = [];
  ctx.pure = isPure;

  return ctx;
}
