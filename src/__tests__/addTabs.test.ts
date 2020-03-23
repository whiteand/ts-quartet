import { addTabs } from "../addTabs";

describe("addTabs", () => {
  test("formats code", () => {
    const code = `console.log('something')\nconsole.log('another')`;
    expect(addTabs(code)).toMatchInlineSnapshot(`
      "  console.log('something')
        console.log('another')"
    `);
  });
});
