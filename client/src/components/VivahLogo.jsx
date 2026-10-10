// VivahLogo.jsx — Beautiful Vivah matrimonial logo with lotus + mangalsutra motif
export default function VivahLogo({ size = 40, showText = true, style = {} }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}>
      {/* SVG logo mark */}
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer circle */}
        <circle cx="24" cy="24" r="22" fill="#c0392b" opacity="0.08" />
        {/* Lotus petals */}
        <ellipse cx="24" cy="16" rx="4" ry="7" fill="#c0392b" opacity="0.7" transform="rotate(0 24 24)" />
        <ellipse cx="24" cy="16" rx="4" ry="7" fill="#c0392b" opacity="0.55" transform="rotate(45 24 24)" />
        <ellipse cx="24" cy="16" rx="4" ry="7" fill="#c0392b" opacity="0.55" transform="rotate(90 24 24)" />
        <ellipse cx="24" cy="16" rx="4" ry="7" fill="#c0392b" opacity="0.55" transform="rotate(135 24 24)" />
        <ellipse cx="24" cy="16" rx="4" ry="7" fill="#c0392b" opacity="0.55" transform="rotate(180 24 24)" />
        <ellipse cx="24" cy="16" rx="4" ry="7" fill="#c0392b" opacity="0.55" transform="rotate(225 24 24)" />
        <ellipse cx="24" cy="16" rx="4" ry="7" fill="#c0392b" opacity="0.55" transform="rotate(270 24 24)" />
        <ellipse cx="24" cy="16" rx="4" ry="7" fill="#c0392b" opacity="0.55" transform="rotate(315 24 24)" />
        {/* Center circle (gold) */}
        <circle cx="24" cy="24" r="7" fill="#d4a017" />
        <circle cx="24" cy="24" r="4.5" fill="#f5c842" />
        {/* Center heart */}
        <path d="M24 27 C24 27 20 24 20 21.5 A2.5 2.5 0 0 1 24 20 A2.5 2.5 0 0 1 28 21.5 C28 24 24 27 24 27Z" fill="#c0392b" />
      </svg>

      {showText && (
        <span style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: size * 0.6,
          fontWeight: 700,
          color: '#c0392b',
          letterSpacing: 0.5,
          lineHeight: 1,
        }}>
          Vivah
        </span>
      )}
    </span>
  )
}
