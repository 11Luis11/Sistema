# Sistema de Inventario YeniJeans - Documentación de seguridad

## Descripción general
Este documento describe las medidas de seguridad implementadas en el sistema de gestión de inventario de YeniJeans, centrándose en las 10 protecciones principales de OWASP y las mejores prácticas del sector.

## Bibliotecas y dependencias de seguridad

### Bibliotecas de seguridad utilizadas

| Libreria | Version | Proposito | Proteccion OWASP |
|---------|---------|---------|-----------------|
| **bcryptjs** | ^2.4.3 | Hash de contraseñas con factor de trabajo adaptativo | A02:2021 - Cryptographic Failures |
| **zod** | 3.25.76 | Validación de entradas y aplicación de esquemas | A03:2021 - Injection |
| **node-cache** | ^5.1.2 | Almacenamiento en caché en memoria para límites de velocidad e intentos de autenticación | A07:2021 - Attack Rate |
| **helmet** | ^7.1.0 | Encabezados de seguridad HTTP | A01:2021 - Broken Access Control |
| **express-rate-limit** | ^7.1.5 | Limitación de la tasa de API | A04:2021 - Brute Force |

### Bibliotecas Node.js integradas

| Libreria | Proposito | Uso |
|---------|---------|-------|
| **crypto** | Funciones criptográficas | Generación de token de sesión (aleatorio de 32 bytes) |
| **@neondatabase/serverless** | Cliente de base de datos | Consultas parametrizadas seguras |

## Cobertura del Top 10 de OWASP

### A01:2021 - Broken Access Control
**Implementacion:**
- Control de acceso basado en roles (RBAC) con tres niveles: Administrador, Gerente, ADM_INV
- Comprobaciones de autorización de puntos finales antes de procesar las solicitudes
- Validación de tokens de sesión para rutas protegidas
- Verificación de roles API a través de encabezados

### A02:2021 - Cryptographic Failures
**Implementacion:**
- bcryptjs con 12 rondas de salt (factor de trabajo adaptativo)
- Tokens aleatorios criptográficamente seguros de 32 bytes
- Contraseñas de un mínimo de 8 caracteres con requisitos de complejidad
- Almacenamiento seguro de sesiones con cookies HttpOnly, Secure y SameSite

### A03:2021 - Injection
**Implementacion:**
- Solo consultas SQL parametrizadas (sin concatenación de cadenas)
- Validación del esquema Zod para todas las entradas
- Desinfección de entradas para la prevención de XSS
- Validación de correos electrónicos y números

### A04:2021 - Insecure Design
**Implementacion:**
- Modelado de amenazas con diagramas UML (incluidos en la documentación del proyecto)
- Configuraciones seguras por defecto
- Validación de entradas antes del procesamiento
- Gestión de errores sin divulgación de información

### A05:2021 - Security Misconfiguration
**Implementacion:**
- Variables de entorno para configuraciones confidenciales
- Encabezados predeterminados seguros (utilizará middleware helmet)
- HTTPS obligatorio en producción (Next.js automático)
- Sin información de depuración en las respuestas de producción

### A06:2021 - Vulnerable and Outdated Components
**Implementacion:**
- Actualizaciones periódicas de las dependencias
- Selección de bibliotecas centrada en la seguridad
- Sin paquetes obsoletos
- Integridad verificada de todas las dependencias

### A07:2021 - Authentication Failures
**Implementacion:**
- Bloqueo de la cuenta tras 3 intentos fallidos con un tiempo de espera de 15 minutos
- Hash seguro de contraseñas con bcryptjs (12 rondas)
- Caducidad del token de sesión (24 horas)
- Registro de auditoría de los intentos de inicio de sesión

### A08:2021 - Software and Data Integrity Failures
**Implementacion:**
- Comprobación de integridad de los tokens de sesión
- Validación de tokens CSRF para operaciones que modifican el estado
- Registros de auditoría para operaciones críticas

### A09:2021 - Logging and Monitoring Failures
**Implementation:**
- Registro de auditoría de inicio de sesión en la base de datos
- Seguimiento de intentos fallidos de inicio de sesión
- Registro de errores con contexto
- Seguimiento de la IP de la solicitud

### A10:2021 - Server-Side Request Forgery (SSRF)
**Implementation:**
- Sin solicitudes externas procedentes de entradas del usuario
- Solo llamadas API internas validadas
- Solicitudes de backend solo a la base de datos

### Conexion
- Utiliza Neon PostgreSQL sin servidor
- Agrupación de conexiones para mejorar el rendimiento
- Cifrado SSL/TLS para el tránsito

### Protección de datos
- Políticas de seguridad a nivel de fila (RLS) recomendadas para Neon
- Contraseñas cifradas con sal
- Registros de auditoría para modificaciones


## Mejoras futuras en materia de seguridad

1. **Autenticación de dos factores (2FA)**
   - TOTP a través de Google Authenticator.
   - Códigos de respaldo por SMS.

2. **Detección avanzada de amenazas**
   - Detección de anomalías en los patrones de inicio de sesión.
   - Bloqueo geográfico para ubicaciones sospechosas.

3. **Cifrado de extremo a extremo**
   - Cifrado de datos confidenciales en reposo
   - Cifrado a nivel de campo para PII

4. **Supervisión de la seguridad**
   - Alertas en tiempo real para actividades sospechosas
   - Integración SIEM

5. **Cumplimiento normativo**
   - Cumplimiento del RGPD
   - Certificación SOC 2
   - Pruebas de penetración periódicas

