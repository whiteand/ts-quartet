import { compileConstant } from "./compileConstant";
import { compileFunctionSchemaResult } from "./compileFunctionSchemaResult";
import { compileObjectSchema } from "./compileObjectSchema";
import { compileObjectSchemaWithRest } from "./compileObjectSchemaWithRest";
import { compileVariants } from "./compileVariants";
import { handleSchema } from "./handleSchema";
import { methods } from "./methods";
import { CompilationResult, QuartetInstance, Schema } from "./types";

export function quartet(): QuartetInstance {
  const compilator = function compile(s: Schema): CompilationResult {
    const compiled = handleSchema<CompilationResult>({
      constant: constant => compileConstant(constant),
      function: funcSchema => compileFunctionSchemaResult(funcSchema()),
      object: objSchema => compileObjectSchema(compile as any, objSchema),
      objectRest: objSchema =>
        compileObjectSchemaWithRest(compile as any, objSchema),
      variant: schemas => compileVariants(compile as any, schemas)
    })(s);

    return compiled as any;
  };
  return Object.assign(compilator, methods) as QuartetInstance;
}

export const v = quartet();

export * from "./types";
