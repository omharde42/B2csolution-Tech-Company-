import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';

const statusIcons: Record<string, any> = {
  'pending': Clock,
  'confirmed': Package,
  'in-progress': Package,
  'completed': CheckCircle,
};

const Dashboard = () => {
  const { orders, reorder, loadingOrders } = useCart();
  const { user, setShowAuth } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-muted-foreground mb-6">Please sign in to view your orders.</p>
        <button onClick={() => setShowAuth(true)} className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-accent-foreground">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Welcome, {user.name}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <h2 className="font-display text-lg font-semibold mb-4">Order History</h2>
      {loadingOrders ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" size={32} /></div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground mb-4">No orders yet.</p>
          <button onClick={() => navigate('/')} className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Browse Services</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const Icon = statusIcons[order.status] || Clock;
            return (
              <div key={order.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Icon size={18} className="text-accent" />
                    <span className="font-mono text-sm font-bold">{order.id}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items.map((item: any) => (
                    <p key={item.id} className="text-sm text-muted-foreground">{item.name} × {item.quantity} — ₹{item.price * item.quantity}</p>
                  ))}
                </div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-display font-bold text-[hsl(var(--price))]">₹{order.total.toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => reorder(order)}
                      className="rounded-lg border border-accent/30 px-4 py-2 text-xs font-medium text-accent hover:bg-accent/10 flex items-center gap-1"
                    >
                      <RefreshCw size={12} /> Reorder
                    </button>
                    <button
                      onClick={() => navigate(`/order-tracking/${order.id}`)}
                      className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary"
                    >
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
