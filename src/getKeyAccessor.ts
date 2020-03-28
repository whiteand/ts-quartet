export function getKeyAccessor(key: string | number) {
  if (typeof key === "number" || /^[1-9]\d*$/.test(key)) {
    return `[${key}]`;
  }
  return typeof key === "string" && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)
    ? "." + key
    : `[${JSON.stringify(key)}]`;
}
