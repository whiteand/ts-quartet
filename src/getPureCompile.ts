import { compileConstant } from "./compileConstant";
import { compileFunctionSchemaResult } from "./compileFunctionSchemaResult";
import { compileObjectSchema } from "./compileObjectSchema";
import { compileObjectSchemaWithRest } from "./compileObjectSchemaWithRest";
import { compileVariants } from "./compileVariants";
import { handleSchema } from "./handleSchema";
import { CompilationResult, QuartetInstance, Schema } from "./types";

export const getPureCompile = () =>
  function pureCompile(this: QuartetInstance, s: Schema): CompilationResult {
    const compiled = handleSchema<CompilationResult>({
      constant: constant => compileConstant(this, constant),
      function: funcSchema =>
        compileFunctionSchemaResult(this, funcSchema()),
      object: objSchema =>
        compileObjectSchema(this, objSchema),
      objectRest: objSchema =>
        compileObjectSchemaWithRest(this, objSchema),
      variant: schemas => compileVariants(this, schemas)
    })(s);

    return compiled as any;
  };
