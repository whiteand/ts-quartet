import { methods } from "./methods";
import { pureCompile } from "./pureCompile";
import { clearContextCounters } from "./toContext";
import { CompilationResult, QuartetInstance, Schema } from "./types";

export function quartet(): QuartetInstance {
  const compilator = function compile(s: Schema): CompilationResult {
    clearContextCounters();
    return pureCompile(s);
  };
  return Object.assign(compilator, methods) as QuartetInstance;
}

export const v = quartet();

export * from "./types";
