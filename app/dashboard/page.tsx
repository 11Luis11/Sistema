'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit2, Trash2, Plus, LogOut, Package, Users } from 'lucide-react';
import { AddProductForm } from '@/components/add-product-form';
import { EditProductForm } from '@/components/edit-product-form';
import { UserManagementTab } from '@/components/user-management-tab';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  price: number;
  current_stock: number;
  size: string;
  color: string;
  gender: string;
}
/*Visualizacion de productos*/ 
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/');
      return;
    }
    
    const userData = JSON.parse(userStr);
    setUser(userData);
    fetchProducts();
  }, [router]);

  async function fetchProducts() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProduct(id: number) {
    if (!window.confirm('¿Estás seguro que deseas eliminar este producto?')) {
      return;
    }

    try {
      const token = localStorage.getItem('sessionToken');
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-Role': user?.role || ''
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
        alert('Producto eliminado exitosamente');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  }

  async function handleEditProduct(product: Product) {
    setEditingProduct(product);
  }

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canManageProducts = ['Administrator', 'Manager', 'ADM_INV'].includes(user?.role || '');
  const canDeleteProducts = ['Administrator'].includes(user?.role || '');
  const canEditProducts = ['Administrator', 'Manager'].includes(user?.role || '');
  const canManageUsers = ['Manager'].includes(user?.role || '');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">YeniJeans</h1>
              <p className="text-xs text-muted-foreground">Control de Inventario</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground font-semibold text-primary">{user?.role}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full gap-4 mb-8">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Productos
            </TabsTrigger>
            {canManageUsers && (
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Gestionar Usuarios
              </TabsTrigger>
            )}
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Productos</h2>
                <p className="text-muted-foreground">Gestiona el inventario de YeniJeans</p>
              </div>
              {canManageProducts && (
                <Button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Producto
                </Button>
              )}
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

            {showAddProduct && (
              <AddProductForm
                onClose={() => setShowAddProduct(false)}
                onSuccess={() => {
                  fetchProducts();
                  setShowAddProduct(false);
                }}
              />
            )}

            {editingProduct && (
              <EditProductForm
                product={editingProduct}
                onClose={() => setEditingProduct(null)}
                onSuccess={() => {
                  fetchProducts();
                  setEditingProduct(null);
                }}
              />
            )}

            {/* Products Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Código</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nombre</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Categoría</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Precio</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Talla</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Color</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                          Cargando productos...
                        </td>
                      </tr>
                    ) : filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                          No hay productos disponibles
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition">
                          <td className="px-6 py-4 text-sm font-medium text-foreground">{product.code}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{product.name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-foreground">S/{Number(product.price).toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              product.current_stock > 10
                                ? 'bg-green-100 text-green-700'
                                : product.current_stock > 0
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {product.current_stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{product.size}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{product.color}</td>
                          <td className="px-6 py-4 text-sm flex gap-2">
                            {canEditProducts && (
                              <button 
                                onClick={() => handleEditProduct(product)}
                                className="p-2 hover:bg-muted rounded transition"
                                title="Editar producto"
                              >
                                <Edit2 className="w-4 h-4 text-primary" />
                              </button>
                            )}
                            {canDeleteProducts && (
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 hover:bg-muted rounded transition"
                                title="Eliminar producto"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          {canManageUsers && (
            <TabsContent value="users">
              <UserManagementTab />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}
