import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, X } from 'lucide-react';
import AdminStatCards from '@/components/admin/AdminStatCards';
import AdminCharts from '@/components/admin/AdminCharts';
import AdminInquiries from '@/components/admin/AdminInquiries';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminDateFilter, { AdminDateRange, computeRange } from '@/components/admin/AdminDateFilter';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dateRange, setDateRange] = useState<AdminDateRange>(() => {
    const { from, to } = computeRange('7d');
    return { preset: '7d', from, to };
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate('/');
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
      setOrders(ordersRes.data || []);
      setContacts(contactsRes.data || []);
      setPageViews(viewsRes.data || []);
      setLoadingData(false);
    };
    fetchData();
  }, [isAdmin]);

  const inRange = (createdAt: string) => {
    if (!dateRange.from || !dateRange.to) return true;
    const t = new Date(createdAt).getTime();
    return t >= dateRange.from.getTime() && t <= dateRange.to.getTime();
  };

  const filteredOrders = useMemo(() => orders.filter(o => inRange(o.created_at)), [orders, dateRange]);
  const filteredContacts = useMemo(() => contacts.filter(c => inRange(c.created_at)), [contacts, dateRange]);
  const filteredViews = useMemo(() => pageViews.filter(v => inRange(v.created_at)), [pageViews, dateRange]);

  const q = search.trim().toLowerCase();
  const searchedOrders = useMemo(() => {
    if (!q) return filteredOrders;
    return filteredOrders.filter((o: any) => {
      const items = Array.isArray(o.items) ? o.items : [];
      const customerName = items[0]?.customerName || items[0]?.name || '';
      const customerEmail = items[0]?.customerEmail || items[0]?.email || '';
      return (
        String(o.order_id || '').toLowerCase().includes(q) ||
        String(customerName).toLowerCase().includes(q) ||
        String(customerEmail).toLowerCase().includes(q) ||
        String(o.status || '').toLowerCase().includes(q)
      );
    });
  }, [filteredOrders, q]);
  const searchedContacts = useMemo(() => {
    if (!q) return filteredContacts;
    return filteredContacts.filter((c: any) =>
      String(c.name || '').toLowerCase().includes(q) ||
      String(c.email || '').toLowerCase().includes(q) ||
      String(c.phone || '').toLowerCase().includes(q) ||
      String(c.issue || '').toLowerCase().includes(q)
    );
  }, [filteredContacts, q]);

  const stats = useMemo(() => ({
    totalOrders: filteredOrders.length,
    totalRevenue: filteredOrders.reduce((s: number, o: any) => s + Number(o.total), 0),
    totalContacts: filteredContacts.length,
    totalViews: filteredViews.length,
  }), [filteredOrders, filteredContacts, filteredViews]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  if (loading || loadingData) {
    return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-muted-foreground" size={40} /></div>;
  }
  if (!isAdmin) return null;

  return (
    <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-12 max-w-7xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pb-6 border-b border-border">
        <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
          Admin <span className="text-gradient-brand">Dashboard</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Real-time overview of your business performance
        </p>
      </div>

      {/* Date Range Filter */}
      <AdminDateFilter value={dateRange} onChange={setDateRange} />

      {/* Search Bar */}
      <div className="rounded-2xl border border-border bg-card p-3 sm:p-4 mb-6 sm:mb-8">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders & inquiries by name, email, order ID, phone or status..."
            className="w-full rounded-lg bg-secondary border border-border pl-10 pr-10 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {search && (
          <p className="mt-2 text-[11px] sm:text-xs text-muted-foreground">
            Found <span className="text-foreground font-semibold">{searchedOrders.length}</span> order{searchedOrders.length === 1 ? '' : 's'} and{' '}
            <span className="text-foreground font-semibold">{searchedContacts.length}</span> inquir{searchedContacts.length === 1 ? 'y' : 'ies'} matching "{search}"
          </p>
        )}
      </div>

      {/* Overview */}
      <section className="mb-10 sm:mb-14">
        <div className="mb-4 sm:mb-6">
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">Overview</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Key metrics for the selected period</p>
        </div>
        <AdminStatCards stats={stats} />
      </section>

      {/* Analytics */}
      <section className="mb-10 sm:mb-14">
        <div className="mb-4 sm:mb-6">
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">Analytics</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Trends across the selected range</p>
        </div>
        <AdminCharts
          orders={filteredOrders}
          pageViews={filteredViews}
          contacts={filteredContacts}
          from={dateRange.from}
          to={dateRange.to}
        />
      </section>

      {/* Inquiries */}
      <section className="mb-10 sm:mb-14">
        <div className="mb-4 sm:mb-6">
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">Customer Inquiries</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Latest contact form submissions</p>
        </div>
        <AdminInquiries contacts={searchedContacts} />
      </section>

      {/* Orders */}
      <section>
        <div className="mb-4 sm:mb-6">
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">Order Management</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Update status and export records</p>
        </div>
        <AdminOrders orders={searchedOrders} onStatusUpdate={handleStatusUpdate} />
      </section>
    </div>
  );
};

export default AdminDashboard;
