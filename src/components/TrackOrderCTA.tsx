import { motion } from 'framer-motion';
import { Package, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const TrackOrderCTA = () => {
  const navigate = useNavigate();
  const { user, setShowAuth } = useAuth();

  const handleClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      toast.info('Please log in to track your order');
      setShowAuth(true);
    }
  };

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 md:p-7 flex flex-col md:flex-row items-center gap-5 md:gap-6 text-center md:text-left"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Package size={22} />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold mb-1">Already placed an order?</h3>
            <p className="text-sm text-muted-foreground">
              Check the live status of your project anytime from your dashboard.
            </p>
          </div>
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-display text-sm font-bold text-primary-foreground transition-transform hover:scale-105 glow-primary whitespace-nowrap"
          >
            Track Your Order <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TrackOrderCTA;
