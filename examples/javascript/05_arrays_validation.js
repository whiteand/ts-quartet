/**
 * 05_arrays_validation.js
 *
 * Contains examples of arrays-validation.
 *
 * Almost most usable method is v.arrayOf(elementSchema) => Validator of Array
 */

import { v } from "quartet"; // const { v } = require('quartet')

const checkArrayOfNumber = v(v.arrayOf(v.number)); // same as v.compileArrayOf(v.number)

checkArrayOfNumber(1); // false, because 1 is not an array
checkArrayOfNumber("1"); // false, because '1' is not an array
checkArrayOfNumber([]); // true
checkArrayOfNumber([1, 2, 3]); // true
checkArrayOfNumber([1, 2, "3"]); // false, because '3' is not a number

// same as v(v.arrayOf({...}))
const checkArrayOfPersons = v.compileArrayOf({
  id: v.string,
  age: v.and(v.positive, v.safeInteger),
  isMale: v.boolean,
});

checkArrayOfPersons([]); // true
checkArrayOfPersons([
  // true
  { id: "1", age: 22, isMale: true },
  { id: "2", age: 12, isMale: false },
  { id: "3", age: 32, isMale: true },
  { id: "4", age: 15, isMale: true },
  { id: "5", age: 13, isMale: false },
  { id: "6", age: 18, isMale: false },
]);

checkArrayOfPersons([
  // false, because second person age is 12.5 - is not integer
  { id: "1", age: 22, isMale: true },
  { id: "2", age: 12.5, isMale: false },
  { id: "3", age: 32, isMale: true },
  { id: "4", age: 15, isMale: true },
  { id: "5", age: 13, isMale: false },
  { id: "6", age: 18, isMale: false },
]);
