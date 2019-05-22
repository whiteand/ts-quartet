import { compile } from "./compile";
import { ValidatorType } from "./constants";
import { doExplanations } from "./doExplanation";
import { has } from "./helpers";
import { REST } from "./symbols";
import {
  Explanation,
  IKeyParentSchema,
  InstanceSettings,
  IObjectSchema,
  Validator,
  ValidatorWithSchema
} from "./types";

interface IPrecompiledValidationData {
  hasRest: boolean;
  restValidator: Validator;
  validatorsDict: { [prop: string]: Validator };
}

type ObjectValidationHandler = (
  precompiledData: IPrecompiledValidationData,
  value: any,
  schema: IObjectSchema,
  settings: InstanceSettings,
  parents?: IKeyParentSchema[],
  explanation?: Explanation,
  explanations?: any[]
) => { handled: boolean; isValid: boolean };

const notObjectHandler: ObjectValidationHandler = (precompiledData, value) => {
  return { handled: !value, isValid: false };
};

const getParentsGetter = (
  parent: any,
  schema: IObjectSchema,
  parents?: IKeyParentSchema[]
) => (key: string) => [{ key, schema, parent }, ...(parents || [])];

const propValidationHandler: ObjectValidationHandler = (
  precompiledData,
  value,
  schema,
  settings,
  parents,
  explanation,
  explanations
) => {
  const { hasRest, validatorsDict, restValidator } = precompiledData;
  const firstStepPropsTesting = hasRest
    ? Object.keys(value)
    : Object.keys(validatorsDict);
  const getParents = getParentsGetter(value, schema, parents);
  let isValid = true;
  for (const prop of firstStepPropsTesting) {
    const propValue = value[prop];
    const isRestProp = !has(validatorsDict, prop);
    const propValidator = isRestProp ? restValidator : validatorsDict[prop];
    const isValidProp = propValidator(
      propValue,
      explanations,
      getParents(prop)
    );
    isValid = isValid && isValidProp;
    if (!isValid && !settings.allErrors) {
      return { handled: true, isValid };
    }
  }

  const secondStepAgenda = Object.entries(validatorsDict).filter(
    ([key]) => !firstStepPropsTesting.includes(key)
  );
  for (const [prop, propValidator] of secondStepAgenda) {
    const propValue = value[prop];
    const isValidProp = propValidator(
      propValue,
      explanations,
      getParents(prop)
    );
    isValid = isValid && isValidProp;
    if (!isValid && !settings.allErrors) {
      return { handled: true, isValid };
    }
  }

  return { handled: true, isValid };
};

const validationAgenda: ObjectValidationHandler[] = [
  notObjectHandler,
  propValidationHandler
];

type GetCurrentData = (
  settings: InstanceSettings,
  schema: IObjectSchema
) => IPrecompiledValidationData;

const getValidatorsDict = (settings: InstanceSettings, schema: IObjectSchema) =>
  Object.entries(schema)
    .filter(([key]) => key !== REST)
    .reduce(
      (dict, [prop, propSchema]) => ({
        ...dict,
        [prop]: compile(settings, propSchema)
      }),
      {}
    );

const getPrecompiledValidationData: GetCurrentData = (settings, schema) => {
  const hasRest = has(schema, REST);
  const validatorsDict = getValidatorsDict(settings, schema);
  const restValidator = hasRest ? compile(settings, schema[REST]) : () => true;
  return {
    hasRest,
    restValidator,
    validatorsDict
  };
};

export const compileObjectSchema = (
  settings: InstanceSettings,
  schema: IObjectSchema,
  explanation?: Explanation
): ValidatorWithSchema<{ type: ValidatorType; innerSchema: IObjectSchema }> => {
  const precompiledData = getPrecompiledValidationData(settings, schema);
  const validator: Validator = (value, explanations, parents) => {
    for (const handler of validationAgenda) {
      const { handled, isValid } = handler(
        precompiledData,
        value,
        schema,
        settings,
        parents,
        explanation,
        explanations
      );
      if (handled) {
        if (!isValid) {
          doExplanations(
            value,
            schema,
            settings,
            parents,
            explanation,
            explanations
          );
        }
        return isValid;
      }
    }
    return true;
  };

  return Object.assign(validator, {
    schema: {
      innerSchema: schema,
      type: ValidatorType.Object
    }
  });
};
