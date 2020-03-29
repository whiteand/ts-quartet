import { IContext, ToContext } from "./types";

export const getContextControllers = (): [ToContext, () => void] => {
  let toContextCounter: Record<string, number> = {};
  const toContext: ToContext = (prefix, value, withoutPostfix = false) => {
    if (!toContextCounter[prefix]) {
      toContextCounter[prefix] = 0;
    }
    let id =
      withoutPostfix || toContextCounter[prefix] === 0
        ? prefix
        : `${prefix}-${toContextCounter[prefix]}`;
    if (id === "explanations" || id === "pure") {
      id = `${prefix}-${toContextCounter[prefix]}`;
    }
    toContextCounter[prefix]++;
    return [
      id.toString(),
      (ctx: IContext) => {
        ctx[id] = value;
      }
    ];
  };

  const clearContextCounters = () => {
    toContextCounter = {};
  };
  return [toContext, clearContextCounters];
};
