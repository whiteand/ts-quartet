import { addTabs } from "./addTabs";
import { IFunctionSchemaResult, CompilationResult } from "./types";

export function compileFunctionSchemaResult(
  s: IFunctionSchemaResult
): CompilationResult {
  let code;
  if (s.handleError) {
    const checkCode = s.check("value", "validator");
    const handleCode = s.handleError("value", "validator");
    const clearExplanations =
      checkCode.indexOf("explanations") >= 0 ||
      handleCode.indexOf("explanations") >= 0
        ? "\n  validator.explanations = []"
        : "";
    code = `(() => {function validator(value) {${clearExplanations}\n  if (${checkCode}) {\n    return true\n  }\n${addTabs(
      handleCode
    )}\n  return false\n}
    return validator
  })()`;
  } else {
    const innerCode = s.check("value", "validator");
    code = `(() => {function validator(value) {${
      innerCode.indexOf("explanations") >= 0
        ? "\n  validator.explanations = []"
        : ""
    }\n  return ${innerCode}\n}
      return validator
    })()`;
  }
  // tslint:disable-next-line
  const ctx = eval(code);
  ctx.explanations = [];
  ctx.pure = !s.handleError;
  if (s.prepare) {
    s.prepare(ctx);
  }
  return ctx;
}
