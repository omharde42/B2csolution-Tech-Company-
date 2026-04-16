import { motion } from 'framer-motion';
import { ShoppingCart, TrendingUp, Mail, Users } from 'lucide-react';

interface Props {
  stats: { totalOrders: number; totalRevenue: number; totalContacts: number; totalViews: number };
}

const AdminStatCards = ({ stats }: Props) => {
  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-primary' },
    { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-[hsl(var(--price))]' },
    { label: 'Inquiries', value: stats.totalContacts, icon: Mail, color: 'text-accent' },
    { label: 'Page Views', value: stats.totalViews, icon: Users, color: 'text-primary' },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4 mb-6 sm:mb-10">
      {statCards.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="rounded-xl border border-border bg-card p-3 sm:p-5"
        >
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <s.icon size={16} className={`${s.color} sm:w-5 sm:h-5`} />
            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">{s.label}</span>
          </div>
          <p className="font-display text-lg sm:text-2xl font-bold">{s.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStatCards;
