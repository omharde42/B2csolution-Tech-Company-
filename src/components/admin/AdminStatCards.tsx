import { motion } from 'framer-motion';
import { ShoppingCart, TrendingUp, Mail, Users } from 'lucide-react';

interface Props {
  stats: { totalOrders: number; totalRevenue: number; totalContacts: number; totalViews: number };
}

const AdminStatCards = ({ stats }: Props) => {
  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, accent: 'bg-primary/10 text-primary ring-primary/20' },
    { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, accent: 'bg-[hsl(var(--price))]/10 text-[hsl(var(--price))] ring-[hsl(var(--price))]/20' },
    { label: 'Inquiries', value: stats.totalContacts, icon: Mail, accent: 'bg-accent/10 text-accent ring-accent/20' },
    { label: 'Page Views', value: stats.totalViews, icon: Users, accent: 'bg-primary/10 text-primary ring-primary/20' },
  ];

  return (
    <div className="grid gap-3 sm:gap-5 grid-cols-2 lg:grid-cols-4">
      {statCards.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <span className="text-[11px] sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">
              {s.label}
            </span>
            <div className={`rounded-xl p-2 sm:p-2.5 ring-1 ${s.accent}`}>
              <s.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {s.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStatCards;
