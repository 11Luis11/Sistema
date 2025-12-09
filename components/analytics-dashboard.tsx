'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Analytics {
  period: number;
  sales: {
    total: number;
    revenue: number;
    avgValue: number;
    growth: number;
    byPaymentMethod: {
      cash: number;
      card: number;
      transfer: number;
    };
  };
  dailySales: Array<{
    date: string;
    salesCount: number;
    revenue: number;
  }>;
  topProducts: Array<{
    id: number;
    code: string;
    name: string;
    category: string;
    timesSold: number;
    quantity: number;
    revenue: number;
  }>;
  lowStockProducts: Array<{
    id: number;
    code: string;
    name: string;
    currentStock: number;
    minimumStock: number;
  }>;
  topCategories: Array<{
    id: number;
    name: string;
    itemsSold: number;
    quantity: number;
    revenue: number;
  }>;
  inventory: {
    totalProducts: number;
    totalItems: number;
    totalValue: number;
  };
}
const COLORS = ['#e91e63', '#9c27b0', '#3f51b5', '#03a9f4', '#009688', '#8bc34a'];

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

 useEffect(() => {
    fetchAnalytics();
  }, [period]);

sync function fetchAnalytics() {
    try {
      setLoading(true);
      const token = localStorage.getItem('sessionToken');
      
      const response = await fetch(`/api/analytics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }

 if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Cargando análisis...</div>
      </div>
    );
  }

if (!analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">No hay datos disponibles</div>
      </div>
    );
  }


<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col items-center justify-center p-4">
          <DollarSign className="w-6 h-6 mb-2 text-green-500" />
          <div className="text-lg font-semibold">Ingresos</div>
          <div className="text-2xl font-bold">${analytics.sales.revenue.toFixed(2)}</div>
        </Card>

        <Card className="flex flex-col items-center justify-center p-4">
          <ShoppingCart className="w-6 h-6 mb-2 text-blue-500" />
          <div className="text-lg font-semibold">Ventas</div>
          <div className="text-2xl font-bold">{analytics.sales.total}</div>
        </Card>

        <Card className="flex flex-col items-center justify-center p-4">
          <Package className="w-6 h-6 mb-2 text-purple-500" />
          <div className="text-lg font-semibold">Inventario</div>
          <div className="text-2xl font-bold">{analytics.inventory.totalItems}</div>
        </Card>

        <Card className="flex flex-col items-center justify-center p-4">
          {analytics.sales.growth >= 0 ? (
            <TrendingUp className="w-6 h-6 mb-2 text-green-500" />
          ) : (
            <TrendingDown className="w-6 h-6 mb-2 text-red-500" />
          )}
          <div className="text-lg font-semibold">Crecimiento</div>
          <div className="text-2xl font-bold">{analytics.sales.growth.toFixed(2)}%</div>
        </Card>
      </div>


  



































































