const productRepository = require('../repositories/product.repository');

const getAllProducts = async () => {
  return await productRepository.findAll();
};

const getProductById = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

const createProduct = async (productData) => {
  return await productRepository.create(productData);
};

const updateProduct = async (id, productData) => {
  const product = await productRepository.updateById(id, productData);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

const deleteProduct = async (id) => {
  const product = await productRepository.deleteById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
