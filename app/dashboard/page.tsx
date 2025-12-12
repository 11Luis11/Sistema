'use client';
import { SalesRegistrationTab } from '@/components/sales-registration-tab';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit2, Trash2, Plus, LogOut, Package, Users, History, TrendingUp, ShoppingCart, Truck } from 'lucide-react';
import { AddProductForm } from '@/components/add-product-form';
import { EditProductForm } from '@/components/edit-product-form';
import { UserManagementTab } from '@/components/user-management-tab';
import { SuppliersTab } from '@/components/suppliers-tab';
import { SalesDashboardTab } from '@/components/sales-dashboard-tab';
import { CustomersManagement } from '@/components/customers-management';
import NotificationBell from '@/components/NotificationBell';

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

interface InventoryMovement {
  id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  user_name: string;
  movement_type: 'ENTRADA' | 'SALIDA' | 'AJUSTE' | 'DEVOLUCION';
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMovements, setLoadingMovements] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [movementSearchTerm, setMovementSearchTerm] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/');
      return;
    }
    
    const userData = JSON.parse(userStr);
    setUser(userData);
    
    fetchDataInParallel();
  }, [router]);

  async function fetchDataInParallel() {
    try {
      const token = localStorage.getItem('sessionToken');
      
      const [productsResponse, movementsResponse] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/inventory-movements?limit=100', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      const [productsData, movementsData] = await Promise.all([
        productsResponse.json(),
        movementsResponse.json()
      ]);

      if (productsData.success) {
        setProducts(productsData.products);
      }
      
      if (movementsData.success) {
        setMovements(movementsData.movements);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setLoadingMovements(false);
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

  const filteredMovements = movements.filter(m =>
    m.product_name.toLowerCase().includes(movementSearchTerm.toLowerCase()) ||
    m.product_code.toLowerCase().includes(movementSearchTerm.toLowerCase()) ||
    m.movement_type.toLowerCase().includes(movementSearchTerm.toLowerCase())
  );

  const canManageProducts = ['Administrator', 'Manager', 'ADM_INV'].includes(user?.role || '');
  const canDeleteProducts = ['Administrator'].includes(user?.role || '');
  const canEditProducts = ['Administrator', 'Manager'].includes(user?.role || '');
  const canManageUsers = ['Manager'].includes(user?.role || '');

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'ENTRADA':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'SALIDA':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'AJUSTE':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'DEVOLUCION':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'ENTRADA':
      case 'DEVOLUCION':
        return <TrendingUp className="w-4 h-4" />;
      case 'SALIDA':
        return <TrendingUp className="w-4 h-4 rotate-180" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">YeniJeans</h1>
              <p className="text-xs text-muted-foreground">Sistema de Gestión Empresarial</p>
            </div>
          </div>
          
<div className="flex items-center gap-4">
  <div className="text-right">
    <p className="text-sm font-medium text-foreground">
      {user?.firstName} {user?.lastName}
    </p>
    <p className="text-xs text-primary font-semibold">{user?.role}</p>
  </div>

  {/* Notification bell (nuevo) */}
  <NotificationBell />

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 gap-2 mb-8 h-auto">
            <TabsTrigger value="products" className="flex items-center gap-2 py-3">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Inventario</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2 py-3">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Ventas</span>
            </TabsTrigger>
            <TabsTrigger value="sales-dashboard" className="flex items-center gap-2 py-3">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="flex items-center gap-2 py-3">
              <Truck className="w-4 h-4" />
              <span className="hidden sm:inline">Proveedores</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2 py-3">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="movements" className="flex items-center gap-2 py-3">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Historial</span>
            </TabsTrigger>
            {canManageUsers && (
              <TabsTrigger value="users" className="flex items-center gap-2 py-3">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Usuarios</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Gestión de Inventario</h2>
                <p className="text-muted-foreground">Administra los productos de YeniJeans</p>
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
                  fetchDataInParallel();
                  setShowAddProduct(false);
                }}
              />
            )}

            {editingProduct && (
              <EditProductForm
                product={editingProduct}
                onClose={() => setEditingProduct(null)}
                onSuccess={() => {
                  fetchDataInParallel();
                  setEditingProduct(null);
                }}
              />
            )}

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
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : product.current_stock > 0
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
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

          {/* Sales Registration Tab */}
          <TabsContent value="sales">
            <SalesRegistrationTab onSaleComplete={fetchDataInParallel} />
          </TabsContent>

          {/* Sales Dashboard Tab */}
          <TabsContent value="sales-dashboard">
            <SalesDashboardTab />
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers">
            <SuppliersTab />
          </TabsContent>
          <TabsContent value="customers">
          <CustomersManagement />
          </TabsContent>
          {/* Movements Tab */}
          <TabsContent value="movements" className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Historial de Movimientos</h2>
                <p className="text-muted-foreground">Registro de todas las operaciones de inventario</p>
              </div>
            </div>

            <Card className="p-6">
              <Input
                placeholder="Buscar por producto, código o tipo de movimiento..."
                value={movementSearchTerm}
                onChange={(e) => setMovementSearchTerm(e.target.value)}
                className="bg-input border-border"
              />
            </Card>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Producto</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tipo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cantidad</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock Anterior</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock Nuevo</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Usuario</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingMovements ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                          Cargando movimientos...
                        </td>
                      </tr>
                    ) : filteredMovements.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                          No hay movimientos registrados
                        </td>
                      </tr>
                    ) : (
                      filteredMovements.map((movement) => (
                        <tr key={movement.id} className="border-b border-border hover:bg-muted/50 transition">
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {formatDate(movement.created_at)}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium text-foreground">{movement.product_name}</div>
                            <div className="text-xs text-muted-foreground">{movement.product_code}</div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getMovementTypeColor(movement.movement_type)}`}>
                              {getMovementIcon(movement.movement_type)}
                              {movement.movement_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-foreground">
                            {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{movement.previous_stock}</td>
                          <td className="px-6 py-4 text-sm font-medium text-foreground">{movement.new_stock}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{movement.user_name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate" title={movement.reason}>
                            {movement.reason || '-'}
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