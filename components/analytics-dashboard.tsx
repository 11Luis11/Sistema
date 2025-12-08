import { Card } from '@/components/ui/card';
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp
} from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#e91e63', '#9c27b0', '#3f51b5'];

export function DashboardMaqueta() {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Dashboard Analítico
          </h2>
          <p className="text-muted-foreground">
            Análisis de ventas e inventario
          </p>
        </div>

        <select className="border rounded px-3 py-1">
          <option>Últimos 7 días</option>
          <option>Últimos 30 días</option>
          <option>Últimos 90 días</option>
        </select>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col items-center justify-center p-4">
          <DollarSign className="w-6 h-6 text-green-500 mb-2" />
          <span className="text-lg font-semibold">Ingresos</span>
          <span className="text-2xl font-bold">$0.00</span>
        </Card>

        <Card className="flex flex-col items-center justify-center p-4">
          <ShoppingCart className="w-6 h-6 text-blue-500 mb-2" />
          <span className="text-lg font-semibold">Ventas</span>
          <span className="text-2xl font-bold">0</span>
        </Card>

        <Card className="flex flex-col items-center justify-center p-4">
          <Package className="w-6 h-6 text-purple-500 mb-2" />
          <span className="text-lg font-semibold">Inventario</span>
          <span className="text-2xl font-bold">0</span>
        </Card>

        <Card className="flex flex-col items-center justify-center p-4">
          <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
          <span className="text-lg font-semibold">Crecimiento</span>
          <span className="text-2xl font-bold">0%</span>
        </Card>
      </div>

      {/* Contenedores de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            Ventas Diarias
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis />
              <YAxis />
              <Tooltip />
              <Line dataKey="value" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">
            Métodos de Pago
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[]}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

    </div>
  );
}





































































