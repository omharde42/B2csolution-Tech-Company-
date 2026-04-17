import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
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
        <AdminInquiries contacts={filteredContacts} />
      </section>

      {/* Orders */}
      <section>
        <div className="mb-4 sm:mb-6">
          <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">Order Management</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Update status and export records</p>
        </div>
        <AdminOrders orders={filteredOrders} onStatusUpdate={handleStatusUpdate} />
      </section>
    </div>
  );
};

export default AdminDashboard;
