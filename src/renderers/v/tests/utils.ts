export function mockAlloc(initialValue: any = null, prefix: string = "var") {
  const suffix =
    initialValue == null
      ? initialValue === undefined
        ? "undefined"
        : "null"
      : JSON.stringify(initialValue);
  return `_${prefix}_${suffix}`;
}
