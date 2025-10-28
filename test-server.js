require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('./src/app');

const PORT = process.env.PORT || 8080;

const startTestServer = async () => {
  try {
    console.log('🚀 Iniciando MongoDB en memoria...');

    // Crear instancia de MongoDB en memoria
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    console.log('✅ MongoDB en memoria iniciado');
    console.log('📍 URI:', uri);

    // Conectar mongoose
    await mongoose.connect(uri, {
      dbName: 'ecommerce',
    });

    console.log('✅ Conectado a MongoDB');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('\n╔═══════════════════════════════════════════════════════╗');
      console.log('║  🎉 SERVIDOR CORRIENDO CON MONGODB EN MEMORIA       ║');
      console.log('╚═══════════════════════════════════════════════════════╝\n');
      console.log(`🌐 Server: http://localhost:${PORT}`);
      console.log(`💚 Health: http://localhost:${PORT}/api/health`);
      console.log('\n📝 Prueba registrar un usuario:');
      console.log(`curl -X POST http://localhost:${PORT}/api/sessions/register \\
  -H "Content-Type: application/json" \\
  -d '{"first_name":"Test","last_name":"User","email":"test@test.com","age":25,"password":"pass123"}'`);
      console.log('\n✨ Presiona Ctrl+C para detener\n');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

startTestServer();
