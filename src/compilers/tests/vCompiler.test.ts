import { anySchema, array, boolean, finite, neverSchema } from "../../schemas";
import { vCompiler } from "../vCompiler";
import { snapshot } from "./snapshot";

describe("v()", () => {
  test(`v(undefined)`, () => {
    snapshot(
      vCompiler,
      undefined,
      [undefined],
      [null, [undefined], "undefined", ["undefined"], 1, 0, NaN, false]
    );
  });
  test(`v(null)`, () => {
    snapshot(
      vCompiler,
      null,
      [null],
      ["null", [null], undefined, 0, 1, NaN, false]
    );
  });
  test(`v(true)`, () => {
    snapshot(
      vCompiler,
      true,
      [true],
      ["true", [true], 1, Infinity, NaN, false, null, undefined]
    );
  });
  test(`v(false)`, () => {
    snapshot(
      vCompiler,
      false,
      [false],
      ["false", [false], 1, Infinity, NaN, true, null, undefined]
    );
  });
  test(`v(0/0)`, () => {
    snapshot(
      vCompiler,
      0 / 0,
      [0 / 0],
      [1, "NaN", Infinity, -0, [0 / 0], "0/0"]
    );
  });
  test(`v(42)`, () => {
    snapshot(
      vCompiler,
      42,
      [42],
      [
        "42",
        [42],
        true,
        undefined,
        false,
        {},
        {
          valueOf() {
            return 42;
          }
        }
      ]
    );
  });
  test(`v('quartet')`, () => {
    snapshot(
      vCompiler,
      "quartet",
      ["quartet"],
      [
        ["quartet"],
        {
          toString() {
            return "quartet";
          }
        },
        1,
        null,
        NaN,
        undefined,
        Infinity
      ]
    );
  });
  test(`v('quartetquartetquartetquartetquartetquartetquartetquartetquartetquartetquartet')`, () => {
    snapshot(
      vCompiler,
      "quartetquartetquartetquartetquartetquartetquartetquartetquartetquartetquartet",
      [
        "quartetquartetquartetquartetquartetquartetquartetquartetquartetquartetquartet"
      ],
      [
        [
          "quartetquartetquartetquartetquartetquartetquartetquartetquartetquartetquartet"
        ],
        {
          toString() {
            return "quartetquartetquartetquartetquartetquartetquartetquartetquartetquartetquartet";
          }
        },
        1,
        null,
        NaN,
        undefined,
        Infinity
      ]
    );
  });
  test(`v(Symbol.for('quartet'))`, () => {
    snapshot(
      vCompiler,
      Symbol.for("quartet"),
      [Symbol.for("quartet")],
      [
        [Symbol.for("quartet")],
        "quartet",
        null,
        undefined,
        NaN,
        Infinity,
        false,
        true
      ]
    );
  });

  test("v(v.array)", () => {
    snapshot(
      vCompiler,
      array(),
      [[], [1], [[]]],
      [{ length: 10 }, null, undefined, false, "Array", Array]
    );
  });
  test("v(v.boolean)", () => {
    snapshot(
      vCompiler,
      boolean(),
      [true, false],
      [
        "true",
        "false",
        [true],
        [false],
        {
          toString() {
            return "true";
          }
        },
        null,
        undefined,
        0,
        NaN
      ]
    );
  });
  test("v(v.finite)", () => {
    snapshot(
      vCompiler,
      finite(),
      [1, 0, 1.5, -0],
      [NaN, Infinity, -Infinity, "0", "1", [1], [1.4], null, undefined, NaN]
    );
  });
  test("v(v.any)", () => {
    snapshot(
      vCompiler,
      anySchema(),
      [
        1,
        0,
        1.5,
        -0,
        NaN,
        Infinity,
        -Infinity,
        "0",
        "1",
        [1],
        [1.4],
        null,
        undefined,
        NaN
      ],
      []
    );
  });
  test("v(v.never)", () => {
    snapshot(
      vCompiler,
      neverSchema(),
      [],
      [
        1,
        0,
        1.5,
        -0,
        NaN,
        Infinity,
        -Infinity,
        "0",
        "1",
        [1],
        [1.4],
        null,
        undefined,
        NaN
      ]
    );
  });
  test("v(v.function)", () => {
    // TODO: Add v.function test
  });
  test("v(v.negative)", () => {
    // TODO: Add v.negative test
  });
  test("v(v.number)", () => {
    // TODO: Add v.number test
  });
  test("v(v.positive)", () => {
    // TODO: Add v.positive test
  });
  test("v(v.safeInteger)", () => {
    // TODO: Add v.safeInteger test
  });
  test("v(v.string)", () => {
    // TODO: Add v.string test
  });
  test("v(v.symbol)", () => {
    // TODO: Add v.symbol test
  });
});
