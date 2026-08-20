import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ShieldCheck } from 'lucide-react';

const AdminAuditLog = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);
      setRows(data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-border flex items-center gap-2">
        <ShieldCheck size={16} className="text-accent" />
        <h3 className="font-display text-sm sm:text-base font-bold">Admin activity log</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-secondary/50 text-muted-foreground">
            <tr>
              <th className="text-left p-3 font-semibold">When</th>
              <th className="text-left p-3 font-semibold">Action</th>
              <th className="text-left p-3 font-semibold">Resource</th>
              <th className="text-left p-3 font-semibold">Records</th>
              <th className="text-left p-3 font-semibold">Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3 text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-3 font-medium capitalize">{String(r.action).replace(/_/g, ' ')}</td>
                <td className="p-3 capitalize">{r.resource}</td>
                <td className="p-3">{r.record_count || '—'}</td>
                <td className="p-3 text-muted-foreground">{r.details || '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No admin activity recorded yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLog;
