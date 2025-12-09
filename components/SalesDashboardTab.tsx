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