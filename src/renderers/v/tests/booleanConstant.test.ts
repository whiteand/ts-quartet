import { booleanConstantRenderer } from "../booleanConstant";
import { mockAlloc } from "./utils";

describe("v constant number renderer", () => {
  test("v(true)", () => {
    expect(
      booleanConstantRenderer.getExpr(
        "_valueId",
        true,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"_valueId === true"`);
    expect(
      booleanConstantRenderer.getIfExprReturnTrue(
        "_valueId",
        true,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"if (_valueId === true) return true;"`);
    expect(
      booleanConstantRenderer.getIfNotExprReturnFalse(
        "_valueId",
        true,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"if (_valueId !== true) return false;"`);
    expect(
      booleanConstantRenderer.getNotExpr(
        "_valueId",
        true,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"_valueId !== true"`);
  });
  test("v(false)", () => {
    expect(
      booleanConstantRenderer.getExpr(
        "_valueId",
        false,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"_valueId === false"`);
    expect(
      booleanConstantRenderer.getIfExprReturnTrue(
        "_valueId",
        false,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"if (_valueId === false) return true;"`);
    expect(
      booleanConstantRenderer.getIfNotExprReturnFalse(
        "_valueId",
        false,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"if (_valueId !== false) return false;"`);
    expect(
      booleanConstantRenderer.getNotExpr(
        "_valueId",
        false,
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"_valueId !== false"`);
  });
});
