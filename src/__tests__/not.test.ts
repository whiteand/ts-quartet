import { v } from "../index";
import { snapshot, puretables } from "./utils";
import { primitives, funcSchemaWithNot, funcSchema } from "./mocks";

describe("v.not", () => {
  test("00. v.not(undefined)", () => {
    const validator = v(v.not(undefined));
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], {}, ...primitives.filter(e => typeof e !== "undefined")],
      [undefined]
    );
  });
  test("01. v.not(null)", () => {
    const validator = v(v.not(null));
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], {}, ...primitives.filter(e => e !== null)],
      [null]
    );
  });
  test("02. v.not(NaN)", () => {
    const validator = v(v.not(NaN));
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], {}, ...primitives.filter(e => !Number.isNaN(e))],
      [NaN]
    );
  });
  test("03. v.not(42)", () => {
    const validator = v(v.not(42));
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(validator, [[], {}, ...primitives.filter(e => e !== 42)], [42]);
  });
  test("04. v.not(true)", () => {
    const validator = v(v.not(true));
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], {}, ...primitives.filter(e => e !== true)],
      [true]
    );
  });
  test("05. v.not(false)", () => {
    const validator = v(v.not(false));
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], {}, ...primitives.filter(e => e !== false)],
      [false]
    );
  });
  test('06. v.not(Symbol.for("test"))', () => {
    const symbol = Symbol.for("test");
    const validator = v(v.not(symbol));
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], {}, ...primitives.filter(e => e !== symbol)],
      [symbol]
    );
  });

  test('07. v.not("test")', () => {
    const validator = v(v.not("test"));
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], {}, ...primitives.filter(e => e !== "test")],
      ["test"]
    );
  });
  test("08. v.not(funcWithNot)", () => {
    const validator = v(v.not(funcSchemaWithNot));
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], {}, ...primitives.filter(e => typeof e !== "number" || e % 2 !== 0)],
      [2, 4, 6, 8]
    );
  });
  test("09. v.not(funcWithoutNot)", () => {
    const validator = v(v.not(funcSchema));
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], {}, ...primitives.filter(e => typeof e !== "number" || e % 2 !== 0)],
      [2, 4, 6, 8]
    );
  });
  test("10. v.not({ a: 42 })", () => {
    const validator = v(v.not({ a: 42 }));
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], {}, { a: 41 }, ...primitives],
      [{ a: 42 }, { a: 42, b: 2 }]
    );
  });
});
