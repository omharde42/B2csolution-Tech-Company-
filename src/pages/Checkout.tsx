import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { X, Minus, Plus, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const upiIds = [
  { label: 'omharde300@oksbi', id: 'omharde300@oksbi' },
  { label: '9882303030@fam', id: '9882303030@fam' },
];

const Checkout = () => {
  const { items, removeItem, updateQuantity, total, placeOrder } = useCart();
  const { user, setShowAuth } = useAuth();
  const [selectedUpi, setSelectedUpi] = useState(upiIds[0].id);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const upiUrl = `upi://pay?pa=${selectedUpi}&pn=B2CSOLUTION&am=${total}&cu=INR&tn=B2CSOLUTION%20Order`;

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    if (!user) { setShowAuth(true); return; }
    
    setPlacing(true);
    const order = await placeOrder();
    setOrderPlaced(order.id);
    setPlacing(false);

    // Build WhatsApp message and redirect
    const lines = items.map(i => `• ${i.name} x${i.quantity} — ₹${i.price * i.quantity}`);
    const msg = `🛒 *New Order from B2CSOLUTION*\n\nOrder ID: ${order.id}\n\n${lines.join('\n')}\n\n💰 *Total: ₹${order.total}*\n\n💳 Payment UPI: ${selectedUpi}\n\n📅 Date: ${new Date().toLocaleDateString('en-IN')}\n\n✅ Please confirm this order. Thank you!`;
    window.open(`https://api.whatsapp.com/send?phone=919882303030&text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block">
          <CheckCircle size={64} className="text-[hsl(var(--price))] mx-auto mb-4" />
        </motion.div>
        <h1 className="font-display text-2xl font-bold mb-2">Order Placed!</h1>
        <p className="text-muted-foreground mb-2">Order ID: <span className="font-mono text-accent">{orderPlaced}</span></p>
        <p className="text-sm text-muted-foreground mb-6">Your order details have been sent via WhatsApp.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate('/')} className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Back to Home</button>
          <button onClick={() => navigate('/dashboard')} className="rounded-lg border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-secondary">View Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="font-display text-2xl font-bold mb-8">Checkout</h1>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">Your cart is empty.</p>
          <button onClick={() => navigate('/')} className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground">Browse Services</button>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold mb-4">Order Summary</h2>
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded bg-secondary p-1"><Minus size={14} /></button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded bg-secondary p-1"><Plus size={14} /></button>
                </div>
                <p className="font-display font-bold text-[hsl(var(--price))] w-20 text-right">₹{item.price * item.quantity}</p>
                <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-accent"><X size={16} /></button>
              </div>
            ))}
            <div className="flex justify-between border-t border-border pt-4">
              <span className="font-display font-bold text-lg">Total</span>
              <span className="font-display font-bold text-lg text-[hsl(var(--price))]">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold mb-4">UPI Payment</h2>
            <div className="flex gap-3 mb-6 flex-wrap">
              {upiIds.map(u => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUpi(u.id)}
                  className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${selectedUpi === u.id ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:text-foreground'}`}
                >
                  {u.label}
                </button>
              ))}
            </div>
            <div className="flex justify-center mb-6">
              <div className="rounded-xl bg-[hsl(0,0%,100%)] p-4">
                <QRCodeSVG value={upiUrl} size={200} level="H" />
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mb-6">
              Scan QR code to pay ₹{total.toLocaleString()} to <span className="text-accent">{selectedUpi}</span>
            </p>
            {!user && (
              <p className="text-center text-xs text-accent mb-4">Please sign in before placing your order.</p>
            )}
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full rounded-lg bg-accent py-3 font-display text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.02] glow-accent disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {placing && <Loader2 size={16} className="animate-spin" />}
              {user ? 'Place Order & Send via WhatsApp' : 'Sign In to Place Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
