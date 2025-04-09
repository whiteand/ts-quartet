/**
 * 04_and_validator.js
 *
 * Contains examples of and-method usage.
 *
 * This method has such type: v.and(schema, schema2, ...) => Validator
 */

import { v } from "quartet"; // const { v } = require('quartet')

const checkNotEmptyArray = v(v.and(v.array, v.minLength(1)));

checkNotEmptyArray("1"); // false
checkNotEmptyArray(1); // false
checkNotEmptyArray([]); // false
checkNotEmptyArray([1]); // true
