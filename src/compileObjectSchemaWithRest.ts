import { methods } from "./methods";
import { toContext } from "./toContext";
import { CompilationResult, IObjectSchema, Schema } from "./types";

export function compileObjectSchemaWithRest(
  c: (schema: Schema) => CompilationResult,
  s: IObjectSchema
) {
  const { [methods.rest]: restSchema, ...propsSchemas } = s;
  const [restId, prepareRestId] = toContext("rest-validator", c(restSchema));
  const propsWithSchemas = Object.keys(propsSchemas);
  const [definedProps, prepareDefinedProps] = toContext(
    "defined",
    c(propsSchemas)
  );
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
            ? `\n  if (!validator['${definedProps}'](value)) {\n    validator.explanations.push(...validator['${definedProps}'].explanations)\n    return false\n  }`
            : `\n  if (!value) return false`
        }\n  const keys = Object.keys(value)\n  for (let i = 0; i < keys.length; i++) {\n    const key = keys[i]${
      propsWithSchemas.length > 0
        ? `\n    if (validator.__propsWithSchemasDict[key] === true) continue`
        : ``
    }\n    if (!validator['${restId}'](value[key])) {\n      validator.explanations.push(...validator['${restId}'].explanations)\n      return false\n    }\n  }\n  return true\n}
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
