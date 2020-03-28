export function toDict(
  list: Array<string | symbol>
): Record<string | symbol, true> {
  const res: Record<string | symbol, true> = {};
  // tslint:disable-next-line
  for (let i = 0; i < list.length; i++) {
    (res as any)[list[i]] = true;
  }
  return res;
}
