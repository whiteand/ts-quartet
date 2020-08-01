const EMPTY: any = {};

export function has(obj: any, key: string | number): boolean {
  if (!obj) {
    return false;
  }
  if (EMPTY[key] !== undefined) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  return obj[key] !== undefined || key in obj;
}

export function arrToDict<T extends string | number | symbol>(
  values: T[]
): { [key in T]: boolean } {
  const res: { [key in T]: boolean } = Object.create(null);

  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    res[value] = true;
  }

  return res;
}

export function getKeyAccessor(key: string | number) {
  if (typeof key === "number" || /^[1-9]\d*$/.test(key)) {
    return `[${key}]`;
  }
  return typeof key === "string" && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)
    ? "." + key
    : `[${JSON.stringify(key)}]`;
}
