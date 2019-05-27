/**
 * 03_object_validation.js
 * 
 * Contains examples of idea of object validators.
 * 
 * One of the main ideas of quartet was that schema of the object validation must be an object.
 * 
 * ObjectSchema = {
 *  prop: propSchema,
 *  prop2: propSchema2,
 *  ...,
 *  [v.rest]: otherPropsSchema
 * }
 */

const { v } = require('quartet') // import { v } from 'quartet'

// One prop

const checkUser = v({
  id: v.string
})

checkUser(null)         // false
checkUser({})           // false
checkUser({ id: 42 })   // false
checkUser({ id: '42' }) // true

// Many props

const checkAgedUser = v({
  id: v.string,
  age: v.number,
  isMale: v.boolean
})

checkAgedUser(undefined)                              // false, undefined cannot have properties
checkAgedUser({})                                     // false, id, age, isMale are undefined
checkAgedUser({ id: '1' })                            // false, age and isMale are undefined
checkAgedUser({ id: 1,   age: 22,   isMale: true })   // false, id is not a string
checkAgedUser({ id: '1', age: '22', isMale: true })   // false, age is not a number
checkAgedUser({ id: '1', age: 22,   isMale: 'true' }) // false, isMale is not a boolean
checkAgedUser({ id: '1', age: 22,   isMale: true })   // true

// Other props

const checkPhoneBook = v({
  phoneBookAuthorId: v.number,
  [v.rest]: v.string // all others fields must be strings
})

const validPhoneBook = {
  phoneBookAuthorId: 42,
  andrew: '097-500-7475',
  bohdan: '063-300-1010',
  taras: '044-332-55'
}

checkPhoneBook(validPhoneBook) // true

checkPhoneBook({
  phoneBookAuthorId: '123',
  andrew: '097-500-7475',
  bohdan: '063-300-1010',
  taras: '044-332-55'
}) // false, because phoneBookAuthorId is not a number

checkPhoneBook({
  phoneBookAuthorId: 123,
  andrew: null,
  bohdan: '063-300-1010',
  taras: '044-332-55'
}) // false, because andrew: null


