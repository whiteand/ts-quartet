import { getKeyAccessor } from "../getKeyAccessor";

describe("getKeyAccessor", () => {
  test("01. getKeyAccessor('')", () => {
    expect(getKeyAccessor("")).toMatchInlineSnapshot(`"[\\"\\"]"`);
  });
  test("02. getKeyAccessor('a')", () => {
    expect(getKeyAccessor("a")).toMatchInlineSnapshot(`".a"`);
  });
  test("03. getKeyAccessor('1a')", () => {
    expect(getKeyAccessor("1a")).toMatchInlineSnapshot(`"[\\"1a\\"]"`);
  });
  test("04. getKeyAccessor('1')", () => {
    expect(getKeyAccessor("1")).toMatchInlineSnapshot(`"[1]"`);
  });
  test("05. getKeyAccessor('a1')", () => {
    expect(getKeyAccessor("a1")).toMatchInlineSnapshot(`".a1"`);
  });
  test("06. getKeyAccessor('a-1')", () => {
    expect(getKeyAccessor("a-1")).toMatchInlineSnapshot(`"[\\"a-1\\"]"`);
  });
  test("06. getKeyAccessor(10)", () => {
    expect(getKeyAccessor(10)).toMatchInlineSnapshot(`"[10]"`);
  });
});
