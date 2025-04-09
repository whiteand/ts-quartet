/**
 * 01_simple_validators.js
 *
 * Contains examples of simplest validations.
 *
 * They are used within other schemas of validation
 */

// import v - pre-created instance of quartet.
import { v } from "quartet"; // const { v } = require('quartet')

// v.number - schema to check if value is a number

const isNumber = v(v.number);
// const isNumber = x => typeof x === 'number'

isNumber(1); // true
isNumber("1"); // false

// v.string - schema to check if value is a string
const isString = v(v.string);
// const isString = x => typeof x === 'string'
isString(1); // false
isString("1"); // true

// v.boolean - schema to check if value is a boolean value
const isBoolean = v(v.boolean);
// const isBoolean = x => typeof x === 'boolean'
isBoolean(1); // false
isBoolean(true); // true
isBoolean(false); // true

// v.positive is the same as
const isPositiveNumber = v(v.positive);
// equivalents:
//   const isPositiveNumber = n => n > 0
//   const isPositiveNumber = v(v.min(0, true))

isPositiveNumber(1); // true
isPositiveNumber(0); // false
isPositiveNumber(-1); // false

// v.negative is the same as
// value => typeof value === 'number' && value < 0

const isNegativeNumber = v(v.negative);
// equivalents:
//   const isNegativeNumber = n => n < 0
//   const isNegativeNumber = v(v.max(0, true))
isNegativeNumber(1); // false
isNegativeNumber(0); // false
isNegativeNumber(-1); // true

// v.safeInteger is the same as
const isSafeInteger = v(v.safeInteger);
// const isSafeInteger x => Number.isSafeInteger(x)
isSafeInteger(1); // true
isSafeInteger(1.5); // false
isSafeInteger(NaN); // false
isSafeInteger(Infinity); // false
isSafeInteger(-Infinity); // false
