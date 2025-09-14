const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Obtener carrito por ID
const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }
    
    res.json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Eliminar producto del carrito
const deleteProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    
    // Verificar que el producto existe
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    
    // Encontrar y actualizar el carrito
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    }
    
    // Filtrar el producto a eliminar
    const initialLength = cart.products.length;
    cart.products = cart.products.filter(item => item.product.toString() !== pid);
    
    // Verificar si se eliminó algún producto
    if (cart.products.length === initialLength) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'El producto no existe en el carrito' 
      });
    }
    
    await cart.save();
    
    // Obtener el carrito con los productos poblados
    const updatedCart = await Cart.findById(cid).populate('products.product');
    
    res.json({ 
      status: 'success', 
      message: 'Producto eliminado del carrito',
      payload: updatedCart
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Error al eliminar el producto del carrito',
      error: error.message 
    });
  }
};

// Reemplazar productos del carrito
const replaceProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    
    // Validar que se hayan proporcionado productos
    if (!Array.isArray(products)) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Se requiere un arreglo de productos' 
      });
    }
    
    // Validar que todos los productos tengan el formato correcto
    const isValid = products.every(p => p.product && p.quantity > 0);
    if (!isValid) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Cada producto debe tener un ID y una cantidad mayor a 0' 
      });
    }
    
    // Validar que todos los productos existan
    const productIds = products.map(p => p.product);
    const existingProducts = await Product.countDocuments({ _id: { $in: productIds } });
    
    if (existingProducts !== products.length) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Uno o más productos no existen' 
      });
    }
    
    // Actualizar el carrito
    const cart = await Cart.findByIdAndUpdate(
      cid,
      { products },
      { new: true, runValidators: true }
    ).populate('products.product');
    
    if (!cart) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Carrito no encontrado' 
      });
    }
    
    res.json({ 
      status: 'success', 
      message: 'Productos del carrito actualizados',
      payload: cart 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Error al actualizar los productos del carrito',
      error: error.message 
    });
  }
};

// Actualizar cantidad de un producto
const updateQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    
    // Validar la cantidad
    const newQuantity = parseInt(quantity, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'La cantidad debe ser un número entero mayor a 0' 
      });
    }
    
    // Verificar que el producto existe
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Producto no encontrado' 
      });
    }
    
    // Verificar que el carrito existe
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Carrito no encontrado' 
      });
    }
    
    // Buscar el producto en el carrito
    const productIndex = cart.products.findIndex(
      item => item.product.toString() === pid
    );
    
    if (productIndex === -1) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'El producto no existe en el carrito' 
      });
    }
    
    // Actualizar la cantidad
    cart.products[productIndex].quantity = newQuantity;
    
    // Guardar los cambios
    await cart.save();
    
    // Obtener el carrito actualizado con los productos poblados
    const updatedCart = await Cart.findById(cid).populate('products.product');
    
    res.json({ 
      status: 'success', 
      message: 'Cantidad actualizada correctamente',
      payload: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Error al actualizar la cantidad del producto',
      error: error.message 
    });
  }
};

// Vaciar carrito
const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    
    // Verificar que el carrito existe
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Carrito no encontrado' 
      });
    }
    
    // Verificar si el carrito ya está vacío
    if (cart.products.length === 0) {
      return res.json({ 
        status: 'success', 
        message: 'El carrito ya está vacío',
        payload: cart 
      });
    }
    
    // Vaciar el carrito
    cart.products = [];
    await cart.save();
    
    // Obtener el carrito actualizado
    const updatedCart = await Cart.findById(cid).populate('products.product');
    
    res.json({ 
      status: 'success', 
      message: 'Carrito vaciado correctamente',
      payload: updatedCart 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Error al vaciar el carrito',
      error: error.message 
    });
  }
};

module.exports = {
  getCart,
  deleteProduct,
  replaceProducts,
  updateQuantity,
  clearCart
};
