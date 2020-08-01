import { SchemaType } from "../../schemas";
import { ISchemaRenderer, TSchema } from "../../types";
import { getDispatchedRenderer, getNotImplementedRenderer } from "../utils";
import { anyRenderer } from "./anyRenderer";
import { arrayRenderer } from "./array";
import { booleanRenderer } from "./boolean";
import { finiteRenderer } from "./finite";
import { functionRenderer } from "./function";
import { negativeRenderer } from "./negative";
import { neverRenderer } from "./neverRenderer";
import { numberRenderer } from "./number";
import { positiveRenderer } from "./positive";
import { primitiveConstantRenderer } from "./primitiveConstant";
import { safeIntegerRenderer } from "./safeInteger";
import { stringRenderer } from "./string";
import { symbolRenderer } from "./symbol";

const SCHEMA_RENDERERS_BY_SCHEMA_TYPE: Record<
  SchemaType,
  ISchemaRenderer<any>
> = {
  [SchemaType.And]: getNotImplementedRenderer(
    new Error("And schema type is not implemented yet ")
  ),
  [SchemaType.Any]: anyRenderer,
  [SchemaType.Array]: arrayRenderer,
  [SchemaType.ArrayOf]: getNotImplementedRenderer(
    new Error("ArrayOf schema type is not implemented yet ")
  ),
  [SchemaType.Boolean]: booleanRenderer,
  [SchemaType.Finite]: finiteRenderer,
  [SchemaType.Function]: functionRenderer,
  [SchemaType.Max]: getNotImplementedRenderer(
    new Error("Max schema type is not implemented yet ")
  ),
  [SchemaType.MaxLength]: getNotImplementedRenderer(
    new Error("MaxLength schema type is not implemented yet ")
  ),
  [SchemaType.Min]: getNotImplementedRenderer(
    new Error("Min schema type is not implemented yet ")
  ),
  [SchemaType.MinLength]: getNotImplementedRenderer(
    new Error("MinLength schema type is not implemented yet ")
  ),
  [SchemaType.Negative]: negativeRenderer,
  [SchemaType.Never]: neverRenderer,
  [SchemaType.Not]: getNotImplementedRenderer(
    new Error("Not schema type is not implemented yet ")
  ),
  [SchemaType.Number]: numberRenderer,
  [SchemaType.Object]: getNotImplementedRenderer(
    new Error("Object schema type is not implemented yet ")
  ),
  [SchemaType.Pair]: getNotImplementedRenderer(
    new Error("Pair schema type is not implemented yet ")
  ),
  [SchemaType.Positive]: positiveRenderer,
  [SchemaType.SafeInteger]: safeIntegerRenderer,
  [SchemaType.String]: stringRenderer,
  [SchemaType.Symbol]: symbolRenderer,
  [SchemaType.Test]: getNotImplementedRenderer(
    new Error("Test schema type is not implemented yet ")
  ),
  [SchemaType.Variant]: getNotImplementedRenderer(
    new Error("Variant schema type is not implemented yet ")
  ),
  [SchemaType.Custom]: getNotImplementedRenderer(
    new Error("Custom schema type is not implemented yet ")
  )
};

export const vSchemaRenderer: ISchemaRenderer<TSchema> = getDispatchedRenderer(
  (schema: TSchema) => {
    if (typeof schema !== "object" || schema === null) {
      return primitiveConstantRenderer;
    }

    return (
      SCHEMA_RENDERERS_BY_SCHEMA_TYPE[schema.type] ||
      getNotImplementedRenderer(
        new Error(`Schema is not handled yet: ${JSON.stringify(schema)}`)
      )
    );
  }
);
