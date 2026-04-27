'use client'
import { KundaliChart, PlanetPosition } from '@/lib/astrology'

interface Props {
  chart: KundaliChart
  title: string
  compact?: boolean
}

// North Indian chart house positions (4x4 grid, cell index 0-15)
// Houses 1-12 mapped to grid positions
const HOUSE_POSITIONS: Record<number, number[]> = {
  1:  [5],
  2:  [2],
  3:  [1],
  4:  [4],
  5:  [8],
  6:  [12],
  7:  [10],
  8:  [13],
  9:  [14],
  10: [11],
  11: [7],
  12: [6],
}

// Grid: which cells are visible (not center 4 cells)
const VISIBLE_CELLS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].filter(
  c => !(c === 5 || c === 6 || c === 9 || c === 10)
)

// Cell to house mapping for North Indian style
const CELL_TO_HOUSE: Record<number, number> = {
  0: 12, 1: 11, 2: 10, 3: 9,
  4: 1,  7: 8,
  8: 2,  11: 7,
  12: 3, 13: 4, 14: 5, 15: 6,
}

// Triangle cuts for corner cells
const CELL_CLIP: Record<number, string> = {
  0:  'polygon(0 0, 100% 0, 0 100%)',
  3:  'polygon(0 0, 100% 0, 100% 100%)',
  12: 'polygon(0 0, 100% 100%, 0 100%)',
  15: 'polygon(100% 0, 100% 100%, 0 100%)',
}

const PLANET_ABBR: Record<string, string> = {
  'सूर्य': 'सू', 'चन्द्र': 'च', 'मङ्गल': 'मं', 'बुध': 'बु',
  'बृहस्पति': 'बृ', 'शुक्र': 'शु', 'शनि': 'श', 'राहु': 'रा', 'केतु': 'के',
}

export default function KundaliChartDisplay({ chart, title, compact = false }: Props) {
  const cellSize = compact ? 60 : 80

  // Build house→planets map
  const housePlanets: Record<number, PlanetPosition[]> = {}
  for (let h = 1; h <= 12; h++) housePlanets[h] = []
  chart.planets.forEach(p => {
    if (housePlanets[p.house]) housePlanets[p.house].push(p)
  })

  return (
    <div>
      <h3 className="text-center text-sm font-bold mb-3" style={{ color: 'var(--accent-gold)' }}>
        {title}
      </h3>
      <div className="relative mx-auto"
        style={{
          width: compact ? 240 : 320,
          height: compact ? 240 : 320,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          border: '2px solid',
          borderColor: 'var(--accent-gold)',
        }}>
        {Array.from({ length: 16 }, (_, i) => {
          const house = CELL_TO_HOUSE[i]
          if (!house) return <div key={i} style={{ background: 'var(--bg-secondary)', opacity: 0.3 }} />

          const planets = housePlanets[house] || []
          const isLagna = house === 1
          const isCorner = [0, 3, 12, 15].includes(i)
          const clip = CELL_CLIP[i]

          return (
            <div
              key={i}
              className={`relative flex flex-col items-center justify-center overflow-hidden ${isLagna ? 'lagna-house' : ''}`}
              style={{
                border: '1px solid var(--accent-gold)',
                background: isLagna
                  ? 'rgba(212,172,13,0.12)'
                  : 'var(--bg-card)',
                minHeight: cellSize,
                clipPath: clip,
              }}
            >
              {/* House number */}
              <span
                className="absolute top-1 left-1 text-xs opacity-40 font-mono"
                style={{ color: 'var(--text-muted)', fontSize: '0.55rem' }}
              >
                {house}
              </span>

              {/* Sign name */}
              <span
                className="text-center leading-none opacity-30 font-bold"
                style={{ color: 'var(--accent-gold)', fontSize: compact ? '0.55rem' : '0.6rem' }}
              >
                {chart.houses[house - 1] !== undefined
                  ? ['मे','वृ','मि','क','सि','क','तु','वृ','ध','म','कु','मी'][chart.houses[house - 1]]
                  : ''}
              </span>

              {/* Planets */}
              <div className="flex flex-wrap justify-center gap-px mt-0.5 px-1">
                {planets.map(p => (
                  <span key={p.name} className={`planet-tag ${p.isRetrograde ? 'retrograde' : ''}`}
                    title={`${p.nameNepali} - ${p.signNameNepali} ${p.degree.toFixed(1)}°${p.isRetrograde ? ' (वक्री)' : ''}`}>
                    {PLANET_ABBR[p.nameNepali] || p.nameNepali.slice(0, 2)}
                    {p.isRetrograde ? '(व)' : ''}
                  </span>
                ))}
              </div>

              {/* Lagna label */}
              {isLagna && (
                <span className="text-xs font-bold mt-0.5" style={{ color: 'var(--accent)', fontSize: '0.6rem' }}>
                  ल
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      {!compact && (
        <div className="mt-3 flex flex-wrap gap-1 justify-center">
          {chart.planets.map(p => (
            <span key={p.name} className="text-xs px-2 py-0.5 rounded-full border"
              style={{
                borderColor: p.isRetrograde ? 'rgba(230,57,70,0.4)' : 'var(--border)',
                color: p.isRetrograde ? '#e63946' : 'var(--text-secondary)',
                background: 'var(--bg-secondary)',
                fontSize: '0.7rem',
              }}>
              {PLANET_ABBR[p.nameNepali] || p.nameNepali} - {p.signNameNepali} भाव {p.house}
              {p.isRetrograde ? ' (व)' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
