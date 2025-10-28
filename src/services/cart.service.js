const cartRepository = require('../repositories/cart.repository');
const productRepository = require('../repositories/product.repository');

const getOrCreateCartByUser = async (userId) => {
  let cart = await cartRepository.findByUserId(userId);

  if (!cart) {
    cart = await cartRepository.create({
      user: userId,
      items: [],
    });
  }

  return cart;
};

const addItem = async (userId, productId, quantity) => {
  const cart = await getOrCreateCartByUser(userId);

  const product = await productRepository.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product._id.toString() === productId
  );

  if (existingItemIndex !== -1) {
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;

    if (newQuantity > product.stock) {
      throw new Error('Insufficient stock');
    }

    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    if (quantity > product.stock) {
      throw new Error('Insufficient stock');
    }

    cart.items.push({
      product: productId,
      quantity,
    });
  }

  return await cartRepository.updateById(cart._id, { items: cart.items });
};

const removeItem = async (userId, productId) => {
  const cart = await getOrCreateCartByUser(userId);

  cart.items = cart.items.filter(
    (item) => item.product._id.toString() !== productId
  );

  return await cartRepository.updateById(cart._id, { items: cart.items });
};

const clear = async (userId) => {
  const cart = await getOrCreateCartByUser(userId);
  return await cartRepository.clearItems(cart._id);
};

module.exports = {
  getOrCreateCartByUser,
  addItem,
  removeItem,
  clear,
};
