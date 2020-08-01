import { TPrimitiveSchema } from "../../types";
import { getDispatchedRenderer, getNotImplementedRenderer } from "../utils";
import { booleanConstantRenderer } from "./booleanConstant";
import { nullConstantRenderer } from "./nullConstant";
import { numberConstantRenderer } from "./numberConstant";
import { stringConstantRenderer } from "./stringConstant";
import { symbolConstantRenderer } from "./symbolConstant";
import { undefinedConstantRenderer } from "./undefinedConstant";

type PrimitiveWithoutNullOrUndefinedTypes =
  | "boolean"
  | "symbol"
  | "string"
  | "number"
  | "bigint";

const RENDERER_FOR_TYPE = {
  bigint: getNotImplementedRenderer(
    new TypeError(
      'bigint is not supported by quartet. Use v.custom(value => typeof value === "bigint")'
    )
  ),
  boolean: booleanConstantRenderer,
  number: numberConstantRenderer,
  string: stringConstantRenderer,
  symbol: symbolConstantRenderer
};

export const primitiveConstantRenderer = getDispatchedRenderer<
  TPrimitiveSchema
>(schema => {
  if (schema === null) {
    return nullConstantRenderer;
  }
  if (schema === undefined) {
    return undefinedConstantRenderer;
  }
  const type = typeof schema as PrimitiveWithoutNullOrUndefinedTypes;
  return RENDERER_FOR_TYPE[type];
});
