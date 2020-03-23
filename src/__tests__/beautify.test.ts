import { beautify } from "../beautify";

describe("beautify", () => {
  test("formats code", () => {
    const code = `
        const a = 1
        for (let i = 0; i < a; i++) {
        if (i % 2 === 0) {
        while (true) {
        break;
        }
        }
        }
      `;
    expect(beautify(code)).toMatchInlineSnapshot(`
      "
              const a = 1
              for (let i = 0; i < a; i++) {
              if (i % 2 === 0) {
              while (true) {
              break;
              }
              }
              }
            "
    `);
  });
});
