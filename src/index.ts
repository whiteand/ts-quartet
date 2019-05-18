import { compile } from "./compile";
import { getMethods } from "./methods";
import { REST } from "./symbols";
import {
  Explanation,
  FromValidationParams,
  IKeyParentSchema,
  InstanceSettings,
  TypeGuardValidator
} from "./types";

const defaultSettings: InstanceSettings = {
  allErrors: true
};

export const quartet = (settings: InstanceSettings = defaultSettings) => {
  const compiler = <T = any>(
    schema: any,
    explanation?: Explanation,
    innerSettings?: InstanceSettings
  ) => {
    const newSettings: InstanceSettings = {
      ...settings,
      ...(innerSettings || {})
    };
    const compiledValidator = compile(newSettings, schema, explanation);
    return ((
      value: any,
      explanations: any[] = [],
      parents: IKeyParentSchema[] = []
    ) => compiledValidator(value, explanations, parents)) as TypeGuardValidator<
      T
    >;
  };
  const methods = getMethods(settings);
  return Object.assign(compiler, methods, { rest: REST });
};

export const v = quartet({
  allErrors: true,
  defaultExplanation: undefined
});

export const obj = quartet(
  ((dict: any[]) => {
    const defaultExplanation: FromValidationParams = (
      value,
      schema,
      settings,
      parents
    ) => {
      let id = dict.indexOf(schema);
      if (id < 0) {
        id = dict.length;
        dict.push(schema);
      }
      return {
        id,
        parents,
        schema,
        settings,
        value
      };
    };
    return {
      allErrors: true,
      defaultExplanation
    };
  })([])
);
