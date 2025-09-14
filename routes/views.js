const { Router } = require('express');
const ProductManager = require('../managers/ProductManager');
const CartManager = require('../managers/CartManager');

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta para home con paginación
router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;
        
        const options = {
            limit: limit ? parseInt(limit) : 10,
            page: page ? parseInt(page) : 1,
            sort: sort || null,
            query: query || null
        };

        const result = await productManager.getProducts(options);
        res.render('home', { 
            products: result.payload,
            pagination: {
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.prevLink,
                nextLink: result.nextLink
            },
            currentQuery: query || '',
            currentSort: sort || '',
            currentLimit: options.limit
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }
});

// Ruta para ver producto individual
router.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        
        if (!product) {
            return res.status(404).render('error', { message: 'Producto no encontrado' });
        }
        
        res.render('productDetail', { product });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).render('error', { message: 'Error al cargar el producto' });
    }
});

// Ruta para ver carrito específico
router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartByIdWithProducts(cid);
        
        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }
        
        res.render('cart', { 
            cart: cart,
            cartId: cid
        });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).render('error', { message: 'Error al cargar el carrito' });
    }
});

// Ruta para realTimeProducts
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).render('error', { message: 'Error al cargar los productos' });
    }
});

module.exports = router;