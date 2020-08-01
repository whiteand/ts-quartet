import { RawSchema, rawSchemaToSchema } from "../rawSchemaToSchema";
import { vSchemaRenderer } from "../renderers/v";
import { SchemaType } from "../schemas";
import {
  Alloc,
  CompilationResult,
  ICompilationResultProps,
  TSchema,
  Validator
} from "../types";
import { arrToDict, getKeyAccessor, has } from "../utils";

const VALUE_PARAM_NAME = "value";
const CTX_PARAM_NAME = "ctx";
type Ctx = ICompilationResultProps<any> & {
  memory: Record<string, any>;
  pure: EvaluatedFunc;
};
type EvaluatedFunc = (value: any, ctx: Ctx) => boolean;

const SINGLE_EXPRESSION_SCHEMA_TYPE: Partial<
  Record<SchemaType, boolean>
> = arrToDict([
  SchemaType.Any,
  SchemaType.Array,
  SchemaType.Boolean,
  SchemaType.Finite,
  SchemaType.Function,
  SchemaType.Max,
  SchemaType.MaxLength,
  SchemaType.Min,
  SchemaType.MinLength,
  SchemaType.Negative,
  SchemaType.Never,
  SchemaType.Number,
  SchemaType.Positive,
  SchemaType.SafeInteger,
  SchemaType.String,
  SchemaType.Symbol
]);

function getFunctionBodyCode(schema: TSchema, ctx: Ctx) {
  const alloc: Alloc = (initialValue = null, prefix = "t") => {
    if (!has(ctx.memory, prefix)) {
      ctx.memory[prefix] = initialValue;
      return `${CTX_PARAM_NAME}.memory${getKeyAccessor(prefix)}`;
    }
    let i = 2;
    while (true) {
      const key = prefix + i;
      if (!has(ctx.memory, key)) {
        ctx.memory[key] = initialValue;
        return `${CTX_PARAM_NAME}.memory${getKeyAccessor(key)}`;
      }
      i++;
    }
  };
  if (
    !schema ||
    typeof schema !== "object" ||
    SINGLE_EXPRESSION_SCHEMA_TYPE[schema.type] === true
  ) {
    return `
        return ${vSchemaRenderer.getExpr(
          VALUE_PARAM_NAME,
          schema,
          alloc,
          `${CTX_PARAM_NAME}.memory.pathToValueId`,
          `${CTX_PARAM_NAME}.explanations`,
          vCompileSchema
        )}
      `.trim();
  }
  if (
    schema &&
    typeof schema === "object" &&
    schema.type === SchemaType.Variant
  ) {
    return `
${vSchemaRenderer.getIfExprReturnTrue(
  VALUE_PARAM_NAME,
  schema,
  alloc,
  `${CTX_PARAM_NAME}.memory.pathToValueId`,
  `${CTX_PARAM_NAME}.explanations`,
  vCompileSchema
)}
return false
    `.trim();
  }
  return `
${vSchemaRenderer.getIfNotExprReturnFalse(
  VALUE_PARAM_NAME,
  schema,
  alloc,
  `${CTX_PARAM_NAME}.memory.pathToValueId`,
  `${CTX_PARAM_NAME}.explanations`,
  vCompileSchema
)}
return true
`.trim();
}

function vCompileSchema<T = any>(
  schema: TSchema
): CompilationResult<T, any> & Ctx {
  const ctx: Ctx = {
    explanations: [],
    memory: {
      pathToValueId: []
    },
    pure: () => false
  };

  ctx.pure = new Function(
    VALUE_PARAM_NAME,
    CTX_PARAM_NAME,
    getFunctionBodyCode(schema, ctx)
  ) as EvaluatedFunc;

  const validator = function(value: any) {
    return ctx.pure(value, ctx);
  } as Validator<T>;

  return Object.assign(validator, ctx);
}

export function vCompiler<T = any>(
  rawSchema: RawSchema
): CompilationResult<T, any> & Ctx {
  const schema = rawSchemaToSchema(rawSchema);
  return vCompileSchema<T>(schema);
}
