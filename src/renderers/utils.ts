import { ISchemaRenderer } from "../types";

export function getDispatchedRenderer<S>(
  getRenderer: (schema: S) => ISchemaRenderer<any>
): ISchemaRenderer<S> {
  return {
    getExpr(valueId, schema, alloc, pathToValueId, explanationsArrId, compile) {
      return getRenderer(schema).getExpr(
        valueId,
        schema,
        alloc,
        pathToValueId,
        explanationsArrId,
        compile
      );
    },
    getNotExpr(
      valueId,
      schema,
      alloc,
      pathToValueId,
      explanationsArrId,
      compile
    ) {
      return getRenderer(schema).getNotExpr(
        valueId,
        schema,
        alloc,
        pathToValueId,
        explanationsArrId,
        compile
      );
    },
    getIfExprReturnTrue(
      valueId,
      schema,
      alloc,
      pathToValueId,
      explanationsArrId,
      compile
    ) {
      return getRenderer(schema).getIfExprReturnTrue(
        valueId,
        schema,
        alloc,
        pathToValueId,
        explanationsArrId,
        compile
      );
    },
    getIfNotExprReturnFalse(
      valueId,
      schema,
      alloc,
      pathToValueId,
      explanationsArrId,
      compile
    ) {
      return getRenderer(schema).getIfNotExprReturnFalse(
        valueId,
        schema,

        alloc,
        pathToValueId,
        explanationsArrId,
        compile
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
