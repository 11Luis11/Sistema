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

PRUEBAS ADICIONALES:

- Crear un nuevo proveedor: tras la creación, verifique la notificación "Nuevo proveedor: <nombre>" en la campana desplegable.
- Crear un nuevo cliente: debe aparecer la notificación "Nuevo cliente: <nombre>".
- Crear un producto con un stock inicial <=5: debe aparecer la notificación "stock_critico" (verificar en la campana).
- Marcar notificaciones individuales y todas: verificar rápidamente las actualizaciones de recuento.
- Verificar el contenido de los registros de auditoría para las entradas de creación/actualización de clientes.