import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(220,60%,50%)', 'hsl(0,78%,55%)', 'hsl(145,65%,42%)', 'hsl(45,90%,50%)', 'hsl(280,60%,50%)'];
const tooltipStyle = { background: 'hsl(222,35%,10%)', border: '1px solid hsl(222,25%,18%)', borderRadius: 8, color: 'hsl(210,25%,93%)' };

interface Props {
  orders: any[];
  pageViews: any[];
  contacts: any[];
  from?: Date | null;
  to?: Date | null;
}

const AdminCharts = ({ orders, pageViews, contacts, from, to }: Props) => {
  // Build day buckets for the active range. Default to last 7 days when no range.
  const days: string[] = (() => {
    let start: Date;
    let end: Date;
    if (from && to) {
      start = new Date(from); start.setHours(0, 0, 0, 0);
      end = new Date(to); end.setHours(0, 0, 0, 0);
    } else if (orders.length || pageViews.length) {
      // "All time" — span from earliest record to today (capped at 60 days for readability)
      const all = [...orders, ...pageViews].map(r => new Date(r.created_at).getTime());
      const min = Math.min(...all);
      start = new Date(min); start.setHours(0, 0, 0, 0);
      end = new Date(); end.setHours(0, 0, 0, 0);
      const diff = Math.round((end.getTime() - start.getTime()) / 86400000);
      if (diff > 60) start = new Date(end.getTime() - 60 * 86400000);
    } else {
      end = new Date(); end.setHours(0, 0, 0, 0);
      start = new Date(end); start.setDate(end.getDate() - 6);
    }
    const out: string[] = [];
    const cur = new Date(start);
    while (cur.getTime() <= end.getTime()) {
      out.push(cur.toISOString().split('T')[0]);
      cur.setDate(cur.getDate() + 1);
    }
    return out;
  })();

  const rangeLabel = days.length === 1 ? 'Today' : `Last ${days.length} Days`;

  const ordersPerDay = days.map(day => ({
    date: day.slice(5),
    orders: orders.filter(o => o.created_at?.startsWith(day)).length,
    revenue: orders.filter(o => o.created_at?.startsWith(day)).reduce((s: number, o: any) => s + Number(o.total), 0),
  }));

  const viewsPerDay = days.map(day => ({
    date: day.slice(5),
    views: pageViews.filter(v => v.created_at?.startsWith(day)).length,
  }));

  const issueCounts: Record<string, number> = {};
  contacts.forEach((c: any) => { issueCounts[c.issue] = (issueCounts[c.issue] || 0) + 1; });
  const issueData = Object.entries(issueCounts).map(([name, value]) => ({ name, value }));

  const cardClass = "rounded-2xl border border-border bg-card p-4 sm:p-6 transition-colors hover:border-primary/30";
  const titleClass = "font-display text-sm sm:text-base font-bold mb-4 sm:mb-5 text-foreground";

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
      <div className={cardClass}>
        <h3 className={titleClass}>Orders ({rangeLabel})</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={ordersPerDay}>
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(215,15%,55%)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(215,15%,55%)' }} width={32} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="orders" fill="hsl(220,60%,50%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={cardClass}>
        <h3 className={titleClass}>Visitor Traffic ({rangeLabel})</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={viewsPerDay}>
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(215,15%,55%)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(215,15%,55%)' }} width={32} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="views" stroke="hsl(145,65%,42%)" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {issueData.length > 0 && (
        <div className={cardClass}>
          <h3 className={titleClass}>Inquiries by Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={issueData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={{ fontSize: 11 }}>
                {issueData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className={cardClass}>
        <h3 className={titleClass}>Revenue ({rangeLabel})</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={ordersPerDay}>
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(215,15%,55%)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(215,15%,55%)' }} width={32} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="revenue" fill="hsl(145,65%,42%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminCharts;
