import { useState } from 'react';
import { FileDown, FileText, ChevronDown } from 'lucide-react';

const ORDER_STATUSES = ['pending', 'confirmed', 'in-progress', 'completed'];
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  confirmed: 'bg-blue-500/10 text-blue-400',
  'in-progress': 'bg-purple-500/10 text-purple-400',
  completed: 'bg-green-500/10 text-green-400',
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
    <div className="rounded-xl border border-border bg-card p-3 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
        <h3 className="font-display text-xs sm:text-sm font-bold">All Orders</h3>
        {orders.length > 0 && (
          <div className="flex gap-2">
            <button onClick={() => exportCSV(orders, 'orders.csv')} className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1.5 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors">
              <FileDown size={12} /> CSV
            </button>
            <button onClick={() => exportPDF(orders, 'All Orders')} className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1.5 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors">
              <FileText size={12} /> PDF
            </button>
          </div>
        )}
      </div>
      {orders.length === 0 ? (
        <p className="text-xs sm:text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full text-xs sm:text-sm min-w-[450px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 sm:px-3 text-[10px] sm:text-xs font-medium text-muted-foreground">Order ID</th>
                <th className="text-left py-2 px-2 sm:px-3 text-[10px] sm:text-xs font-medium text-muted-foreground">Total</th>
                <th className="text-left py-2 px-2 sm:px-3 text-[10px] sm:text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left py-2 px-2 sm:px-3 text-[10px] sm:text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 30).map((o: any) => (
                <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/50">
                  <td className="py-2 px-2 sm:px-3 font-mono text-[10px] sm:text-xs">{o.order_id}</td>
                  <td className="py-2 px-2 sm:px-3 font-bold text-[hsl(var(--price))]">₹{Number(o.total).toLocaleString()}</td>
                  <td className="py-2 px-2 sm:px-3">
                    {editingId === o.id ? (
                      <select
                        value={o.status}
                        onChange={(e) => { onStatusUpdate(o.id, e.target.value); setEditingId(null); }}
                        onBlur={() => setEditingId(null)}
                        autoFocus
                        className="rounded bg-secondary border border-border px-1 py-0.5 text-[10px] sm:text-xs text-foreground focus:outline-none"
                      >
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingId(o.id)}
                        className={`rounded-full px-2 py-0.5 text-[10px] sm:text-xs inline-flex items-center gap-1 ${statusColors[o.status] || 'bg-primary/10 text-primary'}`}
                      >
                        {o.status} <ChevronDown size={10} />
                      </button>
                    )}
                  </td>
                  <td className="py-2 px-2 sm:px-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
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
