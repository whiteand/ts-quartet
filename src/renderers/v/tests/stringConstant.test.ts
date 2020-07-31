import { stringConstantRenderer } from "../stringConstant";
import { mockAlloc } from "./utils";

describe("v constant number renderer", () => {
  test('v("Andrew")', () => {
    expect(
      stringConstantRenderer.getExpr(
        "_valueId",
        "Andrew",
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"_valueId === \\"Andrew\\""`);
    expect(
      stringConstantRenderer.getIfExprReturnTrue(
        "_valueId",
        "Andrew",
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"if (_valueId === \\"Andrew\\") return true;"`);
    expect(
      stringConstantRenderer.getIfNotExprReturnFalse(
        "_valueId",
        "Andrew",
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"if (_valueId !== \\"Andrew\\") return false;"`);
    expect(
      stringConstantRenderer.getNotExpr(
        "_valueId",
        "Andrew",
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(`"_valueId !== \\"Andrew\\""`);
  });
  test('v("Andrew is the creator of quartet data validation library. Try to create another long string")', () => {
    expect(
      stringConstantRenderer.getExpr(
        "_valueId",
        "Andrew is the creator of quartet data validation library. Try to create another long string",
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(
      `"_valueId === _validString_\\"Andrew is the creator of quartet data validation library. Try to create another long string\\""`
    );
    expect(
      stringConstantRenderer.getIfExprReturnTrue(
        "_valueId",
        "Andrew is the creator of quartet data validation library. Try to create another long string",
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(
      `"if (_valueId === _validString_\\"Andrew is the creator of quartet data validation library. Try to create another long string\\") return true;"`
    );
    expect(
      stringConstantRenderer.getIfNotExprReturnFalse(
        "_valueId",
        "Andrew is the creator of quartet data validation library. Try to create another long string",
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(
      `"if (_valueId !== _validString_\\"Andrew is the creator of quartet data validation library. Try to create another long string\\") return false;"`
    );
    expect(
      stringConstantRenderer.getNotExpr(
        "_valueId",
        "Andrew is the creator of quartet data validation library. Try to create another long string",
        mockAlloc,
        "_pathToValueId",
        "_explanations"
      )
    ).toMatchInlineSnapshot(
      `"_valueId !== _validString_\\"Andrew is the creator of quartet data validation library. Try to create another long string\\""`
    );
  });
});
