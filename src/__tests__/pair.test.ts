import { v, e, quartet } from '../index'
import { puretables, snapshot, tables } from './utils'

describe('v.pair', () => {
  test('Pure v.arrayOf', () => {
    const squareNumbers = v(
      v.arrayOf(
        v.pair(
          v.and(
            {
              value: v.number,
              key: v.number,
            },
            v.custom(
              ({ key, value }: { key: number; value: any }) => value === key * key,
            ),
          ),
        ),
      ),
    )

    snapshot(squareNumbers)

    puretables(squareNumbers, [[], [0], [0, 1], [0, 1, 4]], [[1], [0, 2], [0, 1, 3]])
  })
  test('Pure v.arrayOf in complex', () => {
    const squareNumbers = v(
      v.arrayOf(
        v.and(
          v.number,
          v.pair(
            v.and(
              {
                value: v.number,
                key: v.number,
              },
              v.custom(
                ({ key, value }: { key: number; value: any }) => value === key * key,
              ),
            ),
          ),
        ),
      ),
    )

    snapshot(squareNumbers, true)

    puretables(squareNumbers, [[], [0], [0, 1], [0, 1, 4]], [[1], [0, 2], [0, 1, 3]])
  })
  test('Impure v.arrayOf', () => {
    const squareNumbers = v(
      v.arrayOf(
        v.pair(
          v.and(
            {
              value: v.number,
              key: v.number,
            },
            v.custom(
              ({ key, value }: { key: number; value: any }) => value === key * key,
              (value: any) => value,
            ),
          ),
        ),
      ),
    )

    snapshot(squareNumbers)

    tables(
      squareNumbers,
      [[], [0], [0, 1], [0, 1, 4]],
      [
        [[1], [{ key: 0, value: 1 }]],
        [[0, 2], [{ key: 1, value: 2 }]],
        [[0, 1, 3], [{ key: 2, value: 3 }]],
      ],
    )
  })
  test('Pure v.rest', () => {
    const validGender = ['male', 'female']
    const checkGenderDictionary = v({
      [v.rest]: v.pair({ key: validGender, value: v.number }),
    })

    snapshot(checkGenderDictionary)

    puretables(
      checkGenderDictionary,
      [{}, { male: 170 }, { female: 160 }, { male: 170, female: 160 }],
      [{ a: 123 }, { male: 170, female: 160, another: 32 }],
    )
  })
  test('Pure v.rest with another props', () => {
    const validGender = ['male', 'female']
    const checkGenderDictionary = v({
      id: v.string,
      [v.rest]: v.pair({ key: validGender, value: v.number }),
    })

    snapshot(checkGenderDictionary)

    puretables(
      checkGenderDictionary,
      [
        { id: 'id' },
        { id: 'id', male: 170 },
        { id: 'id', female: 160 },
        { id: 'id', male: 170, female: 160 },
      ],
      [
        { a: 123 },
        { male: 170 },
        { id: 1, male: 170 },
        { male: 170, female: 160, another: 32 },
      ],
    )
  })
  test('Impure v.rest', () => {
    const validGender = ['male', 'female']
    const checkGenderDictionary = v({
      [v.rest]: v.pair(
        v.custom(
          ({ key, value }: { key: any; value: any }) => {
            return validGender.includes(key) && typeof value === 'number'
          },
          (value: any) => value,
        ),
      ),
    })

    snapshot(checkGenderDictionary)

    tables(
      checkGenderDictionary,
      [{}, { male: 170 }, { female: 160 }, { male: 170, female: 160 }],
      [
        [{ a: 123 }, [{ key: 'a', value: 123 }]],
        [{ male: 170, female: 160, another: 32 }, [{ key: 'another', value: 32 }]],
      ],
    )
  })
  test('Impure v.rest with another props', () => {
    const validGender = ['male', 'female']
    const checkGenderDictionary = v({
      id: v.string,
      [v.rest]: v.pair(
        v.custom(
          ({ key, value }: { key: any; value: any }) => {
            return validGender.includes(key) && typeof value === 'number'
          },
          (value: any) => value,
        ),
      ),
    })

    snapshot(checkGenderDictionary)

    tables(
      checkGenderDictionary,
      [
        { id: 'id' },
        { id: 'id', male: 170 },
        { id: 'id', female: 160 },
        { id: 'id', male: 170, female: 160 },
      ],
      [
        [{ a: 123 }, []],
        [{ id: '123', a: 123 }, [{ key: 'a', value: 123 }]],
        [{ male: 170 }, []],
        [{ id: 1, male: 170 }, []],
        [
          { id: '123', male: 170, female: 160, another: 32 },
          [{ key: 'another', value: 32 }],
        ],
      ],
    )
  })
  test('wrong usage', () => {
    expect(() => v(v.pair({}))).toThrowErrorMatchingInlineSnapshot(
      `"Wrong usage of v.pair"`,
    )
    expect(() => v({ a: v.pair({}) })).toThrowErrorMatchingInlineSnapshot(
      `"Wrong usage of v.pair"`,
    )
    expect(() => v([v.number, v.pair({})])).toThrowErrorMatchingInlineSnapshot(
      `"Wrong usage of v.pair"`,
    )
  })
})
