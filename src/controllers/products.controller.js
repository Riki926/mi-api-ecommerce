const Product = require('../models/Product');

/**
 * Obtiene productos con paginación, filtros y ordenamiento
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const getProducts = async (req, res) => {
  try {
    // Obtener parámetros de consulta
    const { limit = 10, page = 1, sort, query, category, status, stock } = req.query;
    
    // Construir filtro
    const filter = {};
    
    // Aplicar filtros si existen
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (status !== undefined) {
      filter.status = status === 'true' || status === '1' || status === 'on';
    }
    
    if (stock) {
      filter.stock = { $gt: 0 };
    }

    // Configurar opciones de paginación
    const options = {
      page: parseInt(page, 10),
      limit: Math.min(parseInt(limit, 10), 100), // Limitar máximo 100 productos por página
      lean: true,
      sort: {}
    };

    // Configurar ordenamiento si es válido
    if (sort === 'asc' || sort === 'desc') {
      options.sort.price = sort === 'asc' ? 1 : -1;
    } else if (sort === 'az' || sort === 'za') {
      options.sort.title = sort === 'az' ? 1 : -1;
    }

    // Obtener productos paginados
    const result = await Product.paginate(filter, options);

    // Construir enlaces de paginación
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const buildLink = (page) => {
      const params = new URLSearchParams();
      
      // Agregar solo los parámetros que existen
      if (limit) params.append('limit', limit);
      if (sort) params.append('sort', sort);
      if (query) params.append('query', query);
      if (category) params.append('category', category);
      if (status) params.append('status', status);
      if (stock) params.append('stock', stock);
      
      params.append('page', page);
      
      return `${baseUrl}?${params.toString()}`;
    };

    // Formatear respuesta según especificación
    const response = {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage || null,
      nextPage: result.nextPage || null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
    };

    res.json(response);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getProducts
};
