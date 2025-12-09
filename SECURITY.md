# YeniJeans Inventory System - Security Documentation

## Overview
This document outlines the security measures implemented in the YeniJeans inventory management system, focusing on OWASP Top 10 protections and industry best practices.

## Security Libraries & Dependencies

### Core Security Libraries

| Library | Version | Purpose | OWASP Protection |
|---------|---------|---------|-----------------|
| **bcryptjs** | ^2.4.3 | Password hashing with adaptive work factor | A02:2021 - Cryptographic Failures |
| **zod** | 3.25.76 | Input validation and schema enforcement | A03:2021 - Injection |
| **node-cache** | ^5.1.2 | In-memory caching for rate limits and auth attempts | A07:2021 - Attack Rate |
| **helmet** | ^7.1.0 | HTTP security headers | A01:2021 - Broken Access Control |
| **express-rate-limit** | ^7.1.5 | API rate limiting | A04:2021 - Brute Force |

### Built-in Node.js Libraries

| Library | Purpose | Usage |
|---------|---------|-------|
| **crypto** | Cryptographic functions | Session token generation (32-byte random) |
| **@neondatabase/serverless** | Database client | Secure parameterized queries |

## OWASP Top 10 Coverage

### A01:2021 - Broken Access Control
**Implementation:**
- Role-based access control (RBAC) with three tiers: Administrator, Manager, ADM_INV
- Endpoint authorization checks before processing requests
- Session token validation for protected routes
- API role verification via headers

**Files:**
- `lib/security/auth-middleware.ts`
- `app/api/products/route.ts`

### A02:2021 - Cryptographic Failures
**Implementation:**
- bcryptjs with 12 salt rounds (adaptive work factor)
- 32-byte cryptographically secure random tokens
- Passwords minimum 8 characters with complexity requirements
- Secure session storage with HttpOnly, Secure, SameSite cookies

**Files:**
- `lib/security/password-hash.ts`
- `app/api/auth/login/route.ts`

### A03:2021 - Injection
**Implementation:**
- Parameterized SQL queries only (no string concatenation)
- Zod schema validation for all inputs
- Input sanitization for XSS prevention
- Email and numeric validation

**Files:**
- `lib/security/input-validation.ts`
- `lib/database.ts`
- All API routes use parameterized queries

### A04:2021 - Insecure Design
**Implementation:**
- Threat modeling with UML diagrams (included in project docs)
- Secure by default configurations
- Input validation before processing
- Error handling without information disclosure

**Files:**
- `lib/security/input-validation.ts`
- All API error handlers return generic messages

### A05:2021 - Security Misconfiguration
**Implementation:**
- Environment variables for sensitive configuration
- Secure default headers (will use helmet middleware)
- HTTPS enforced in production (Next.js automatic)
- No debug information in production responses

### A06:2021 - Vulnerable and Outdated Components
**Implementation:**
- Regular dependency updates
- Security-focused library selection
- No deprecated packages
- Verified integrity of all dependencies

### A07:2021 - Authentication Failures
**Implementation:**
- 3-attempt account lockout with 15-minute timeout
- Secure password hashing with bcryptjs (12 rounds)
- Session token expiration (24 hours)
- Audit logging for login attempts

**Files:**
- `lib/security/login-attempts.ts`
- `app/api/auth/login/route.ts`

### A08:2021 - Software and Data Integrity Failures
**Implementation:**
- Integrity check for session tokens
- CSRF token validation for state-changing operations
- Audit trails for critical operations

**Files:**
- `lib/security/csrf-protection.ts`

### A09:2021 - Logging and Monitoring Failures
**Implementation:**
- Login audit log in database
- Failed login attempt tracking
- Error logging with context
- Request IP tracking

**Database Tables:**
- `login_audit_log` - tracks all login attempts
- `audit_logs` - tracks all product operations

### A10:2021 - Server-Side Request Forgery (SSRF)
**Implementation:**
- No external requests from user input
- Validated internal API calls only
- Database-only backend requests

## Authentication Flow

