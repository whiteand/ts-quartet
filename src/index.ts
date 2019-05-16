import {
  Explanation,
  IKeyParentSchema,
  InstanceSettings,
  IObjectSchema,
  IVariantSchema,
  QuartetInstance,
  Schema,
  TypeGuardValidator,
  Validator
} from "./global";
import { methods } from "./methods";

const doExplanations = (
  value: any,
  schema: Schema,
  settings: InstanceSettings,
  parents?: IKeyParentSchema[],
  explanation?: Explanation,
  explanations?: any[]
) => {
  const paramExplanation = explanation || settings.defaultExplanation;
  if (paramExplanation === undefined) {
    return;
  }
  if (!explanations) {
    return;
  }
  const getExplanation =
    typeof explanation === "function" ? explanation : () => explanation;
  const actualExplanation = getExplanation(value, schema, parents);
  if (explanations && actualExplanation !== undefined) {
    explanations.push(actualExplanation);
  }
};

const compileFunction = (
  settings: InstanceSettings,
  schema: Validator,
  explanation?: Explanation
): Validator & { schema: Schema } => {
  const res: Validator & { schema: Schema } = (
    value,
    explanations,
    parents
  ): boolean => {
    const isValid = schema(value, explanations, parents);
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
  res.schema = schema;
  return res;
};

const compileVariantSchema = (
  settings: InstanceSettings,
  schema: IVariantSchema,
  explanation?: Explanation
): Validator & { schema: Schema } => {
  const validators = schema.map(innerSchema => compile(settings, innerSchema));
  const resValidator: Validator & { schema: Schema } = (
    value,
    explanations,
    parents
  ): boolean => {
    const innerExplanations: any[] = [];
    const isValid = validators.some((check: Validator) =>
      check(value, innerExplanations, parents)
    );
    if (!isValid) {
      if (explanations) {
        explanations.push(...innerExplanations);
      }
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

const compileFirstErrorObjectSchema = (
  settings: InstanceSettings,
  schema: IObjectSchema,
  explanation?: Explanation
): Validator & { schema: Schema } => {
  const entries = Object.entries(schema).map(([key, innerSchema]) => ({
    check: compile(settings, innerSchema),
    key
  }));
  const resValidator: Validator & { schema: Schema } = (
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
): Validator & { schema: Schema } => {
  const entries = Object.entries(schema).map(([key, innerSchema]) => ({
    check: compile(settings, innerSchema),
    key
  }));
  const resValidator: Validator & { schema: Schema } = (
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

const compileObjectSchema = (
  settings: InstanceSettings,
  schema: IObjectSchema,
  explanation?: Explanation
): Validator & { schema: Schema } => {
  if (settings.allErrors) {
    return compileAllErrorsObjectSchema(settings, schema, explanation);
  }
  return compileFirstErrorObjectSchema(settings, schema, explanation);
};

const isConstantSchema = (
  possiblyConstantSchema: any
): possiblyConstantSchema is
  | number
  | string
  | symbol
  | undefined
  | boolean
  | null =>
  ["number", "string", "symbol", "undefined", "boolean"].indexOf(
    typeof possiblyConstantSchema
  ) >= 0 || possiblyConstantSchema === null;

const compile = (
  settings: InstanceSettings,
  schema?: Schema,
  explanation?: Explanation
): Validator => {
  if (typeof schema === "function") {
    return compileFunction(settings, schema, explanation);
  }
  if (Array.isArray(schema)) {
    return compileVariantSchema(settings, schema, explanation);
  }
  if (isConstantSchema(schema)) {
    return (value: any): boolean => value === schema;
  }
  if (typeof schema === "object") {
    return compileObjectSchema(settings, schema, explanation);
  }
  throw new TypeError(`Wrong schema: ${JSON.stringify(schema)}`);
};

const defaultSettings: InstanceSettings = {
  allErrors: true
};

const createInstance = (settings: InstanceSettings = defaultSettings) => {
  const compiler: any = <T = any>(
    schema?: Schema,
    explanation?: Explanation,
    innerSettings?: InstanceSettings
  ): TypeGuardValidator<T> => {
    const newSettings: InstanceSettings = {
      ...settings,
      ...(innerSettings || {})
    };
    const compiled = compile(newSettings, schema, explanation);
    const resTypeGuard: TypeGuardValidator<T> = (
      value,
      explanations,
      parents
    ): value is T => compiled(value, explanations || [], parents || []);
    return resTypeGuard;
  };
  for (const [methodName, method] of Object.entries(methods)) {
    compiler[methodName] = method;
  }
  return compiler as QuartetInstance;
};

export default createInstance;
