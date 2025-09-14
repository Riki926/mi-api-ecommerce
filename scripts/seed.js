require('dotenv').config();
const { connectMongo } = require('../src/db/mongo');
const Product = require('../src/models/Product');
const Cart = require('../src/models/Cart');

// Datos de ejemplo
const sampleProducts = [
  {
    title: 'Laptop HP Pavilion',
    description: 'Laptop de 15.6" con procesador i5 y 8GB RAM',
    price: 850,
    status: true,
    stock: 15,
    category: 'electronics',
    thumbnails: ['laptop1.jpg']
  },
  {
    title: 'Smartphone Samsung S21',
    description: 'Teléfono inteligente con cámara de 64MP',
    price: 700,
    status: true,
    stock: 25,
    category: 'electronics',
    thumbnails: ['phone1.jpg']
  },
  {
    title: 'Auriculares Sony WH-1000XM4',
    description: 'Auriculares inalámbricos con cancelación de ruido',
    price: 350,
    status: true,
    stock: 30,
    category: 'audio',
    thumbnails: ['headphones1.jpg']
  },
  {
    title: 'Smart TV 55" 4K',
    description: 'Televisor inteligente con resolución 4K',
    price: 1200,
    status: true,
    stock: 8,
    category: 'tvs',
    thumbnails: ['tv1.jpg']
  },
  {
    title: 'Cámara Canon EOS R6',
    description: 'Cámara mirrorless full frame',
    price: 2500,
    status: true,
    stock: 5,
    category: 'cameras',
    thumbnails: ['camera1.jpg']
  },
  {
    title: 'Tablet Samsung Galaxy Tab S7',
    description: 'Tablet de 11" con S Pen incluido',
    price: 650,
    status: false,
    stock: 0,
    category: 'tablets',
    thumbnails: ['tablet1.jpg']
  },
  {
    title: 'Monitor 27" 4K',
    description: 'Monitor profesional para diseño',
    price: 450,
    status: true,
    stock: 12,
    category: 'monitors',
    thumbnails: ['monitor1.jpg']
  },
  {
    title: 'Teclado Mecánico',
    description: 'Teclado gaming con switches azules',
    price: 120,
    status: true,
    stock: 20,
    category: 'accessories',
    thumbnails: ['keyboard1.jpg']
  }
];

const seedDatabase = async () => {
  try {
    // Limpiar colecciones
    await Product.deleteMany({});
    await Cart.deleteMany({});
    
    // Insertar productos
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ ${products.length} productos insertados`);
    
    // Crear carrito con algunos productos
    const cart = await Cart.create({
      products: [
        { product: products[0]._id, quantity: 2 },
        { product: products[1]._id, quantity: 1 },
        { product: products[2]._id, quantity: 3 }
      ]
    });
    
    console.log('\n=== IDs para pruebas ===');
    console.log(`CID=${cart._id}`);
    products.forEach((p, i) => {
      console.log(`PID${i+1}=${p._id}`);
    });
    
    console.log('\n=== Comandos curl de prueba ===');
    console.log(`# Obtener carrito`);
    console.log(`curl http://localhost:8080/api/carts/${cart._id}\n`);
    
    console.log(`# Actualizar cantidad`);
    console.log(`curl -X PUT http://localhost:8080/api/carts/${cart._id}/products/${products[0]._id} \\
  -H "Content-Type: application/json" \\
  -d '{"quantity": 5}'\n`);
    
    console.log(`# Eliminar producto`);
    console.log(`curl -X DELETE http://localhost:8080/api/carts/${cart._id}/products/${products[1]._id}\n`);
    
    console.log(`# Reemplazar productos`);
    console.log(`curl -X PUT http://localhost:8080/api/carts/${cart._id} \\
  -H "Content-Type: application/json" \\
  -d '{"products":[{"product":"${products[3]._id}","quantity":2}]}'\n`);
    
    console.log(`# Vaciar carrito`);
    console.log(`curl -X DELETE http://localhost:8080/api/carts/${cart._id}`);
    
    return { products, cart };
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    throw error;
  }
};

// Ejecutar seeding
const runSeed = async () => {
  try {
    // Conectar a MongoDB usando la configuración del proyecto
    await connectMongo(process.env.MONGO_URI);
    console.log('🔌 Conectado a MongoDB');
    
    // Ejecutar el seed
    await seedDatabase();
    console.log('\n✅ Seed completado exitosamente!');
    
    // Cerrar la conexión y salir
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
};

// Ejecutar el script
runSeed();



