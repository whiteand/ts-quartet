import { e, ExplanationSchemaType } from '..'
import { getExplanations } from './getExplanations'
import { testValidatorImpure } from './testValidatorImpure'

describe('e.custom', () => {
  test('e(e.arrayOf(e.custom(e(e.number))))', () => {
    const checkNumber = e(e.number)
    const checkArrNumber = e(e.arrayOf(e.custom(checkNumber)))
    testValidatorImpure(
      checkArrNumber,
      [[], [1], [1, 2, 3]],
      [null, false, { length: 1, 0: 1 }, ['1']],
    )
    expect(getExplanations(checkArrNumber, null)).toEqual([
      {
        path: [],
        schema: {
          elementSchema: {
            customValidator: checkNumber,
            innerExplanations: [
              {
                path: [],
                schema: {
                  type: ExplanationSchemaType.Number,
                },
                value: '1',
              },
            ],
            type: ExplanationSchemaType.Custom,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: null,
      },
    ])
    expect(getExplanations(checkArrNumber, false)).toEqual([
      {
        path: [],
        schema: {
          elementSchema: {
            customValidator: checkNumber,
            innerExplanations: [
              {
                path: [],
                schema: {
                  type: ExplanationSchemaType.Number,
                },
                value: '1',
              },
            ],
            type: ExplanationSchemaType.Custom,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: false,
      },
    ])
    expect(getExplanations(checkArrNumber, { length: 1, 0: 1 })).toEqual([
      {
        path: [],
        schema: {
          elementSchema: {
            customValidator: checkNumber,
            innerExplanations: [
              {
                path: [],
                schema: {
                  type: ExplanationSchemaType.Number,
                },
                value: '1',
              },
            ],
            type: ExplanationSchemaType.Custom,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: {
          '0': 1,
          length: 1,
        },
      },
    ])
    expect(getExplanations(checkArrNumber, ['1'])).toEqual([
      {
        path: [0],
        schema: {
          customValidator: checkNumber,
          innerExplanations: [
            {
              path: [],
              schema: {
                type: ExplanationSchemaType.Number,
              },
              value: '1',
            },
          ],
          type: ExplanationSchemaType.Custom,
        },
        value: '1',
      },
    ])
  })
  test('e(e.arrayOf(e.custom(x => typeof x === "number")))', () => {
    const checkNumber = (x: any) => typeof x === 'number'
    const checkArrNumber = e(e.arrayOf(e.custom(checkNumber)))
    testValidatorImpure(
      checkArrNumber,
      [[], [1], [1, 2, 3]],
      [null, false, { length: 1, 0: 1 }, ['1']],
    )
    expect(getExplanations(checkArrNumber, null)).toEqual([
      {
        path: [],
        schema: {
          elementSchema: {
            customValidator: checkNumber,
            innerExplanations: [],
            type: ExplanationSchemaType.Custom,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: null,
      },
    ])
    expect(getExplanations(checkArrNumber, false)).toEqual([
      {
        path: [],
        schema: {
          elementSchema: {
            customValidator: checkNumber,
            innerExplanations: [],
            type: ExplanationSchemaType.Custom,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: false,
      },
    ])
    expect(getExplanations(checkArrNumber, { length: 1, 0: 1 })).toEqual([
      {
        path: [],
        schema: {
          elementSchema: {
            customValidator: checkNumber,
            innerExplanations: [],
            type: ExplanationSchemaType.Custom,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: {
          '0': 1,
          length: 1,
        },
      },
    ])
    expect(getExplanations(checkArrNumber, ['1'])).toEqual([
      {
        path: [0],
        schema: {
          customValidator: checkNumber,
          innerExplanations: [],
          type: ExplanationSchemaType.Custom,
        },
        value: '1',
      },
    ])
  })
})
