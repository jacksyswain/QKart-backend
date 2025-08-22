const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const { cartService } = require("../services");
const { Cart, User } = require("../models");
const config = require("../config/config");

const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCartByUser(req.user);
  res.send(cart);
});

const addProductToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addProductToCart(
    req.user,
    productId,
    quantity
  );
  res.status(httpStatus.CREATED).send(cart);
});

const updateProductInCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;

  if (quantity === 0) {
    await cartService.deleteProductFromCart(req.user, productId);
    return res.status(httpStatus.NO_CONTENT).send();
  }

  const cart = await cartService.updateProductInCart(
    req.user,
    productId,
    quantity
  );

  res.status(httpStatus.OK).send(cart);
});

const checkout = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Access token missing");
  }

  const userEmail = req.user.email;
  let cart = await Cart.findOne({ email: userEmail });

  if (!cart) {
    cart = await Cart.create({ email: userEmail, cartItems: [] });
  }

  if (!cart.cartItems || cart.cartItems.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cart is empty");
  }

  const user = await User.findOne({ email: userEmail });

  if (!user.address || user.address === config.default_address) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Address not set");
  }

  let totalCost = 0;
  for (const item of cart.cartItems) {
    if (item.product && item.product.cost && item.quantity) {
      totalCost += parseFloat(item.product.cost) * parseInt(item.quantity);
    }
  }

  const userWalletMoney = Number(user.walletMoney) || 0;
  
  if (userWalletMoney < totalCost) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient wallet balance");
  }

  user.walletMoney = userWalletMoney - totalCost;
  await user.save();

  cart.cartItems = [];
  await cart.save();

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getCart,
  addProductToCart,
  updateProductInCart,
  checkout,
};
