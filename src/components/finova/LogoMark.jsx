export default function LogoMark({ size = 32, className = '' }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0a0e17" stroke="rgba(201,162,39,0.25)" strokeWidth="1" />
      <g transform="rotate(135 32 32)" strokeLinecap="round" fill="none">
        <circle cx="32" cy="32" r="22" stroke="#2a3346" strokeWidth="5" strokeDasharray="103.67 34.56" />
        <circle cx="32" cy="32" r="22" stroke="#c9a227" strokeWidth="5" strokeDasharray="74.64 138.23" />
      </g>
    </svg>
  );
}