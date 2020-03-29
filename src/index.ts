import { methods } from "./methods";
import { getPureCompile } from "./getPureCompile";
import { getContextControllers } from "./toContext";
import { QuartetInstance, Schema } from "./types";

export function quartet(): QuartetInstance {
  const [toContext, clearContextCounters] = getContextControllers();
  const pureCompile = getPureCompile();
  const compilator: QuartetInstance = Object.assign(
    function compile(s: Schema): any {
      compilator.clearContextCounters();
      return compilator.pureCompile(s);
    },
    { pureCompile, toContext, clearContextCounters },
    methods
  );
  return compilator
}

export const v = quartet();

export * from "./types";
