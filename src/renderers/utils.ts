import { ISchemaRenderer } from "../types";

export function getDispatchedRenderer<S>(
  getRenderer: (schema: S) => ISchemaRenderer<any>
): ISchemaRenderer<S> {
  return {
    getExpr(valueId, schema, alloc, pathToValueId, explanationsArrId) {
      return getRenderer(schema).getExpr(
        valueId,
        schema,
        alloc,
        pathToValueId,
        explanationsArrId
      );
    },
    getNotExpr(valueId, schema, alloc, pathToValueId, explanationsArrId) {
      return getRenderer(schema).getNotExpr(
        valueId,
        schema,
        alloc,
        pathToValueId,
        explanationsArrId
      );
    },
    getIfExprReturnTrue(
      valueId,
      schema,
      alloc,
      pathToValueId,
      explanationsArrId
    ) {
      return getRenderer(schema).getIfExprReturnTrue(
        valueId,
        schema,
        alloc,
        pathToValueId,
        explanationsArrId
      );
    },
    getIfNotExprReturnFalse(
      valueId,
      schema,
      alloc,
      pathToValueId,
      explanationsArrId
    ) {
      return getRenderer(schema).getIfNotExprReturnFalse(
        valueId,
        schema,

        alloc,
        pathToValueId,
        explanationsArrId
      );
    }
  };
}

export function getNotImplementedRenderer(error: {
  message: string;
}): ISchemaRenderer<any> {
  const throwError = () => {
    throw error;
  };
  return {
    getExpr: throwError,
    getIfExprReturnTrue: throwError,
    getIfNotExprReturnFalse: throwError,
    getNotExpr: throwError
  };
}
