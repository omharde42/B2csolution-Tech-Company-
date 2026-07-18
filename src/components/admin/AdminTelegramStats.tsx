/**
 * AdminTelegramStats — Stat cards for Telegram Bot section of Admin Dashboard
 */
import { Bot, Users, TrendingUp, HeadphonesIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface TelegramStats {
  totalUsers: number;
  activeConversations: number;
  newLeads: number;
  handoffs: number;
}

interface Props {
  stats: TelegramStats;
}

const AdminTelegramStats = ({ stats }: Props) => {
  const cards = [
    {
      label: 'Telegram Users',
      value: stats.totalUsers,
      icon: Users,
      accent: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
      gradient: 'from-blue-500/5',
    },
    {
      label: 'Active Chats',
      value: stats.activeConversations,
      icon: Bot,
      accent: 'bg-primary/10 text-primary ring-primary/20',
      gradient: 'from-primary/5',
    },
    {
      label: 'New Leads',
      value: stats.newLeads,
      icon: TrendingUp,
      accent: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
      gradient: 'from-emerald-500/5',
    },
    {
      label: 'Human Handoffs',
      value: stats.handoffs,
      icon: HeadphonesIcon,
      accent: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
      gradient: 'from-amber-500/5',
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-5 grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={`relative overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-6 transition-all hover:border-primary/30 hover:shadow-lg bg-gradient-to-br ${card.gradient} to-transparent`}
        >
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <span className="text-[11px] sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">
              {card.label}
            </span>
            <div className={`rounded-xl p-2 sm:p-2.5 ring-1 ${card.accent}`}>
              <card.icon size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {card.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminTelegramStats;
