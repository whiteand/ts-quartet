/**
 * 04_and_validator.js
 * 
 * Contains examples of and-method usage.
 * 
 * This method has such type: v.and(schema, schema2, ...) => Validator
 */

const { v } = require('quartet') // import { v } from 'quartet'

const checkNotEmptyArray = v.and(
  v.array,
  v.min(1) // v.min with arrays is the same as value => value.length >= 1
) 

checkNotEmptyArray('1')  // false
checkNotEmptyArray(1)    // false
checkNotEmptyArray([])   // false
checkNotEmptyArray([1])  // true
