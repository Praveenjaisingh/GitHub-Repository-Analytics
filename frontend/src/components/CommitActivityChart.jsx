import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function CommitActivityChart({ commitActivity }) {
  if (!commitActivity || commitActivity.status !== 'ready' || commitActivity.weeks.length === 0) {
    return (
      <p className="py-8 text-center font-mono text-sm text-mist-500">
        {commitActivity?.status === 'computing'
          ? 'GitHub is computing commit stats for this repository — try again shortly.'
          : 'No commit activity data available.'}
      </p>
    );
  }

  const data = commitActivity.weeks.slice(-26).map((w) => ({
    week: w.week_start.slice(5),
    commits: w.total,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#262D39" vertical={false} />
          <XAxis
            dataKey="week"
            stroke="#7C8697"
            fontSize={10}
            interval={3}
            tickLine={false}
            axisLine={{ stroke: '#333C4A' }}
          />
          <YAxis stroke="#7C8697" fontSize={10} tickLine={false} axisLine={{ stroke: '#333C4A' }} />
          <Tooltip
            contentStyle={{ background: '#1B2029', border: '1px solid #333C4A', borderRadius: 8 }}
            labelStyle={{ color: '#F5F6F8' }}
            cursor={{ fill: 'rgba(242,166,90,0.06)' }}
          />
          <Bar dataKey="commits" fill="#F2A65A" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
