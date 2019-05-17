import { compile } from "./compile";
import { doExplanations } from "./doExplanation";
import {
  Explanation,
  InstanceSettings,
  IObjectSchema,
  ValidatorWithSchema
} from "./global";

const compileFirstErrorObjectSchema = (
  settings: InstanceSettings,
  schema: IObjectSchema,
  explanation?: Explanation
): ValidatorWithSchema => {
  const entries = Object.entries(schema).map(([key, innerSchema]) => ({
    check: compile(settings, innerSchema),
    key
  }));
  const resValidator: ValidatorWithSchema = (
    value,
    explanations,
    parents
  ): boolean => {
    if (!value) {
      doExplanations(
        value,
        schema,
        settings,
        parents,
        explanation,
        explanations
      );
      if (settings.onInvalid) {
        settings.onInvalid(value, schema, settings, parents);
      }
      return false;
    }
    const isValid = entries.every(({ key, check }) => {
      const newParents = [{ key, parent: value, schema }, ...(parents || [])];
      return check(value[key], explanations, newParents);
    });

    if (!isValid) {
      doExplanations(
        value,
        schema,
        settings,
        parents,
        explanation,
        explanations
      );
      if (settings.onInvalid) {
        settings.onInvalid(value, schema, settings, parents);
      }
      return false;
    }
    if (settings.onValid) {
      settings.onValid(value, schema, settings, parents);
    }
    return isValid;
  };
  resValidator.schema = schema;
  return resValidator;
};

const compileAllErrorsObjectSchema = (
  settings: InstanceSettings,
  schema: IObjectSchema,
  explanation?: Explanation
): ValidatorWithSchema => {
  const entries = Object.entries(schema).map(([key, innerSchema]) => ({
    check: compile(settings, innerSchema),
    key
  }));
  const resValidator: ValidatorWithSchema = (
    value,
    explanations,
    parents
  ): boolean => {
    if (!value) {
      doExplanations(
        value,
        schema,
        settings,
        parents,
        explanation,
        explanations
      );
      if (settings.onInvalid) {
        settings.onInvalid(value, schema, settings, parents);
      }
      return false;
    }
    let isValid = true;
    for (const { key, check } of entries) {
      const newParents = [{ key, parent: value, schema }, ...(parents || [])];
      const isValidProp = check(value[key], explanations, newParents);
      isValid = isValid && isValidProp;
    }

    if (!isValid) {
      doExplanations(
        value,
        schema,
        settings,
        parents,
        explanation,
        explanations
      );
      if (settings.onInvalid) {
        settings.onInvalid(value, schema, settings, parents);
      }
      return false;
    }
    if (settings.onValid) {
      settings.onValid(value, schema, settings, parents);
    }
    return isValid;
  };
  resValidator.schema = schema;
  return resValidator;
};

export const compileObjectSchema = (
  settings: InstanceSettings,
  schema: IObjectSchema,
  explanation?: Explanation
): ValidatorWithSchema => {
  if (settings.allErrors) {
    return compileAllErrorsObjectSchema(settings, schema, explanation);
  }
  return compileFirstErrorObjectSchema(settings, schema, explanation);
};
