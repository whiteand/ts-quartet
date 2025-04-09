import { Z } from "../types";
import { getAccessorWithAlloc } from "../utils";
import { describe, expect } from "vitest";

const mockedAlloc = (a: string, b: Z, c: boolean = false) =>
  JSON.stringify({ a, b, c });

describe("getAccessor", (test) => {
  test("number", () => {
    expect(getAccessorWithAlloc(123, mockedAlloc)).toEqual("[123]");
  });
  test("not simple number", () => {
    expect(getAccessorWithAlloc(123.531231, mockedAlloc)).toEqual(
      `[{"a":"c","b":123.531231,"c":false}]`,
    );
  });
  test("not simple prop", () => {
    expect(getAccessorWithAlloc("a-b", mockedAlloc)).toEqual(`["a-b"]`);
  });
  test("simple prop", () => {
    expect(getAccessorWithAlloc("a", mockedAlloc)).toEqual(".a");
  });
});
