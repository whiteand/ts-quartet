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
) => boolean;

const checkWithRest: ObjectValidationHandler = (
  precompiledData,
  value,
  schema,
  settings,
  parents = [],
  explanation,
  explanations
) => {
  const { validatorsDict, restValidator } = precompiledData;
  const keysToBeTested = Object.keys(value);
  let isValid = true;
  for (const key of keysToBeTested) {
    const propValidator = has(validatorsDict, key)
      ? validatorsDict[key]
      : restValidator;

    const isValidProp = propValidator(value[key], explanations, [
      { key, schema, parent: value },
      ...parents
    ]);
    if (!isValidProp) {
      isValid = false;
    }
    if (!isValid && !settings.allErrors) {
      return isValid;
    }
  }

  const entries = Object.entries(validatorsDict);
  // tslint:disable-next-line
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const key = entry[0];

    if (has(value, key)) {
      continue;
    }

    const propValidator = entry[1];

    const propValue = value[key];
    const isValidProp = propValidator(propValue, explanations, [
      { key, schema, parent: value },
      ...parents
    ]);
    isValid = isValid && isValidProp;
    if (!isValid && !settings.allErrors) {
      return isValid;
    }
  }
  return isValid;
};
const checkWithoutRest: ObjectValidationHandler = (
  precompiledData,
  value,
  schema,
  settings,
  parents = [],
  explanation,
  explanations
) => {
  const { validatorsDict } = precompiledData;
  const firstStepPropsTesting = Object.keys(validatorsDict);
  let isValid = true;
  for (const key of firstStepPropsTesting) {
    const propValidator = validatorsDict[key];
    const isValidProp = propValidator(value[key], explanations, [
      { key, schema, parent: value },
      ...parents
    ]);
    if (!isValidProp) {
      isValid = false;
    }
    if (!isValid && !settings.allErrors) {
      return isValid;
    }
  }

  return isValid;
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
  if (precompiledData.hasRest) {
    return checkWithRest(
      precompiledData,
      value,
      schema,
      settings,
      parents,
      explanation,
      explanations
    );
  } else {
    return checkWithoutRest(
      precompiledData,
      value,
      schema,
      settings,
      parents,
      explanation,
      explanations
    );
  }
};

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
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const prop = entry[0];
    if (prop === REST) continue;
    const propSchema = entry[1];
    dict[prop] = compile(settings, propSchema);
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
    const isValid = value
      ? propValidationHandler(
          precompiledData,
          value,
          schema,
          settings,
          parents,
          explanation,
          explanations
        )
      : false;
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
  };

  return Object.assign(validator, {
    schema: {
      innerSchema: schema,
      type: ValidatorType.Object
    }
  });
};
