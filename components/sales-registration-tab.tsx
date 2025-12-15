'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, ShoppingCart, Search } from 'lucide-react';

interface Product {
  id: number;
  code: string;
  name: string;
  price: number | string; // Puede venir como string desde la BD
  current_stock: number;
}

interface CartItem {
  productId: number;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface SalesRegistrationTabProps {
  onSaleComplete: () => void;
}

export function SalesRegistrationTab({ onSaleComplete }: SalesRegistrationTabProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = (products || []).filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  async function fetchProducts() {
    try {
      const response = await fetch('/api/products?limit=200');
      const data = await response.json();
      if (data.success) {
        // Asegurar que los productos tengan stock > 0 y convertir price a número
        const validProducts = (data.products || [])
          .filter((p: Product) => (p.current_stock || 0) > 0)
          .map((p: Product) => ({
            ...p,
            price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
            current_stock: typeof p.current_stock === 'string' ? parseInt(p.current_stock) : p.current_stock
          }));
        setProducts(validProducts);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }

  function addToCart(product: Product) {
    // Convertir price a número si viene como string
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    const stock = typeof product.current_stock === 'string' ? parseInt(product.current_stock) : product.current_stock;
    
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < stock) {
        setCart(cart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        alert('No hay suficiente stock disponible');
      }
    } else {
      setCart([...cart, {
        productId: product.id,
        productCode: product.code,
        productName: product.name,
        quantity: 1,
        unitPrice: price
      }]);
    }
    setSearchTerm('');
  }

  function removeFromCart(productId: number) {
    setCart(cart.filter(item => item.productId !== productId));
  }

  function updateQuantity(productId: number, newQuantity: number) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const stock = typeof product.current_stock === 'string' ? parseInt(product.current_stock) : product.current_stock;

    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQuantity > stock) {
      alert('No hay suficiente stock disponible');
      return;
    }

    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  }

  function calculateTotal(): number {
    return cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  async function handleSubmitSale() {
    if (cart.length === 0) {
      setError('Agrega al menos un producto al carrito');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('sessionToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-User-Id': user.id?.toString() || ''
        },
        body: JSON.stringify({
          customerName: customerName || null,
          customerEmail: customerEmail || null,
          customerPhone: customerPhone || null,
          paymentMethod,
          notes: notes || null,
          items: cart
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al registrar la venta');
        return;
      }

      alert('✅ Venta registrada exitosamente');
      
      setCart([]);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setPaymentMethod('Efectivo');
      setNotes('');
      
      fetchProducts();
      onSaleComplete();
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Función helper para formatear precios
  const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Registro de Ventas</h2>
          <p className="text-muted-foreground">Registra nuevas ventas y actualiza el inventario</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 text-foreground">Buscar Productos</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredProducts.length > 0 && (
              <div className="mt-4 max-h-64 overflow-y-auto border border-border rounded-lg">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">S/{formatPrice(product.price)}</p>
                        <p className="text-xs text-muted-foreground">Stock: {product.current_stock}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Carrito de Compras
              </h3>
              <span className="text-sm text-muted-foreground">{cart.length} items</span>
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>El carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.productId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">{item.productCode}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center hover:bg-muted transition"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 rounded bg-background border border-border flex items-center justify-center hover:bg-muted transition"
                        >
                          +
                        </button>
                      </div>
                      <p className="w-24 text-right font-bold text-foreground">
                        S/{formatPrice(item.quantity * item.unitPrice)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-2 hover:bg-destructive/10 rounded transition"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 text-foreground">Información del Cliente</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Nombre</label>
                <Input
                  placeholder="Cliente general"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Teléfono</label>
                <Input
                  placeholder="+51 987654321"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 text-foreground">Método de Pago</h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Yape/Plin">Yape/Plin</option>
            </select>

            <div className="mt-3">
              <label className="block text-sm font-medium mb-1 text-foreground">Notas</label>
              <textarea
                placeholder="Observaciones adicionales..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                rows={2}
              />
            </div>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="font-bold text-lg mb-4 text-foreground">Resumen de Venta</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Productos:</span>
                <span className="font-medium text-foreground">{cart.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unidades:</span>
                <span className="font-medium text-foreground">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-foreground">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    S/{formatPrice(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handleSubmitSale}
              disabled={loading || cart.length === 0}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 text-base"
            >
              {loading ? 'Procesando...' : 'Registrar Venta'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}