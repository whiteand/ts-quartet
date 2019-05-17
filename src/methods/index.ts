import { doExplanations } from '../doExplanation';
import { InstanceSettings, Validator } from "../types";
import { REST } from "./../symbols";

type FromSettings<T = any> = (settings: InstanceSettings) => T

export interface IMethods {
  array: Validator;
  finite: Validator;
  number: Validator;
  safeInteger: Validator;
  string: Validator;
  rest: string;
}

const getExplain = (settings: InstanceSettings) => (check: Validator): Validator => {
  const res: Validator = (value, explanations, parents) => {
    const isValid = check(value)
    if (isValid) { return true }
    doExplanations(value, getRes(), settings, parents || [], undefined, explanations)
    return false
  }
  function getRes() { return res }
  return res

}

export const getMethods: FromSettings<IMethods> = settings => {
  const explain = getExplain(settings)
  const methods = {
    array: explain((value) => Array.isArray(value)),
    finite: explain((value) => Number.isFinite(value)),
    number: explain((value) => typeof value === "number"),
    rest: REST,
    safeInteger: explain((value) => Number.isSafeInteger(value)),
    string: explain((value) => typeof value === "string")
  }
  return methods
}
