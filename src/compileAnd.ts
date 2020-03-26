import { addTabs } from "./addTabs";
import { getKeyAccessor } from "./getKeyAccessor";
import { handleSchema } from "./handleSchema";
import { toContext } from "./toContext";
import { CompilationResult, Prepare, Schema } from "./types";
import { compileIfNotValidReturnFalse } from "./compileIfNotValidReturnFalse";

function compileAndVariantElementToReturnWay(
  c: (schema: Schema) => CompilationResult,
  index: number,
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[],
  primitives: any[]
): [string, boolean] {
  return handleSchema<[string, boolean]>({
    constant: constant => {
      if (primitives.indexOf(constant) < 0) {
        primitives.push(constant);
      }

      return ["", true];
    },
    function: funcSchema => {
      const s = funcSchema();
      if (s.prepare) {
        preparations.push(s.prepare);
      }
      const notCheck = s.not
        ? s.not(valueId, ctxId)
        : `!(${s.check(valueId, ctxId)})`;
      return [
        s.handleError
          ? `if (${notCheck}) {\n${addTabs(
              s.handleError(valueId, ctxId)
            )}\n  return false\n}`
          : `if (${notCheck}) return false`,
        !s.handleError
      ];
    },
    object: objectSchema => {
      const compiled = c(objectSchema);
      const [id, prepare] = toContext(index, compiled, true);
      const idAccessor = getKeyAccessor(id);
      preparations.push(prepare);
      const funcSchema = compiled.pure
        ? () => ({
            check: () => `${ctxId}${idAccessor}(${valueId})`,
            not: () => `!${ctxId}${idAccessor}(${valueId})`
          })
        : () => ({
            check: () => `${ctxId}${idAccessor}(${valueId})`,
            handleError: () =>
              `${ctxId}.explanations.push(...${ctxId}${idAccessor}.explanations)`,
            not: () => `!${ctxId}${idAccessor}(${valueId})`
          });
      return compileAndVariantElementToReturnWay(
        c,
        index,
        valueId,
        ctxId,
        funcSchema,
        preparations,
        primitives
      );
    },
    objectRest: objectSchema => {
      const compiled = c(objectSchema);
      const [id, prepare] = toContext(index, compiled, true);
      const idAccessor = getKeyAccessor(id);
      preparations.push(prepare);
      const funcSchema = compiled.pure
        ? () => ({
            check: () => `${ctxId}${idAccessor}(${valueId})`,
            not: () => `!${ctxId}${idAccessor}(${valueId})`
          })
        : () => ({
            check: () => `${ctxId}${idAccessor}(${valueId})`,
            handleError: () =>
              `${ctxId}.explanations.push(...${ctxId}${idAccessor}.explanations)`,
            not: () => `!${ctxId}${idAccessor}(${valueId})`
          });
      return compileAndVariantElementToReturnWay(
        c,
        index,
        valueId,
        ctxId,
        funcSchema,
        preparations,
        primitives
      );
    },
    variant: schemas => {
      if (schemas.length === 0) {
        return [`return false`, true];
      }
      if (schemas.length === 1) {
        return compileAndVariantElementToReturnWay(
          c,
          index,
          valueId,
          ctxId,
          schemas[0],
          preparations,
          primitives
        );
      }
      const compiled = c(schemas);
      const [id, prepare] = toContext(index, compiled, true);
      preparations.push(prepare);
      const funcSchema = compiled.pure
        ? () => ({
            check: () => `${ctxId}${idAccessor}(${valueId})`,
            not: () => `!${ctxId}${idAccessor}(${valueId})`
          })
        : () => ({
            check: () => `${ctxId}${idAccessor}(${valueId})`,
            handleError: () =>
              `${ctxId}.explanations.push(...${ctxId}${idAccessor}.explanations)`,
            not: () => `!${ctxId}${idAccessor}(${valueId})`
          });
      const idAccessor = getKeyAccessor(id);
      return compileAndVariantElementToReturnWay(
        c,
        index,
        valueId,
        ctxId,
        funcSchema,
        preparations,
        primitives
      );
    }
  })(schema);
}

export function compileAnd(
  c: (schema: Schema) => CompilationResult,
  schemas: Schema[]
): CompilationResult {
  if (schemas.length === 0) {
    return Object.assign(() => true, { explanations: [], pure: true });
  }
  if (schemas.length === 1) {
    return c(schemas[0]);
  }

  const preparations: Prepare[] = [];
  let [bodyCode, isPure] = compileIfNotValidReturnFalse(
    c,
    "value",
    "validator",
    schemas[0],
    preparations
  )
  for (let i = 1; i < schemas.length; i++) {
    const [anotherBodyCode, anotherIsPure] = compileIfNotValidReturnFalse(
      c,
      "value",
      "validator",
      schemas[i],
      preparations
    )
    bodyCode += '\n' + anotherBodyCode
    isPure = isPure && anotherIsPure
  }

  const code = `(() => {\nfunction validator(value) {${
    isPure ? "" : "\n  validator.explanations = []"
  }\n${addTabs(bodyCode)}\n  return true\n}
    return validator
  })()`;

  // tslint:disable-next-line
  const ctx = eval(code);
  for (const prepare of preparations) {
    prepare(ctx);
  }
  ctx.explanations = [];
  ctx.pure = isPure;
  return ctx as any;
}
