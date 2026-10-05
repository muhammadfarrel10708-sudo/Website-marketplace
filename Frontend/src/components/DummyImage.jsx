import { useId } from 'react'

const palettes = [
  ['#0a1030', '#3b5bff', '#22d3ee'],
  ['#0b1f2a', '#14b8a6', '#a3e635'],
  ['#120a2e', '#7c5cff', '#38bdf8'],
  ['#1a1205', '#f59e0b', '#fde047'],
  ['#0a1a1f', '#06b6d4', '#6366f1'],
  ['#0d0d1f', '#4f46e5', '#2dd4bf'],
]

// Gambar dummy berbentuk layar LED. Ganti dengan <img> asli nanti.
export default function DummyImage({ seed = 0, label, ratio = '4 / 3', className = '' }) {
  const uid = useId().replace(/:/g, '')
  const [bg, c1, c2] = palettes[seed % palettes.length]
  return (
    <div className={`relative overflow-hidden ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`a${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
          <pattern id={`p${uid}`} width="5" height="5" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="1.4" fill="#000" fillOpacity=".5" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill={bg} />
        <circle cx={80 + (seed % 3) * 120} cy="60" r="90" fill={c1} fillOpacity=".12" />
        <rect x="45" y="50" width="310" height="175" rx="4" fill={`url(#a${uid})`} />
        <path d="M45 190 L140 110 L200 165 L250 120 L355 200 L355 225 L45 225Z" fill="#000" fillOpacity=".25" />
        <rect x="45" y="50" width="310" height="175" rx="4" fill={`url(#p${uid})`} />
        <rect x="38" y="43" width="324" height="189" rx="8" fill="none" stroke="#2b2b2b" strokeWidth="8" />
        <rect x="190" y="232" width="20" height="46" fill="#222" />
        <rect x="150" y="276" width="100" height="8" rx="3" fill="#333" />
      </svg>
      {label && (
        <span className="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">{label}</span>
      )}
    </div>
  )
}
