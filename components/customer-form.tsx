'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function CustomerForm({ initial = null, onSuccess }: { initial?: any, onSuccess: () => void }) {
  const [form, setForm] = useState(initial || { name:'', document:'', phone:'', email:'' });
  const [loading, setLoading] = useState(false);

  function isEmailValid(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function submit(e: any) {
    e.preventDefault();
    if (!form.name || !form.document || !form.email) {
      alert('Complete los campos obligatorios');
      return;
    }
    if (!isEmailValid(form.email)) {
      alert('Correo inválido');
      return;
    }
    setLoading(true);
    const url = initial ? `/api/customers/${initial.id}` : '/api/customers';
    const method = initial ? 'PUT' : 'POST';
    const payload = { ...form, userId: Number(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string).id : null) };
    const res = await fetch(url, {
      method,
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    setLoading(false);
    if (res.ok) {
      onSuccess();
    } else {
      const data = await res.json();
      alert(data.message || 'Error');
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <Input placeholder="Nombre completo" value={form.name} onChange={(e:any)=>setForm({...form,name:e.target.value})} required />
      <Input placeholder="Documento (DNI/RUC)" value={form.document} onChange={(e:any)=>setForm({...form,document:e.target.value})} required />
      <Input placeholder="Teléfono" value={form.phone} onChange={(e:any)=>setForm({...form,phone:e.target.value})} />
      <Input type="email" placeholder="Correo" value={form.email} onChange={(e:any)=>setForm({...form,email:e.target.value})} required />
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
      </div>
    </form>
  );
}
