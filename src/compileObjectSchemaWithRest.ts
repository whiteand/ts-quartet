import { beautify } from "./beautify";
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
    beautify(`
      (()=>{
        function validator(value) {
          validator.explanations = []
          ${
            propsWithSchemas.length > 0
              ? `if (!validator['${definedProps}'](value)) {
            validator.explanations.push(...validator['${definedProps}'].explanations)
            return false
          }`
              : `if (!value) return false`
          }
          const keys = Object.keys(value)
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            ${
              propsWithSchemas.length > 0
                ? `if (validator.__propsWithSchemasDict[key] === true) continue`
                : ``
            }
            if (!validator['${restId}'](value[key])) {
              validator.explanations.push(...validator['${restId}'].explanations)
              return false
            }
          }
          return true
        }
        return validator
      })()
    `)
  );
  prepareRestId(ctx);
  prepareDefinedProps(ctx);
  ctx.explanations = [];
  if (propsWithSchemas.length > 0) {
    ctx.__propsWithSchemasDict = __propsWithSchemasDict;
  }
  return ctx;
}
