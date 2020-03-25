import { v, Schema } from "../index";
import { schemas, values } from "./mocks";
import { getDescription } from "./getDescription";

describe("v", () => {
  test("any case", () => {
    const maxLevel = 1;
    const valids: Array<[(v: any) => boolean, Schema, any]> = [];
    const explanations: Array<[Schema, any, any]> = [];
    for (const schema of schemas(maxLevel)) {
      const compiled = v(schema);
      expect(typeof compiled.pure).toBe("boolean");
      for (const value of values(maxLevel)) {
        try {
          const validationResult = compiled(value);
          if (typeof validationResult !== "boolean") {
            console.log(schema);
          }
          expect(typeof validationResult).toBe("boolean");

          if (validationResult) {
            valids.push([compiled, schema, value]);
          }
          expect(compiled.explanations).toBeInstanceOf(Array);
          if (compiled.explanations.length > 0) {
            explanations.push([schema, value, compiled.explanations]);
          }
        } catch (error) {
          console.log(schema, value, compiled.toString());
          console.error(error);
          throw error;
        }
      }
    }
    expect(explanations.length).toMatchInlineSnapshot(`24224`);
    expect(valids.length).toMatchInlineSnapshot(`6631`);
    let maxDescription = getDescription(valids[0][0]);
    let maxDescriptionText = JSON.stringify(maxDescription);
    let maxIndex = 0;
    for (let i = 1; i < valids.length; i++) {
      const description = getDescription(valids[i][0]);
      const descriptionText = JSON.stringify(description);
      if (descriptionText.length > maxDescriptionText.length) {
        maxIndex = i;
        maxDescription = description;
        maxDescriptionText = descriptionText;
      }
    }
    expect(maxDescription).toMatchInlineSnapshot(`
      Object {
        "_": "function validator(value) {
        validator.explanations = []
        if (!value) return false
        const keys = Object.keys(value)
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          if (!validator.checkRest(value[key])) {
            validator.explanations.push(...validator.checkRest.explanations)
            return false
          }
        }
        return true
      }",
        "checkRest": "function validator(value) {
        validator.explanations = []
        if (typeof value === 'number' && value % validator.divider === 0) {
          return true
        }
        validator.explanations.push(value)
        return false
      }",
        "checkRest.divider": 2,
        "checkRest.explanations": Array [
          Array [],
        ],
        "checkRest.pure": false,
        "defined": "function (v) { return !!v; }",
        "defined.explanations": Array [],
        "defined.pure": true,
        "explanations": Array [
          Array [],
        ],
        "pure": false,
      }
    `);
  });
});
