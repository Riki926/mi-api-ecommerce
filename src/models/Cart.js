const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    min: 1, 
    default: 1 
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  products: [cartItemSchema]
}, {
  timestamps: true,
  versionKey: false
});

// Middleware para poblar automáticamente los productos al hacer find
cartSchema.pre('find', function() {
  this.populate('products.product');
});

cartSchema.pre('findOne', function() {
  this.populate('products.product');
});

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
