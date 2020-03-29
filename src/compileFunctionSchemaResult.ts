import { addTabs } from "./addTabs";
import { CompilationResult, IFunctionSchemaResult, QuartetInstance } from "./types";

export function compileFunctionSchemaResult(
  v: QuartetInstance,
  s: IFunctionSchemaResult
): CompilationResult {
  let code;
  let isPure = true;
  if (s.handleError) {
    isPure = false;
    const checkCode = s.check("value", "validator");
    const handleCode = s.handleError("value", "validator");
    code = `(() => {function validator(value) {\n  validator.explanations = []\n  if (${checkCode}) {\n    return true\n  }\n${addTabs(
      handleCode
    )}\n  return false\n}
    return validator
  })()`;
  } else {
    const innerCode = s.check("value", "validator");
    code = `(() => {function validator(value) {\n  return ${innerCode}\n}
      return validator
    })()`;
  }
  // tslint:disable-next-line
  const ctx = eval(code);
  ctx.explanations = [];
  ctx.pure = isPure;
  if (s.prepare) {
    s.prepare(ctx);
  }
  return ctx;
}
