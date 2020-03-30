import { getPureCompile } from "./getPureCompile";
import { methods } from "./methods";
import { getContextControllers } from "./toContext";
import { ISettings, QuartetInstance, Schema } from "./types";

const DEFAULT_SETTINGS: ISettings = {};
export function quartet(
  settings: ISettings = DEFAULT_SETTINGS
): QuartetInstance {
  const actualSettings = { ...DEFAULT_SETTINGS, ...settings };
  const [toContext, clearContextCounters] = getContextControllers();
  const pureCompile = getPureCompile(actualSettings);
  const compilator: QuartetInstance = Object.assign(
    function compile(s: Schema): any {
      compilator.clearContextCounters();

      return compilator.pureCompile(s);
    },
    { pureCompile, toContext, clearContextCounters, settings: actualSettings },
    methods
  );
  return compilator;
}

export const v = quartet();
export const e = quartet({
  errorBoundary(explanations, { value, schema, innerExplanations, id }) {
    explanations.push(...innerExplanations, { value, schema, id });
  }
});

export * from "./types";
