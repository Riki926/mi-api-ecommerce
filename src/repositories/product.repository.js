const productDAO = require('../dao/product.dao');

class ProductRepository {
  async findById(id) {
    return await productDAO.findById(id);
  }

  async findAll() {
    return await productDAO.findAll();
  }

  async create(productData) {
    return await productDAO.create(productData);
  }

  async updateById(id, updateData) {
    return await productDAO.updateById(id, updateData);
  }

  async deleteById(id) {
    return await productDAO.deleteById(id);
  }
}

module.exports = new ProductRepository();
