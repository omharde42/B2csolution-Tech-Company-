import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { CheckCircle, Circle, ArrowLeft } from 'lucide-react';

const defaultSteps = (status: string) => [
  { label: 'Order Placed', done: true },
  { label: 'Confirmed', done: ['confirmed', 'in-progress', 'completed'].includes(status) },
  { label: 'In Progress', done: ['in-progress', 'completed'].includes(status) },
  { label: 'Completed', done: status === 'completed' },
];

const OrderTracking = () => {
  const { orderId } = useParams();
  const { orders } = useCart();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">Order <span className="font-mono text-accent">{orderId}</span> could not be found.</p>
        <button onClick={() => navigate('/dashboard')} className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Go to Dashboard</button>
      </div>
    );
  }

  const steps = defaultSteps(order.status);

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
      <h1 className="font-display text-2xl font-bold mb-2">Order Tracking</h1>
      <p className="font-mono text-sm text-accent mb-8">{order.id}</p>

      <div className="relative mb-10">
        <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border" />
        {steps.map((step, i) => (
          <div key={i} className="relative flex items-start gap-4 pb-8 last:pb-0">
            <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${step.done ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>
              {step.done ? <CheckCircle size={16} /> : <Circle size={16} />}
            </div>
            <div>
              <p className={`text-sm font-semibold ${step.done ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-sm font-semibold mb-3">Order Details</h2>
        {order.items.map((item: any) => (
          <p key={item.id} className="text-sm text-muted-foreground">{item.name} × {item.quantity} — ₹{item.price * item.quantity}</p>
        ))}
        <div className="mt-3 border-t border-border pt-3 flex justify-between">
          <span className="font-semibold text-sm">Total</span>
          <span className="font-display font-bold text-accent">₹{order.total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
