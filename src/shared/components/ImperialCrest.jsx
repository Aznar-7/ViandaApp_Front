const SPOKES = [0, 60, 120, 180, 240, 300]
const R = 46
const r = 19

export default function ImperialCrest({ className }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <circle cx="50" cy="50" r={R} stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r={r} stroke="currentColor" strokeWidth="1.5" />

      {SPOKES.map((deg) => {
        const rad = (deg * Math.PI) / 180
        return (
          <line
            key={deg}
            x1={50 + r * Math.cos(rad)}  y1={50 + r * Math.sin(rad)}
            x2={50 + R * Math.cos(rad)}  y2={50 + R * Math.sin(rad)}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        )
      })}

      {SPOKES.map((deg) => {
        const a1 = (deg * Math.PI) / 180
        const a2 = ((deg + 60) * Math.PI) / 180
        const am = ((deg + 30) * Math.PI) / 180
        const rm = 34
        const x1 = 50 + r * Math.cos(a1),   y1 = 50 + r * Math.sin(a1)
        const xm = 50 + rm * Math.cos(am),   ym = 50 + rm * Math.sin(am)
        const x2 = 50 + r * Math.cos(a2),   y2 = 50 + r * Math.sin(a2)
        return (
          <path
            key={`f${deg}`}
            d={`M ${x1} ${y1} L ${xm} ${ym} L ${x2} ${y2} Z`}
            fill="currentColor"
            fillOpacity="0.18"
          />
        )
      })}

      <circle cx="50" cy="50" r="5.5" fill="currentColor" />
    </svg>
  )
}
