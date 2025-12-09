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
 
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      const token = localStorage.getItem('sessionToken');
      const response = await fetch('/api/suppliers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setSuppliers(data.suppliers);
      }
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('sessionToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-Role': user.role
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al crear proveedor');
        return;
      }

      // LIMPIEZA POST ENVÍO
      alert('Proveedor creado exitosamente');
      setFormData({
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
      setShowForm(false);
      fetchSuppliers();

    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    }
  }

   async function handleDelete(id: number) {
    if (!confirm('¿Está seguro que desea eliminar este proveedor?')) return;

    try {
      const token = localStorage.getItem('sessionToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch(`/api/suppliers?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-Role': user.role
        }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Error al eliminar proveedor');
        return;
      }

      alert('Proveedor eliminado exitosamente');
      fetchSuppliers();
    } catch (err) {
      alert('Error al conectar con el servidor');
      console.error(err);
    }
  }

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Gestión de Proveedores</h2>
          <p className="text-muted-foreground">Administra tus proveedores y contactos</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <Input
          placeholder="Buscar por nombre o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-input border-border"
        />
      </Card>

      {/* Form */}
      {showForm && (
        <Card className="p-6 border-primary/20 bg-primary/5">
          <h3 className="text-lg font-bold mb-4 text-foreground">Crear Nuevo Proveedor</h3>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Código *</label>
                <Input
                  type="text"
                  placeholder="SUP-001"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Nombre de Empresa *</label>
                <Input
                  type="text"
                  placeholder="Textiles SAC"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Persona de Contacto</label>
                <Input
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="contacto@empresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Teléfono</label>
                <Input
                  type="text"
                  placeholder="+51 987654321"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">RUC / Tax ID</label>
                <Input
                  type="text"
                  placeholder="20123456789"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Ciudad</label>
                <Input
                  type="text"
                  placeholder="Lima"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">País</label>
                <Input
                  type="text"
                  placeholder="Perú"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-foreground">Dirección</label>
                <Input
                  type="text"
                  placeholder="Av. Industrial 123"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-foreground">Notas</label>
                <textarea
                  placeholder="Información adicional..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Crear Proveedor
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Suppliers Grid */}
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Cargando proveedores...
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No hay proveedores registrados</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{supplier.name}</h3>
                  <p className="text-sm text-muted-foreground">{supplier.code}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="p-2 hover:bg-destructive/10 rounded transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {supplier.contact_name && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{supplier.contact_name}</span>
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground truncate">{supplier.email}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{supplier.phone}</span>
                  </div>
                )}
                {supplier.city && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{supplier.city}, {supplier.country}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Productos:</span>
                  <span className="font-semibold text-primary">{supplier.products_count}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );


}