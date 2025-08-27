const socket = io();

// Elementos del DOM
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

// Escuchar el evento submit del formulario
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Crear objeto con los datos del producto
    const product = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        thumbnails: document.getElementById('thumbnails').value.split(',').map(url => url.trim()).filter(url => url)
    };

    // Emitir evento para crear producto
    socket.emit('addProduct', product);
    
    // Limpiar formulario
    productForm.reset();
});

// Escuchar clicks en botones de eliminar
productList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-product')) {
        const productId = e.target.dataset.id;
        socket.emit('deleteProduct', productId);
    }
});

// Escuchar actualizaciones de productos
socket.on('updateProducts', (products) => {
    updateProductList(products);
});

// Función para actualizar la lista de productos
function updateProductList(products) {
    productList.innerHTML = products.map(product => `
        <div class="col-md-6 mb-4 product-card" data-id="${product.id}">
            <div class="card">
                ${product.thumbnails && product.thumbnails[0] 
                    ? `<img src="${product.thumbnails[0]}" class="card-img-top" alt="${product.title}">`
                    : ''}
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.description}</p>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Código: ${product.code}</li>
                        <li class="list-group-item">Precio: $${product.price}</li>
                        <li class="list-group-item">Stock: ${product.stock}</li>
                        <li class="list-group-item">Categoría: ${product.category}</li>
                    </ul>
                    <button class="btn btn-danger mt-2 delete-product" data-id="${product.id}">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Notificaciones de conexión
socket.on('connect', () => {
    console.log('Conectado al servidor');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
});

