const httpStatus = require("http-status");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");

/**
 * Login with username and password
 * - Utilize userService method to fetch user object corresponding to the email provided
 * - Use the User schema's "isPasswordMatch" method to check if input password matches the one user registered with (i.e, hash stored in MongoDB)
 * - If user doesn't exist or incorrect password,
 * throw an ApiError with "401 Unauthorized" status code and message, "Incorrect email or password"
 * - Else, return the user object
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
 const loginUserWithEmailAndPassword = async (email, password) => {
  // 1. Fetch the user document
  const user = await userService.getUserByEmail(email);

  // 2. If no user or password mismatch, throw 401
  //    Note: call the instance method directly on user
  const passwordMatched = user && (await user.isPasswordMatch(password));
  if (!user || !passwordMatched) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Incorrect email or password"
    );
  }

  // 3. Return the authenticated user
  return user;
};

module.exports = {
  loginUserWithEmailAndPassword,
};
