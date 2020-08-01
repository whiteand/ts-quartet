import { getSimpleCondition } from "./utils";

export const anyRenderer = getSimpleCondition(
  () => `true`,
  () => `false`,
  () => "",
  () => "return true"
);
