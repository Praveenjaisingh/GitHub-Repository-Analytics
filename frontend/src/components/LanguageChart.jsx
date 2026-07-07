import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#F2A65A', '#6FCF97', '#E8697A', '#7C9CF2', '#C96F24', '#B7BEC9', '#7C8697'];

export default function LanguageChart({ languages }) {
  if (!languages || languages.length === 0) {
    return <p className="py-8 text-center font-mono text-sm text-mist-500">No language data available.</p>;
  }

  const data = languages.slice(0, 7).map((l) => ({ name: l.name, value: l.percentage }));

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="h-64 w-full sm:w-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} stroke="#0B0E13" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{ background: '#1B2029', border: '1px solid #333C4A', borderRadius: 8 }}
              labelStyle={{ color: '#F5F6F8' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 space-y-2 font-mono text-sm">
        {data.map((entry, index) => (
          <li key={entry.name} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-mist-300">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS[index % COLORS.length] }}
              />
              {entry.name}
            </span>
            <span className="text-mist-100">{entry.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
