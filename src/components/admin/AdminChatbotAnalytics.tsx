import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MessageSquare, Users, PhoneForwarded, TrendingDown } from 'lucide-react';

interface Props {
  from?: Date | null;
  to?: Date | null;
}

const STAGE_LABELS: Record<string, string> = {
  greeting: 'Greeting',
  exploring: 'Exploring',
  consideration: 'Pricing / consideration',
  support: 'Support',
  handoff: 'Human handoff',
};

const AdminChatbotAnalytics = ({ from, to }: Props) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [s, l] = await Promise.all([
        supabase.from('chat_sessions').select('*').order('updated_at', { ascending: false }).limit(500),
        supabase.from('chat_logs').select('*').order('created_at', { ascending: false }).limit(2000),
      ]);
      setSessions(s.data || []);
      setLogs(l.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const inRange = (d: string) => {
    if (!from || !to) return true;
    const t = new Date(d).getTime();
    return t >= from.getTime() && t <= to.getTime();
  };

  const filteredSessions = useMemo(() => sessions.filter((s) => inRange(s.created_at)), [sessions, from, to]);
  const filteredLogs = useMemo(() => logs.filter((l) => inRange(l.created_at)), [logs, from, to]);

  const stats = useMemo(() => {
    const total = filteredSessions.length;
    const handoffs = filteredSessions.filter((s) => s.handed_off).length;
    const oneTurn = filteredSessions.filter((s) => (s.message_count ?? 0) <= 2).length;
    return {
      total,
      messages: filteredLogs.length,
      handoffs,
      dropOffRate: total ? Math.round((oneTurn / total) * 100) : 0,
    };
  }, [filteredSessions, filteredLogs]);

  const topIntents = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredLogs.filter((l) => l.role === 'user' && l.intent).forEach((l) => {
      counts[l.intent] = (counts[l.intent] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [filteredLogs]);

  const dropOffs = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredSessions.forEach((s) => {
      const stage = s.last_stage || 'greeting';
      counts[stage] = (counts[stage] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [filteredSessions]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  const maxIntent = topIntents[0]?.[1] || 1;
  const maxStage = dropOffs[0]?.[1] || 1;

  const cards = [
    { icon: MessageSquare, label: 'Conversations', value: stats.total },
    { icon: Users, label: 'Messages logged', value: stats.messages },
    { icon: PhoneForwarded, label: 'Human handoffs', value: stats.handoffs },
    { icon: TrendingDown, label: 'Early drop-off', value: `${stats.dropOffRate}%` },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-4">
            <c.icon size={18} className="text-accent mb-2" />
            <p className="font-display text-xl sm:text-2xl font-bold text-foreground">{c.value}</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top intents */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <h3 className="font-display text-sm sm:text-base font-bold mb-4">Top intents</h3>
          {topIntents.length === 0 ? (
            <p className="text-xs text-muted-foreground">No chatbot activity in this range yet.</p>
          ) : (
            <div className="space-y-3">
              {topIntents.map(([intent, count]) => (
                <div key={intent}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground font-medium capitalize">{intent.replace(/_/g, ' ')}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${(count / maxIntent) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drop-off points */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
          <h3 className="font-display text-sm sm:text-base font-bold mb-1">Drop-off points</h3>
          <p className="text-[11px] text-muted-foreground mb-4">Where conversations ended (last stage reached)</p>
          {dropOffs.length === 0 ? (
            <p className="text-xs text-muted-foreground">No sessions yet.</p>
          ) : (
            <div className="space-y-3">
              {dropOffs.map(([stage, count]) => (
                <div key={stage}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground font-medium">{STAGE_LABELS[stage] || stage}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-accent to-primary" style={{ width: `${(count / maxStage) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent sessions */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border">
          <h3 className="font-display text-sm sm:text-base font-bold">Recent conversations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-secondary/50 text-muted-foreground">
              <tr>
                <th className="text-left p-3 font-semibold">Session</th>
                <th className="text-left p-3 font-semibold">Messages</th>
                <th className="text-left p-3 font-semibold">Last intent</th>
                <th className="text-left p-3 font-semibold">Stage</th>
                <th className="text-left p-3 font-semibold">Started</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.slice(0, 25).map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="p-3 font-mono text-[11px] text-muted-foreground">{String(s.session_key).slice(0, 12)}…</td>
                  <td className="p-3">{s.message_count}</td>
                  <td className="p-3 capitalize">{(s.last_intent || 'general').replace(/_/g, ' ')}</td>
                  <td className="p-3">{STAGE_LABELS[s.last_stage] || s.last_stage}</td>
                  <td className="p-3 text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filteredSessions.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No conversations yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminChatbotAnalytics;
