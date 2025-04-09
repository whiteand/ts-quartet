import type { StandardSchemaV1 } from "@standard-schema/spec";
import { describe, expect } from "vitest";
import { v } from "../v";

const util = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  equal: <a, b>(_value: a extends b ? (b extends a ? true : false) : false) => {
    // just for typechecking
  },
};

describe("standard schema compat", (test) => {
  test("assignability", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _s1: StandardSchemaV1 = v(v.string);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _s4: StandardSchemaV1<unknown, string> = v(v.string);
  });

  test("type inference", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stringToNumber = v(v.safeInteger);
    type input = StandardSchemaV1.InferInput<typeof stringToNumber>;
    util.equal<input, unknown>(true);
    type output = StandardSchemaV1.InferOutput<typeof stringToNumber>;
    util.equal<output, number>(true);
  });

  test("valid parse", () => {
    const schema = v(v.string);
    const result = schema["~standard"]["validate"]("hello");
    if (result instanceof Promise) {
      throw new Error("Expected sync result");
    }
    expect(result.issues).toEqual(undefined);
    if (result.issues) {
      throw new Error("Expected no issues");
    } else {
      expect(result.value).toEqual("hello");
    }
  });

  test("invalid parse", () => {
    const schema = v(v.string);
    const result = schema["~standard"]["validate"](1234);
    if (result instanceof Promise) {
      throw new Error("Expected sync result");
    }
    expect(result.issues).toBeDefined();
    if (!result.issues) {
      throw new Error("Expected issues");
    }
    expect(result.issues.length).toEqual(1);
    expect(result.issues[0].path).toEqual([]);
  });
});
