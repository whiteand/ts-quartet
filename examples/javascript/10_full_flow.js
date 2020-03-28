/**
 * 10_full_flow.js
 *
 * This file contains little example of full flow of api request with validation
 */

const { v } = require("quartet"); // import { v } from 'quartet'

const checkUser = v({
  id: v.number,
  name: v.string,
  age: v.and(v.positive, v.safeInteger),
  sex: ["male", "female"],
  house: [null, { address: v.string }],
  hasWord: v.boolean
});

// Function that will validate response from fetcher and returns valid response
const isValidUserId = v(v.and(v.safeInteger, v.positive));
const safeFetchUser = async (fetcher, userId) => {
  // Validation of input value
  if (!isValidUserId(userId)) {
    throw new TypeError("userId is invalid");
  }

  const response = await fetcher(userId);

  // Validation of response
  if (!checkUser(response)) {
    // get validation with
    throw new TypeError("wrong user response data")
  }
  return response;
};

// Mock async function that returns valid user data
const validFetcher = async userId => ({
  id: userId,
  name: "Andrew",
  age: 22,
  sex: "male",
  house: { address: "st. Yanhelya, 5" },
  hasWord: true
});

// Mock async function that returns invalid user data
const invalidFetcher = async userId => ({
  id: userId,
  name: "Andrew",
  age: 22.5,
  sex: null
});

// Demo function
async function demo() {
  try {
    const validUser = await safeFetchUser(validFetcher, 1);
    console.log(validUser);
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
    const invalidUser = await safeFetchUser(invalidFetcher, 2); // throws Error with explanations
  } catch (error) {
    // Handle Error
  }
}

demo();
