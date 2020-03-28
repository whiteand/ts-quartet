import { toContext, clearContextCounters } from "../toContext";
import { IContext } from "..";

describe("toContext", () => {
  test("Do not add number when uniq without number", () => {
    clearContextCounters();
    const [id, prepare] = toContext("prefix", 42);
    const ctx: IContext = { explanations: [], pure: true };
    prepare(ctx);
    expect(ctx).toMatchInlineSnapshot(`
            Object {
              "explanations": Array [],
              "prefix": 42,
              "pure": true,
            }
        `);
    expect(id).toMatchInlineSnapshot(`"prefix"`);
  });
  test("Add number when explanations prefix", () => {
    clearContextCounters();
    const [id, prepare] = toContext("explanations", 42);
    const ctx: IContext = { explanations: [], pure: true };
    prepare(ctx);
    expect(ctx).toMatchInlineSnapshot(`
      Object {
        "explanations": Array [],
        "explanations-0": 42,
        "pure": true,
      }
    `);
    expect(id).toMatchInlineSnapshot(`"explanations-0"`);
  });
  test("Add number when pure prefix", () => {
    clearContextCounters();
    const [id, prepare] = toContext("pure", 42);
    const ctx: IContext = { explanations: [], pure: true };
    prepare(ctx);
    expect(ctx).toMatchInlineSnapshot(`
      Object {
        "explanations": Array [],
        "pure": true,
        "pure-0": 42,
      }
    `);
    expect(id).toMatchInlineSnapshot(`"pure-0"`);
  });
  test("add number when necessary", () => {
    clearContextCounters();
    const [id1, prepare1] = toContext("prefix", 42);
    const [id2, prepare2] = toContext("prefix", 43);
    const ctx: IContext = { explanations: [], pure: true };
    prepare1(ctx);
    prepare2(ctx);
    expect(ctx).toMatchInlineSnapshot(`
      Object {
        "explanations": Array [],
        "prefix": 42,
        "prefix-1": 43,
        "pure": true,
      }
    `);
    expect(id1).toMatchInlineSnapshot(`"prefix"`);
    expect(id2).toMatchInlineSnapshot(`"prefix-1"`);
  });
  test("add number when necessary", () => {
    clearContextCounters();
    const [id1, prepare1] = toContext("prefix", 42, true);
    const [id2, prepare2] = toContext("prefix", 43, true);
    const ctx: IContext = { explanations: [], pure: true };
    prepare1(ctx);
    prepare2(ctx);
    expect(ctx).toMatchInlineSnapshot(`
      Object {
        "explanations": Array [],
        "prefix": 43,
        "pure": true,
      }
    `);
    expect(id1).toMatchInlineSnapshot(`"prefix"`);
    expect(id2).toMatchInlineSnapshot(`"prefix"`);
  });
});
