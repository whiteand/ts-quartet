import { v } from "../index";
import { tables, snapshot } from "./utils";

describe("min", () => {
  test("exclusive", () => {
    const validator = v(v.min(5, true));
    tables(validator, [6, 7, 8, 9, 5.1, Infinity], [1, 2, 3, 4, 5, -Infinity]);
    snapshot(validator);
  });
  test("inclusive", () => {
    const validator = v(v.min(5));
    tables(validator, [5, 6, 7, 8, 9, 5.1, Infinity], [1, 2, 3, 4, -Infinity]);
    snapshot(validator);
  });
});

describe("minLength", () => {
  test("exclusive", () => {
    const validator = v(v.minLength(5, true));
    tables(
      validator,
      [
        ...[6, 7, 8, 9].map(length => Array.from({ length }, () => 1)),
        "123456"
      ],
      [
        "12345",
        "1234",
        ...[1, 2, 3, 4, 5].map(length => Array.from({ length }, () => 1))
      ]
    );
    snapshot(validator);
  });
  test("inclusive", () => {
    const validator = v(v.minLength(5));
    tables(
      validator,
      [
        ...[6, 7, 8, 9].map(length => Array.from({ length }, () => 1)),
        "123456",
        "12345"
      ],
      ["1234", ...[1, 2, 3, 4].map(length => Array.from({ length }, () => 1))]
    );
    snapshot(validator);
  });
});
describe("max", () => {
  test("exclusive", () => {
    const validator = v(v.max(5, true));
    tables(validator, [1, 2, 3, 4, -Infinity], [5, 6, 7, 8, 9, 5.1, Infinity]);
    snapshot(validator);
  });
  test("inclusive", () => {
    const validator = v(v.max(5));
    tables(validator, [1, 2, 3, 4, -Infinity, 5], [6, 7, 8, 9, 5.1, Infinity]);
    snapshot(validator);
  });
});

describe("maxLength", () => {
  test("exclusive", () => {
    const validator = v(v.maxLength(5, true));
    tables(
      validator,
      ["1234", ...[1, 2, 3, 4].map(length => Array.from({ length }, () => 1))],
      [
        "12345",
        ...[6, 7, 8, 9, 5].map(length => Array.from({ length }, () => 1)),
        "123456"
      ]
    );
    snapshot(validator);
  });
  test("inclusive", () => {
    const validator = v(v.maxLength(5));
    tables(
      validator,
      [
        "1234",
        "12345",
        ...[1, 2, 3, 4, 5].map(length => Array.from({ length }, () => 1))
      ],
      [...[6, 7, 8, 9].map(length => Array.from({ length }, () => 1)), "123456"]
    );
    snapshot(validator);
  });
});
