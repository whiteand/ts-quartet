import { handleSchema } from "./handleSchema";
import { toContext } from "./toContext";
import {
  CompilationResult,
  FunctionSchema,
  HandleSchemaHandler,
  Schema
} from "./types";

export function compileNot(
  c: (schema: Schema) => CompilationResult,
  schema: Schema
) {
  const defaultHandler: HandleSchemaHandler<Schema, FunctionSchema> = (
    schemaToBeReverted: Schema
  ) => {
    const compiled = c(schemaToBeReverted);
    const [notId, prepare] = toContext("not", compiled);
    return () => ({
      check: (valueId, ctxId) => `!${ctxId}['${notId}'](${valueId})`,
      not: (valueId, ctxId) => `${ctxId}['${notId}'](${valueId})`,
      prepare
    });
  };
  return handleSchema({
    constant: constant => {
      switch (typeof constant) {
        case "undefined":
          return () => ({
            check: id => `${id} !== undefined`,
            not: id => `${id} === undefined`
          });
        case "object":
          return () => ({
            check: id => `${id} !== null`,
            not: id => `${id} === null`
          });
        case "number":
          return Number.isNaN(constant)
            ? () => ({
                check: id => `!Number.isNaN(${id})`,
                not: id => `Number.isNaN(${id})`
              })
            : () => ({
                check: id => `${id} !== ${JSON.stringify(constant)}`,
                not: id => `${id} === ${JSON.stringify(constant)}`
              });
        case "symbol":
          const [symbolId, prepare] = toContext("not-symbol", constant);
          return () => ({
            check: (id, ctx) => `${id} !== ${ctx}['${symbolId}']`,
            not: (id, ctx) => `${id} === ${ctx}['${symbolId}']`,
            prepare
          });
        default:
          return () => ({
            check: id => `${id} !== ${JSON.stringify(constant)}`,
            not: id => `${id} === ${JSON.stringify(constant)}`
          });
      }
    },
    function: funcSchema => {
      const s = funcSchema();
      if (s.not) {
        return () => ({
          check: s.not as any,
          not: s.check,
          prepare: s.prepare
        });
      }
      return () => ({
        check: (id, ctx) => `!(${s.check(id, ctx)})`,
        not: s.check,
        prepare: s.prepare
      });
    },
    object: defaultHandler,
    objectRest: defaultHandler,
    variant: defaultHandler
  })(schema);
}