/** Lightweight SVG sparkline from a series of numbers */
export function Sparkline({
  values,
  width = 140,
  height = 48,
  color = '#5B8CFF',
}: {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / span) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  const last = values[values.length - 1];
  const first = values[0];
  const up = last >= first;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="sparkline">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={up ? color : '#ef4444'}
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={pts}
      />
    </svg>
  );
}

/** Deterministic fake history from balance for chart demo */
export function buildChartSeries(seed: number, points = 24): number[] {
  const out: number[] = [];
  let v = Math.max(seed, 0.01);
  let n = Math.abs(Math.sin(seed * 12.9898) * 43758.5453);
  for (let i = 0; i < points; i++) {
    n = (n * 1.1) % 1;
    const drift = (n - 0.48) * (v * 0.04 + 0.5);
    v = Math.max(0.01, v + drift);
    out.push(v);
  }
  out[out.length - 1] = Math.max(seed, 0.01);
  return out;
}
