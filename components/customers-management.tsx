// components/customers-management.tsx
'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import CustomerForm from './customer-form';

type Customer = { id:number; name:string; document:string; phone?:string; email:string; created_at?:string; };

export function CustomersManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const token = localStorage.getItem('sessionToken');
      const response = await fetch('/api/customers?limit=200', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setCustomers(data.customers);
    } catch (err) { console.error(err); }
    setLoading(false);
  }
  
   const [sortField, setSortField] = useState<'name' | 'document'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  function sortBy(field: 'name' | 'document') {
    if (sortField === field)
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortDir('asc');
    }

    setCustomers(prev =>
      [...prev].sort((a, b) => {
        const A = (a[field] || '').toString().toLowerCase();
        const B = (b[field] || '').toString().toLowerCase();
        if (A < B) return sortDir === 'asc' ? -1 : 1;
        if (A > B) return sortDir === 'asc' ? 1 : -1;
        return 0;
      })
    );
  }
  
  function openNew() {
    setEditing(null);
    setShowForm(true);
  }

  function editCustomer(c: Customer) {
    setEditing(c);
    setShowForm(true);
  }
  
  async function removeCustomer(id: number) {
    if (!confirm('¿Desactivar cliente?')) return;
    const token = localStorage.getItem('sessionToken');
    const res = await fetch(`/api/customers/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }});
    if (res.ok) load();
  }

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.document.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Clientes</h2>
          <p className="text-muted-foreground">Listado y gestión de clientes</p>
        </div>
        <Button onClick={openNew} className="bg-primary gap-2">
          <Plus className="w-4 h-4" /> Nuevo Cliente
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input placeholder="Buscar por nombre o documento..." value={search} onChange={(e:any)=>setSearch(e.target.value)} className="flex-1" />
        </div>
      </Card>

      {showForm && (
        <Card className="p-6 border-primary/20 bg-primary/5">
          <CustomerForm initial={editing} onSuccess={() => { setShowForm(false); load(); }} />
          <div className="mt-3">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
               <th className="px-6 py-3 text-left">
  <button onClick={() => sortBy('name')} className="font-semibold">Nombre</button>
</th>
<th className="px-6 py-3 text-left">
  <button onClick={() => sortBy('document')} className="font-semibold">Documento</button>
</th>
                <th className="px-6 py-3 text-left">Correo</th>
                <th className="px-6 py-3 text-left">Teléfono</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-6 text-center">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center">No hay clientes</td></tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-3">{c.name}</td>
                    <td className="px-6 py-3">{c.document}</td>
                    <td className="px-6 py-3">{c.email}</td>
                    <td className="px-6 py-3">{c.phone || '-'}</td>
                    <td className="px-6 py-3 flex gap-2">
                      <button onClick={() => editCustomer(c)} className="p-2 hover:bg-muted rounded">
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button onClick={() => removeCustomer(c.id)} className="p-2 hover:bg-muted rounded">
                        <Trash2 className="w-4 h-4 text-destructive" />
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

