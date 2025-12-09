'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Edit2, Package, Mail, Phone, MapPin } from 'lucide-react';

interface Supplier {
  id: number;
  code: string;
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  tax_id: string;
  products_count: number;
  active: boolean;
}

export function SuppliersTab() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Perú',
    taxId: '',
    notes: ''
  });
  
  useEffect(() => {
    fetchSuppliers();
  }, []);
}