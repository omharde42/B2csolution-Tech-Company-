import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import AdminStatCards from '@/components/admin/AdminStatCards';
import AdminCharts from '@/components/admin/AdminCharts';
import AdminInquiries from '@/components/admin/AdminInquiries';
import AdminOrders from '@/components/admin/AdminOrders';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalContacts: 0, totalViews: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

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
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-xl sm:text-2xl font-bold">Admin <span className="text-gradient-brand">Dashboard</span></h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Overview of your business metrics</p>
      </div>
      <AdminStatCards stats={stats} />
      <AdminCharts orders={orders} pageViews={pageViews} contacts={contacts} />
      <AdminInquiries contacts={contacts} />
      <AdminOrders orders={orders} onStatusUpdate={handleStatusUpdate} />
    </div>
  );
};

export default AdminDashboard;
