import { SchemaType } from "../../schemas/SchemaType";
import { TSchema } from "../../types";
import { getAccessorWithAlloc, has } from "../../utils";
import { explanation } from "./explanation";
import { getExplanator } from "./getExplanator";

function renderExplanation(
  valueVar: string,
  pathVar: string,
  schema: TSchema,
  alloc: (varName: string, initialValue: any, singleton?: boolean) => string,
  innerExplanationsVar?: string
): string {
  const getExpVar = alloc(
    "e",
    (value: any, path: KeyType[], innerExplanations: any[] = []) =>
      explanation(value, path, schema, innerExplanations)
  );

  return innerExplanationsVar
    ? `${getExpVar}(${valueVar}, ${pathVar}, ${innerExplanationsVar})`
    : `${getExpVar}(${valueVar}, ${pathVar})`;
}

export function returnExplanations(
  schema: TSchema,
  alloc: (varName: string, initialValue: any, singleton?: boolean) => string,
  valueVar: string,
  pathVar: string,
  statementsBeforeInvalidReturn: string[]
): string[] {
  const expsVar = alloc("es", []);
  if (typeof schema !== "object" || schema === null) {
    const constantVar = alloc("c", schema);
    const statements: string[] = [];
    statements.push(
      `if (${valueVar} !== ${constantVar}) {`,
      `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
    );
    for (let i = 0; i < statementsBeforeInvalidReturn.length; i++) {
      statements.push(statementsBeforeInvalidReturn[i]);
    }
    statements.push(`return ${expsVar}`, "}");
    return statements;
  }
  switch (schema.type) {
    case SchemaType.Not:
    case SchemaType.Variant:
    case SchemaType.Pair:
      const explanator = getExplanator(schema);
      const explanatorVar = alloc("variantExp", explanator);
      const funcStatements: string[] = [];
      funcStatements.push(
        `${expsVar} = ${explanatorVar}(${valueVar}, ${pathVar})`,
        `if (${expsVar}) {`
      );
      for (let i = 0; i < statementsBeforeInvalidReturn.length; i++) {
        funcStatements.push(statementsBeforeInvalidReturn[i]);
      }
      funcStatements.push(`return ${expsVar}`, `}`);
      return funcStatements;
    case SchemaType.And:
      const andStatements: string[] = [];
      for (let i = 0; i < schema.schemas.length; i++) {
        const innerSchema = schema.schemas[i];
        const innerStatements = returnExplanations(
          innerSchema,
          alloc,
          valueVar,
          pathVar,
          statementsBeforeInvalidReturn
        );
        for (let j = 0; j < innerStatements.length; j++) {
          andStatements.push(innerStatements[j]);
        }
      }
      return andStatements;
    case SchemaType.Any:
      return [];
    case SchemaType.Array:
      const arrayStatements = [
        `if (!Array.isArray(${valueVar})) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ];
      for (let i = 0; i < statementsBeforeInvalidReturn.length; i++) {
        arrayStatements.push(statementsBeforeInvalidReturn[i]);
      }
      arrayStatements.push(`return ${expsVar}`, `}`);
      return arrayStatements;
    case SchemaType.ArrayOf:
      const arrayOfStatements: string[] = [
        `if (!Array.isArray(${valueVar})) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ];
      for (let i = 0; i < statementsBeforeInvalidReturn.length; i++) {
        arrayOfStatements.push(statementsBeforeInvalidReturn[i]);
      }
      arrayOfStatements.push(`return ${expsVar}`, `}`);
      const indexVar = alloc("i", 0);
      const elemVar = alloc("e", undefined);
      arrayOfStatements.push(
        `for (${indexVar} = 0; ${indexVar} < ${valueVar}.length; ${indexVar}++) {`,
        `${elemVar} = ${valueVar}[${indexVar}]`,
        `${pathVar}.push(${indexVar})`
      );
      const handleElementStatements = returnExplanations(
        schema.elementSchema,
        alloc,
        elemVar,
        pathVar,
        statementsBeforeInvalidReturn.concat([`${pathVar}.pop()`])
      );

      for (let i = 0; i < handleElementStatements.length; i++) {
        arrayOfStatements.push(handleElementStatements[i]);
      }

      arrayOfStatements.push(`${pathVar}.pop()`, `}`);

      return arrayOfStatements;
    case SchemaType.Boolean:
      return [
        `if (typeof ${valueVar} !== 'boolean') {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);

    case SchemaType.Finite:
      return [
        `if (!Number.isFinite(${valueVar})) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);
    case SchemaType.Function:
      return [
        `if (typeof ${valueVar} !== 'function') {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);
    case SchemaType.Max:
      const maxValueVar = alloc("mv", schema.maxValue);
      const cmpMax = schema.isExclusive ? "<" : "<=";
      return [
        `if (!(${valueVar} ${cmpMax} ${maxValueVar})) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);

    case SchemaType.MaxLength:
      const maxLengthVar = alloc("ml", schema.maxLength);
      const cmpMaxLen = schema.isExclusive ? "<" : "<=";
      return [
        `if (${valueVar} == null || !(${valueVar}.length ${cmpMaxLen} ${maxLengthVar})) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);
    case SchemaType.Min:
      const minValueVar = alloc("mv", schema.minValue);
      const cmpMin = schema.isExclusive ? ">" : ">=";
      return [
        `if (!(${valueVar} ${cmpMin} ${minValueVar})) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);

    case SchemaType.MinLength:
      const minLengthVar = alloc("ml", schema.minLength);
      const cmpMinLen = schema.isExclusive ? ">" : ">=";
      return [
        `if (${valueVar} == null || !(${valueVar}.length ${cmpMinLen} ${minLengthVar})) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);
    case SchemaType.Negative:
      return [
        `if (!(${valueVar} < 0)) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);
    case SchemaType.Never:
      return [
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`]);
    case SchemaType.NotANumber:
      return [
        `if (!Number.isNaN(${valueVar})) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);
    case SchemaType.Number:
      return [
        `if (typeof ${valueVar} !== 'number') {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);
    case SchemaType.Object:
      const statements: string[] = [];
      statements.push(
        `if (${valueVar} == null) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      );
      for (let i = 0; i < statementsBeforeInvalidReturn.length; i++) {
        statements.push(statementsBeforeInvalidReturn[i]);
      }
      statements.push(`return ${expsVar}`, `}`);
      const { props, propsSchemas } = schema;
      for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        const propSchema = propsSchemas[prop];

        statements.push(`${pathVar}.push(${JSON.stringify(prop)})`);
        const handlePropStatements = returnExplanations(
          propSchema,
          alloc,
          `${valueVar}${getAccessorWithAlloc(prop, alloc)}`,
          pathVar,
          statementsBeforeInvalidReturn.concat([`${pathVar}.pop()`])
        );
        for (let j = 0; j < handlePropStatements.length; j++) {
          statements.push(handlePropStatements[j]);
        }
        statements.push(`${pathVar}.pop()`);
      }

      if (schema.hasRestValidator) {
        const restPropsVar = alloc("rps", []);
        const indexVar = alloc("i", 0);
        const restPropVar = alloc("rp", "");
        const restPropValueVar = alloc("rpv", undefined);
        const hasVar = alloc("has", has, true);
        const propsSchemasVar = alloc("ps", schema.propsSchemas);
        const restOmitDictVar = alloc("rod", schema.restOmitDict);

        statements.push(
          `${restPropsVar} = Object.keys(${valueVar})`,
          `for (${indexVar} = 0; ${indexVar} < ${restPropsVar}.length; ${indexVar}++) {`,
          `${restPropVar} = ${restPropsVar}[${indexVar}]`,
          `if (${hasVar}(${propsSchemasVar}, ${restPropVar}) || ${restOmitDictVar}[${restPropVar}] === true) continue;`,
          `${restPropValueVar} = ${valueVar}[${restPropVar}]`,
          `${pathVar}.push(${restPropVar})`
        );
        const handleRestPropStatements = returnExplanations(
          schema.rest,
          alloc,
          restPropValueVar,
          pathVar,
          [`${pathVar}.pop()`]
        );
        for (let j = 0; j < handleRestPropStatements.length; j++) {
          statements.push(handleRestPropStatements[j]);
        }
        statements.push(`${pathVar}.pop()`, `}`);
      }

      return statements;

    case SchemaType.Positive:
      return [
        `if (!(${valueVar} > 0)) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);
    case SchemaType.SafeInteger:
      return [
        `if (!Number.isSafeInteger(${valueVar})) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);
    case SchemaType.String:
      return [
        `if (typeof ${valueVar} !== 'string') {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);
    case SchemaType.Symbol:
      return [
        `if (typeof ${valueVar} !== 'symbol') {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);

    case SchemaType.Test:
      const testerVar = alloc("tester", schema.tester);
      return [
        `if (!${testerVar}.test(${valueVar})) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);

    case SchemaType.Custom:
      const customValidatorVar = alloc("tester", schema.customValidator);
      return [
        `if (!${customValidatorVar}(${valueVar})) {`,
        `${expsVar} = [${renderExplanation(valueVar, pathVar, schema, alloc)}]`
      ].concat(statementsBeforeInvalidReturn, [`return ${expsVar}`, `}`]);
  }
  return [];
}
