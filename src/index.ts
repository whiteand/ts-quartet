import { compile } from "./compile";
import { getMethods } from "./methods";
import {
  Explanation,
  FromValidationParams,
  InstanceSettings,
  QuartetInstance,
  Schema,
  Validator
} from "./types";

const defaultSettings: InstanceSettings = {
  allErrors: true
};

export const quartet = (settings: InstanceSettings = defaultSettings) => {
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
  const methods = getMethods(settings)
  for (const [methodName, method] of Object.entries(methods)) {
    compiler[methodName] = method;
  }
  return compiler as QuartetInstance;
};

export const v = quartet({
  allErrors: true,
  defaultExplanation: undefined
})

export const obj = quartet(((dict: any[])=>{
  const defaultExplanation: FromValidationParams = (value, schema, settings, parents) => {
    console.log(parents)
    let id = dict.indexOf(schema)
    if (id < 0) {
      id = dict.length
      dict.push(schema)
    }
    return {
      id,
      parents,
      schema,
      settings,
      value
    }
  }
  return {
    allErrors: true,
    defaultExplanation
  }
})([]))