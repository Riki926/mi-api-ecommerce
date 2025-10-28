const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  console.log('🔍 Diagnóstico de Conexión MongoDB\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;

  console.log('📍 URI:', uri.replace(/:[^:@]+@/, ':****@'));
  console.log('📁 Database:', dbName);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('⏳ Intentando conectar...\n');

  try {
    await mongoose.connect(uri, {
      dbName: dbName,
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ ¡CONEXIÓN EXITOSA!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Estado de la conexión:');
    console.log('   - Estado:', mongoose.connection.readyState);
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Database:', mongoose.connection.name);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🎉 MongoDB Atlas está FUNCIONANDO correctamente!\n');

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.log('❌ ERROR DE CONEXIÓN\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Tipo de error:', error.name);
    console.log('Mensaje:', error.message);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (error.message.includes('querySrv ECONNREFUSED')) {
      console.log('🔴 PROBLEMA DETECTADO: DNS no resuelve\n');
      console.log('POSIBLES CAUSAS:');
      console.log('1. ⏳ El cluster se está creando (espera 5-10 minutos)');
      console.log('2. 🔌 El cluster está pausado o detenido');
      console.log('3. 🌐 Problema de red/firewall\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('✅ SOLUCIÓN:');
      console.log('   Ve a MongoDB Atlas → Database');
      console.log('   Verifica que tu cluster diga "ACTIVE" (verde)');
      console.log('   Si dice "Creating", espera unos minutos');
      console.log('   Si dice "Paused", haz click en "Resume"\n');
    } else if (error.message.includes('Authentication failed')) {
      console.log('🔴 PROBLEMA: Credenciales incorrectas\n');
      console.log('✅ SOLUCIÓN:');
      console.log('   Verifica el usuario y password en .env');
    } else if (error.message.includes('IP')) {
      console.log('🔴 PROBLEMA: IP no autorizada\n');
      console.log('✅ SOLUCIÓN:');
      console.log('   Network Access debe tener 0.0.0.0/0');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(1);
  }
};

testConnection();
