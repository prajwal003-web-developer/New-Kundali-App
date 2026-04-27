'use client'
import { DashaPeriod } from '@/lib/astrology'

interface Props {
  dasha: DashaPeriod
}

const PLANET_COLORS: Record<string, string> = {
  Sun: '#ff9500',
  Moon: '#c8a8f0',
  Mars: '#e63946',
  Mercury: '#2ecc71',
  Jupiter: '#f4d03f',
  Venus: '#ff85c2',
  Saturn: '#708090',
  Rahu: '#8b5cf6',
  Ketu: '#6b7280',
}

export default function DashaTimeline({ dasha }: Props) {
  const total = dasha.antardasha.length
  const barColors = [
    '#ff7a0a', '#d4ac0d', '#8b5cf6', '#e63946', '#2ecc71',
    '#c8a8f0', '#ff85c2', '#708090', '#6b7280',
  ]

  return (
    <div>
      {/* Mahadasha header */}
      <div className="flex items-center justify-between mb-5 p-4 rounded-xl"
        style={{ background: 'rgba(255,122,10,0.08)', border: '1px solid rgba(255,122,10,0.25)' }}>
        <div>
          <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>महादशा</p>
          <p className="text-xl font-bold" style={{ color: 'var(--accent)', fontFamily: 'Yatra One, serif' }}>
            {dasha.planetNepali} महादशा
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {dasha.startDate} → {dasha.endDate}
          </p>
        </div>
        <div className="text-right">
          <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 font-bold text-lg"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
            {Math.floor(dasha.yearsRemaining)}
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>बाँकी वर्ष</p>
        </div>
      </div>

      {/* Timeline bar */}
      <div className="mb-5">
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>अन्तर्दशा प्रगति</p>
        <div className="flex rounded-full overflow-hidden h-3" style={{ background: 'var(--bg-secondary)' }}>
          {dasha.antardasha.map((ad, i) => (
            <div
              key={i}
              className="h-full transition-all"
              style={{
                width: `${100 / total}%`,
                background: barColors[i % barColors.length],
                opacity: 0.8,
              }}
              title={ad.planetNepali}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{dasha.startDate}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{dasha.endDate}</span>
        </div>
      </div>

      {/* Antardasha list */}
      <div className="space-y-2">
        <p className="text-xs font-bold mb-3" style={{ color: 'var(--text-muted)' }}>अन्तर्दशा विवरण</p>
        <div className="grid gap-2">
          {dasha.antardasha.map((ad, i) => (
            <div key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:opacity-90"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: barColors[i % barColors.length] }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{ad.planetNepali} अन्तर्दशा</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {ad.startDate} → {ad.endDate}
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                style={{ background: `${barColors[i % barColors.length]}22`, color: barColors[i % barColors.length], border: `1px solid ${barColors[i % barColors.length]}44` }}>
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
