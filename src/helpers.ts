const empty: any = {};

export const has = (value: any, propName: string) => {
  return value && empty[propName] !== undefined
    ? Object.prototype.hasOwnProperty.call(value, propName)
    : value[propName] !== undefined || propName in value;
};
