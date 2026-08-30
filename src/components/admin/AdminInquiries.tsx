import { FileDown, FileText } from 'lucide-react';
import { buildCsv, downloadCsv, openPrintableTable } from '@/lib/exportSafe';

interface Props {
  contacts: any[];
}

const exportCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  downloadCsv(buildCsv(Object.keys(data[0]), data), filename);
};

const exportPDF = (data: any[], title: string) => {
  openPrintableTable(title, Object.keys(data[0] || {}), data);
};

const AdminInquiries = ({ contacts }: Props) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
        <div>
          <h3 className="font-display text-sm sm:text-base font-bold text-foreground">Recent Inquiries</h3>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{contacts.length} total submission{contacts.length === 1 ? '' : 's'}</p>
        </div>
        {contacts.length > 0 && (
          <div className="flex gap-2">
            <button onClick={() => exportCSV(contacts, 'inquiries.csv')} className="flex items-center gap-1.5 rounded-lg bg-secondary border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary/70 hover:border-primary/40 transition-all">
              <FileDown size={13} /> CSV
            </button>
            <button onClick={() => exportPDF(contacts, 'Recent Inquiries')} className="flex items-center gap-1.5 rounded-lg bg-secondary border border-border px-3 py-2 text-xs text-foreground hover:bg-secondary/70 hover:border-primary/40 transition-all">
              <FileText size={13} /> PDF
            </button>
          </div>
        )}
      </div>
      {contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No inquiries yet.</p>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-xs sm:text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</th>
                <th className="text-left py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Issue</th>
                <th className="text-left py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.slice(0, 20).map((c: any) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="py-3 px-3 sm:px-4 font-medium">{c.name}</td>
                  <td className="py-3 px-3 sm:px-4 text-muted-foreground truncate max-w-[140px]">{c.email}</td>
                  <td className="py-3 px-3 sm:px-4 text-muted-foreground">{c.phone}</td>
                  <td className="py-3 px-3 sm:px-4"><span className="rounded-full bg-accent/10 border border-accent/20 px-2.5 py-1 text-[10px] sm:text-xs text-accent font-medium">{c.issue}</span></td>
                  <td className="py-3 px-3 sm:px-4 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
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
