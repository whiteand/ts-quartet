import { addTabs } from "./addTabs";
import { getKeyAccessor } from "./getKeyAccessor";
import { handleSchema } from "./handleSchema";
import { toContext } from "./toContext";
import { CompilationResult, IObjectSchema, Prepare, Schema } from "./types";

function compilePropValidationWithoutRest(
  c: (schema: Schema) => CompilationResult,
  key: string,
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[],
  stringNumbersSymbols: Array<string | number | symbol>
): [string, boolean] {
  return handleSchema<[string, boolean]>({
    constant: constant => {
      if (constant === null) {
        return [`if (${valueId} !== null) return false`, true];
      }
      if (constant === undefined) {
        return [`if (${valueId} !== undefined) return false`, true];
      }
      if (typeof constant === "number") {
        if (Number.isNaN(constant)) {
          return [`if (!Number.isNaN(${valueId})) return false`, true];
        }
        return [`if (${valueId} !== ${constant}) return false`, true];
      }
      if (constant === "true" || constant === "false") {
        return [`if (${valueId} !== '${constant}') return false`, true];
      }
      if (typeof constant === "symbol" || typeof constant === "string") {
        stringNumbersSymbols.push(constant);
        return ["", true];
      }
      return [
        `if (${valueId} !== ${JSON.stringify(constant)}) return false`,
        true
      ];
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
      const keys = Object.keys(objectSchema);
      const codeLines = [`if (!${valueId}) return false`];
      const important: string[] = [];
      let isPure = true;
      // tslint:disable-next-line
      for (let i = 0; i < keys.length; i++) {
        const innerKey = keys[i];
        const innerKeyAccessor = getKeyAccessor(innerKey);
        const keyValidValues: Array<string | symbol> = [];
        const innerKeyId = valueId + innerKeyAccessor;
        const [code, isPurePart] = compilePropValidationWithoutRest(
          c,
          innerKey,
          innerKeyId,
          ctxId,
          objectSchema[innerKey],
          preparations,
          keyValidValues
        );
        if (!isPurePart) {
          isPure = false;
        }

        if (keyValidValues.length > 0) {
          for (const valid of keyValidValues) {
            const [keyConstantId, prepare] = toContext(innerKeyId, valid);
            preparations.push(prepare);
            important.push(
              `if (${innerKeyId} !== ${ctxId}['${keyConstantId}']) return false`
            );
          }
        }
        if (code) {
          codeLines.push(code);
        }
      }
      codeLines.splice(1, 0, ...important);
      return [codeLines.join("\n"), isPure];
    },
    objectRest: objectSchema => {
      const compiled = c(objectSchema);
      const [id, prepare] = toContext(key, compiled);
      preparations.push(prepare);
      const funcSchema = compiled.pure
        ? () => ({
            check: () => `${ctxId}['${id}'](${valueId})`,
            not: () => `!${ctxId}['${id}'](${valueId})`
          })
        : () => ({
            check: () => `${ctxId}['${id}'](${valueId})`,
            handleError: () =>
              `${ctxId}.explanations.push(...${ctxId}['${id}'].explanations)`,
            not: () => `!${ctxId}['${id}'](${valueId})`
          });
      return compilePropValidationWithoutRest(
        c,
        key,
        valueId,
        ctxId,
        funcSchema,
        preparations,
        stringNumbersSymbols
      );
    },
    variant: schemas => {
      if (schemas.length === 0) {
        return [`return false`, true];
      }
      if (schemas.length === 1) {
        return compilePropValidationWithoutRest(
          c,
          key,
          valueId,
          ctxId,
          schemas[0],
          preparations,
          stringNumbersSymbols
        );
      }
      const compiled = c(schemas);
      const [id, prepare] = toContext(key, compiled);
      preparations.push(prepare);
      const funcSchema = compiled.pure
        ? () => ({
            check: () => `${ctxId}['${id}'](${valueId})`,
            not: () => `!${ctxId}['${id}'](${valueId})`
          })
        : () => ({
            check: () => `${ctxId}['${id}'](${valueId})`,
            handleError: () =>
              `${ctxId}.explanations.push(...${ctxId}['${id}'].explanations)`,
            not: () => `!${ctxId}['${id}'](${valueId})`
          });
      return compilePropValidationWithoutRest(
        c,
        key,
        valueId,
        ctxId,
        funcSchema,
        preparations,
        stringNumbersSymbols
      );
    }
  })(schema);
}

export function compileObjectSchema(
  c: (schema: Schema) => CompilationResult,
  s: IObjectSchema
): CompilationResult {
  const keys = Object.keys(s);
  if (keys.length === 0) {
    return Object.assign((v: any) => !!v, { explanations: [], pure: true });
  }
  const bodyCodeLines = [];
  const preparations: Prepare[] = [];
  const ctxId = "validator";
  const validValues: Record<string, Record<string, true>> = {};
  const withValidValues: string[] = [];
  let isPure = true;
  // tslint:disable-next-line
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const schema = s[key];
    const keyAccessor = getKeyAccessor(key);
    const valueId = `value${keyAccessor}`;
    const keyValidValues: any[] = [];
    let [codeLine, pureLine] = compilePropValidationWithoutRest(
      c,
      key,
      valueId,
      ctxId,
      schema,
      preparations,
      keyValidValues
    );
    codeLine = codeLine.trim();
    if (!pureLine) {
      isPure = false;
    }
    if (codeLine) {
      bodyCodeLines.push(codeLine);
    }
    if (keyValidValues.length > 0) {
      withValidValues.push(key);
      if (!validValues[key]) {
        validValues[key] = {};
      }
      for (const valid of keyValidValues) {
        validValues[key][valid] = true;
      }
    }
  }

  if (withValidValues.length > 0) {
    preparations.push(context => {
      context.__validValues = validValues;
    });
    bodyCodeLines.unshift(
      ...withValidValues.map(key => {
        const keyAccessor = getKeyAccessor(key);
        return `if (validator.__validValues${keyAccessor}[value${keyAccessor}] !== true) return false`;
      })
    );
  }
  bodyCodeLines.unshift("if (!value) return false");
  if (!isPure) {
    bodyCodeLines.unshift("validator.explanations = []");
  }
  const code = `
    (() => {\nfunction validator(value) {\n${addTabs(
      bodyCodeLines.join("\n")
    )}\n  return true\n}
      return validator
    })()
  `.trim();

  // tslint:disable-next-line
  const ctx = eval(code);

  for (const prepare of preparations) {
    prepare(ctx);
  }

  ctx.explanations = [];
  ctx.pure = isPure;

  return ctx;
}
