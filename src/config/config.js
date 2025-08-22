const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

// Default values
const DEFAULT_WALLET_MONEY = 500;
const DEFAULT_PAYMENT_OPTION = "PAYMENT_OPTION_DEFAULT";
const DEFAULT_ADDRESS = "ADDRESS_NOT_SET";

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Define validation schema for env vars
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("Minutes after which access tokens expire"),
  })
  .unknown();

// Validate process.env
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Export configuration object
module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    // Append "-test" for test environment
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {}, // ✅ No deprecated options, defaults are fine in Mongoose v6+
  },
  default_wallet_money: DEFAULT_WALLET_MONEY,
  default_payment_option: DEFAULT_PAYMENT_OPTION,
  default_address: DEFAULT_ADDRESS,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
  },
};
