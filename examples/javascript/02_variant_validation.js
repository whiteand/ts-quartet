/**
 * 02_variant_validation.js
 *
 * Contains examples of idea of variant validations.
 *
 * VariantSchema = [schema1, schema2, schema3, ...]
 *
 * When instance of quartet(means `v`) takes the array it will create validator that will
 * return true if value is valid by **one of** these schemas.
 *
 * See examples below.
 */

import { v } from "quartet"; // const { v } = require('quartet')

const checkNumberOrString = v([v.number, v.string]); // validator of (string | number)

checkNumberOrString(1); // true
checkNumberOrString("1"); // true
checkNumberOrString(true); // false

const checkNumberOrStringOrBoolean = v([v.number, v.string, v.boolean]); // validator of (string | number | boolean)

checkNumberOrStringOrBoolean(1); // true
checkNumberOrStringOrBoolean("1"); // true
checkNumberOrStringOrBoolean(true); // true
checkNumberOrStringOrBoolean([]); // false

// Example for empty array schema: there is no any schema that will show that value is valid
const checkNothing = v([]); // The same as () => false, it means that nothing is valid
checkNothing(1); // false
checkNothing("1"); // false
checkNothing(true); // false

// Example of array schema with one element
const checkNumber = v([v.number]); // The same as v.number (as well as value => typeof value === 'number')

checkNumber(1); // true
checkNumber("1"); // false
