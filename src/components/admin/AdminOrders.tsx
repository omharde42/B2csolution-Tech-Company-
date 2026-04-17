import { useState } from 'react';
import { FileDown, FileText, ChevronDown } from 'lucide-react';

const ORDER_STATUSES = ['pending', 'confirmed', 'in-progress', 'completed'];
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/30',
  confirmed: 'bg-blue-500/10 text-blue-400 ring-blue-500/30',
  'in-progress': 'bg-purple-500/10 text-purple-400 ring-purple-500/30',
  completed: 'bg-green-500/10 text-green-400 ring-green-500/30',
};
const statusDots: Record<string, string> = {
  pending: 'bg-yellow-400',
  confirmed: 'bg-blue-400',
  'in-progress': 'bg-purple-400',
  completed: 'bg-green-400',
};

interface Props {
  orders: any[];
  onStatusUpdate: (orderId: string, status: string) => void;
}

const exportCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  const keys = ['order_id', 'total', 'status', 'created_at'];
  const csv = [keys.join(','), ...data.map(r => keys.map(k => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const exportPDF = (data: any[], title: string) => {
  const win = window.open('', '_blank');
  if (!win) return;
  const keys = ['order_id', 'total', 'status', 'created_at'];
  const rows = data.map(r => `<tr>${keys.map(k => `<td style="border:1px solid #333;padding:4px;font-size:11px;color:#ddd">${r[k] ?? ''}</td>`).join('')}</tr>`).join('');
  win.document.write(`<html><head><title>${title}</title><style>body{background:#0f172a;color:#e2e8f0;font-family:sans-serif}table{border-collapse:collapse;width:100%}th{background:#1e293b;color:#94a3b8;padding:6px;border:1px solid #334155;font-size:11px;text-align:left}</style></head><body><h2>${title}</h2><table><tr>${keys.map(k => `<th>${k}</th>`).join('')}</tr>${rows}</table><script>setTimeout(()=>window.print(),500)</script></body></html>`);
  win.document.close();
};

const AdminOrders = ({ orders, onStatusUpdate }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
        <div>
          <h3 className="font-display text-sm sm:text-base font-bold text-foreground">All Orders</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{orders.length} total order{orders.length === 1 ? '' : 's'} • Click status to update</p>
        </div>
        {orders.length > 0 && (
          <div className="flex gap-2">
            <button onClick={() => exportCSV(orders, 'orders.csv')} className="flex items-center gap-1.5 rounded-lg bg-secondary border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary/70 hover:border-primary/40 transition-all">
              <FileDown size={13} /> CSV
            </button>
            <button onClick={() => exportPDF(orders, 'All Orders')} className="flex items-center gap-1.5 rounded-lg bg-secondary border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary/70 hover:border-primary/40 transition-all">
              <FileText size={13} /> PDF
            </button>
          </div>
        )}
      </div>
      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-xs sm:text-sm min-w-[450px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order ID</th>
                <th className="text-left py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                <th className="text-left py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 30).map((o: any) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="py-3 px-3 sm:px-4 font-mono text-[11px] sm:text-xs">{o.order_id}</td>
                  <td className="py-3 px-3 sm:px-4 font-bold text-[hsl(var(--price))]">₹{Number(o.total).toLocaleString()}</td>
                  <td className="py-3 px-3 sm:px-4">
                    {editingId === o.id ? (
                      <select
                        value={o.status}
                        onChange={(e) => { onStatusUpdate(o.id, e.target.value); setEditingId(null); }}
                        onBlur={() => setEditingId(null)}
                        autoFocus
                        className="rounded-lg bg-secondary border border-border px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingId(o.id)}
                        className={`rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-medium ring-1 inline-flex items-center gap-1.5 transition-all hover:scale-105 ${statusColors[o.status] || 'bg-primary/10 text-primary ring-primary/30'}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDots[o.status] || 'bg-primary'}`} />
                        {o.status}
                        <ChevronDown size={11} className="opacity-60" />
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