\`\`\`
User Input
    ↓
Input Validation (Zod)
    ↓
Rate Limiting Check
    ↓
Login Attempts Check
    ↓
Database Query (Parameterized)
    ↓
Password Verification (bcryptjs)
    ↓
Session Token Generation (32-byte random)
    ↓
Audit Log Entry
    ↓
Response with Secure Cookie
\`\`\`

## Session Management

- **Token Length:** 32 bytes (256 bits) cryptographically secure random
- **Token Expiry:** 24 hours
- **Storage:** HttpOnly, Secure, SameSite=Strict cookies
- **Validation:** Checked on every protected route

## Rate Limiting

### API Rate Limits
- **General API:** 30 requests per minute per IP
- **Login Endpoint:** 10 attempts per 15 minutes per IP
- **Products Endpoint:** 30 requests per minute per IP

## Password Requirements

- **Minimum Length:** 8 characters
- **Hashing:** bcryptjs with 12 salt rounds (adaptive work factor)
- **Storage:** Never in plaintext, only hashed values
- **Comparison:** Timing-safe comparison (bcryptjs)

## Database Security

### Connection
- Uses Neon serverless PostgreSQL
- Connection pooling for performance
- SSL/TLS encryption for transit

### Query Safety
\`\`\`typescript
// ✅ SAFE - Parameterized query
await sql('SELECT * FROM users WHERE email = $1', [email]);

// ❌ UNSAFE - String concatenation
await sql(`SELECT * FROM users WHERE email = '${email}'`);
\`\`\`

### Data Protection
- Row-level security (RLS) policies recommended for Neon
- Encrypted passwords with salt
- Audit trails for modifications

## Input Validation Rules

| Field | Validation | Purpose |
|-------|-----------|---------|
| Email | RFC 5322 format | Prevent injection, ensure valid format |
| Password | Min 8 chars, alphanumeric | Enforce complexity without limitations |
| Product Code | Alphanumeric, 1-50 chars | Prevent injection, normalize format |
| Price | Positive number | Prevent negative/invalid pricing |
| Stock | Non-negative integer | Prevent invalid inventory values |

## Error Handling

### Secure Error Messages
- Never expose database structure
- Never leak internal paths
- Generic messages for authentication failures
- Specific messages for validation errors (safe fields only)

### Example
\`\`\`
❌ Error: "User 'john@example.com' not found in users table"
✅ Error: "Invalid credentials"
\`\`\`

## Deployment Security Checklist

- [ ] Set all environment variables (.env in production)
- [ ] Enable HTTPS only (Next.js automatic on Vercel)
- [ ] Set secure cookie flags
- [ ] Enable CORS only for trusted origins
- [ ] Set proper security headers (Content-Security-Policy, etc.)
- [ ] Enable request logging and monitoring
- [ ] Regular dependency updates (npm audit)
- [ ] Database backups enabled
- [ ] Regular security testing

## Testing

### Database Connection Test
\`\`\`bash
npm run test:db
\`\`\`

### Login Security Test
\`\`\`bash
# Test rate limiting
for i in {1..5}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  sleep 1
done
# Should lock after 3 attempts
\`\`\`

### Input Validation Test
\`\`\`bash
# Test SQL injection prevention
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com'; DROP TABLE users;--","password":"test"}'
# Should be rejected at validation level
\`\`\`

## Credentials for Testing

| Email | Password | Role |
|-------|----------|------|
| admin@yenijeans.com | admin123 | Administrator |
| gerente@yenijeans.com | gerente123 | Manager |
| adm_inv@yenijeans.com | adm_inv123 | ADM_INV |

## Future Security Enhancements

1. **Two-Factor Authentication (2FA)**
   - TOTP via Google Authenticator
   - SMS backup codes

2. **Advanced Threat Detection**
   - Anomaly detection for login patterns
   - Geo-blocking for suspicious locations

3. **End-to-End Encryption**
   - Sensitive data encryption at rest
   - Field-level encryption for PII

4. **Security Monitoring**
   - Real-time alerting for suspicious activity
   - SIEM integration

5. **Compliance**
   - GDPR compliance
   - SOC 2 certification path
   - Regular penetration testing

## Support

For security issues, contact: security@yenijeans.com

Never publicly disclose security vulnerabilities. Follow responsible disclosure practices.
