const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { userService, tokenService } = require("../services");
const ApiError = require("../utils/ApiError");

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.getUserByEmail(email).catch(() => null);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  const isMatch = await user.isPasswordMatch(password);
  if (!isMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

module.exports = {
  register,
  login,
};
