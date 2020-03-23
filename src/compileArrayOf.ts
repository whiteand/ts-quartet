import { addTabs } from "./beautify";
import { handleSchema } from "./handleSchema";
import { toContext } from "./toContext";
import {
  CompilationResult,
  Prepare,
  Schema,
  TypedCompilationResult
} from "./types";

function compileForLoopBody(
  c: (schema: Schema) => CompilationResult,
  schema: Schema,
  preparations: Prepare[]
): string {
  return handleSchema({
    constant: constant => {
      if (constant === null) {
        return `if (elem !== null) return false`;
      }
      if (constant === undefined) {
        return `if (elem !== undefined) return false`;
      }
      if (typeof constant === "number") {
        if (Number.isNaN(constant)) {
          return `if (!Number.isNaN(elem)) return false`;
        }
        return `if (elem !== ${constant}) return false`;
      }
      if (constant === "true" || constant === "false") {
        return `if (elem !== '${constant}') return false`;
      }
      if (typeof constant === "symbol") {
        const [symbolId, prepare] = toContext("symbol-element", constant);
        preparations.push(prepare);
        return `if (elem !== validator['${symbolId}']) return false`;
      }
      return `if (elem !== ${JSON.stringify(constant)}) return false`;
    },
    function: funcSchema => {
      const s = funcSchema();
      if (s.prepare) {
        preparations.push(s.prepare);
      }
      const notCheck = s.not
        ? s.not("elem", "validator")
        : `!(${s.check("elem", "validator")})`;
      return s.handleError
        ? `if (${notCheck}) {\n${addTabs(
            s.handleError("elem", "validator")
          )}\n  return false\n}`
        : `if (${notCheck}) return false`;
    },
    object: objectSchema => {
      const compiled = c(objectSchema);
      const [id, prepare] = toContext("object-elem", compiled);
      preparations.push(prepare);
      return compileForLoopBody(
        c,
        () => ({
          check: () => `validator['${id}'](elem)`,
          handleError: () =>
            `validator.explanations.push(...validator['${id}'].explanations)`,
          not: () => `!validator['${id}'](elem)`
        }),
        preparations
      );
    },
    objectRest: objectSchema => {
      const compiled = c(objectSchema);
      const [id, prepare] = toContext("object-elem", compiled);
      preparations.push(prepare);
      return compileForLoopBody(
        c,
        () => ({
          check: () => `validator['${id}'](elem)`,
          handleError: () =>
            `validator.explanations.push(...validator['${id}'].explanations)`,
          not: () => `!validator['${id}'](elem)`
        }),
        preparations
      );
    },
    variant: schemas => {
      if (schemas.length === 0) {
        return `return false`;
      }
      if (schemas.length === 1) {
        return compileForLoopBody(c, schemas[0], preparations);
      }
      const compiled = c(schemas);
      const [id, prepare] = toContext("variant-elem", compiled);
      preparations.push(prepare);
      return compileForLoopBody(
        c,
        () => ({
          check: () => `validator['${id}'](elem)`,
          handleError: () =>
            `validator.explanations.push(...validator['${id}'].explanations)`,
          not: () => `!validator['${id}'](elem)`
        }),
        preparations
      );
    }
  })(schema);
}

export function arrayOf<T = any>(
  c: (schema: Schema) => CompilationResult,
  schema: Schema
): TypedCompilationResult<T> {
  const preparations: Prepare[] = [];
  const forLoopBody = compileForLoopBody(c, schema, preparations);

  const code = `
    (() => {function validator(value) {${
      forLoopBody.indexOf("explanations") >= 0
        ? "\n  validator.explanations = []"
        : ""
    }\n  if (!value || !Array.isArray(value)) return false\n  for (let i = 0; i < value.length; i++) {\n    const elem = value[i]\n${addTabs(
    forLoopBody,
    2
  )}\n  }\n  return true\n}
        return validator
    })()
  `.trim();

  // tslint:disable-next-line
  const ctx = eval(code);

  for (const prepare of preparations) {
    prepare(ctx);
  }

  ctx.explanations = [];

  return ctx;
}
