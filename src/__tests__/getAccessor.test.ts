import { getAccessor } from "../utils";
import { describe, expect } from "vitest";

describe("getAccessor", (test) => {
  test("number", () => {
    expect(getAccessor(123)).toEqual("[123]");
  });
  test("not simple prop", () => {
    expect(getAccessor("a-b")).toEqual('["a-b"]');
  });
  test("simple prop", () => {
    expect(getAccessor("a")).toEqual(".a");
  });
});
