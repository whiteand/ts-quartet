import { compile } from "./compile";
import { has } from "./helpers";
import { getMethods } from "./methods";
import { REST } from "./symbols";
import {
  Explanation,
  FromValidationParams,
  IKeyParentSchema,
  InstanceSettings,
  Quartet,
  TypeGuardValidator
} from "./types";

const defaultSettings: InstanceSettings = {
  allErrors: true
};

export const quartet: Quartet = (
  settings: InstanceSettings = defaultSettings
) => {
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
  return Object.assign(compiler, methods, { rest: REST, settings });
};

export const v = quartet({
  allErrors: false,
  defaultExplanation: undefined
});

export const full = quartet(
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

export const obj = quartet(
  ((dict: any[]) => {
    function transformToObj(schema: any): any {
      if (!schema) {
        return schema;
      }
      if (!["object", "function"].includes(typeof schema)) {
        return schema;
      }
      if (Array.isArray(schema)) {
        const variants: any[] = [];
        // tslint:disable-next-line
        for (let i = 0; i < schema.length; i++) {
          variants.push(transformToObj(schema[i]));
        }
        return variants;
      }
      if (typeof schema === "object") {
        const entries = Object.entries(schema);
        const objSchema: any = {};
        // tslint:disable-next-line
        for (let i = 0; i < entries.length; i++) {
          objSchema[entries[i][0]] = transformToObj(entries[i][1]);
        }
        return objSchema;
      }
      if (schema.schema) {
        return transformToObj(schema.schema);
      }
      if (!schema.type) {
        return schema;
      }
      return has(schema, "innerSchema")
        ? { ...schema, innerSchema: transformToObj(schema.innerSchema) }
        : { ...schema };
    }
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
        schema: transformToObj(schema),
        settings,
        value
      };
    };
    return {
      allErrors: false,
      defaultExplanation
    };
  })([])
);
