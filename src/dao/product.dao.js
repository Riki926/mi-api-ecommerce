const Product = require('../models/Product');

class ProductDAO {
  async findById(id) {
    return await Product.findById(id);
  }

  async findAll() {
    return await Product.find();
  }

  async create(productData) {
    const product = new Product(productData);
    return await product.save();
  }

  async updateById(id, updateData) {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await Product.findByIdAndDelete(id);
  }
}

module.exports = new ProductDAO();
