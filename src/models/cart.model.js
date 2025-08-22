const mongoose = require('mongoose');
const { productSchema } = require('./product.model');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: productSchema,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cartItems: {
      type: [cartItemSchema],
    },
    paymentOption: {
      type: String,
      default: "PAYMENT_OPTION_DEFAULT",
    },
  },
  {
    timestamps: false,
  }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports.Cart = Cart;
