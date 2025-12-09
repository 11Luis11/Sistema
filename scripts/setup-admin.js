// Script para generar hash de admin
const bcrypt = require('bcryptjs');
const { neon } = require('@neondatabase/serverless');

// Usar directamente tu DATABASE_URL
const DATABASE_URL = 'postgresql://neondb_owner:npg_ovjVzr17MZXh@ep-red-forest-a4b750jg-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function setupAdmin() {
  try {
    console.log('\n🔐 Generando hash seguro para admin...\n');
    
    const password = 'admin123';
    const passwordHash = await bcrypt.hash(password, 12);
    
    console.log('✅ Hash generado exitosamente');
    console.log('🔄 Actualizando usuario admin en la base de datos...\n');
    
    const sql = neon(DATABASE_URL);
    
    const result = await sql`
      UPDATE users 
      SET password_hash = ${passwordHash}, 
          updated_at = NOW()
      WHERE email = 'admin@yenijeans.com'
      RETURNING id, email, first_name, last_name
    `;

    if (result.length === 0) {
      console.error('❌ No se encontró el usuario admin@yenijeans.com');
      console.log('\n💡 Primero ejecuta el script SQL en Neon para crear las tablas');
      process.exit(1);
    }

    console.log('✅ Usuario admin actualizado exitosamente!\n');
    console.log('📧 Email:', result[0].email);
    console.log('👤 Nombre:', result[0].first_name, result[0].last_name);
    console.log('🔑 Contraseña: admin123');
    console.log('\n✨ ¡Listo! Ya puedes iniciar sesión\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
}

setupAdmin();