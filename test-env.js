const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log('🔍 Ruta del archivo .env:', path.resolve(__dirname, '.env'));
console.log('📄 Contenido del archivo .env:');
console.log('----------------------------------------');
console.log(fs.readFileSync(path.resolve(__dirname, '.env'), 'utf8'));
console.log('----------------------------------------');

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });

console.log('\n🔍 Variables de entorno cargadas:');
console.log('----------------------------------------');
console.log('MONGO_URI:', process.env.MONGO_URI || 'No definida');
console.log('----------------------------------------');

// Verificar si la variable existe
if (!process.env.MONGO_URI) {
  console.error('❌ Error: No se pudo cargar la variable MONGO_URI');
  process.exit(1);
}

console.log('✅ La variable MONGO_URI se cargó correctamente');
