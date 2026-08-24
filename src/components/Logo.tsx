export function CrypteraLogo({ size = 120 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="logo-mark"
      aria-label="Cryptera"
      style={{ filter: 'drop-shadow(0 0 18px rgba(61,126,255,0.55))' }}
    >
      <defs>
        <linearGradient id="crypteraGrad" x1="18" y1="8" x2="102" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5B8CFF" />
          <stop offset="1" stopColor="#2F6BFF" />
        </linearGradient>
      </defs>
      <path
        d="M60 8L100 26V62C100 84 82 102 60 110C38 102 20 84 20 62V26L60 8Z"
        fill="url(#crypteraGrad)"
      />
      <path
        d="M42 60C42 47.8 50.6 40 61.4 40C69.4 40 75.4 44 78 49.8L68.6 54.6C67.4 51.6 64.8 49.8 61.4 49.8C56.4 49.8 52.8 53.8 52.8 60C52.8 66.2 56.4 70.2 61.4 70.2C64.8 70.2 67.4 68.4 68.6 65.4L78 70.2C75.4 76 69.4 80 61.4 80C50.6 80 42 72.2 42 60Z"
        fill="#fff"
      />
    </svg>
  );
}

/** @deprecated use CrypteraLogo */
export const NexusLogo = CrypteraLogo;

export function Identicon({ address, size = 28 }: { address: string; size?: number }) {
  const colors = ['#3D7EFF', '#2F6BFF', '#5B8CFF', '#0B1220', '#1B2A4A', '#7EB0FF', '#1648C7'];
  let hash = 0;
  for (let i = 0; i < address.length; i++) hash = address.charCodeAt(i) + ((hash << 5) - hash);
  const c1 = colors[Math.abs(hash) % colors.length];
  const c2 = colors[Math.abs(hash >> 3) % colors.length];
  const c3 = colors[Math.abs(hash >> 6) % colors.length];
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="identicon">
      <rect width="32" height="32" fill={c1} />
      <path d="M0 0H16V16H0Z" fill={c2} />
      <path d="M16 16H32V32H16Z" fill={c3} />
      <circle cx="16" cy="16" r="6" fill={c1} opacity="0.85" />
    </svg>
  );
}
