export function getKeyAccessor(key: string) {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)
    ? "." + key
    : `[${JSON.stringify(key)}]`;
}
