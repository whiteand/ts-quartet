import { getSimpleCondition } from "./utils";

export const neverRenderer = getSimpleCondition(
  () => `false`,
  () => `true`,
  () => "return false",
  () => ""
);
