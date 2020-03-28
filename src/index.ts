import { compileConstant } from "./compileConstant";
import { compileFunctionSchemaResult } from "./compileFunctionSchemaResult";
import { compileObjectSchema } from "./compileObjectSchema";
import { compileObjectSchemaWithRest } from "./compileObjectSchemaWithRest";
import { compileVariants } from "./compileVariants";
import { handleSchema } from "./handleSchema";
import { methods } from "./methods";
import { clearContextCounters } from "./toContext";
import { CompilationResult, QuartetInstance, Schema } from "./types";

export function quartet(): QuartetInstance {
  const pureCompile = function _compile(s: Schema): CompilationResult {
    const compiled = handleSchema<CompilationResult>({
      constant: constant => compileConstant(constant),
      function: funcSchema => compileFunctionSchemaResult(funcSchema()),
      object: objSchema => compileObjectSchema(_compile as any, objSchema),
      objectRest: objSchema =>
        compileObjectSchemaWithRest(_compile as any, objSchema),
      variant: schemas => compileVariants(_compile as any, schemas)
    })(s);

    return compiled as any;
  };
  const compilator = function compile(s: Schema): CompilationResult {
    clearContextCounters();
    return pureCompile(s);
  };
  return Object.assign(compilator, methods) as QuartetInstance;
}

export const v = quartet();

export * from "./types";
