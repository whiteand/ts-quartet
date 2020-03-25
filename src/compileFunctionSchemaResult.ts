import { addTabs } from "./addTabs";
import { CompilationResult, IFunctionSchemaResult } from "./types";

export function compileFunctionSchemaResult(
  s: IFunctionSchemaResult
): CompilationResult {
  let code;
  let isPure = true;
  if (s.handleError) {
    isPure = false;
    const checkCode = s.check("value", "validator");
    const handleCode = s.handleError("value", "validator");
    const clearExplanations = isPure ? "" : "\n  validator.explanations = []";
    code = `(() => {function validator(value) {${clearExplanations}\n  if (${checkCode}) {\n    return true\n  }\n${addTabs(
      handleCode
    )}\n  return false\n}
    return validator
  })()`;
  } else {
    const innerCode = s.check("value", "validator");
    if (innerCode.indexOf("explanations") >= 0) {
      isPure = false;
    }
    code = `(() => {function validator(value) {${
      isPure ? "" : "\n  validator.explanations = []"
    }\n  return ${innerCode}\n}
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
