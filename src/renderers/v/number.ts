import { getSimpleCondition } from "./utils";

const nanRenderer: SchemaRenderer<number> = getSimpleCondition(
  (valueId) => `Number.isNaN(${valueId})`,
  (valueId) => `!Number.isNaN(${valueId})`
);

export const numberRenderer: SchemaRenderer<number> = {
  getExpr: (schema, valueId, ctxId, mapCtx) => {},
  getNotExpr: (schema, valueId, ctxId, mapCtx) => {},
  getIfExprReturnTrue: (schema, valueId, ctxId, mapCtx) => {},
  getIfNotExprReturnFalse: (schema, valueId, ctxId, mapCtx) => {},
};
