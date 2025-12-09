'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';

interface Sale {
  id: number;
  sale_code: string;
  customer_name: string;
  customer_email: string;
  total_amount: number | string;
  payment_method: string;
  status: string;
  created_at: string;
  user_name: string;
  items_count: number | string;
}

interface Analytics {
  summary: {
    totalSales: number;
    totalRevenue: number;
    averageSale: number;
    totalProducts: number;
  };
  sales: {
    byDay: Array<{
      date: string;
      sales_count: number | string;
      revenue: number | string;
    }>;
    byPaymentMethod: Array<{
      payment_method: string;
      count: number | string;
      total: number | string;
    }>;
    topProducts: Array<{
      product_name: string;
      product_code: string;
      total_sold: number | string;
      total_revenue: number | string;
      sales_count: number | string;
    }>;
  };
}

export function SalesDashboardTab() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const [error, setError] = useState('');

useEffect(() => {
  fetchData();
}, [period]);

async function fetchData() {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('sessionToken');
      
      const [salesResponse, analyticsResponse] = await Promise.all([
        fetch(`/api/sales?period=${period}&limit=50`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/analytics?period=${period}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const [salesData, analyticsData] = await Promise.all([
        salesResponse.json(),
        analyticsResponse.json()
      ]);

      console.log('Sales Data:', salesData); // Debug
      console.log('Analytics Data:', analyticsData); // Debug

      if (salesData.success) {
        setSales(salesData.sales || []);
      } else {
        console.error('Sales fetch failed:', salesData);
        setError('Error al cargar ventas');
      }

      if (analyticsData.success) {
        setAnalytics(analyticsData.analytics);
      } else {
        console.error('Analytics fetch failed:', analyticsData);
        setError('Error al cargar analytics');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }

const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return '-';
    }
  };
  
  const formatCurrency = (amount: number | string | undefined | null) => {
    if (amount === undefined || amount === null) return 'S/ 0.00';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) return 'S/ 0.00';
    return `S/ ${numAmount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const toNumber = (value: number | string | undefined | null): number => {
    if (value === undefined || value === null) return 0;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? 0 : num;
  };

  const getPaymentMethodIcon = (method: string) => {
    if (!method) return <CreditCard className="w-4 h-4" />;
    switch (method.toLowerCase()) {
      case 'tarjeta':
        return <CreditCard className="w-4 h-4" />;
      case 'efectivo':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    if (!method) return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    switch (method.toLowerCase()) {
      case 'tarjeta':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'efectivo':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'transferencia':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'yape/plin':
        return 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-20 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
    const totalSales = toNumber(analytics?.summary?.totalSales);
  const totalRevenue = toNumber(analytics?.summary?.totalRevenue);
  const averageSale = toNumber(analytics?.summary?.averageSale);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard de Ventas</h2>
          <p className="text-muted-foreground">Análisis y estadísticas de ventas</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={period === 7 ? 'default' : 'outline'}
            onClick={() => setPeriod(7)}
            size="sm"
          >
            7 días
          </Button>
          <Button
            variant={period === 30 ? 'default' : 'outline'}
            onClick={() => setPeriod(30)}
            size="sm"
          >
            30 días
          </Button>
          <Button
            variant={period === 90 ? 'default' : 'outline'}
            onClick={() => setPeriod(90)}
            size="sm"
          >
            90 días
          </Button>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-destructive/10 border-destructive/20">
          <p className="text-destructive text-sm">{error}</p>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground font-medium">Total Ventas</p>
            <div className="bg-primary/10 p-2 rounded-full">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalSales}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <ArrowUpRight className="w-3 h-3" />
            <span>Últimos {period} días</span>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground font-medium">Ingresos Totales</p>
            <div className="bg-green-500/10 p-2 rounded-full">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {formatCurrency(totalRevenue)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <ArrowUpRight className="w-3 h-3" />
            <span>+{totalSales > 0 ? ((totalRevenue / totalSales) * 100 / period).toFixed(1) : 0}% por día</span>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground font-medium">Ticket Promedio</p>
            <div className="bg-blue-500/10 p-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {formatCurrency(averageSale)}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <span>Por venta</span>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground font-medium">Productos Vendidos</p>
            <div className="bg-purple-500/10 p-2 rounded-full">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {analytics?.sales?.topProducts?.reduce((sum, p) => sum + toNumber(p.total_sold), 0) || 0}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <span>Unidades totales</span>
          </div>
        </Card>
      </div>
      
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Productos */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 text-foreground">Top Productos Vendidos</h3>
            {analytics.sales?.topProducts && analytics.sales.topProducts.length > 0 ? (
              <div className="space-y-4">
                {analytics.sales.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{product.product_name || 'Sin nombre'}</p>
                      <p className="text-xs text-muted-foreground">{product.product_code || '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{toNumber(product.total_sold)} unidades</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(product.total_revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay datos de productos vendidos</p>
              </div>
            )}
          </Card>
      
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 text-foreground">Ventas por Método de Pago</h3>
            {analytics.sales?.byPaymentMethod && analytics.sales.byPaymentMethod.length > 0 ? (
              <div className="space-y-4">
                {analytics.sales.byPaymentMethod.map((method, index) => {
                  const total = toNumber(method.total);
                  const revenue = totalRevenue || 1;
                  const percentage = revenue > 0 ? (total / revenue) * 100 : 0;
                  
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getPaymentMethodIcon(method.payment_method)}
                          <span className="font-medium text-foreground">{method.payment_method || 'No especificado'}</span>
                        </div>
                        <span className="font-bold text-foreground">{formatCurrency(total)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {toNumber(method.count)} ventas ({percentage.toFixed(1)}%)
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay datos de métodos de pago</p>
              </div>
            )}
          </Card>
        </div>
      )}