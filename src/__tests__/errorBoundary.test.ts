import { v, e, quartet } from "../index";
import { ErrorBoundary } from "../types";
import { tables } from "./utils";
const errorBoundary: ErrorBoundary = (
  explanations,
  { value, innerExplanations, schema, id }
) => {
  explanations.push(...innerExplanations, { value, schema, id });
};
describe("errorBoundary", () => {
  test("simple", () => {
    const checkNumber = v(v.errorBoundary(v.number, errorBoundary));
    expect(checkNumber.pure).toBe(false);
    tables(
      checkNumber,
      [1, 2, 3, 4, Infinity, -Infinity, NaN],
      [[null, [{ value: null, schema: v.number, id: "value" }]]]
    );
  });
  test("byDefault", () => {
    const checkNumber = e([null, e.number]);
    expect(checkNumber.pure).toBe(false);
    tables(
      checkNumber,
      [1, 2, 3, 4, Infinity, -Infinity, NaN, null],
      [["1", [{ value: "1", id: "value", schema: [null, e.number] }]]]
    );
  });
  test("byDefault with e.errorBoundary", () => {
    const fullSchema = [null, e.errorBoundary(e.number)];
    const checkNumber = e(fullSchema);
    expect(checkNumber.pure).toBe(false);
    tables(
      checkNumber,
      [1, 2, 3, 4, Infinity, -Infinity, NaN, null],
      [
        [
          "1",
          [
            { value: "1", id: "value", schema: e.number },
            { value: "1", id: "value", schema: fullSchema }
          ]
        ]
      ]
    );
  });
  test("errorBoundary id", () => {
    const checkNumbers = v(v.arrayOf(v.errorBoundary(v.number, errorBoundary)));

    tables(
      checkNumbers,
      [[], [1], [1, 2, 3]],
      [[[1, 2, 3, "4"], [{ value: "4", id: "validator.elem", schema: v.number }]]]
    );
  });
  test("from Documentation", () => {
    const exp = quartet({
      errorBoundary(explanations, { id, value, schema, innerExplanations }) {
        if (innerExplanations.length > 0) {
          explanations.push(...innerExplanations);
        } else {
          explanations.push({ id, value, schema });
        }
      }
    });

    const schema = {
      name: exp.and(exp.string, exp.minLength(1)),
      id: v.safeInteger
    };
    const checkPerson = exp(schema);
    const expl2 = (checkPerson({ name: "Andrew", id: "1" }),
    checkPerson.explanations);
    expect(expl2).toEqual([
      { value: "1", schema: v.safeInteger, id: "value.id" }
    ]);
    const expl0 = (checkPerson(null), checkPerson.explanations);
    expect(expl0).toEqual([]);
    const expl1 = (checkPerson({}), checkPerson.explanations);
    expect(expl1).toEqual([
      { value: undefined, schema: exp.string, id: "value.name" }
    ]);
  });
});
