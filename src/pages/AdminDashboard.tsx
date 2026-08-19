import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, X, Bot, BarChart3 } from 'lucide-react';
import AdminStatCards from '@/components/admin/AdminStatCards';
import AdminCharts from '@/components/admin/AdminCharts';
import AdminInquiries from '@/components/admin/AdminInquiries';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminDateFilter, { AdminDateRange, computeRange } from '@/components/admin/AdminDateFilter';
import AdminTelegramStats from '@/components/admin/AdminTelegramStats';
import AdminTelegramLeads from '@/components/admin/AdminTelegramLeads';
import AdminTelegramConversations from '@/components/admin/AdminTelegramConversations';

// ─── Tab Types ────────────────────────────────────────────────────────────────
type ActiveTab = 'website' | 'telegram';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // ── Website Tab State ──────────────────────────────────────────────────────
  const [orders, setOrders] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dateRange, setDateRange] = useState<AdminDateRange>(() => {
    const { from, to } = computeRange('7d');
    return { preset: '7d', from, to };
  });
  const [search, setSearch] = useState('');

  // ── Telegram Tab State ─────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>('website');
  const [telegramLeads, setTelegramLeads] = useState<any[]>([]);
  const [telegramConversations, setTelegramConversations] = useState<any[]>([]);
  const [telegramMessages, setTelegramMessages] = useState<Record<string, any[]>>({});
  const [loadingTelegram, setLoadingTelegram] = useState(false);
  const [telegramStats, setTelegramStats] = useState({
    totalUsers: 0,
    activeConversations: 0,
    newLeads: 0,
    handoffs: 0,
  });

  // ─── Auth Guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate('/');
  }, [user, isAdmin, loading, navigate]);

  // ─── Fetch Website Data ─────────────────────────────────────────────────────
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

  // ─── Fetch Telegram Data ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAdmin || activeTab !== 'telegram') return;
    const fetchTelegramData = async () => {
      setLoadingTelegram(true);
      const [leadsRes, convsRes, usersRes] = await Promise.all([
        supabase
          .from('telegram_leads')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('telegram_conversations')
          .select('*, telegram_users(username, first_name, last_name)')
          .order('updated_at', { ascending: false })
          .limit(50),
        supabase
          .from('telegram_users')
          .select('telegram_id, last_seen'),
      ]);

      const leads = leadsRes.data || [];
      const convs = convsRes.data || [];
      const users = usersRes.data || [];

      setTelegramLeads(leads);
      setTelegramConversations(convs);

      // Compute stats
      setTelegramStats({
        totalUsers: users.length,
        activeConversations: convs.filter((c: any) => c.status === 'active').length,
        newLeads: leads.filter((l: any) => l.status === 'new').length,
        handoffs: convs.filter((c: any) => c.status === 'handed_off').length,
      });

      setLoadingTelegram(false);
    };
    fetchTelegramData();
  }, [isAdmin, activeTab]);

  // ─── Load Messages for a Conversation ──────────────────────────────────────
  const loadConversationMessages = async (conversationId: string) => {
    const { data } = await supabase
      .from('telegram_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    setTelegramMessages((prev) => ({ ...prev, [conversationId]: data || [] }));
  };

  // ─── Lead Status Update ─────────────────────────────────────────────────────
  const handleLeadStatusUpdate = async (leadId: string, status: string) => {
    const { error } = await supabase
      .from('telegram_leads')
      .update({ status })
      .eq('id', leadId);
    if (!error) {
      setTelegramLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status } : l))
      );
    }
  };

  // ─── Website Tab Helpers ────────────────────────────────────────────────────
  const inRange = (createdAt: string) => {
    if (!dateRange.from || !dateRange.to) return true;
    const t = new Date(createdAt).getTime();
    return t >= dateRange.from.getTime() && t <= dateRange.to.getTime();
  };

  const filteredOrders = useMemo(() => orders.filter((o) => inRange(o.created_at)), [orders, dateRange]);
  const filteredContacts = useMemo(() => contacts.filter((c) => inRange(c.created_at)), [contacts, dateRange]);
  const filteredViews = useMemo(() => pageViews.filter((v) => inRange(v.created_at)), [pageViews, dateRange]);

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
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    }
  };

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (loading || loadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-muted-foreground" size={40} />
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-12 max-w-7xl">
      {/* ── Page Header ── */}
      <div className="mb-6 sm:mb-8 pb-6 border-b border-border">
        <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight">
          Admin <span className="text-gradient-brand">Dashboard</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Real-time overview of your business performance
        </p>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex gap-2 mb-6 sm:mb-8 rounded-xl border border-border bg-card p-1 w-fit">
        <button
          onClick={() => setActiveTab('website')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === 'website'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <BarChart3 size={15} />
          Website
        </button>
        <button
          onClick={() => setActiveTab('telegram')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
            activeTab === 'telegram'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          }`}
        >
          <Bot size={15} />
          Telegram Bot
          {telegramStats.newLeads > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
              {telegramStats.newLeads}
            </span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          WEBSITE TAB
      ══════════════════════════════════════════════════════════ */}
      {activeTab === 'website' && (
        <>
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
                <span className="text-foreground font-semibold">{searchedContacts.length}</span> inquir{searchedContacts.length === 1 ? 'y' : 'ies'} matching &quot;{search}&quot;
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
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          TELEGRAM BOT TAB
      ══════════════════════════════════════════════════════════ */}
      {activeTab === 'telegram' && (
        <>
          {loadingTelegram ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-muted-foreground" size={32} />
            </div>
          ) : (
            <>
              {/* Telegram Stats */}
              <section className="mb-10 sm:mb-14">
                <div className="mb-4 sm:mb-6">
                  <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
                    🤖 Telegram Bot Overview
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Real-time metrics from your Telegram assistant
                  </p>
                </div>
                <AdminTelegramStats stats={telegramStats} />
              </section>

              {/* New Leads */}
              <section className="mb-10 sm:mb-14">
                <div className="mb-4 sm:mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
                      Captured Leads
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Requirements collected through the bot's sales flow
                    </p>
                  </div>
                  {telegramStats.newLeads > 0 && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      {telegramStats.newLeads} new
                    </span>
                  )}
                </div>
                <AdminTelegramLeads
                  leads={telegramLeads}
                  onStatusUpdate={handleLeadStatusUpdate}
                />
              </section>

              {/* Conversation History */}
              <section>
                <div className="mb-4 sm:mb-6">
                  <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
                    Conversation History
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Click any row to expand the full chat transcript
                  </p>
                </div>
                <AdminTelegramConversations
                  conversations={telegramConversations}
                  messages={telegramMessages}
                  onLoadMessages={loadConversationMessages}
                />
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
