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

const empty: any = {};
const hasProperty = (obj: any, key: string) => {
  if (empty[key]) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  return obj[key] !== undefined || key in obj;
};

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
  const firstStepsPropsTestingDict = hasRest ? value : validatorsDict;
  const firstStepPropsTesting = Object.keys(firstStepsPropsTestingDict);
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
  const validatorsDictEntries = Object.entries(validatorsDict);
  // tslint:disable-next-line
  for (let i = 0; i < validatorsDictEntries.length; i++) {
    const [prop, propValidator] = validatorsDictEntries[i];

    if (hasProperty(firstStepPropsTesting, prop)) {
      continue;
    }

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

const getValidatorsDict = (
  settings: InstanceSettings,
  schema: IObjectSchema
) => {
  const entries = Object.entries(schema);
  const dict: any = {};
  // tslint:disable-next-line
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const prop = entry[0];
    if (prop === REST) {
      continue;
    }
    dict[prop] = compile(settings, entry[1]);
  }
  return dict;
};

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
