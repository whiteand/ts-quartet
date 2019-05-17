import { compile } from "./compile";
import { methods } from "./methods";
import {
  Explanation,
  InstanceSettings,
  QuartetInstance,
  Schema,
  Validator
} from "./types";

const defaultSettings: InstanceSettings = {
  allErrors: true
};

const createInstance = (settings: InstanceSettings = defaultSettings) => {
  const compiler: any = (
    schema?: Schema,
    explanation?: Explanation,
    innerSettings?: InstanceSettings
  ): Validator => {
    const newSettings: InstanceSettings = {
      ...settings,
      ...(innerSettings || {})
    };
    const compiledValidator = compile(newSettings, schema, explanation);
    return (value, explanations, parents) =>
      compiledValidator(value, explanations || [], parents || []);
  };
  for (const [methodName, method] of Object.entries(methods)) {
    compiler[methodName] = method;
  }
  return compiler as QuartetInstance;
};

export default createInstance;
