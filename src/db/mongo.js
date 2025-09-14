const mongoose = require('mongoose');

// Habilitar modo estricto para consultas
mongoose.set('strictQuery', true);

// Manejar eventos de conexión
mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión a MongoDB:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('ℹ️  Desconectado de MongoDB');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 Conexión a MongoDB cerrada por terminación de la aplicación');
  process.exit(0);
});

/**
 * Establece la conexión con MongoDB
 * @param {string} uri - URI de conexión a MongoDB
 * @returns {Promise<void>}
 */
async function connectMongo(uri) {
  try {
    if (!uri) {
      throw new Error('No se proporcionó una URI de conexión a MongoDB');
    }

    console.log('🔍 Intentando conectar a MongoDB...');
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    
    console.log('✅ Conectado a MongoDB:', mongoose.connection.host);

    // Manejar cierre de la aplicación
    const gracefulShutdown = (signal) => {
      return () => {
        console.log(`\nRecibida señal ${signal}. Cerrando conexión a MongoDB...`);
        mongoose.connection.close(false, () => {
          console.log('Conexión a MongoDB cerrada');
          process.exit(0);
        });
      };
    };

    // Manejar señales de terminación
    process.on('SIGINT', gracefulShutdown('SIGINT'));
    process.on('SIGTERM', gracefulShutdown('SIGTERM'));

  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = { connectMongo };
