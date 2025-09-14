const mongoose = require('mongoose');
const Cart = require('../src/models/Cart');
const Product = require('../src/models/Product');

class CartManager {
    constructor() {
        // Constructor vacío ya que no necesitamos inicializar nada
    }

    /**
     * Obtiene un carrito por su ID con los productos completos
     * @param {string} id - ID del carrito
     * @returns {Promise<Object>} Carrito con productos
     */
    async getCartById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('ID de carrito inválido');
            }

            const cart = await Cart.findById(id)
                .populate('products.product', 'title description price category thumbnails stock status')
                .lean();

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return {
                status: 'success',
                payload: cart
            };
        } catch (error) {
            console.error('Error al obtener carrito por ID:', error);
            throw error;
        }
    }

    /**
     * Crea un nuevo carrito vacío
     * @returns {Promise<Object>} Carrito creado
     */
    async createCart() {
        try {
            const newCart = new Cart({
                products: []
            });

            const savedCart = await newCart.save();
            
            return {
                status: 'success',
                payload: savedCart,
                message: 'Carrito creado exitosamente'
            };
        } catch (error) {
            console.error('Error al crear carrito:', error);
            throw error;
        }
    }

    /**
     * Actualiza la cantidad de un producto en el carrito
     * @param {string} cartId - ID del carrito
     * @param {string} productId - ID del producto
     * @param {number} quantity - Nueva cantidad
     * @returns {Promise<Object>} Carrito actualizado
     */
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error('ID de carrito o producto inválido');
            }

            if (isNaN(quantity) || quantity < 1) {
                throw new Error('La cantidad debe ser un número mayor a 0');
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Verificar que el producto exista
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            // Buscar el producto en el carrito
            const productIndex = cart.products.findIndex(
                item => item.product.toString() === productId
            );

            if (productIndex === -1) {
                throw new Error('El producto no está en el carrito');
            }

            // Actualizar la cantidad
            cart.products[productIndex].quantity = quantity;
            
            const updatedCart = await cart.save();
            const populatedCart = await Cart.populate(updatedCart, {
                path: 'products.product',
                select: 'title description price category thumbnails stock status'
            });

            return {
                status: 'success',
                payload: populatedCart,
                message: 'Cantidad actualizada exitosamente'
            };
        } catch (error) {
            console.error('Error al actualizar cantidad del producto:', error);
            throw error;
        }
    }

    /**
     * Elimina un producto del carrito
     * @param {string} cartId - ID del carrito
     * @param {string} productId - ID del producto a eliminar
     * @returns {Promise<Object>} Carrito actualizado
     */
    async removeProductFromCart(cartId, productId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error('ID de carrito o producto inválido');
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            const initialLength = cart.products.length;
            cart.products = cart.products.filter(
                item => item.product.toString() !== productId
            );

            if (cart.products.length === initialLength) {
                throw new Error('El producto no está en el carrito');
            }

            const updatedCart = await cart.save();
            const populatedCart = await Cart.populate(updatedCart, {
                path: 'products.product',
                select: 'title description price category thumbnails stock status'
            });

            return {
                status: 'success',
                payload: populatedCart,
                message: 'Producto eliminado del carrito exitosamente'
            };
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            throw error;
        }
    }

    /**
     * Actualiza todos los productos del carrito
     * @param {string} cartId - ID del carrito
     * @param {Array} products - Array de productos a actualizar
     * @returns {Promise<Object>} Carrito actualizado
     */
    async updateCartProducts(cartId, products) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Validar que todos los productos existen
            for (const item of products) {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Producto con ID ${item.product} no encontrado`);
                }
            }

            cart.products = products;
            const updatedCart = await cart.save();
            
            const populatedCart = await Cart.populate(updatedCart, {
                path: 'products.product',
                select: 'title description price category thumbnails stock status'
            });

            return {
                status: 'success',
                payload: populatedCart,
                message: 'Carrito actualizado exitosamente'
            };
        } catch (error) {
            console.error('Error al actualizar productos del carrito:', error);
            throw error;
        }
    }

    /**
     * Vacía el carrito
     * @param {string} cartId - ID del carrito a vaciar
     * @returns {Promise<Object>} Carrito vaciado
     */
    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            cart.products = [];
            const updatedCart = await cart.save();
            
            return {
                status: 'success',
                payload: updatedCart,
                message: 'Carrito vaciado exitosamente'
            };
        } catch (error) {
            console.error('Error al limpiar carrito:', error);
            throw error;
        }
    }

    /**
     * Agrega un producto al carrito
     * @param {string} cartId - ID del carrito
     * @param {string} productId - ID del producto a agregar
     * @returns {Promise<Object>} Carrito actualizado
     */
    async addProductToCart(cartId, productId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error('ID de carrito o producto inválido');
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            // Verificar que el producto exista
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }

            // Buscar si el producto ya está en el carrito
            const productIndex = cart.products.findIndex(
                item => item.product.toString() === productId
            );

            if (productIndex !== -1) {
                // Incrementar cantidad si ya existe
                cart.products[productIndex].quantity += 1;
            } else {
                // Agregar producto si no existe
                cart.products.push({
                    product: productId,
                    quantity: 1
                });
            }

            const updatedCart = await cart.save();
            const populatedCart = await Cart.populate(updatedCart, {
                path: 'products.product',
                select: 'title description price category thumbnails stock status'
            });

            return {
                status: 'success',
                payload: populatedCart,
                message: 'Producto agregado al carrito exitosamente'
            };
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }
}

module.exports = CartManager;