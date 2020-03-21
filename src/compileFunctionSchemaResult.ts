import { beautify } from "./beautify";
import { IFunctionSchemaResult } from "./types";

export function compileFunctionSchemaResult(s: IFunctionSchemaResult) {
  const code = s.handleError
    ? beautify(`(() => {
    function validator(value) {
      validator.explanations = []
      if (${s.check("value", "validator")}) {
        return true
      }
      ${s.handleError("value", "validator")}
      return false
    }
    return validator
  })()`)
    : beautify(`(() => {
    function validator(value) {
      validator.explanations = []
      return ${s.check("value", "validator")}
    }
    return validator
  })()`);
  // tslint:disable-next-line
  const ctx = eval(code);
  ctx.explanations = [];
  if (s.prepare) {
    s.prepare(ctx);
  }
  return ctx;
}
