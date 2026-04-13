import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { X, Minus, Plus, CheckCircle, Loader2, Upload, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const upiIds = [
  { label: 'omharde300@oksbi', id: 'omharde300@oksbi' },
  { label: '9882303030@fam', id: '9882303030@fam' },
];

const QR_EXPIRY_SECONDS = 15 * 60; // 15 minutes

const Checkout = () => {
  const { items, removeItem, updateQuantity, total, placeOrder } = useCart();
  const { user, setShowAuth } = useAuth();
  const [selectedUpi, setSelectedUpi] = useState(upiIds[0].id);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [qrGenTime, setQrGenTime] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState(QR_EXPIRY_SECONDS);
  const [qrExpired, setQrExpired] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // QR countdown timer
  useEffect(() => {
    if (items.length === 0 || orderPlaced) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - qrGenTime) / 1000);
      const remaining = QR_EXPIRY_SECONDS - elapsed;
      if (remaining <= 0) {
        setQrExpired(true);
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [qrGenTime, items.length, orderPlaced]);

  const refreshQr = () => {
    setQrGenTime(Date.now());
    setQrExpired(false);
    setTimeLeft(QR_EXPIRY_SECONDS);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum file size is 5MB.', variant: 'destructive' });
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please upload an image file.', variant: 'destructive' });
      return;
    }
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    if (!user) { setShowAuth(true); return; }
    if (!screenshot) {
      toast({ title: 'Screenshot required', description: 'Please upload your UPI payment screenshot before placing the order.', variant: 'destructive' });
      return;
    }

    setPlacing(true);
    try {
      const order = await placeOrder();
      setOrderPlaced(order.id);

      // Upload screenshot to storage
      let screenshotUrl = '';
      if (screenshot) {
        setUploading(true);
        const ext = screenshot.name.split('.').pop() || 'png';
        const filePath = `${user.id}/${order.id}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-screenshots')
          .upload(filePath, screenshot, { contentType: screenshot.type });

        if (uploadError) {
          console.error('Upload error:', uploadError);
        } else {
          const { data: urlData } = supabase.storage
            .from('payment-screenshots')
            .getPublicUrl(filePath);
          screenshotUrl = urlData?.publicUrl || '';
        }
        setUploading(false);
      }

      // Build WhatsApp message with all details
      const lines = items.map(i => `• ${i.name} x${i.quantity} — ₹${i.price * i.quantity}`);
      const msg = [
        `✅ *CONFIRMED ORDER — B2CSOLUTION*`,
        ``,
        `📋 *Order ID:* ${order.id}`,
        `👤 *Customer:* ${user.name} (${user.email})`,
        ``,
        `🛒 *Services Ordered:*`,
        ...lines,
        ``,
        `💰 *Total Paid: ₹${order.total}*`,
        `💳 *UPI ID:* ${selectedUpi}`,
        ``,
        `📎 *Payment Screenshot:*`,
        screenshotUrl ? screenshotUrl : '(Screenshot uploaded to admin dashboard)',
        ``,
        `📅 *Date:* ${new Date().toLocaleDateString('en-IN')}`,
        ``,
        `🙏 Please confirm this order. Thank you!`,
      ].join('\n');

      window.open(`https://api.whatsapp.com/send?phone=919882303030&text=${encodeURIComponent(msg)}`, '_blank');
    } catch (err) {
      toast({ title: 'Order failed', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    }
    setPlacing(false);
  };

  const txnRef = `B2C${qrGenTime}`;
  const upiUrl = `upi://pay?pa=${selectedUpi}&pn=B2CSOLUTION&am=${total}&cu=INR&tn=B2CSOLUTION%20Order%20${txnRef}&tr=${txnRef}`;

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block">
          <CheckCircle size={64} className="text-[hsl(var(--price))] mx-auto mb-4" />
        </motion.div>
        <h1 className="font-display text-2xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2">Order ID: <span className="font-mono text-accent">{orderPlaced}</span></p>
        <p className="text-sm text-muted-foreground mb-6">Your order details and payment proof have been sent via WhatsApp.</p>
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
          {/* Order Summary */}
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

          {/* Payment */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold mb-4">UPI Payment</h2>

              {/* UPI selector */}
              <div className="flex gap-3 mb-6 flex-wrap">
                {upiIds.map(u => (
                  <button
                    key={u.id}
                    onClick={() => { setSelectedUpi(u.id); refreshQr(); }}
                    className={`rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${selectedUpi === u.id ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:text-foreground'}`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>

              {/* QR Code with timer */}
              <div className="flex flex-col items-center mb-6">
                {qrExpired ? (
                  <div className="rounded-xl bg-destructive/10 border border-destructive/30 p-8 text-center">
                    <AlertTriangle size={48} className="text-destructive mx-auto mb-3" />
                    <p className="font-semibold text-destructive mb-2">QR Code Expired</p>
                    <p className="text-xs text-muted-foreground mb-4">This QR code has expired for security reasons.</p>
                    <button onClick={refreshQr} className="rounded-lg bg-accent px-6 py-2.5 text-xs font-bold text-accent-foreground transition-transform hover:scale-105">
                      Generate New QR Code
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl bg-white p-4 mb-3">
                      <QRCodeSVG value={upiUrl} size={200} level="H" />
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${timeLeft < 120 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      <Clock size={14} />
                      Expires in {formatTime(timeLeft)}
                    </div>
                  </>
                )}
              </div>

              <p className="text-center text-xs text-muted-foreground mb-4">
                Scan QR code to pay ₹{total.toLocaleString()} to <span className="text-accent">{selectedUpi}</span>
              </p>
            </div>

            {/* Screenshot Upload */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold mb-2">Upload Payment Screenshot</h2>
              <p className="text-xs text-muted-foreground mb-4">After completing payment, upload a screenshot from your UPI app as proof.</p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleScreenshotChange}
                className="hidden"
              />

              {screenshotPreview ? (
                <div className="relative rounded-lg overflow-hidden border border-border mb-4">
                  <img src={screenshotPreview} alt="Payment screenshot" className="w-full max-h-64 object-contain bg-secondary/30" />
                  <button
                    onClick={() => { setScreenshot(null); setScreenshotPreview(null); }}
                    className="absolute top-2 right-2 rounded-full bg-destructive p-1.5 text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-lg border-2 border-dashed border-border py-10 flex flex-col items-center gap-2 text-muted-foreground hover:border-accent hover:text-accent transition-colors mb-4"
                >
                  <Upload size={32} />
                  <span className="text-sm font-medium">Click to upload screenshot</span>
                  <span className="text-xs">PNG, JPG up to 5MB</span>
                </button>
              )}

              {!user && (
                <p className="text-center text-xs text-accent mb-4">Please sign in before placing your order.</p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={placing || uploading || qrExpired || !screenshot}
                className="w-full rounded-lg bg-accent py-3 font-display text-sm font-bold text-accent-foreground transition-transform hover:scale-[1.02] glow-accent disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(placing || uploading) && <Loader2 size={16} className="animate-spin" />}
                {!user ? 'Sign In to Place Order' : !screenshot ? 'Upload Screenshot First' : 'Confirm Order & Send via WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
