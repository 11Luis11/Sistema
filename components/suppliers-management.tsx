'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Search, Package } from 'lucide-react';

interface Supplier {
  id: number;
  code: string;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string;
  tax_id: string | null;
  payment_terms: string | null;
  notes: string | null;
  active: boolean;
}

export function SuppliersManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Perú',
    tax_id: '',
    payment_terms: '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      const token = localStorage.getItem('sessionToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch('/api/suppliers?active=true', {
        headers: {
          'Authorization': Bearer ${token},
          'X-User-Role': user.role
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

      const url = '/api/suppliers';
      const method = editingId ? 'PUT' : 'POST';
      const payload = editingId 
        ? { id: editingId, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Bearer ${token},
          'X-User-Role': user.role
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al guardar proveedor');
        return;
      }

      // After successful creation/update, trigger a notification
      try {
        // Create a short notification message
        const notiPayload = {
          type: editingId ? 'proveedor_actualizado' : 'proveedor_nuevo',
          message: ${editingId ? 'Proveedor actualizado:' : 'Nuevo proveedor:'} ${formData.name},
          meta: { supplierCode: formData.code }
        };
        await fetch('/api/notifications/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notiPayload)
        });
      } catch (err) {
        console.error('Failed to send supplier notification', err);
      }

      alert(Proveedor ${editingId ? 'actualizado' : 'creado'} exitosamente);
      resetForm();
      fetchSuppliers();
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    }
  }

  function resetForm() {
    setFormData({
      code: '',
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'Perú',
      tax_id: '',
      payment_terms: '',
      notes: ''
    });
    setEditingId(null);
    setShowForm(false);
    setError('');
  }

  function handleEdit(supplier: Supplier) {
    setEditingId(supplier.id);
    setFormData({
      code: supplier.code,
      name: supplier.name,
      contact_person: supplier.contact_person || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      city: supplier.city || '',
      country: supplier.country || 'Perú',
      tax_id: supplier.tax_id || '',
      payment_terms: supplier.payment_terms || '',
      notes: supplier.notes || ''
    });
    setShowForm(true);
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Está seguro que desea desactivar este proveedor?')) return;

    try {
      const token = localStorage.getItem('sessionToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch(/api/suppliers?id=${id}, {
        method: 'DELETE',
        headers: {
          'Authorization': Bearer ${token},
          'X-User-Role': user.role
        }
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Error al eliminar proveedor');
        return;
      }

      alert('Proveedor desactivado exitosamente');
      fetchSuppliers();
    } catch (err) {
      alert('Error al conectar con el servidor');
      console.error(err);
    }
  }

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.contact_person && s.contact_person.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Gestión de Proveedores</h2>
          <p className="text-muted-foreground">Administra tus proveedores y contactos</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, código o contacto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-input border-border flex-1"
          />
        </div>
      </Card>

      {/* Form */}
      {showForm && (
        <Card className="p-6 border-primary/20 bg-primary/5">
          <h3 className="text-lg font-bold mb-4 text-foreground">
            {editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Código *
                </label>
                <Input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="SUP-001"
                  disabled={editingId !== null}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Nombre *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre del proveedor"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Persona de Contacto
                </label>
                <Input
                  type="text"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contacto@proveedor.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Teléfono
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+51 999 888 777"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  RUC/DNI
                </label>
                <Input
                  type="text"
                  value={formData.tax_id}
                  onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                  placeholder="20123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Ciudad
                </label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Lima"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  País
                </label>
                <Input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Perú"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Dirección
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jr. Gamarra 1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Términos de Pago
                </label>
                <Input
                  type="text"
                  value={formData.payment_terms}
                  onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                  placeholder="30 días"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Notas adicionales..."
                  className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {editingId ? 'Actualizar' : 'Crear'} Proveedor
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Código</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nombre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Contacto</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Teléfono</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ciudad</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    Cargando proveedores...
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-12 h-12 opacity-50" />
                      <p>No hay proveedores registrados</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-border hover:bg-muted/50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{supplier.code}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-semibold">{supplier.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {supplier.contact_person || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {supplier.email || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {supplier.phone || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {supplier.city || '-'}, {supplier.country}
                    </td>
                    <td className="px-6 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="p-2 hover:bg-blue-100 rounded text-blue-600 transition"
                        title="Editar proveedor"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="p-2 hover:bg-red-100 rounded text-red-600 transition"
                        title="Desactivar proveedor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}