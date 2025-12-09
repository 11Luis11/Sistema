'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function SuppliersManagement() {
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simular carga de datos
    const fetchData = () => {
      setTimeout(() => {
        setNotificationCount(3);
        setActivityLog([
          { id: 1, message: 'Nuevo proveedor registrado: Proveedor A' },
          { id: 2, message: 'Orden de compra completada: #4534' },
          { id: 3, message: 'Pago procesado para Proveedor C' },
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones ({notificationCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : notificationCount > 0 ? (
            <ul className="list-disc pl-5">
              <li>Nuevas facturas recibidas</li>
              <li>Órdenes pendientes por aprobar</li>
              <li>Pagos próximos a vencer</li>
            </ul>
          ) : (
            <p>No hay nuevas notificaciones.</p>
          )}
        </CardContent>
      </Card>

      {/* Estado de gastos */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <div className="space-y-2">
              <p>Total de gastos del mes: <strong>$12,500</strong></p>
              <p>Pagos pendientes: <strong>$4,200</strong></p>
              <Button>Ver detalles</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registro de actividad */}
      <Card>
        <CardHeader>
          <CardTitle>Registro de Actividad</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : activityLog.length > 0 ? (
            <ul className="list-disc pl-5">
              {activityLog.map((log) => (
                <li key={log.id}>{log.message}</li>
              ))}
            </ul>
          ) : (
            <p>No hay actividad reciente.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default SuppliersManagement;
