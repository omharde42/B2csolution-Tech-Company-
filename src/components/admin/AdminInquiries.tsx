import { FileDown, FileText } from 'lucide-react';

interface Props {
  contacts: any[];
}

const exportCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csv = [keys.join(','), ...data.map(r => keys.map(k => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const exportPDF = (data: any[], title: string) => {
  const win = window.open('', '_blank');
  if (!win) return;
  const keys = Object.keys(data[0] || {});
  const rows = data.map(r => `<tr>${keys.map(k => `<td style="border:1px solid #333;padding:4px;font-size:11px;color:#ddd">${r[k] ?? ''}</td>`).join('')}</tr>`).join('');
  win.document.write(`<html><head><title>${title}</title><style>body{background:#0f172a;color:#e2e8f0;font-family:sans-serif}table{border-collapse:collapse;width:100%}th{background:#1e293b;color:#94a3b8;padding:6px;border:1px solid #334155;font-size:11px;text-align:left}</style></head><body><h2>${title}</h2><table><tr>${keys.map(k => `<th>${k}</th>`).join('')}</tr>${rows}</table><script>setTimeout(()=>window.print(),500)</script></body></html>`);
  win.document.close();
};

const AdminInquiries = ({ contacts }: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card p-3 sm:p-5 mb-6 sm:mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
        <h3 className="font-display text-xs sm:text-sm font-bold">Recent Inquiries</h3>
        {contacts.length > 0 && (
          <div className="flex gap-2">
            <button onClick={() => exportCSV(contacts, 'inquiries.csv')} className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1.5 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors">
              <FileDown size={12} /> CSV
            </button>
            <button onClick={() => exportPDF(contacts, 'Recent Inquiries')} className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1.5 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors">
              <FileText size={12} /> PDF
            </button>
          </div>
        )}
      </div>
      {contacts.length === 0 ? (
        <p className="text-xs sm:text-sm text-muted-foreground">No inquiries yet.</p>
      ) : (
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full text-xs sm:text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 sm:px-3 text-[10px] sm:text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left py-2 px-2 sm:px-3 text-[10px] sm:text-xs font-medium text-muted-foreground">Email</th>
                <th className="text-left py-2 px-2 sm:px-3 text-[10px] sm:text-xs font-medium text-muted-foreground">Phone</th>
                <th className="text-left py-2 px-2 sm:px-3 text-[10px] sm:text-xs font-medium text-muted-foreground">Issue</th>
                <th className="text-left py-2 px-2 sm:px-3 text-[10px] sm:text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.slice(0, 20).map((c: any) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/50">
                  <td className="py-2 px-2 sm:px-3">{c.name}</td>
                  <td className="py-2 px-2 sm:px-3 text-muted-foreground truncate max-w-[120px]">{c.email}</td>
                  <td className="py-2 px-2 sm:px-3 text-muted-foreground">{c.phone}</td>
                  <td className="py-2 px-2 sm:px-3"><span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent">{c.issue}</span></td>
                  <td className="py-2 px-2 sm:px-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
