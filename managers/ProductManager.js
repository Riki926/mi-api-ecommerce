const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, '../data/products.json');
        this.init();
    }

    async init() {
        try {
            await fs.access(this.path);
        } catch (error) {
            // Si el archivo no existe, lo creamos con un array vacío
            await this.saveProducts([]);
        }
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id == id);
    }

    async addProduct(productData) {
        const products = await this.getProducts();
        
        // Validar campos requeridos
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                throw new Error(`El campo ${field} es requerido`);
            }
        }

        // Verificar que el código no se repita
        const existingProduct = products.find(product => product.code === productData.code);
        if (existingProduct) {
            throw new Error('Ya existe un producto con ese código');
        }

        // Generar ID único
        const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

        const newProduct = {
            id,
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: Number(productData.price),
            status: productData.status !== undefined ? productData.status : true,
            stock: Number(productData.stock),
            category: productData.category,
            thumbnails: productData.thumbnails || []
        };

        products.push(newProduct);
        await this.saveProducts(products);
        return newProduct;
    }

    async updateProduct(id, updateData) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id == id);
        
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        // No permitir actualizar el ID
        delete updateData.id;

        // Actualizar solo los campos proporcionados
        products[productIndex] = { ...products[productIndex], ...updateData };
        await this.saveProducts(products);
        return products[productIndex];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const productIndex = products.findIndex(product => product.id == id);
        
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        const deletedProduct = products.splice(productIndex, 1)[0];
        await this.saveProducts(products);
        return deletedProduct;
    }

    async saveProducts(products) {
        const dir = path.dirname(this.path);
        try {
            await fs.access(dir);
        } catch (error) {
            await fs.mkdir(dir, { recursive: true });
        }
        
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    }
}

module.exports = ProductManager; 