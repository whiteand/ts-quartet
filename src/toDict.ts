export function toDict(
  list: (string | symbol)[]
): Record<string | symbol, true> {
  let res: Record<string | symbol, true> = {};
  for (let i = 0; i < list.length; i++) {
    (res as any)[list[i]] = true;
  }
  return res;
}
