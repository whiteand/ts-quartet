import { RawSchema } from "../../rawSchemaToSchema";
import { CompilationResult } from "../../types";

function serializeFunctions(obj: any): any {
  if (!obj) {
    return obj;
  }
  if (typeof obj === "function") {
    return {
      code: obj.toString(),
      ...serializeFunctions({ ...obj })
    };
  }
  if (typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeFunctions);
  }
  return Object.keys(obj).reduce((res, key) => {
    const value = obj[key];
    res[key] = serializeFunctions(value);
    return res;
  }, Object.create(null));
}

export function snapshot(
  compiler: (schema: RawSchema) => CompilationResult<any, any>,
  rawSchema: RawSchema,
  valids: any[] = [],
  invalids: any[] = []
) {
  const validator = compiler(rawSchema);
  expect(serializeFunctions(validator)).toMatchSnapshot();
  expect(Array.isArray(validator.explanations)).toBeTruthy();
  for (let i = 0; i < valids.length; i++) {
    const valid = valids[i];
    expect(validator(valid) ? valid : [valid]).toBe(valid);
  }
  for (let i = 0; i < invalids.length; i++) {
    const invalid = invalids[i];
    expect(validator(invalid) ? [invalid] : invalid).toBe(invalid);
  }
  return validator;
}
