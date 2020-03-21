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
  validatorsDict: {
    [prop: string]: Validator | number | boolean | string | null | undefined;
  };
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
  const { validatorsDict } = precompiledData;
  const restValidator = compile(settings, schema[REST]);
  const keysToBeTested = Object.keys(value);
  let isValid = true;
  // tslint:disable-next-line
  for (let i = 0; i < keysToBeTested.length; i++) {
    const key = keysToBeTested[i];
    const propValidator = has(validatorsDict, key)
      ? validatorsDict[key]
      : restValidator;

    const isValidProp =
      typeof propValidator === "function"
        ? propValidator(value[key], explanations, [
            { key, schema, parent: value },
            ...parents
          ])
        : propValidator === value[key];
    if (!isValidProp) {
      isValid = false;
    }
    if (!isValid && !settings.allErrors) {
      return isValid;
    }
  }

  const keys = Object.keys(validatorsDict);
  // tslint:disable-next-line
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (has(value, key)) {
      continue;
    }

    const propValidator = validatorsDict[key];

    const isValidProp =
      typeof propValidator === "function"
        ? propValidator(value[key], explanations, [
            { key, schema, parent: value },
            ...parents
          ])
        : propValidator === value[key];
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
  // tslint:disable-next-line
  for (let i = 0; i < firstStepPropsTesting.length; i++) {
    const key = firstStepPropsTesting[i];

    const propValidator = validatorsDict[key];
    const isValidProp =
      typeof propValidator === "function"
        ? propValidator(value[key], explanations, [
            { key, schema, parent: value },
            ...parents
          ])
        : propValidator === value[key];
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
  const keys = Object.keys(schema);
  const dict: any = {};
  // tslint:disable-next-line
  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    if (prop === REST) {
      continue;
    }
    const propSchema = schema[prop];
    dict[prop] =
      propSchema && typeof propSchema === "object"
        ? compile(settings, propSchema)
        : propSchema;
  }
  return dict;
};

const getPrecompiledValidationData: GetCurrentData = (settings, schema) => {
  const hasRest = has(schema, REST);
  const validatorsDict = getValidatorsDict(settings, schema);
  return {
    hasRest,
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
