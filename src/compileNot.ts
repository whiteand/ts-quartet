import { handleSchema } from "./handleSchema";
import { toContext } from "./toContext";
import {
  CompilationResult,
  FunctionSchema,
  HandleSchemaHandler,
  Schema
} from "./types";
import { constantToFunc } from "./constantToFunc";

export function compileNot(
  c: (schema: Schema) => CompilationResult,
  schema: Schema
): FunctionSchema {
  const defaultHandler: HandleSchemaHandler<Schema, FunctionSchema> = (
    schemaToBeReverted: Schema
  ): FunctionSchema => {
    const compiled = c(schemaToBeReverted);
    const [notId, prepare] = toContext("not", compiled);
    return () => ({
      check: (valueId, ctxId) => `!${ctxId}['${notId}'](${valueId})`,
      not: (valueId, ctxId) => `${ctxId}['${notId}'](${valueId})`,
      prepare
    });
  };
  return handleSchema({
    constant: constant => compileNot(c, constantToFunc(constant)),
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
