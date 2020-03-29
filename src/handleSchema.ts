import { isAndSchema } from "./andId";
import { has } from "./has";
import { methods } from "./methods";
import { IHandleSchemaHandlers, Schema } from "./types";

export function handleSchema<R>(
  handlers: IHandleSchemaHandlers<R>
): (schema: Schema) => R {
  return schema => {
    if (typeof schema === "function") {
      return handlers.function(schema);
    }
    if (!schema || typeof schema !== "object") {
      return handlers.constant(schema);
    }
    if (Array.isArray(schema)) {
      return isAndSchema(schema)
        ? handlers.and(schema)
        : handlers.variant(schema);
    }
    if (has(schema, methods.rest)) {
      return handlers.objectRest(schema);
    } else {
      if (has(schema, methods.restOmit)) {
        const { [methods.restOmit]: _, ...objectSchema } = schema;
        return handlers.object(objectSchema);
      }
      return handlers.object(schema);
    }
  };
}
