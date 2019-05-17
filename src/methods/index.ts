export interface IMethods {
  array: Validator;
  finite: Validator;
  number: Validator;
  safeInteger: Validator;
  string: Validator;
}
export const methods: IMethods = {
  array: (value): value is any[] => Array.isArray(value),
  finite: (value): value is number => Number.isFinite(value),
  number: (value): value is number => typeof value === "number",
  safeInteger: (value): value is number => Number.isSafeInteger(value),
  string: (value): value is string => typeof value === "string"
};
