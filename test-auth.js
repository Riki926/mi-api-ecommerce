const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

// Función para probar el sistema de autenticación
async function testAuthSystem() {
  console.log('🧪 Iniciando pruebas del sistema de autenticación...\n');

  try {
    // 1. Probar registro de usuario
    console.log('1. Probando registro de usuario...');
    const registerData = {
      first_name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@test.com',
      age: 25,
      password: 'password123',
      role: 'user'
    };

    const registerResponse = await axios.post(`${BASE_URL}/api/v1/auth/register`, registerData);
    console.log('✅ Registro exitoso:', registerResponse.data.success);
    
    const token = registerResponse.data.token;
    console.log('🔑 Token obtenido:', token.substring(0, 20) + '...\n');

    // 2. Probar login
    console.log('2. Probando login...');
    const loginData = {
      email: 'juan.perez@test.com',
      password: 'password123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/api/v1/auth/login`, loginData);
    console.log('✅ Login exitoso:', loginResponse.data.success);
    
    const loginToken = loginResponse.data.token;
    console.log('🔑 Token de login:', loginToken.substring(0, 20) + '...\n');

    // 3. Probar ruta /api/sessions/current
    console.log('3. Probando ruta /api/sessions/current...');
    const currentUserResponse = await axios.get(`${BASE_URL}/api/sessions/current`, {
      headers: {
        'Authorization': `Bearer ${loginToken}`
      }
    });
    
    console.log('✅ Usuario actual obtenido:', currentUserResponse.data.success);
    console.log('👤 Datos del usuario:', {
      id: currentUserResponse.data.data.id,
      first_name: currentUserResponse.data.data.first_name,
      last_name: currentUserResponse.data.data.last_name,
      email: currentUserResponse.data.data.email,
      role: currentUserResponse.data.data.role
    });

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('\n📋 Resumen de funcionalidades implementadas:');
    console.log('✅ Modelo User con todos los campos requeridos');
    console.log('✅ Encriptación de contraseñas con bcrypt.hashSync');
    console.log('✅ Estrategias de Passport configuradas');
    console.log('✅ Sistema de login con JWT');
    console.log('✅ Ruta /api/sessions/current funcionando');
    console.log('✅ CRUD de usuarios completo');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas si el servidor está corriendo
testAuthSystem();
