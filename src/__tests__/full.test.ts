import { full as v } from "../index";

test("full is a function", () => {
  expect(typeof v).toBe("function");
});

test("full has default explanation", () => {
  expect(v.settings).toBeTruthy();
  expect(typeof v.settings.defaultExplanation).toBe("function");
});

test("full has full explanation", () => {
  const isNumber = v.number;
  const schema = {
    a: isNumber,
    b: isNumber
  };
  const checkANumber = v(schema);
  const explanations: any = [];
  checkANumber({ a: "string" }, explanations);
  const checkExplanations = v.and(
    v.min(1),
    v.arrayOf(
      v.and(
        {
          id: v.number,
          parents: v.arrayOf(
            v.and(
              {
                key: [v.number, v.string],
                parent: Boolean
              },
              parent => parent.hasOwnProperty("schema")
            )
          ),
          settings: (v: any) => typeof v === "object",
          value: () => true
        },
        explanation => explanation.hasOwnProperty("schema")
      )
    )
  );
  expect(checkExplanations(explanations)).toBe(true);
});
