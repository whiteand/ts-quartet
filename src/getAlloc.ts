import { Z } from "./types";
import { getAccessor } from "./utils";

export function getAlloc(context: Record<string, Z>, contextVar: string) {
  const prefixesCounters: Record<string, number> = {};

  return (prefix: string, initialValue: Z, singleton?: boolean) => {
    if (!prefixesCounters[prefix]) {
      context[prefix] = initialValue;
      prefixesCounters[prefix] = 1;
      return `${contextVar}${getAccessor(prefix)}`;
    }
    if (singleton) {
      if (context[prefix] !== initialValue) {
        throw new Error("Wrong singleton usage");
      }
      return `${contextVar}${getAccessor(prefix)}`;
    }
    const newCounter = prefixesCounters[prefix] + 1;
    const newAddress = `${prefix}_${newCounter}`;
    prefixesCounters[prefix]++;
    context[newAddress] = initialValue;
    return `${contextVar}${getAccessor(newAddress)}`;
  };
}
