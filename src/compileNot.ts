import { handleSchema } from "./handleSchema";
import { toContext } from "./toContext";
import {
  Schema,
  CompilationResult,
  HandleSchemaHandler,
  FunctionSchema
} from "./types";

export function compileNot(
  c: (schema: Schema) => CompilationResult,
  schema: Schema
) {
  const defaultHandler: HandleSchemaHandler<Schema, FunctionSchema> = (
    schema: Schema
  ) => {
    const compiled = c(schema);
    const [notId, prepare] = toContext("not", compiled);
    return () => ({
      check: (valueId, ctxId) => `!${ctxId}['${notId}'](${valueId})`,
      not: (valueId, ctxId) => `${ctxId}['${notId}'](${valueId})`,
      prepare
    });
  };
  return handleSchema({
    constant: defaultHandler,
    function: defaultHandler,
    object: defaultHandler,
    objectRest: defaultHandler,
    variant: defaultHandler
  })(schema);
}
