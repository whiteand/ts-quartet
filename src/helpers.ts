export const has = (value: any, propName: string) => {
  return value && Object.prototype.hasOwnProperty.call(value, propName);
};
