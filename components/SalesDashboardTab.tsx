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