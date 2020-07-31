type RendererMethod<R = string, S = any> = (
  valueId: string,
  // id that is ready to be used in expression for reading
  schema: S,
  // function that is used to allocate place to do something, returns id that is ready to be used for reading and writing
  alloc: (initialValue?: any, prefix?: string) => string,
  // id of array that is ready to be used in expression for reading
  pathToValueId: string,
  // id of array that is ready to be used for reading and writing
  explanationsArrId: string
) => R;

export interface ISchemaRenderer<S = any> {
  getExpr: RendererMethod<string, S>;
  getNotExpr: RendererMethod<string, S>;
  getIfNotExprReturnFalse: RendererMethod<string, S>;
  getIfExprReturnTrue: RendererMethod<string, S>;
}
