import { compileConstant } from "./compileConstant";
import { compileFunctionSchemaResult } from "./compileFunctionSchemaResult";
import { compileObjectSchema } from "./compileObjectSchema";
import { compileObjectSchemaWithRest } from "./compileObjectSchemaWithRest";
import { compileVariants } from "./compileVariants";
import { handleSchema } from "./handleSchema";
import { CompilationResult, Schema } from "./types";

export function pureCompile(s: Schema): CompilationResult {
  const compiled = handleSchema<CompilationResult>({
    constant: constant => compileConstant(constant),
    function: funcSchema => compileFunctionSchemaResult(funcSchema()),
    object: objSchema => compileObjectSchema(pureCompile as any, objSchema),
    objectRest: objSchema =>
      compileObjectSchemaWithRest(pureCompile as any, objSchema),
    variant: schemas => compileVariants(pureCompile as any, schemas)
  })(s);

  return compiled as any;
}
