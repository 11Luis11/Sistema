'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';

interface AddProductFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddProductForm({ onClose, onSuccess }: AddProductFormProps) {
  /*Campos para registrar producto */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    categoryId: '1',
    price: '',
    size: '',
    color: '',
    gender: 'Unisex',
    stock: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.code || !formData.name || !formData.price) {
        setError('Por favor completa los campos requeridos');
        setLoading(false);
        return;
      }

      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('sessionToken');
      
      if (!userStr || !token) {
        setError('Sesión expirada. Por favor inicia sesión de nuevo');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userStr);

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-Role': user.role || ''
        },
        body: JSON.stringify({
          code: formData.code,
          name: formData.name,
          description: formData.description,
          categoryId: parseInt(formData.categoryId),
          price: parseFloat(formData.price),
          size: formData.size || 'N/A',
          color: formData.color || 'N/A',
          gender: formData.gender,
          stock: parseInt(formData.stock) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || `Error al crear el producto (${response.status})`);
        console.log('[v0] Error response:', data);
        return;
      }

      setFormData({
        code: '',
        name: '',
        description: '',
        categoryId: '1',
        price: '',
        size: '',
        color: '',
        gender: 'Unisex',
        stock: '',
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      setError('Error al crear el producto');
      console.error('[v0] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-card">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Agregar Nuevo Producto</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Código del Producto *
              </label>
              <Input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="ej: PRD-001"
                className="bg-input border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ej: Jean Clásico"
                className="bg-input border-border"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción del producto"
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Categoría
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="1">Jeans Clásicos</option>
                <option value="2">Jeans Degradados</option>
                <option value="3">Casacas</option>
                <option value="4">Accesorios</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Precio (S/) *
              </label>
              <Input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Talla
              </label>
              <Input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="ej: S, M, L, XL"
                className="bg-input border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Color
              </label>
              <Input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="ej: Negro, Azul"
                className="bg-input border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Género
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Mujer">Mujer</option>
                <option value="Hombre">Hombre</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Stock Inicial
            </label>
            <Input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              className="bg-input border-border"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              disabled={loading}
            >
              <Plus className="w-4 h-4" />
              {loading ? 'Guardando...' : 'Agregar Producto'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
