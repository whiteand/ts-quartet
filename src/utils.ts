const EMPTY: any = {}

export function has(obj: any, key: string | number): boolean {
  if (obj == null) {
    return false
  }
  if (EMPTY[key] !== undefined) {
    return Object.prototype.hasOwnProperty.call(obj, key)
  }
  return obj[key] !== undefined || key in obj
}

export function arrToDict<T extends string | number | symbol>(
  values: T[],
): { [key in T]: boolean } {
  const res: { [key in T]: boolean } = Object.create(null)

  for (let i = 0; i < values.length; i++) {
    const value = values[i]
    res[value] = true
  }

  return res
}

const isSimplePropRegex = /^[a-zA-Z_][_a-zA-Z0-9]*$/
export function getAccessor(prop: string | number) {
  if (typeof prop === 'number') {
    return `[${prop}]`
  }
  if (!isSimplePropRegex.test(prop)) {
    return `[${JSON.stringify(prop)}]`
  }
  return `.${prop}`
}
export function getAccessorWithAlloc(
  prop: string | number,
  alloc: (varName: string, initialValue: any, singleton?: boolean) => string,
) {
  if (typeof prop === 'number') {
    if (Number.isSafeInteger(prop)) {
      return `[${prop}]`
    }
    const propVar = alloc('c', prop)
    return `[${propVar}]`
  }
  if (!isSimplePropRegex.test(prop)) {
    return `[${JSON.stringify(prop)}]`
  }
  return `.${prop}`
}
