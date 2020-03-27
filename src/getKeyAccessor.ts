export function getKeyAccessor(key: string | number) {
  return typeof key === 'string' && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)
    ? "." + key
    : `[${JSON.stringify(key)}]`;
}
