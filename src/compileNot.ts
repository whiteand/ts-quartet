import { constantToFunc } from "./constantToFunc";
import { getKeyAccessor } from "./getKeyAccessor";
import { handleSchema } from "./handleSchema";
import {
  FunctionSchema,
  HandleSchemaHandler,
  QuartetInstance,
  Schema
} from "./types";

export function compileNot(v: QuartetInstance, schema: Schema): FunctionSchema {
  const defaultHandler: HandleSchemaHandler<Schema, FunctionSchema> = (
    schemaToBeReverted: Schema
  ): FunctionSchema => {
    const compiled = v.pureCompile(schemaToBeReverted);
    const [notId, prepare] = v.toContext("not", compiled);
    const notAcc = getKeyAccessor(notId);
    return () => ({
      check: (valueId, ctxId) => `!${ctxId}${notAcc}(${valueId})`,
      not: (valueId, ctxId) => `${ctxId}${notAcc}(${valueId})`,
      prepare
    });
  };
  return handleSchema({
    and: defaultHandler,
    constant: constant => compileNot(v, constantToFunc(v, constant)),
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
