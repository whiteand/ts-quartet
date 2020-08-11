import { e as v, ExplanationSchemaType } from '..'
import { getExplanations } from './getExplanations'
import { testValidatorImpure } from './testValidatorImpure'

describe('v.min, v.max, v.minLength, v.maxLength', () => {
  test('v.min', () => {
    const checkNonNegative = v(v.min(0))
    testValidatorImpure(
      checkNonNegative,
      [0, 1, 2, 3.1415926, Infinity, [0], ['0']],
      [-1, '-1', [-1]],
    )
    expect(getExplanations(checkNonNegative, -1)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          minValue: 0,
          type: ExplanationSchemaType.Min,
        },
        value: -1,
      },
    ])
    expect(getExplanations(checkNonNegative, '-1')).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          minValue: 0,
          type: ExplanationSchemaType.Min,
        },
        value: '-1',
      },
    ])
    expect(getExplanations(checkNonNegative, [-1])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          minValue: 0,
          type: ExplanationSchemaType.Min,
        },
        value: [-1],
      },
    ])
  })
  test('v.min exclusive', () => {
    const checkPositive = v(v.min(0, true))
    testValidatorImpure(
      checkPositive,
      [1, 2, 3.1415926, Infinity, [1], '1', ['1']],
      [0, -1, '-1', [-1], [0], ['0']],
    )
    expect(getExplanations(checkPositive, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minValue: 0,
          type: ExplanationSchemaType.Min,
        },
        value: 0,
      },
    ])
    expect(getExplanations(checkPositive, -1)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minValue: 0,
          type: ExplanationSchemaType.Min,
        },
        value: -1,
      },
    ])
    expect(getExplanations(checkPositive, '-1')).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minValue: 0,
          type: ExplanationSchemaType.Min,
        },
        value: '-1',
      },
    ])
    expect(getExplanations(checkPositive, [-1])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minValue: 0,
          type: ExplanationSchemaType.Min,
        },
        value: [-1],
      },
    ])
    expect(getExplanations(checkPositive, [0])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minValue: 0,
          type: ExplanationSchemaType.Min,
        },
        value: [0],
      },
    ])
    expect(getExplanations(checkPositive, ['0'])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minValue: 0,
          type: ExplanationSchemaType.Min,
        },
        value: ['0'],
      },
    ])
  })
  test('v.max', () => {
    const checkNonPositive = v(v.max(0))
    testValidatorImpure(
      checkNonPositive,
      [0, -1, -2, -3.1415926, -Infinity, [0], ['0']],
      [1, '1', [1]],
    )
    expect(getExplanations(checkNonPositive, 1)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          maxValue: 0,
          type: ExplanationSchemaType.Max,
        },
        value: 1,
      },
    ])
    expect(getExplanations(checkNonPositive, '1')).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          maxValue: 0,
          type: ExplanationSchemaType.Max,
        },
        value: '1',
      },
    ])
    expect(getExplanations(checkNonPositive, [1])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          maxValue: 0,
          type: ExplanationSchemaType.Max,
        },
        value: [1],
      },
    ])
  })
  test('v.max exclusive', () => {
    const checkNegative = v(v.max(0, true))
    testValidatorImpure(
      checkNegative,
      [-1, -2, -3.1415926, -Infinity, [-1], '-1', ['-1']],
      [0, 1, '1', [0], ['0']],
    )
    expect(getExplanations(checkNegative, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          maxValue: 0,
          type: ExplanationSchemaType.Max,
        },
        value: 0,
      },
    ])
    expect(getExplanations(checkNegative, 1)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          maxValue: 0,
          type: ExplanationSchemaType.Max,
        },
        value: 1,
      },
    ])
    expect(getExplanations(checkNegative, '1')).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          maxValue: 0,
          type: ExplanationSchemaType.Max,
        },
        value: '1',
      },
    ])
    expect(getExplanations(checkNegative, [0])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          maxValue: 0,
          type: ExplanationSchemaType.Max,
        },
        value: [0],
      },
    ])
    expect(getExplanations(checkNegative, ['0'])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          maxValue: 0,
          type: ExplanationSchemaType.Max,
        },
        value: ['0'],
      },
    ])
  })
  test('v.minLength', () => {
    const validator = v(v.minLength(2))
    testValidatorImpure(
      validator,
      ['ab', [1, 2], { length: 3 }],
      ['a', [1], {}, null, undefined, false, true],
    )
    expect(getExplanations(validator, 'a')).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: 'a',
      },
    ])
    expect(getExplanations(validator, [1])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: [1],
      },
    ])
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: {},
      },
    ])
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: null,
      },
    ])
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: undefined,
      },
    ])
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: false,
      },
    ])
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: true,
      },
    ])
  })
  test('v.minLength exclusive', () => {
    const checkThreePlusLength = v(v.minLength(2, true))
    testValidatorImpure(
      checkThreePlusLength,
      ['abc', [1, 2, 3], { length: 3 }],
      ['ab', [1, 2], 'a', [1], {}, null, undefined, false, true],
    )
    expect(getExplanations(checkThreePlusLength, 'ab')).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: 'ab',
      },
    ])
    expect(getExplanations(checkThreePlusLength, [1, 2])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: [1, 2],
      },
    ])
    expect(getExplanations(checkThreePlusLength, 'a')).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: 'a',
      },
    ])
    expect(getExplanations(checkThreePlusLength, [1])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: [1],
      },
    ])
    expect(getExplanations(checkThreePlusLength, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: {},
      },
    ])
    expect(getExplanations(checkThreePlusLength, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: null,
      },
    ])
    expect(getExplanations(checkThreePlusLength, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: undefined,
      },
    ])
    expect(getExplanations(checkThreePlusLength, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: false,
      },
    ])
    expect(getExplanations(checkThreePlusLength, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          minLength: 2,
          type: ExplanationSchemaType.MinLength,
        },
        value: true,
      },
    ])
  })
  test('v.maxLength', () => {
    const checkTwoMinusLength = v(v.maxLength(2))
    testValidatorImpure(
      checkTwoMinusLength,
      ['ab', [1, 2], 'a', [1]],
      ['abc', [1, 2, 3], { length: 3 }, {}, null, undefined, false, true],
    )
    expect(getExplanations(checkTwoMinusLength, 'abc')).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: 'abc',
      },
    ])
    expect(getExplanations(checkTwoMinusLength, [1, 2, 3])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: [1, 2, 3],
      },
    ])
    expect(getExplanations(checkTwoMinusLength, { length: 3 })).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: {
          length: 3,
        },
      },
    ])
    expect(getExplanations(checkTwoMinusLength, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: {},
      },
    ])
    expect(getExplanations(checkTwoMinusLength, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: null,
      },
    ])
    expect(getExplanations(checkTwoMinusLength, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: undefined,
      },
    ])
    expect(getExplanations(checkTwoMinusLength, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: false,
      },
    ])
    expect(getExplanations(checkTwoMinusLength, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: false,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: true,
      },
    ])
  })
  test('v.maxLength exclusive', () => {
    const validator = v(v.maxLength(2, true))
    testValidatorImpure(
      validator,
      ['a', [1]],
      ['ab', [1, 2], { length: 3 }, {}, null, undefined, false, true],
    )
    expect(getExplanations(validator, 'ab')).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: 'ab',
      },
    ])
    expect(getExplanations(validator, [1, 2])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: [1, 2],
      },
    ])
    expect(getExplanations(validator, { length: 3 })).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: {
          length: 3,
        },
      },
    ])
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: {},
      },
    ])
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: null,
      },
    ])
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: undefined,
      },
    ])
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: false,
      },
    ])
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          isExclusive: true,
          maxLength: 2,
          type: ExplanationSchemaType.MaxLength,
        },
        value: true,
      },
    ])
  })
})
