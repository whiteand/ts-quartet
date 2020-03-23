import { addTabs } from "./addTabs";
import { handleSchema } from "./handleSchema";
import { toContext } from "./toContext";
import { CompilationResult, Prepare, Schema } from "./types";
import { getKeyAccessor } from "./getKeyAccessor";

function compileAndVariantElementToReturnWay(
  c: (schema: Schema) => CompilationResult,
  index: number,
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[],
  primitives: any[]
): string {
  return handleSchema({
    constant: constant => {
      if (primitives.indexOf(constant) < 0) {
        primitives.push(constant);
      }

      return "";
    },
    function: funcSchema => {
      const s = funcSchema();
      if (s.prepare) {
        preparations.push(s.prepare);
      }
      const notCheck = s.not
        ? s.not(valueId, ctxId)
        : `!(${s.check(valueId, ctxId)})`;
      return s.handleError
        ? `if (${notCheck}) {\n${addTabs(
            s.handleError(valueId, ctxId)
          )}\n  return false\n}`
        : `if (${notCheck}) return false`;
    },
    object: objectSchema => {
      const compiled = c(objectSchema);
      const [id, prepare] = toContext(index, compiled, true);
      const idAccessor = getKeyAccessor(id);
      preparations.push(prepare);
      return compileAndVariantElementToReturnWay(
        c,
        index,
        valueId,
        ctxId,
        () => ({
          check: () => `${ctxId}${idAccessor}(${valueId})`,
          handleError: () =>
            `${ctxId}.explanations.push(...${ctxId}${idAccessor}.explanations)`,
          not: () => `!${ctxId}${idAccessor}(${valueId})`
        }),
        preparations,
        primitives
      );
    },
    objectRest: objectSchema => {
      const compiled = c(objectSchema);
      const [id, prepare] = toContext(index, compiled, true);
      const idAccessor = getKeyAccessor(id);
      preparations.push(prepare);
      return compileAndVariantElementToReturnWay(
        c,
        index,
        valueId,
        ctxId,
        () => ({
          check: () => `${ctxId}${idAccessor}(${valueId})`,
          handleError: () =>
            `${ctxId}.explanations.push(...${ctxId}${idAccessor}.explanations)`,
          not: () => `!${ctxId}${idAccessor}(${valueId})`
        }),
        preparations,
        primitives
      );
    },
    variant: schemas => {
      if (schemas.length === 0) {
        return `return false`;
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
      const idAccessor = getKeyAccessor(id);
      return compileAndVariantElementToReturnWay(
        c,
        index,
        valueId,
        ctxId,
        () => ({
          check: () => `${ctxId}${idAccessor}(${valueId})`,
          handleError: () =>
            `${ctxId}.explanations.push(...${ctxId}${idAccessor}.explanations)`,
          not: () => `!${ctxId}${idAccessor}(${valueId})`
        }),
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
    return Object.assign(() => true, { explanations: [] });
  }
  if (schemas.length === 1) {
    return c(schemas[0]);
  }

  const preparations: Prepare[] = [];
  const bodyCodeLines = [];
  const primitives: any[] = [];
  for (let i = 0; i < schemas.length; i++) {
    const schema = schemas[i];
    const codeLine = compileAndVariantElementToReturnWay(
      c,
      i,
      `value`,
      `validator`,
      schema,
      preparations,
      primitives
    );
    if (codeLine) {
      bodyCodeLines.push(codeLine);
    }
    if (primitives.length > 1) {
      return Object.assign(() => false, { explanations: [] });
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
    bodyCode.indexOf("explanations") >= 0
      ? "\n  validator.explanations = []"
      : ""
  }\n${bodyCode}\n  return true\n}
    return validator
  })()`;

  // tslint:disable-next-line
  const ctx = eval(code);
  for (const prepare of preparations) {
    prepare(ctx);
  }
  ctx.explanations = [];
  return ctx as any;
}
