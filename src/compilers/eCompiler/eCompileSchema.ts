/* tslint:disable:object-literal-sort-keys */
import { StandardSchemaV1 } from "@standard-schema/spec";
import {
  ExplanationSchemaType,
  IExplanation,
  TExplanationSchema,
} from "../../explanations";
import { Z } from "../../types";
import { CompilationResult, TSchema, Validator } from "../../types";
import { implStandard } from "../implStandard";
import { getExplanator } from "./getExplanator";

function getExpectedTypeName(schema: TExplanationSchema): string {
  if (schema === undefined) return `undefined`;
  if (schema === null) return `null`;
  if (
    typeof schema === "boolean" ||
    typeof schema === "number" ||
    typeof schema === "string"
  )
    return `${JSON.stringify(schema)}`;
  if (typeof schema === "symbol") {
    return `${schema.toString()}`;
  }
  if (typeof schema === "bigint") {
    return `${schema}n`;
  }
  if (schema.type === ExplanationSchemaType.And) {
    return `and<${schema.schemas.map((t) => getExpectedTypeName(t)).join(",")}>`;
  }
  if (schema.type === ExplanationSchemaType.Any) {
    return `any`;
  }
  if (schema.type === ExplanationSchemaType.Array) {
    return `Array<any>`;
  }
  if (schema.type === ExplanationSchemaType.ArrayOf) {
    return `Array<${getExpectedTypeName(schema.elementSchema)}>`;
  }
  if (schema.type === ExplanationSchemaType.Boolean) {
    return `boolean`;
  }
  if (schema.type === ExplanationSchemaType.Finite) {
    return `finite number`;
  }
  if (schema.type === ExplanationSchemaType.Function) {
    return `function`;
  }
  if (schema.type === ExplanationSchemaType.Max) {
    return `(${schema.isExclusive ? ">" : ">="} ${schema.maxValue})`;
  }
  if (schema.type === ExplanationSchemaType.MaxLength) {
    return `{ length: ${schema.isExclusive ? ">" : ">="} ${schema.maxLength} }`;
  }
  if (schema.type === ExplanationSchemaType.Min) {
    return `(${schema.isExclusive ? "<" : "<="} ${schema.minValue})`;
  }
  if (schema.type === ExplanationSchemaType.MinLength) {
    return `{ length: ${schema.isExclusive ? "<" : "<="} ${schema.minLength}}`;
  }
  if (schema.type === ExplanationSchemaType.Negative) {
    return `(< 0)`;
  }
  if (schema.type === ExplanationSchemaType.Never) {
    return `never`;
  }
  if (schema.type === ExplanationSchemaType.Not) {
    const inner = getExpectedTypeName(schema.schema);
    return `not (${inner})`;
  }
  if (schema.type === ExplanationSchemaType.NotANumber) {
    return `NaN`;
  }
  if (schema.type === ExplanationSchemaType.Number) {
    return `number`;
  }
  if (schema.type === ExplanationSchemaType.Object) {
    return `{ ${Object.entries(schema.propsSchemas).map((x) => `${x[0]}: ${getExpectedTypeName(x[1])}`)} }`;
  }
  if (schema.type === ExplanationSchemaType.Pair) {
    return `pair<${getExpectedTypeName(schema.keyValueSchema)}>`;
  }
  if (schema.type === ExplanationSchemaType.Positive) {
    return `(> 0)`;
  }
  if (schema.type === ExplanationSchemaType.SafeInteger) {
    return `safe integer`;
  }
  if (schema.type === ExplanationSchemaType.String) {
    return `string`;
  }
  if (schema.type === ExplanationSchemaType.Symbol) {
    return `symbol`;
  }
  if (schema.type === ExplanationSchemaType.Test) {
    return `test<${schema.description}>`;
  }
  if (schema.type === ExplanationSchemaType.Variant) {
    return `oneOf<${schema.variants.map((x) => getExpectedTypeName(x)).join(", ")}>`;
  }
  if (schema.type === ExplanationSchemaType.Custom) {
    return `custom<${schema.description}>`;
  }

  return JSON.stringify(schema);
}

function getMessage(explanation: IExplanation): string {
  const { schema } = explanation;

  return `expected type: ${getExpectedTypeName(schema)}`;
}

function getPath(
  explanation: IExplanation
): ReadonlyArray<PropertyKey | StandardSchemaV1.PathSegment> | undefined {
  return [...explanation.path];
}

export function eCompileSchema<T = Z>(
  schema: TSchema
): CompilationResult<T, Z> {
  const explanator: (value: Z, path: KeyType[]) => null | IExplanation[] =
    getExplanator(schema);
  const explanations: IExplanation[] = [];
  function validator(value: Z) {
    const explanationsOrNull = explanator(value, []);
    if (explanationsOrNull) {
      (
        validator as unknown as CompilationResult<T, IExplanation>
      ).explanations = explanationsOrNull;
      return false;
    } else {
      (
        validator as unknown as CompilationResult<T, IExplanation>
      ).explanations = [];
      return true;
    }
  }

  const res = Object.assign(validator as Validator<T>, {
    explanations,
    schema,
    cast() {
      return this as Z;
    },
  }) as Z;
  res["~standard"] = implStandard(
    res as CompilationResult<T, IExplanation>,
    (explanations) => {
      return explanations.map((explanation) => {
        const message = getMessage(explanation);
        const path = getPath(explanation);
        return {
          /** The error message of the issue. */
          message,
          /** The path of the issue, if any. */
          path,
        };
      });
    }
  );
  return res;
}
