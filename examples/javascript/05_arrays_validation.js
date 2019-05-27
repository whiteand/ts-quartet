/**
 * 05_arrays_validation.js
 * 
 * Contains examples of arrays-validation.
 * 
 * Almost most usable method is v.arrayOf(elementSchema) => Validator of Array
 */

const { v } = require('quartet') // import { v } from 'quartet'

const checkArrayOfNumber = v.arrayOf(v.number)

checkArrayOfNumber(1)         // false, because 1 is not an array
checkArrayOfNumber('1')       // false, because '1' is not an array
checkArrayOfNumber([])        // true
checkArrayOfNumber([1,2,3])   // true
checkArrayOfNumber([1,2,'3']) // false, because '3' is not a number

const checkArrayOfPersons = v.arrayOf({
  id: v.string,
  age: v.and(v.positive, v.safeInteger),
  isMale: v.boolean
})

checkArrayOfPersons([]) // true
checkArrayOfPersons([   // true
  { id: '1', age: 22, isMale: true },
  { id: '2', age: 12, isMale: false },
  { id: '3', age: 32, isMale: true },
  { id: '4', age: 15, isMale: true },
  { id: '5', age: 13, isMale: false },
  { id: '6', age: 18, isMale: false },
])

checkArrayOfPersons([   // false, because second person age is 12.5 - is not integer
  { id: '1', age: 22, isMale: true },
  { id: '2', age: 12.5, isMale: false },
  { id: '3', age: 32, isMale: true },
  { id: '4', age: 15, isMale: true },
  { id: '5', age: 13, isMale: false },
  { id: '6', age: 18, isMale: false },
])