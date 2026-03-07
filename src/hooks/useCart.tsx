import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  orders: Order[];
  placeOrder: () => Promise<Order>;
  reorder: (order: Order) => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  loadingOrders: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch orders from DB when user logs in
  useEffect(() => {
    if (user) {
      setLoadingOrders(true);
      supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) {
            setOrders(data.map((o: any) => ({
              id: o.order_id,
              items: o.items as CartItem[],
              total: Number(o.total),
              status: o.status as Order['status'],
              date: o.created_at,
            })));
          }
          setLoadingOrders(false);
        });
    } else {
      setOrders([]);
    }
  }, [user]);

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

  const placeOrder = useCallback(async () => {
    const orderId = `B2C-${Date.now().toString(36).toUpperCase()}`;
    const order: Order = {
      id: orderId,
      items: [...items],
      total,
      status: 'pending',
      date: new Date().toISOString(),
    };

    // Save to DB if logged in
    if (user) {
      await supabase.from('orders').insert({
        order_id: orderId,
        user_id: user.id,
        items: items as any,
        total,
        status: 'pending',
      });
    }

    setOrders(prev => [order, ...prev]);
    setItems([]);
    return order;
  }, [items, total, user]);

  const reorder = useCallback((order: Order) => {
    setItems(order.items.map(i => ({ ...i })));
    setIsOpen(true);
  }, []);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, orders, placeOrder, reorder, isOpen, setIsOpen, loadingOrders }}>
      {children}
    </CartContext.Provider>
  );
};
