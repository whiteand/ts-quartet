import { GetFromSettings } from "../types";

export const getArrayValidator: GetFromSettings = () => value =>
  Array.isArray(value);
