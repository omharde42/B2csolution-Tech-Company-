import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, ShoppingCart, Mail, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['hsl(220,60%,50%)', 'hsl(0,78%,55%)', 'hsl(145,65%,42%)', 'hsl(45,90%,50%)', 'hsl(280,60%,50%)'];

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalContacts: 0, totalViews: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      setLoadingData(true);
      const [ordersRes, contactsRes, viewsRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
        supabase.from('page_views').select('*').order('created_at', { ascending: false }),
      ]);

      const ordersData = ordersRes.data || [];
      const contactsData = contactsRes.data || [];
      const viewsData = viewsRes.data || [];

      setOrders(ordersData);
      setContacts(contactsData);
      setPageViews(viewsData);
      setStats({
        totalOrders: ordersData.length,
        totalRevenue: ordersData.reduce((s: number, o: any) => s + Number(o.total), 0),
        totalContacts: contactsData.length,
        totalViews: viewsData.length,
      });
      setLoadingData(false);
    };
    fetchData();
  }, [isAdmin]);

  if (loading || loadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-muted-foreground" size={40} />
      </div>
    );
  }

  if (!isAdmin) return null;

  // Chart data: orders per day (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
  const ordersPerDay = last7Days.map(day => ({
    date: day.slice(5),
    orders: orders.filter(o => o.created_at?.startsWith(day)).length,
    revenue: orders.filter(o => o.created_at?.startsWith(day)).reduce((s: number, o: any) => s + Number(o.total), 0),
  }));

  const viewsPerDay = last7Days.map(day => ({
    date: day.slice(5),
    views: pageViews.filter(v => v.created_at?.startsWith(day)).length,
  }));

  // Issue type distribution
  const issueCounts: Record<string, number> = {};
  contacts.forEach((c: any) => { issueCounts[c.issue] = (issueCounts[c.issue] || 0) + 1; });
  const issueData = Object.entries(issueCounts).map(([name, value]) => ({ name, value }));

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-primary' },
    { label: 'Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-[hsl(var(--price))]' },
    { label: 'Inquiries', value: stats.totalContacts, icon: Mail, color: 'text-accent' },
    { label: 'Page Views', value: stats.totalViews, icon: Users, color: 'text-primary' },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold">Admin <span className="text-gradient-brand">Dashboard</span></h1>
        <p className="text-sm text-muted-foreground">Overview of your business metrics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-10">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <s.icon size={20} className={s.color} />
              <span className="text-xs text-muted-foreground font-medium">{s.label}</span>
            </div>
            <p className="font-display text-2xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2 mb-10">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-sm font-bold mb-4">Orders (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ordersPerDay}>
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(215,15%,55%)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(215,15%,55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(222,35%,10%)', border: '1px solid hsl(222,25%,18%)', borderRadius: 8, color: 'hsl(210,25%,93%)' }} />
              <Bar dataKey="orders" fill="hsl(220,60%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-sm font-bold mb-4">Visitor Traffic (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={viewsPerDay}>
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(215,15%,55%)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(215,15%,55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(222,35%,10%)', border: '1px solid hsl(222,25%,18%)', borderRadius: 8, color: 'hsl(210,25%,93%)' }} />
              <Line type="monotone" dataKey="views" stroke="hsl(145,65%,42%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {issueData.length > 0 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display text-sm font-bold mb-4">Inquiries by Type</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={issueData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {issueData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(222,35%,10%)', border: '1px solid hsl(222,25%,18%)', borderRadius: 8, color: 'hsl(210,25%,93%)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-sm font-bold mb-4">Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ordersPerDay}>
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(215,15%,55%)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(215,15%,55%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(222,35%,10%)', border: '1px solid hsl(222,25%,18%)', borderRadius: 8, color: 'hsl(210,25%,93%)' }} />
              <Bar dataKey="revenue" fill="hsl(145,65%,42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="rounded-xl border border-border bg-card p-5 mb-10">
        <h3 className="font-display text-sm font-bold mb-4">Recent Inquiries</h3>
        {contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No inquiries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Phone</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Issue</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {contacts.slice(0, 20).map((c: any) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/50">
                    <td className="py-2 px-3">{c.name}</td>
                    <td className="py-2 px-3 text-muted-foreground">{c.email}</td>
                    <td className="py-2 px-3 text-muted-foreground">{c.phone}</td>
                    <td className="py-2 px-3"><span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">{c.issue}</span></td>
                    <td className="py-2 px-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-display text-sm font-bold mb-4">All Orders</h3>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 30).map((o: any) => (
                  <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/50">
                    <td className="py-2 px-3 font-mono text-xs">{o.order_id}</td>
                    <td className="py-2 px-3 font-bold text-[hsl(var(--price))]">₹{Number(o.total).toLocaleString()}</td>
                    <td className="py-2 px-3"><span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{o.status}</span></td>
                    <td className="py-2 px-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
