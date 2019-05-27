/**
 * 01_simple_validators.js
 * 
 * Contains examples of simplest validation functions.
 * 
 * These functions only return true/false if value is valid/invalid. That's all
 * 
 * They are used in more complicated schemas of validation. But can be used separately as simple validators.
 */

// import v - pre-created instance of quartet.
const { v } = require('quartet') // import { v } from 'quartet'

// v.number is the same as
// value => typeof value === 'number'

v.number(1)   // true
v.number('1') // false

// v.string is the same as
// value => typeof value === 'string'

v.string(1)   // false
v.string('1') // true

// v.boolean is the same as
// value => typeof value === 'boolean'

v.boolean(1)     // false
v.boolean(true)  // true
v.boolean(false) // true

// v.positive is the same as
// value => typeof value === 'number' && value > 0

v.positive(1)  // true
v.positive(0)  // false
v.positive(-1) // false

// v.nonNegative is the same as
// value => typeof value === 'number' && value >= 0

v.nonNegative(1)  // true
v.nonNegative(0)  // true
v.nonNegative(-1) // false

// v.negative is the same as
// value => typeof value === 'number' && value < 0

v.negative(1)  // false
v.negative(0)  // false
v.negative(-1) // true

// v.nonPositive is the same as
// value => typeof value === 'number' && value <= 0

v.nonPositive(1)  // false
v.nonPositive(0)  // true
v.nonPositive(-1) // true

// v.safeInteger is the same as
// value => Number.isSafeInteger(value)

v.safeInteger(1)         // true
v.safeInteger(1.5)       // false
v.safeInteger(NaN)       // false
v.safeInteger(Infinity)  // false
v.safeInteger(-Infinity) // false

// v.array is the same as
// value => Array.isArray(value)

v.array([])              // true
v.array([1])             // true
v.array(1)               // false
v.array({ a: 1 })        // false
v.array({ length: 100 }) // false