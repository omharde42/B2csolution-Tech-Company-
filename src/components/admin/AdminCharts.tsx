import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(220,60%,50%)', 'hsl(0,78%,55%)', 'hsl(145,65%,42%)', 'hsl(45,90%,50%)', 'hsl(280,60%,50%)'];
const tooltipStyle = { background: 'hsl(222,35%,10%)', border: '1px solid hsl(222,25%,18%)', borderRadius: 8, color: 'hsl(210,25%,93%)' };

interface Props {
  orders: any[];
  pageViews: any[];
  contacts: any[];
}

const AdminCharts = ({ orders, pageViews, contacts }: Props) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const ordersPerDay = last7Days.map(day => ({
    date: day.slice(5),
    orders: orders.filter(o => o.created_at?.startsWith(day)).length,
    revenue: orders.filter(o => o.created_at?.startsWith(day)).reduce((s: number, o: any) => s + Number(o.total), 0),
  }));

  const viewsPerDay = last7Days.map(day => ({
    date: day.slice(5),
    views: pageViews.filter(v => v.created_at?.startsWith(day)).length,
  }));

  const issueCounts: Record<string, number> = {};
  contacts.forEach((c: any) => { issueCounts[c.issue] = (issueCounts[c.issue] || 0) + 1; });
  const issueData = Object.entries(issueCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 mb-6 sm:mb-10">
      <div className="rounded-xl border border-border bg-card p-3 sm:p-5">
        <h3 className="font-display text-xs sm:text-sm font-bold mb-3 sm:mb-4">Orders (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ordersPerDay}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215,15%,55%)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(215,15%,55%)' }} width={30} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="orders" fill="hsl(220,60%,50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-border bg-card p-3 sm:p-5">
        <h3 className="font-display text-xs sm:text-sm font-bold mb-3 sm:mb-4">Visitor Traffic (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={viewsPerDay}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215,15%,55%)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(215,15%,55%)' }} width={30} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="views" stroke="hsl(145,65%,42%)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {issueData.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-3 sm:p-5">
          <h3 className="font-display text-xs sm:text-sm font-bold mb-3 sm:mb-4">Inquiries by Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={issueData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={{ fontSize: 10 }}>
                {issueData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-3 sm:p-5">
        <h3 className="font-display text-xs sm:text-sm font-bold mb-3 sm:mb-4">Revenue (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ordersPerDay}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(215,15%,55%)' }} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(215,15%,55%)' }} width={30} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="revenue" fill="hsl(145,65%,42%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminCharts;
