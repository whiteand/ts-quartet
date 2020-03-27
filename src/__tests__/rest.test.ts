import { v } from '../index'
import { snapshot, tables, puretables } from './utils'
import { funcSchemaWithNotHandleError, funcSchemaWithNot } from './mocks'

describe('v.rest', () => {
    test('00. v({ [v.rest]: funcSchemaWithNot })', () => {
        const validator = v({ [v.rest]: funcSchemaWithNot })
        expect(validator.pure).toBe(true)
        snapshot(validator)
        puretables(validator, [{}, { a: 2, b: 4, toString: 6}], [{ a: 1}, {a: 2, c: 1}])
    })
    test('01. v({ [v.rest]: funcSchemaWithNotHandleError })', () => {
        const validator = v({ [v.rest]: funcSchemaWithNotHandleError })
        expect(validator.pure).toBe(false)
        snapshot(validator)
        tables(validator, [], [])
        // TODO: Check this out
    })
    test('02. v({ a: 42, [v.rest]: funcSchemaWithNot })', () => {
        const validator = v({ a: 42, [v.rest]: funcSchemaWithNot })
        expect(validator.pure).toBe(true)
        snapshot(validator)
        tables(validator, [], [])
        // TODO: Check this out
    })
    test('03. v({ a: 42 [v.rest]: funcSchemaWithNotHandleError })', () => {
        const validator = v({ a: 42, [v.rest]: funcSchemaWithNotHandleError })
        expect(validator.pure).toBe(false)
        snapshot(validator)
        tables(validator, [], [])
        // TODO: Check this out
    })
    test('04. v({ a: funcSchemaWithNotHandleError, [v.rest]: funcSchemaWithNot })', () => {
        const validator = v({ a: funcSchemaWithNotHandleError, [v.rest]: funcSchemaWithNot })
        expect(validator.pure).toBe(false)
        snapshot(validator)
        tables(validator, [], [])
        // TODO: Check this out
    })
    test('05. v({ a: funcSchemaWithNotHandleError, [v.rest]: funcSchemaWithNotHandleError })', () => {
        const validator = v({ a: funcSchemaWithNotHandleError, [v.rest]: funcSchemaWithNotHandleError })
        expect(validator.pure).toBe(false)
        snapshot(validator)
        tables(validator, [], [])
        // TODO: Check this out
    })
})
