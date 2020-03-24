import { getKeyAccessor } from "./getKeyAccessor";
import { methods } from "./methods";
import { toContext } from "./toContext";
import { CompilationResult, IObjectSchema, Schema } from "./types";

export function compileObjectSchemaWithRest(
  c: (schema: Schema) => CompilationResult,
  s: IObjectSchema
) {
  const { [methods.rest]: restSchema, ...propsSchemas } = s;
  const [restId, prepareRestId] = toContext("checkRest", c(restSchema), true);
  const restIdAccessor = getKeyAccessor(restId);
  const propsWithSchemas = Object.keys(propsSchemas);
  const [definedProps, prepareDefinedProps] = toContext(
    "defined",
    c(propsSchemas),
    true
  );
  const definedAccessor = getKeyAccessor(definedProps);
  // tslint:disable-next-line
  const __propsWithSchemasDict = propsWithSchemas.reduce((dict: any, prop) => {
    dict[prop] = true;
    return dict;
  }, {});
  // tslint:disable-next-line
  const ctx = eval(
    `
      (()=>{
        function validator(value) {\n  validator.explanations = []${
          propsWithSchemas.length > 0
            ? `\n  if (!validator${definedAccessor}(value)) {\n    validator.explanations.push(...validator${definedAccessor}.explanations)\n    return false\n  }`
            : `\n  if (!value) return false`
        }\n  const keys = Object.keys(value)\n  for (let i = 0; i < keys.length; i++) {\n    const key = keys[i]${
      propsWithSchemas.length > 0
        ? `\n    if (validator.__propsWithSchemasDict[key] === true) continue`
        : ``
    }\n    if (!validator${restIdAccessor}(value[key])) {\n      validator.explanations.push(...validator${restIdAccessor}.explanations)\n      return false\n    }\n  }\n  return true\n}
        return validator
      })()
    `
  );
  prepareRestId(ctx);
  prepareDefinedProps(ctx);
  ctx.explanations = [];
  if (propsWithSchemas.length > 0) {
    ctx.__propsWithSchemasDict = __propsWithSchemasDict;
  }
  return ctx;
}
