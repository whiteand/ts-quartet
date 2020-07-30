export function getSimpleCondition<S = any>(
  getExpr: (valueId: string) => string,
  getNotExpr: (valueId: string) => string = (valueId) =>
    `!(${getExpr(valueId)})`,
  getIfExprReturnTrue: (valueId: string) => string = function(valueId) {
    return `if (${getExpr(valueId)}) return true;`;
  },
  getIfNotExprReturnFalse: (valueId: string) => string = function(valueId) {
    return `if (${getNotExpr(valueId)}) return false;`;
  }
): SchemaRenderer<S> {
  return {
    getExpr: getExpr,
    getNotExpr: getNotExpr,
    getIfExprReturnTrue: getIfExprReturnTrue,
    getIfNotExprReturnFalse: getIfNotExprReturnFalse,
  };
}

export function getDispatchedRenderer<S>(
  getRenderer: (schema: S) => SchemaRenderer<S>
): SchemaRenderer<S> {
  return {
    getExpr(valueId, schema, ctxId, alloc, pathToValueId, explanationsArrId) {
      return getRenderer(schema).getExpr(
        valueId,
        schema,
        ctxId,
        alloc,
        pathToValueId,
        explanationsArrId
      );
    },
    getNotExpr(
      valueId,
      schema,
      ctxId,
      alloc,
      pathToValueId,
      explanationsArrId
    ) {
      return getRenderer(schema).getNotExpr(
        valueId,
        schema,
        ctxId,
        alloc,
        pathToValueId,
        explanationsArrId
      );
    },
    getIfExprReturnTrue(
      valueId,
      schema,
      ctxId,
      alloc,
      pathToValueId,
      explanationsArrId
    ) {
      return getRenderer(schema).getIfExprReturnTrue(
        valueId,
        schema,
        ctxId,
        alloc,
        pathToValueId,
        explanationsArrId
      );
    },
    getIfNotExprReturnFalse(
      valueId,
      schema,
      ctxId,
      alloc,
      pathToValueId,
      explanationsArrId
    ) {
      return getRenderer(schema).getIfNotExprReturnFalse(
        valueId,
        schema,
        ctxId,
        alloc,
        pathToValueId,
        explanationsArrId
      );
    },
  };
}
