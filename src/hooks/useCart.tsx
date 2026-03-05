import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed';
  date: string;
  trackingSteps: { label: string; done: boolean; date?: string }[];
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  orders: Order[];
  placeOrder: () => Order;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

const loadOrders = (): Order[] => {
  try {
    return JSON.parse(localStorage.getItem('b2c_orders') || '[]');
  } catch { return []; }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) { setItems(prev => prev.filter(i => i.id !== id)); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const placeOrder = useCallback(() => {
    const order: Order = {
      id: `B2C-${Date.now().toString(36).toUpperCase()}`,
      items: [...items],
      total,
      status: 'pending',
      date: new Date().toISOString(),
      trackingSteps: [
        { label: 'Order Placed', done: true, date: new Date().toISOString() },
        { label: 'Confirmed', done: false },
        { label: 'In Progress', done: false },
        { label: 'Completed', done: false },
      ],
    };
    const updated = [order, ...orders];
    setOrders(updated);
    localStorage.setItem('b2c_orders', JSON.stringify(updated));
    setItems([]);
    return order;
  }, [items, total, orders]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, orders, placeOrder, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
};
