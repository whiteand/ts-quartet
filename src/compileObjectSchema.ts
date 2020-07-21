import { addTabs } from "./addTabs";
import { compileIfNotValidReturnFalse } from "./compileIfNotValidReturnFalse";
import {
  CompilationResult,
  IObjectSchema,
  Prepare,
  QuartetInstance
} from "./types";

export function compileObjectSchema(
  v: QuartetInstance,
  s: IObjectSchema
): CompilationResult {
  const keys = Object.keys(s);
  if (keys.length === 0) {
    return Object.assign((x: any) => x != null, {
      explanations: [],
      pure: true
    });
  }
  const bodyCodeLines = [];
  const preparations: Prepare[] = [];
  const ctxId = "validator";
  const [bodyCode, isPure] = compileIfNotValidReturnFalse(
    v,
    "value",
    ctxId,
    s,
    preparations,
    null
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
