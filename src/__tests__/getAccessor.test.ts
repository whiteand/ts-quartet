import { getAccessor } from "../utils";

describe("getAccessor", () => {
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
