const Product = require('../src/models/Product');

class ProductManager {
    constructor() {
        // Ya no necesitamos inicialización de archivos
    }

    // Método principal con paginación, filtros y ordenamiento
    async getProducts(options = {}) {
        try {
            const {
                limit = 10,
                page = 1,
                sort = null,
                query = null
            } = options;

            // Construir filtros
            const filter = {};
            
            if (query) {
                // Manejar query en formato field:value (ej: category:Electrónica o status:true)
                if (query.includes(':')) {
                    const [field, value] = query.split(':');
                    if (field === 'category') {
                        filter.category = { $regex: value, $options: 'i' };
                    } else if (field === 'status') {
                        filter.status = value === 'true';
                    }
                } else {
                    // Búsqueda por defecto (puede ser por categoría o disponibilidad)
                    filter.$or = [
                        { category: { $regex: query, $options: 'i' } },
                        { title: { $regex: query, $options: 'i' } }
                    ];
                }
            }

            // Construir opciones de ordenamiento
            let sortOptions = {};
            if (sort === 'asc' || sort === 'desc') {
                sortOptions.price = sort === 'asc' ? 1 : -1;
            }

            // Calcular paginación
            const skip = (page - 1) * limit;

            // Ejecutar consulta con paginación
            const products = await Product.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .lean();

            // Contar total de documentos para paginación
            const totalDocs = await Product.countDocuments(filter);
            const totalPages = Math.ceil(totalDocs / limit);

            // Calcular información de paginación
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;
            const prevPage = hasPrevPage ? page - 1 : null;
            const nextPage = hasNextPage ? page + 1 : null;

            // Construir links para paginación
            const buildLink = (pageNum) => {
                if (!pageNum) return null;
                const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
                const params = new URLSearchParams();
                if (limit !== 10) params.append('limit', limit);
                if (query) params.append('query', query);
                if (sort) params.append('sort', sort);
                params.append('page', pageNum);
                return `${baseUrl}/api/products?${params.toString()}`;
            };

            return {
                status: products.length > 0 ? 'success' : 'error',
                payload: products,
                totalPages,
                prevPage,
                nextPage,
                page: parseInt(page, 10),
                hasPrevPage,
                hasNextPage,
                prevLink: buildLink(prevPage),
                nextLink: buildLink(nextPage)
            };
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return {
                status: 'error',
                payload: [],
                totalPages: 0,
                prevPage: null,
                nextPage: null,
                page: 1,
                hasPrevPage: false,
                hasNextPage: false,
                prevLink: null,
                nextLink: null
            };
        }
    }

    // Método simple para obtener todos los productos (compatibilidad)
    async getAllProducts() {
        try {
            return await Product.find().lean();
        } catch (error) {
            console.error('Error al obtener todos los productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return null;
            }
            
            const product = await Product.findById(id).lean();
            if (!product) {
                return null;
            }
            
            return {
                status: 'success',
                payload: product
            };
        } catch (error) {
            console.error('Error al obtener producto por ID:', error);
            return null;
        }
    }

    async addProduct(productData) {
        try {
            // Validar campos requeridos
            const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
            const missingFields = [];
            
            for (const field of requiredFields) {
                if (!productData[field]) {
                    missingFields.push(field);
                }
            }
            
            if (missingFields.length > 0) {
                throw new Error(`Los siguientes campos son requeridos: ${missingFields.join(', ')}`);
            }

            // Verificar que el código no se repita
            const existingProduct = await Product.findOne({ code: productData.code });
            if (existingProduct) {
                throw new Error('Ya existe un producto con ese código');
            }

            const newProduct = new Product({
                title: productData.title,
                description: productData.description,
                code: productData.code,
                price: Number(productData.price),
                status: productData.status !== undefined ? productData.status : true,
                stock: Number(productData.stock),
                category: productData.category,
                thumbnails: productData.thumbnails || []
            });

            const savedProduct = await newProduct.save();
            
            return {
                status: 'success',
                payload: savedProduct,
                message: 'Producto creado exitosamente'
            };
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    async updateProduct(id, updateData) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('ID de producto inválido');
            }

            // No permitir actualizar el ID ni el código
            delete updateData._id;
            delete updateData.id;
            delete updateData.code; // No permitir actualizar el código

            // Validar campos requeridos si se están actualizando
            if (updateData.price !== undefined) {
                updateData.price = Number(updateData.price);
                if (isNaN(updateData.price) || updateData.price < 0) {
                    throw new Error('El precio debe ser un número mayor o igual a 0');
                }
            }

            if (updateData.stock !== undefined) {
                updateData.stock = Number(updateData.stock);
                if (isNaN(updateData.stock) || updateData.stock < 0) {
                    throw new Error('El stock debe ser un número mayor o igual a 0');
                }
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!updatedProduct) {
                throw new Error('Producto no encontrado');
            }

            return {
                status: 'success',
                payload: updatedProduct,
                message: 'Producto actualizado exitosamente'
            };
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('ID de producto inválido');
            }

            const deletedProduct = await Product.findByIdAndDelete(id);
        
            if (!deletedProduct) {
                throw new Error('Producto no encontrado');
            }

            return {
                status: 'success',
                message: 'Producto eliminado exitosamente',
                payload: deletedProduct
            };
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }
}

module.exports = ProductManager; 