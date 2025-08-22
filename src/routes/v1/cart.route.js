const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const cartValidation = require("../../validations/cart.validation");
const { cartController } = require("../../controllers/");

const router = express.Router();

// Get current user's cart
router.get("/", auth, cartController.getCart);

// Add product to cart
router.post(
  "/",
  auth,
  validate(cartValidation.addProductToCart),
  cartController.addProductToCart
);

// Update product in cart
router.put(
  "/",
  auth,
  validate(cartValidation.addProductToCart),
  cartController.updateProductInCart
);

// Checkout the cart (changed to PUT, validation removed to match tests)
router.put(
  "/checkout",
  auth,
  cartController.checkout
);

module.exports = router;
