/**
 * 10_full_flow.js
 * 
 * This file contains little example of full flow of api request with validation
 */


// obj is pre-created instance quartet with explanations of errors
const { obj: v } = require('quartet') // import { obj as v } from 'quartet'

const checkUser = v({
  id: v.number,
  name: v.string,
  age: v.and(v.positive, v.safeInteger),
  sex: ['male', 'female'],
  house: [null, { address: v.string }],
  hasWord: v.boolean
})


// Function that will validate response from fetcher and returns valid response
const safeFetchUser = async (fetcher, userId) => {
  // Validation of input value
  if (!v.number(userId)) {
    throw new TypeError('userId is invalid')
  }

  const response = await fetcher(userId)

  const explanations = []


  // Validation of response
  if (!checkUser(response, explanations)) { // get validation with 
    throw Object.assign(
      new TypeError('wrong user response data'),
      { explanations }
    )
  }
  return response
}


// Mock async function that returns valid user data
const validFetcher = async (userId) => ({
  id: userId,
  name: 'Andrew',
  age: 22,
  sex: 'male',
  house: { address: 'st. Yanhelya, 5'},
  hasWord: true
})

// Mock async function that returns invalid user data
const invalidFetcher = async (userId) => ({
  id: userId,
  name: 'Andrew',
  age: 22.5,
  sex: null
})

// Demo function
async function demo() {
  try {
    const validUser = await safeFetchUser(validFetcher, 1)
    console.log(validUser)
    /*
    console:
    {
      "id": 1,
      "name": "Andrew",
      "age": 22,
      "sex": "male",
      "house": {
        "address": "st. Yanhelya, 5"
      },
      "hasWord": true
    }
    */
   const invalidUser = await safeFetchUser(invalidFetcher, 2) // throws Error with explanations

  } catch (error) {
    if (error.explanations) {
      console.log(error.explanations)
      /*
        [
          {
            "id": 0,
            "parents": [{
              "key": "age",
              "schema": [Object],
              "parent": {
                "id": 2,
                "name": "Andrew",
                "age": 22.5,
                "sex": null
              }
            }],
            "schema": {
             "type": "SafeInteger"
            },
            "settings": {
              "allErrors": true
            },
            "value": 22.5
          },
          {
            "id": 1,
            "parents": [
              {
                "key": "age",
                "schema": [Object],
                "parent": [Object]
              }
            ],
            "schema": {
              "type": "And",
              "innerSchema": [
                {
                  "type": "Positive"
                },
                {
                  "type": "SafeInteger"
                }
              ]
            },
            "settings": [Object],
            "value": 22.5
          },
          {
            "id": 2,
            "parents": [[Object]],
            "schema": [
              "male",
              "female"
            ],
            "settings": [Object],
            "value": null
          },
        {
          "id": 3,
          "parents": [[Object]],
          "schema": {
            "address": {
              "type": "String"
            }
          },
          "settings": [Object]
        },
        {
          "id": 4,
          "parents": [[Object]],
          "schema": [
            null,
            {
              "address": {
                "type": "String"
              }
            }
          ],
          "settings": [Object]
        },
        {
          "id": 5,
          "parents": [[Object]],
          "schema": {
            "type": "Boolean"
          },
          "settings": [Object]
        },
        {
          "id": 6,
          "parents": [],
          "schema": {
            "id": {
              "type": "Number"
            },
            "name": {
              "type": "String"
            },
            "age": {
              "type": "And",
              "innerSchema": [
                {
                  "type": "Positive"
                },
                {
                  "type": "SafeInteger"
                }
              ]
            },
            "sex": [
              "male",
              "female"
            ],
            "house": [
              null,
              {
                "address": {
                  "type": "String"
                }
              }
            ],
            "hasWord": {
              "type": "Boolean"
            }
          },
          "settings": [Object],
          "value": {
            "id": 2,
            "name": "Andrew",
            "age": 22.5,
            "sex": null
          }
        }
      ]
      */
    }
  }
}

demo()