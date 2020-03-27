import { IContext } from "./types";

let toContextCounter: Record<string, number> = {};
export const toContext = (
  prefix: string | number,
  value: any,
  withoutPostfix: boolean = false
) => {
  if (!toContextCounter[prefix]) {
    toContextCounter[prefix] = 0;
  }
  let id =
    withoutPostfix || toContextCounter[prefix] === 0
      ? prefix
      : `${prefix}-${toContextCounter[prefix]}`;
  if (id === 'explanations' || id === 'pure') {
    id = `${prefix}-${toContextCounter[prefix]}`
  }
  toContextCounter[prefix]++;
  return [
    id,
    (ctx: IContext) => {
      ctx[id] = value;
    }
  ] as [string, (ctx: IContext) => void];
};

export const clearContextCounters = () => {
  toContextCounter = {};
};
