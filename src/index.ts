import { compileConstant } from "./compileConstant";
import { compileFunctionSchemaResult } from "./compileFunctionSchemaResult";
import { compileObjectSchema } from "./compileObjectSchema";
import { compileObjectSchemaWithRest } from "./compileObjectSchemaWithRest";
import { compileVariants } from "./compileVariants";
import { handleSchema } from "./handleSchema";
import { methods } from "./methods";
import { CompilationResult, QuartetInstance, Schema } from "./types";
import { clearContextCounters } from "./toContext";

export function quartet(): QuartetInstance {
  const _compile = function _compile(s: Schema): CompilationResult {
    const compiled = handleSchema<CompilationResult>({
      constant: constant => compileConstant(constant),
      function: funcSchema => compileFunctionSchemaResult(funcSchema()),
      object: objSchema => compileObjectSchema(_compile as any, objSchema),
      objectRest: objSchema =>
        compileObjectSchemaWithRest(_compile as any, objSchema),
      variant: schemas => compileVariants(_compile as any, schemas)
    })(s);

    return compiled as any;
  }
  const compilator = function compile(s: Schema): CompilationResult {
    clearContextCounters()
    return _compile(s)
  };
  return Object.assign(compilator, methods) as QuartetInstance;
}

export const v = quartet();

export * from "./types";
