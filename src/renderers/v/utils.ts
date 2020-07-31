import { ISchemaRenderer } from "../../types";

export function getSimpleCondition<S = any>(
  getExpr: (valueId: string) => string,
  getNotExpr: (valueId: string) => string = function(valueId) {
    return `!(${getExpr(valueId)})`;
  },
  getIfNotExprReturnFalse: (valueId: string) => string = function(valueId) {
    return `if (${getNotExpr(valueId)}) return false;`;
  },
  getIfExprReturnTrue: (valueId: string) => string = function(valueId) {
    return `if (${getExpr(valueId)}) return true;`;
  }
): ISchemaRenderer<S> {
  return {
    getExpr,
    getIfExprReturnTrue,
    getIfNotExprReturnFalse,
    getNotExpr
  };
}

export function getDispatchedRenderer<S>(
  getRenderer: (schema: S) => ISchemaRenderer<S>
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

export function fromValueSchemaAlloc<S = any>(
  getExpr: (
    valueId: string,
    schema: S,
    alloc: (initialValue?: any, prefix?: string) => string
  ) => string,
  getNotExpr: (
    valueId: string,
    schema: S,
    alloc: (initialValue?: any, prefix?: string) => string
  ) => string = function(valueId, schema, alloc) {
    return `!(${getExpr(valueId, schema, alloc)})`;
  },
  getIfExprReturnTrue: (
    valueId: string,
    schema: S,
    alloc: (initialValue?: any, prefix?: string) => string
  ) => string = function(valueId, schema, alloc) {
    return `if (${getExpr(valueId, schema, alloc)}) return true;`;
  },
  getIfNotExprReturnFalse: (
    valueId: string,
    schema: S,
    alloc: (initialValue?: any, prefix?: string) => string
  ) => string = function(valueId, schema, alloc) {
    return `if (${getNotExpr(valueId, schema, alloc)}) return false;`;
  }
) {
  return {
    getExpr,
    getIfExprReturnTrue,
    getIfNotExprReturnFalse,
    getNotExpr
  };
}

export function getStrictComparisonWithSchemaRenderer<S>(
  schemaVarPrefix: string
): ISchemaRenderer<S> {
  return fromValueSchemaAlloc(
    (valueId, schema, alloc) => {
      const schemaId = alloc(schema, schemaVarPrefix);
      return `${valueId} === ${schemaId}`;
    },
    (valueId, schema, alloc) => {
      const schemaId = alloc(schema, schemaVarPrefix);
      return `${valueId} !== ${schemaId}`;
    }
  );
}
