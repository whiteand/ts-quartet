import { ISchemaRenderer } from "../../../types";
import { mockAlloc } from "./utils";

interface IRendererArgs<S> {
  valueId?: string;
  schema: S;
  alloc?: (initialValue?: any, prefix?: string) => string;
  pathToValueId?: string;
  explanationsArrId?: string;
}
export function snapshot(
  renderer: ISchemaRenderer<any>,
  {
    valueId = "_valueId",
    schema,
    alloc = mockAlloc,
    pathToValueId = "_pathToValueId",
    explanationsArrId = "_explanationsArrId"
  }: IRendererArgs<any>
) {
  expect(
    renderer.getExpr(valueId, schema, alloc, pathToValueId, explanationsArrId)
  ).toMatchSnapshot();
  expect(
    renderer.getNotExpr(
      valueId,
      schema,
      alloc,
      pathToValueId,
      explanationsArrId
    )
  ).toMatchSnapshot();
  expect(
    renderer.getIfExprReturnTrue(
      valueId,
      schema,
      alloc,
      pathToValueId,
      explanationsArrId
    )
  ).toMatchSnapshot();
  expect(
    renderer.getIfNotExprReturnFalse(
      valueId,
      schema,
      alloc,
      pathToValueId,
      explanationsArrId
    )
  ).toMatchSnapshot();
}
