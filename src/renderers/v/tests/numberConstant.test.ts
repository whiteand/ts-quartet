import { numberConstantRenderer } from "../numberConstant";
import { mockAlloc } from "./utils";

describe("v constant number renderer", () => {
  test("v(NaN)", () => {
    expect(
      numberConstantRenderer.getExpr(
        "_valueId",
        0 / 0,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"Number.isNaN(_valueId)"`);
    expect(
      numberConstantRenderer.getIfExprReturnTrue(
        "_valueId",
        0 / 0,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"if (Number.isNaN(_valueId)) return true;"`);
    expect(
      numberConstantRenderer.getIfNotExprReturnFalse(
        "_valueId",
        0 / 0,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"if (!Number.isNaN(_valueId)) return false;"`);
    expect(
      numberConstantRenderer.getNotExpr(
        "_valueId",
        0 / 0,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"!Number.isNaN(_valueId)"`);
  });
  test("v(42)", () => {
    expect(
      numberConstantRenderer.getExpr(
        "_valueId",
        42,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"_valueId === _validNumber_42"`);
    expect(
      numberConstantRenderer.getIfExprReturnTrue(
        "_valueId",
        42,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"if (_valueId === _validNumber_42) return true;"`);
    expect(
      numberConstantRenderer.getIfNotExprReturnFalse(
        "_valueId",
        42,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(
      `"if (_valueId !== _validNumber_42) return false;"`
    );
    expect(
      numberConstantRenderer.getNotExpr(
        "_valueId",
        42,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"_valueId !== _validNumber_42"`);
  });
});
