import { getKeyAccessor } from "./getKeyAccessor";
import { methods } from "./methods";
import { toContext } from "./toContext";
import { CompilationResult, IObjectSchema, Schema } from "./types";

export function compileObjectSchemaWithRest(
  c: (schema: Schema) => CompilationResult,
  s: IObjectSchema
): CompilationResult {
  const {
    [methods.rest]: restSchema,
    [methods.restOmit]: omitKeys,
    ...propsSchemas
  } = s;
  const restCompiled = c(restSchema);
  const [restId, prepareRestId] = toContext("checkRest", restCompiled, true);
  const restIdAccessor = getKeyAccessor(restId);
  const propsWithSchemas = Object.keys(propsSchemas);
  const definedCompiled = c(propsSchemas);
  const [definedProps, prepareDefinedProps] = toContext(
    "defined",
    definedCompiled,
    true
  );
  const definedAccessor = getKeyAccessor(definedProps);
  const keysToBeOmitted = [...(omitKeys || []), ...propsWithSchemas];
  // tslint:disable-next-line
  const __keysToBeOmitted = keysToBeOmitted.reduce((dict: any, prop) => {
    dict[prop] = true;
    return dict;
  }, {});
  const checkObjectAndDefined =
    propsWithSchemas.length > 0
      ? definedCompiled.pure
        ? `if (!validator${definedAccessor}(value)) return false`
        : `if (!validator${definedAccessor}(value)) {\n    validator.explanations.push(...validator${definedAccessor}.explanations)\n    return false\n  }`
      : `if (value == null) return false`;
  const checkRestValues = restCompiled.pure
    ? `if (!validator${restIdAccessor}(value[key])) return false`
    : `if (!validator${restIdAccessor}(value[key])) {\n      validator.explanations.push(...validator${restIdAccessor}.explanations)\n      return false\n    }`;
  const isPure = definedCompiled.pure && restCompiled.pure;
  const clearExplanations = isPure ? "" : "\n  validator.explanations = []";
  console.log(JSON.stringify(s))
  
  // tslint:disable-next-line
  const ctx = eval(
    `
      (()=>{
        function validator(value) {${clearExplanations}\n  ${checkObjectAndDefined}\n  const keys = Object.keys(value)\n  for (let i = 0; i < keys.length; i++) {\n    const key = keys[i]${
          keysToBeOmitted.length > 0
        ? `\n    if (validator.__keysToBeOmitted[key] === true) continue`
        : ``
    }\n    ${checkRestValues}\n  }\n  return true\n}
        return validator
      })()
    `
  );
  prepareRestId(ctx);
  prepareDefinedProps(ctx);
  ctx.explanations = [];
  ctx.pure = isPure;
  if (keysToBeOmitted.length > 0) {
    ctx.__keysToBeOmitted = __keysToBeOmitted;
  }
  return ctx;
}
