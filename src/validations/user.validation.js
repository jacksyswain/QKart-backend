const Joi = require("joi");
const { objectId } = require("./custom.validation");

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement request validation for "/v1/users/:userId" endpoint
/**
 * Example url: `/v1/users/:userId`
 * Validate the "userId" url *params* field. "userId" value should be a
 * - string
 * - valid Mongo id -> Use the helper function in src/validations/custom.validation.js
 */
 const getUser = {
  params: Joi.object().keys({
    userId: Joi.string()
      .hex()
      .length(24)
      .required()
      .messages({
        'string.base': `"userId" should be a type of 'text'`,
        'string.hex': `"userId" must only contain hexadecimal characters`,
        'string.length': `"userId" must be 24 characters long`,
        'any.required': `"userId" is a required parameter`
      }),
  }),
};



const setAddress = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    address: Joi.string().required().min(20),
  }),
};

module.exports = {
  getUser,
  setAddress,
};
