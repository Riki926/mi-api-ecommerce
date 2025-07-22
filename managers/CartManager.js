const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../data/carts.json');
        this.init();
    }

    async init() {
        try {
            await fs.access(this.path);
        } catch (error) {
            // Si el archivo no existe, lo creamos con un array vacío
            await this.saveCarts([]);
        }
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer carritos:', error);
            return [];
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id == id);
    }

    async createCart() {
        const carts = await this.getCarts();
        
        // Generar ID único
        const id = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;

        const newCart = {
            id,
            products: []
        };

        carts.push(newCart);
        await this.saveCarts(carts);
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(cart => cart.id == cartId);
        
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }

        const cart = carts[cartIndex];
        const existingProductIndex = cart.products.findIndex(item => item.product == productId);

        if (existingProductIndex !== -1) {
            // Si el producto ya existe, incrementar cantidad
            cart.products[existingProductIndex].quantity += 1;
        } else {
            // Si no existe, agregarlo con cantidad 1
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        await this.saveCarts(carts);
        return cart;
    }

    async saveCarts(carts) {
        const dir = path.dirname(this.path);
        try {
            await fs.access(dir);
        } catch (error) {
            await fs.mkdir(dir, { recursive: true });
        }
        
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    }
}

module.exports = CartManager; 