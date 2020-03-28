const EMPTY: any = {};
export function has(obj: any, key: any) {
  if (!obj) {
    return false;
  }
  if (EMPTY[key] !== undefined) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  return obj[key] !== undefined || key in obj;
}
