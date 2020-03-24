import { addTabs } from "./addTabs";
import { getKeyAccessor } from "./getKeyAccessor";
import { handleSchema } from "./handleSchema";
import { toContext } from "./toContext";
import { CompilationResult, Prepare, Schema } from "./types";

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
  const bodyCodeLines = [];
  const primitives: any[] = [];
  let isPure = true;
  for (let i = 0; i < schemas.length; i++) {
    const schema = schemas[i];
    const [codeLine, pureLine] = compileAndVariantElementToReturnWay(
      c,
      i,
      `value`,
      `validator`,
      schema,
      preparations,
      primitives
    );
    if (!pureLine) {
      isPure = false;
    }
    if (codeLine) {
      bodyCodeLines.push(codeLine);
    }
    if (primitives.length > 1) {
      return Object.assign(() => false, { explanations: [], pure: true });
    }
  }
  if (primitives.length === 1) {
    return c(primitives[0]);
  }
  let bodyCode = "";
  if (bodyCodeLines.length > 0) {
    bodyCode = addTabs(bodyCodeLines[0].trim());
    for (let i = 1; i < bodyCodeLines.length; i++) {
      bodyCode += "\n" + addTabs(bodyCodeLines[i]);
    }
  }
  const code = `(() => {\nfunction validator(value) {${
    isPure ? "" : "\n  validator.explanations = []"
  }\n${bodyCode}\n  return true\n}
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
