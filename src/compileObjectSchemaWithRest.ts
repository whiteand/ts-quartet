import { getKeyAccessor } from "./getKeyAccessor";
import { methods } from "./methods";
import { toContext } from "./toContext";
import { CompilationResult, IObjectSchema, Schema } from "./types";

export function compileObjectSchemaWithRest(
  c: (schema: Schema) => CompilationResult,
  s: IObjectSchema
): CompilationResult {
  const { [methods.rest]: restSchema, ...propsSchemas } = s;
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
  // tslint:disable-next-line
  const __propsWithSchemasDict = propsWithSchemas.reduce((dict: any, prop) => {
    dict[prop] = true;
    return dict;
  }, {});
  const checkObjectAndDefined =
    propsWithSchemas.length > 0
      ? definedCompiled.pure
        ? `\n  if (!validator${definedAccessor}(value)) return false`
        : `\n  if (!validator${definedAccessor}(value)) {\n    validator.explanations.push(...validator${definedAccessor}.explanations)\n    return false\n  }`
      : `\n  if (!value) return false`;
  const checkRestValues = restCompiled.pure
    ? `if (!validator${restIdAccessor}(value[key])) return false`
    : `if (!validator${restIdAccessor}(value[key])) {\n      validator.explanations.push(...validator${restIdAccessor}.explanations)\n      return false`;
  // tslint:disable-next-line
  const ctx = eval(
    `
      (()=>{
        function validator(value) {\n  validator.explanations = []${checkObjectAndDefined}\n  const keys = Object.keys(value)\n  for (let i = 0; i < keys.length; i++) {\n    const key = keys[i]${
      propsWithSchemas.length > 0
        ? `\n    if (validator.__propsWithSchemasDict[key] === true) continue`
        : ``
    }\n    ${checkRestValues}\n    }\n  }\n  return true\n}
        return validator
      })()
    `
  );
  prepareRestId(ctx);
  prepareDefinedProps(ctx);
  ctx.explanations = [];
  ctx.pure = restCompiled.pure && definedCompiled.pure;
  if (propsWithSchemas.length > 0) {
    ctx.__propsWithSchemasDict = __propsWithSchemasDict;
  }
  return ctx;
}
