import { e as v } from '..'
import { testValidatorWithExplanations } from './testValidatorWithExplanations'
import { ExplanationSchemaType } from '../explanations'

describe('v.array', () => {
  test('v.array', () => {
    testValidatorWithExplanations(
      v(v.array),
      [[], [1, 2, '3']],
      [
        [
          {},
          [
            {
              value: {},
              path: [],
              schema: {
                type: ExplanationSchemaType.Array,
              },
            },
          ],
        ],
        [
          { length: 10 },
          [
            {
              value: { length: 10 },
              path: [],
              schema: {
                type: ExplanationSchemaType.Array,
              },
            },
          ],
        ],
        [
          'Andrew',
          [
            {
              value: 'Andrew',
              path: [],
              schema: {
                type: ExplanationSchemaType.Array,
              },
            },
          ],
        ],
      ],
    )
  })
})
