export const getExplanatoryFunc = (
  validValue: string,
  explanation: string
) => () => ({
  check: (v: any) => `${v} === ${JSON.stringify(validValue)}`,
  not: (v: any) => `${v} !== ${JSON.stringify(validValue)}`,
  handleError: (v: any, ctx: any) =>
    `${ctx}.explanations.push(${JSON.stringify(explanation)})`
});
