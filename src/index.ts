interface IKeyParent {
  key: any;
  parent: any;
  schema: any;
}

type Validator<T = any> = (
  value: any,
  explanations?: any[],
  parents?: IKeyParent[],
  settings?: InstanceSettings
) => value is T;

interface IObjectSchema {
  [key: string]: Schema;
}

type Schema<T = any> =
  | null
  | number
  | string
  | symbol
  | undefined
  | boolean
  | Validator<T>
  | IVariantSchema
  | IObjectSchema;
interface IVariantSchema extends Array<Schema> {}

type FromValidationParams<T = any> = (
  value: any,
  schema: Schema,
  settings: InstanceSettings,
  parents?: IKeyParent[]
) => T;
type Explanation<T = any> = T | FromValidationParams<T>;

type InstanceSettings = Partial<{
  defaultExplanation: Explanation;
  onInvalid: FromValidationParams;
  onValid: FromValidationParams;
  allErrors: boolean;
}>;

const doExplanations = (
  value: any,
  schema: Schema,
  settings: InstanceSettings,
  parents?: IKeyParent[],
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

const compileFunction = <T = any>(
  settings: InstanceSettings,
  schema: Validator<T>,
  explanation?: Explanation
): Validator<T> & { schema: Schema } => {
  const res: Validator<T> & { schema: Schema } = (
    value,
    explanations,
    parents
  ): value is T => {
    const isValid = schema(value, explanations, parents, settings);
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
    }
    if (settings.onValid) {
      settings.onValid(value, schema, settings, parents);
    }
    return isValid;
  };
  res.schema = schema;
  return res;
};

const compileVariantSchema = <T = any>(
  settings: InstanceSettings,
  schema: IVariantSchema,
  explanation?: Explanation
): Validator<T> & { schema: Schema } => {
  const validators = schema.map(innerSchema => compile(settings, innerSchema));
  const resValidator: Validator<T> & { schema: Schema } = (
    value,
    explanations,
    parents
  ): value is T => {
    const innerExplanations: any[] = [];
    const isValid = validators.some(check =>
      check(value, innerExplanations, parents, settings)
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
    }
    if (settings.onValid) {
      settings.onValid(value, schema, settings, parents);
    }
    return isValid;
  };
  resValidator.schema = schema;
  return resValidator;
};

const compileFirstErrorObjectSchema = <T = any>(
  settings: InstanceSettings,
  schema: IObjectSchema,
  explanation?: Explanation
): Validator<T> & { schema: Schema } => {
  const isValid = (value: any): value is T => false;
  isValid.schema = schema;
  return isValid;
};

const compileAllErrorsObjectSchema = <T = any>(
  settings: InstanceSettings,
  schema: IObjectSchema,
  explanation?: Explanation
): Validator<T> & { schema: Schema } => {
  const isValid = (value: any): value is T => false; // TODO: write this
  isValid.schema = schema;
  return isValid;
};

const compileObjectSchema = <T = any>(
  settings: InstanceSettings,
  schema: IObjectSchema,
  explanation?: Explanation
): Validator<T> & { schema: Schema } => {
  if (settings.allErrors) {
    return compileAllErrorsObjectSchema<T>(settings, schema, explanation);
  }
  return compileFirstErrorObjectSchema<T>(settings, schema, explanation);
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

const compile = <T = any>(
  settings: InstanceSettings,
  schema?: Schema<T>,
  explanation?: Explanation
): Validator<T> => {
  if (typeof schema === "function") {
    return compileFunction<T>(settings, schema, explanation);
  }
  if (Array.isArray(schema)) {
    return compileVariantSchema<T>(settings, schema, explanation);
  }
  if (isConstantSchema(schema)) {
    return (value: any): value is T => value === schema;
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
  const compiler = <T = any>(
    schema?: Schema,
    explanation?: Explanation,
    innerSettings?: InstanceSettings
  ): Validator<T> => {
    const newSettings: InstanceSettings = {
      ...settings,
      ...(innerSettings || {})
    };
    return compile(newSettings, schema, explanation);
  };
  return compiler;
};
