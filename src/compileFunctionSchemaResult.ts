import { beautify } from "./beautify";
import { IFunctionSchemaResult } from "./types";

export function compileFunctionSchemaResult(s: IFunctionSchemaResult) {
  let code;
  if (s.handleError) {
    const checkCode = s.check("value", "validator");
    const handleCode = s.handleError("value", "validator");
    const clearExplanations =
      checkCode.indexOf("explanations") >= 0 ||
      handleCode.indexOf("explanations") >= 0
        ? "validator.explanations = []"
        : "validator.explanations = []";
    code = beautify(`(() => {
    function validator(value) {
      ${clearExplanations}
      if (${checkCode}) {
        return true
      }
      ${handleCode}
      return false
    }
    return validator
  })()`);
  } else {
    const innerCode = s.check("value", "validator");
    code = beautify(`(() => {
      function validator(value) {
        ${
          innerCode.indexOf("explanations") >= 0
            ? "validator.explanations = []"
            : ""
        }
        return ${innerCode}
      }
      return validator
    })()`);
  }
  // tslint:disable-next-line
  const ctx = eval(code);
  ctx.explanations = [];
  if (s.prepare) {
    s.prepare(ctx);
  }
  return ctx;
}
