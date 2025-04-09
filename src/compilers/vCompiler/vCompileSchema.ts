import { Z } from "../../types";
import { CompilationResult, TSchema, Validator } from "../../types";
import { getValidatorFromSchema } from "./getValidatorFromSchema";
import { implStandard } from "../implStandard";

export function vCompileSchema<T = Z>(
  schema: TSchema,
): CompilationResult<T, Z> {
  const explanations: Z[] = [];
  const validator = getValidatorFromSchema(schema, undefined) as Validator<T>;
  const res = Object.assign(validator, {
    explanations,
    schema,
    cast() {
      return this as Z;
    },
  }) as Z;
  res["~standard"] = implStandard(res, () => [
    {
      message: "invalid value",
      path: [],
    },
  ]);
  return res;
}
