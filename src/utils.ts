const EMPTY: any = {};

export function has(obj: any, key: string | number): boolean {
  if (obj == null) {
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
