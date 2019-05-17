import {
  Explanation,
  InstanceSettings,
  IObjectSchema,
  IVariantSchema,
  Schema,
  Validator
} from "./global";

import { compileFunction } from "./compileFunction";

import { compileObjectSchema } from "./compileObjectSchema";
import { compileVariantSchema } from "./compileVariantSchema";

const isConstantSchema = (possiblyConstantSchema: any): boolean =>
  possiblyConstantSchema === null ||
  ["number", "string", "symbol", "undefined", "boolean"].includes(
    typeof possiblyConstantSchema
  );

interface ICompileAgendaItem {
  compiler: (
    settings: InstanceSettings,
    schema: Schema,
    explanation?: Explanation
  ) => Validator;
  test: (s: Schema) => boolean;
}

const compileAgenda: ICompileAgendaItem[] = [
  {
    compiler: (settings, schema, explanation) =>
      compileFunction(settings, schema as Validator, explanation),
    test: schema => typeof schema === "function"
  },
  {
    compiler: (settings, schema, explanation) =>
      compileVariantSchema(settings, schema as IVariantSchema, explanation),
    test: schema => Array.isArray(schema)
  },
  {
    compiler: (settings, schema: Schema) => (value: any): boolean =>
      value === schema,
    test: isConstantSchema
  },
  {
    compiler: (settings, schema, explanation) =>
      compileObjectSchema(settings, schema as IObjectSchema, explanation),
    test: schema => typeof schema === "object"
  }
];

export const compile = (
  settings: InstanceSettings,
  schema: Schema,
  explanation?: Explanation
): Validator => {
  const agendaItem = compileAgenda.find(({ test }) => test(schema));
  if (!agendaItem) {
    throw new TypeError(`Wrong schema: ${JSON.stringify(schema)}`);
  }
  return agendaItem.compiler(settings, schema, explanation);
};
