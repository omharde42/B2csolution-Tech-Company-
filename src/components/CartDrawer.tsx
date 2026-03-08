import { useCart } from '@/hooks/useCart';
import { X, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, total, isOpen, setIsOpen } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-card"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <h2 className="font-display text-lg font-bold">Your Cart</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground mt-10">Your cart is empty</p>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded bg-secondary p-1 text-foreground hover:bg-muted">
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded bg-secondary p-1 text-foreground hover:bg-muted">
                        <Plus size={14} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-accent">
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-border p-4">
                <div className="flex justify-between mb-3">
                  <span className="font-semibold">Total</span>
                  <span className="font-display font-bold text-accent">₹{total}</span>
                </div>
                <button
                  onClick={() => { setIsOpen(false); navigate('/checkout'); }}
                  className="block w-full rounded-lg bg-accent py-3 text-center text-sm font-bold text-accent-foreground transition-colors hover:bg-accent/80"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
