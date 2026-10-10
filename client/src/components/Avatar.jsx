// Avatar.jsx — generates beautiful letter-based avatars with Indian color palette
const MALE_COLORS = [
  ['#1e3a5f','#4a90d9'],['#2d4a1e','#6abf5e'],['#4a1e2d','#d96a8a'],
  ['#3d2b1f','#c0834b'],['#1e2d4a','#5e7ad9'],['#2d1e4a','#8a6ad9'],
]
const FEMALE_COLORS = [
  ['#8b1a4a','#e85d9c'],['#6b2d8b','#c47de8'],['#1a5f8b','#5db8e8'],
  ['#8b4a1a','#e89c5d'],['#1a8b6b','#5de8b8'],['#8b6b1a','#e8c45d'],
]

// Get initials from name
function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name[0].toUpperCase()
}

// Consistent color from name hash
function getColorPair(name, gender) {
  const hash = (name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const palette = gender === 'female' ? FEMALE_COLORS : MALE_COLORS
  return palette[hash % palette.length]
}

export default function Avatar({
  name,
  photo,
  gender,
  size = 56,
  style = {},
  className = '',
  onClick,
}) {
  const initials = getInitials(name)
  const [bg, text] = getColorPair(name, gender)
  const fontSize = size > 80 ? size * 0.38 : size * 0.4

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        onClick={onClick}
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          cursor: onClick ? 'pointer' : 'default',
          ...style,
        }}
      />
    )
  }

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${bg}, ${text})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize,
        fontWeight: 700,
        color: '#fff',
        fontFamily: 'Playfair Display, serif',
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        letterSpacing: 1,
        boxShadow: `0 2px 8px ${bg}55`,
        ...style,
      }}
    >
      {initials}
    </div>
  )
}
