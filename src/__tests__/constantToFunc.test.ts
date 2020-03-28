import { constantToFunc } from '../constantToFunc'
import { primitives } from './mocks'

describe('constantToFunc', () => {
    test('works', () => {
        for (const primitive of primitives) {
            const funcRes = constantToFunc(primitive)()
            expect(funcRes.check('value', 'validator')).toMatchSnapshot()
            expect(funcRes.handleError && funcRes.handleError('value', 'validator')).toMatchSnapshot()
            expect(funcRes.not && funcRes.not('value', 'validator')).toMatchSnapshot()
            expect(funcRes.prepare && (() => { const ctx: any = {}; funcRes.prepare(ctx); return ctx})()).toMatchSnapshot()
        }
    })
})
