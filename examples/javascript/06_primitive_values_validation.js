/**
 * 06_primitive_values_validation.js
 * 
 * Sometimes we know all the valid values of primitive types(number, string, boolean, symbol, undefined, null)
 * 
 * When we want to validate them we can use them in the schema
 */

const { v } = require('quartet') // import { v } from 'quartet'

const check42 = v(42)
check42(1)    // false
check42('42') // false
check42(42)   // true

const checkIsGoodNumber = v([3, 7, 12])

checkIsGoodNumber(3)  // true
checkIsGoodNumber(7)  // true
checkIsGoodNumber(12) // true
checkIsGoodNumber(42) // false

const checkSex = v(['male', 'female'])

checkSex('male')   // true
checkSex('female') // true
checkSex(null)     // false

const checkTrue = v(true)

checkTrue(true)   // true
checkTrue('true') // false
checkTrue(false)  // false

const USER_STATUSES = {
  VERIFIED: 'VERIFIED',
  NON_VERIFIED: 'NON_VERIFIED',
  ADMIN: 'ADMIN'
}

const ENGLISH_SKILL_LEVEL = {
  BEGINNER: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2
}

const checkUser = v({
  name: v.string,
  age: v.and(v.positive, v.safeInteger),
  sex: ['male', 'female'],
  status: Object.values(USER_STATUSES),
  englishSkillLevel: Object.values(ENGLISH_SKILL_LEVEL),
  house: [
    null,
    { address: v.string }
  ] // null if user has not house, or object with house info
})

checkUser({
  name: 'Andrew', // is string
  age: 22, // is positive integer
  sex: 'male', // is one of ['male', 'female']
  status: 'ADMIN', // is one of ['VERIFIED', 'NON_VERIFIED', 'ADMIN']
  englishSkillLevel: 1, // is one of [1,2,3]
  house: null // house absent, but valid
}) // true

checkUser({
  name: 'Andrew',
  age: 22,
  sex: 'male',
  status: 'ADMIN',
  englishSkillLevel: 1,
  house: { // house present and valid
    address: 'st. Yanhelya, 5'
  }
}) // true

checkUser({
  name: 'Andrew', 
  age: 22,
  sex: 'male', 
  status: 'ADMIN', 
  englishSkillLevel: 1,
  house: { 
    address: 123 // invalid
  }
}) // false


checkUser({
  name: 'Andrew',
  age: 22.5, // is not an integer
  sex: 'male',
  status: 'NON_VERIFIED',
  englishSkillLevel: 1,
  house: null
}) // => false

checkUser({
  name: 'Andrew',
  age: 22,
  sex: 'male',
  status: 'NON_VERIFIED',
  englishSkillLevel: 3 // invalid english skill level
}) // => false

checkUser({
  name: 'Andrew',
  age: 22,
  sex: 'male',
  status: 'NON_VERIFIED',
  englishSkillLevel: 3 // invalid english skill level
}) // => false