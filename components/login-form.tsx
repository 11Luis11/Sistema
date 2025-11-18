'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ShieldAlert, XCircle } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    message: string;
    attemptsLeft?: number;
    locked?: boolean;
  } | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({
          message: data.message || 'Error al iniciar sesión',
          attemptsLeft: data.attemptsLeft,
          locked: data.locked,
        });
        return;
      }

      // Save session
      if (rememberMe) {
        localStorage.setItem('userEmail', email);
      }
      localStorage.setItem('sessionToken', data.sessionToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError({
        message: 'Error de conexión. Por favor, intenta nuevamente.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Brand */}
        <div className="hidden md:flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl font-bold text-primary-foreground">Y</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">YeniJeans</h1>
          <p className="text-muted-foreground text-lg mb-2">Control de Inventario</p>
          <p className="text-muted-foreground">Gestiona tu inventario de jeans y casacas de manera eficiente y moderna</p>
        </div>

        {/* Right side - Login Form */}
        <Card className="p-8 shadow-lg">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Iniciar Sesión</h2>
            <p className="text-muted-foreground">Accede a tu panel de control</p>
          </div>

          {/* Mensaje de Error Mejorado */}
          {error && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                error.locked
                  ? 'bg-red-50 border-2 border-red-200'
                  : 'bg-amber-50 border-2 border-amber-200'
              }`}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {error.locked ? (
                    <ShieldAlert className="h-5 w-5 text-red-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-amber-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-semibold text-sm mb-1 ${
                      error.locked ? 'text-red-800' : 'text-amber-800'
                    }`}
                  >
                    {error.locked ? '🔒 Cuenta Bloqueada' : '⚠️ Credenciales Inválidas'}
                  </h3>
                  <p
                    className={`text-sm ${
                      error.locked ? 'text-red-700' : 'text-amber-700'
                    }`}
                  >
                    {error.message}
                  </p>
                  
                  {/* Contador de Intentos con bolitas */}
                  {error.attemptsLeft !== undefined && error.attemptsLeft > 0 && (
                    <div className="mt-3 pt-3 border-t border-amber-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-amber-700 font-medium">
                          Intentos restantes:
                        </span>
                        <div className="flex gap-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                i < (error.attemptsLeft || 0)
                                  ? 'bg-amber-500'
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-amber-600 mt-1 font-semibold">
                        {error.attemptsLeft} {error.attemptsLeft === 1 ? 'intento' : 'intentos'}
                      </p>
                    </div>
                  )}

                  {/* Mensaje de Bloqueo */}
                  {error.locked && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="text-xs text-red-600">
                        ⏱️ Podrás intentar nuevamente en <span className="font-semibold">15 minutos</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-input border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-input border-border"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                Recordar sesión
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading || error?.locked}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? 'Ingresando...' : error?.locked ? '🔒 Cuenta Bloqueada' : 'Ingresar'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            ¿No tienes cuenta? <span className="text-primary cursor-pointer hover:underline">Regístrate aquí</span>
          </div>

          <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground text-center">
            Sistema de gestión de inventario YeniJeans. Todos los derechos reservados.
          </div>
        </Card>
      </div>
    </div>
  );
}