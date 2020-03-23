import { IContext } from "./types";

const toContextCounter: Record<string, number> = {};
export const toContext = (
  prefix: string | number,
  value: any,
  withoutPostfix: boolean = false
) => {
  if (!toContextCounter[prefix]) {
    toContextCounter[prefix] = 0;
  }
  const id = withoutPostfix
    ? prefix
    : `${prefix}-${toContextCounter[prefix]++}`;

  toContextCounter[prefix] %= 1e9;
  return [
    id,
    (ctx: IContext) => {
      ctx[id] = value;
    }
  ] as [string, (ctx: IContext) => void];
};
