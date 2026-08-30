import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Download, Loader2, MessageSquare } from 'lucide-react';

const download = (filename: string, content: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const ChatHistoryExport = () => {
  const { user } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);
  const [empty, setEmpty] = useState(false);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('chat_logs')
      .select('created_at, role, content, intent')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: true });
    return data || [];
  };

  const exportAs = async (format: 'txt' | 'csv' | 'json') => {
    setBusy(format);
    setEmpty(false);
    const logs = await fetchLogs();
    setBusy(null);
    if (logs.length === 0) return setEmpty(true);

    const stamp = new Date().toISOString().slice(0, 10);
    if (format === 'txt') {
      const body = logs
        .map((l: any) => `[${new Date(l.created_at).toLocaleString()}] ${l.role === 'user' ? 'You' : 'B2C Bot'}: ${l.content}`)
        .join('\n\n');
      download(`b2c-chat-history-${stamp}.txt`, body, 'text/plain');
    } else if (format === 'json') {
      download(`b2c-chat-history-${stamp}.json`, JSON.stringify(logs, null, 2), 'application/json');
    } else {
      const esc = (v: string) => {
        const s = String(v ?? '');
        const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
        return `"${safe.replace(/"/g, '""')}"`;
      };
      const rows = [
        ['Time', 'Role', 'Intent', 'Message'].map(esc).join(','),
        ...logs.map((l: any) => [new Date(l.created_at).toLocaleString(), l.role, l.intent || '', l.content].map(esc).join(',')),
      ].join('\n');
      download(`b2c-chat-history-${stamp}.csv`, rows, 'text/csv');
    }
  };

  if (!user) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-1">
        <MessageSquare size={17} className="text-accent" />
        <h2 className="font-display text-lg font-semibold">Chat History</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Download a copy of your conversations with B2C Bot.
      </p>
      <div className="flex flex-wrap gap-2">
        {(['txt', 'csv', 'json'] as const).map((f) => (
          <button
            key={f}
            onClick={() => exportAs(f)}
            disabled={busy !== null}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary disabled:opacity-50"
          >
            {busy === f ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      {empty && <p className="mt-3 text-xs text-muted-foreground">No chat history found for your account yet.</p>}
    </div>
  );
};

export default ChatHistoryExport;
