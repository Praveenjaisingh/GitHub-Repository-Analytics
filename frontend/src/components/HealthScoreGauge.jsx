const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function HealthScoreGauge({ health }) {
  if (!health) return null;
  const { score, rating, breakdown } = health;
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  const color = score >= 75 ? '#6FCF97' : score >= 50 ? '#F2A65A' : '#E8697A';

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <div className="relative flex h-36 w-36 shrink-0 items-center justify-center sm:h-44 sm:w-44">
        <svg viewBox="0 0 160 160" className="h-36 w-36 -rotate-90 sm:h-44 sm:w-44">
          <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#262D39" strokeWidth="10" />
          <circle
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-display text-3xl font-bold text-mist-100 sm:text-4xl">{score}</span>
          <span className="font-mono text-xs text-mist-500">/ 100</span>
          <span className="mt-1 font-mono text-sm" style={{ color }}>
            {'★'.repeat(rating)}
            <span className="text-ink-600">{'★'.repeat(5 - rating)}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-2 font-mono text-xs">
        {Object.entries(breakdown).map(([key, value]) => {
          const max = { commitActivity: 25, popularity: 15, contributors: 15, issueResolution: 15, releaseFrequency: 10, documentation: 10, communityEngagement: 10 }[key] || 10;
          const pct = (value / max) * 100;
          return (
            <div key={key}>
              <div className="mb-1 flex justify-between text-mist-500">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-mist-300">
                  {value}/{max}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-ink-700">
                <div
                  className="h-1.5 rounded-full bg-amber-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
