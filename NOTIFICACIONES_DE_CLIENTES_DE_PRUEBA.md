PRUEBAS: Clientes y Notificaciones

1) Configuración
- Asegurarse de que DATABASE_URL esté configurado (Neon)
- Ejecutar:

psql $DATABASE_URL -f scripts/create-customers.sql

psql $DATABASE_URL -f scripts/create-notifications.sql

psql $DATABASE_URL -f scripts/create-audit.sql

2) Iniciar la aplicación: npm run dev

3) Abrir el Panel de Control -> nueva pestaña "Clientes"

- Crear un nuevo cliente (rellenar nombre, documento y correo electrónico)

- Verificar que aparezca en la tabla

- Verificar que aparezca una notificación en el menú desplegable

4) Editar cliente -> cambiar correo electrónico -> verificar que se haya actualizado y creado la fila de auditoría (consultar audit_logs)

5) Eliminar (desactivar) -> verificar que se haya eliminado de la lista activa

6) Validar los mensajes de correo electrónico/documento duplicado del lado del cliente

Si algún paso falla, revisar los registros del servidor para los endpoints:

GET /api/customers
POST /api/clientes
PUT /api/clientes/:id
GET /api/notificaciones