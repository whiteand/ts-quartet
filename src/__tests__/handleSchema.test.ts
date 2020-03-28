import { v } from "../index";
import { handleSchema } from "../handleSchema";
import { funcSchema } from "./mocks";

describe("handleSchema", () => {
  test("switches in appropriate way", () => {
    const handle = handleSchema<any>({
      constant: constant => ["constant", constant],
      function: func => ["func", typeof func],
      object: obj => ["obj", obj],
      objectRest: withRest => ["objWithRest", withRest],
      variant: schemas => ["variants", schemas]
    });
    expect(handle(funcSchema)).toMatchInlineSnapshot(`
      Array [
        "func",
        "function",
      ]
    `);
    expect(handle(undefined)).toMatchInlineSnapshot(`
            Array [
              "constant",
              undefined,
            ]
        `);
    expect(handle(null)).toMatchInlineSnapshot(`
            Array [
              "constant",
              null,
            ]
        `);
    expect(handle(true)).toMatchInlineSnapshot(`
            Array [
              "constant",
              true,
            ]
        `);
    expect(handle(false)).toMatchInlineSnapshot(`
            Array [
              "constant",
              false,
            ]
        `);
    expect(handle(0)).toMatchInlineSnapshot(`
            Array [
              "constant",
              0,
            ]
        `);
    expect(handle(1)).toMatchInlineSnapshot(`
            Array [
              "constant",
              1,
            ]
        `);
    expect(handle(NaN)).toMatchInlineSnapshot(`
            Array [
              "constant",
              NaN,
            ]
        `);
    expect(handle(Infinity)).toMatchInlineSnapshot(`
            Array [
              "constant",
              Infinity,
            ]
        `);
    expect(handle(-Infinity)).toMatchInlineSnapshot(`
            Array [
              "constant",
              -Infinity,
            ]
        `);
    expect(handle("")).toMatchInlineSnapshot(`
            Array [
              "constant",
              "",
            ]
        `);
    expect(handle("Andrew")).toMatchInlineSnapshot(`
            Array [
              "constant",
              "Andrew",
            ]
        `);
    expect(handle(Symbol.for("test"))).toMatchInlineSnapshot(`
            Array [
              "constant",
              Symbol(test),
            ]
        `);
    expect(handle({ a: 1 })).toMatchInlineSnapshot(`
            Array [
              "obj",
              Object {
                "a": 1,
              },
            ]
        `);
    expect(handle({ a: 1, [v.rest]: 2 })).toMatchInlineSnapshot(`
            Array [
              "objWithRest",
              Object {
                "__quartet/rest__": 2,
                "a": 1,
              },
            ]
        `);
    expect(handle({ a: 1, [v.rest]: 2, [v.restOmit]: ["a"] }))
      .toMatchInlineSnapshot(`
            Array [
              "objWithRest",
              Object {
                "__quartet/rest-omit__": Array [
                  "a",
                ],
                "__quartet/rest__": 2,
                "a": 1,
              },
            ]
        `);
    expect(handle({ a: 1, [v.restOmit]: ["a"] })).toMatchInlineSnapshot(`
            Array [
              "obj",
              Object {
                "a": 1,
              },
            ]
        `);
  });
});
