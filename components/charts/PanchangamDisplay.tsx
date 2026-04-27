'use client'
import { Panchangam } from '@/lib/astrology'
import { Sun, Moon, Star, Zap, Clock } from 'lucide-react'

interface Props {
  panchangam: Panchangam
  birthDate?: string
}

const TITHI_DESC: Record<string, string> = {
  'प्रतिपदा': 'नयाँ शुरुआतको लागि शुभ',
  'द्वितीया': 'यात्रा र व्यापारको लागि अनुकूल',
  'तृतीया': 'सामाजिक कार्यको लागि उपयुक्त',
  'चतुर्थी': 'विघ्नहर्ता गणेशको तिथि',
  'पञ्चमी': 'शिक्षा र ज्ञानको लागि शुभ',
  'षष्ठी': 'बालबच्चाको लागि विशेष',
  'सप्तमी': 'सूर्यको तिथि, स्वास्थ्यको लागि',
  'अष्टमी': 'शक्तिको तिथि, साधनाको लागि',
  'नवमी': 'दुर्गाको तिथि',
  'दशमी': 'धर्मको तिथि',
  'एकादशी': 'विष्णुको तिथि, उपवासको दिन',
  'द्वादशी': 'विष्णुको पूजाको लागि शुभ',
  'त्रयोदशी': 'शिवको तिथि',
  'चतुर्दशी': 'शिव र शक्तिको तिथि',
  'पूर्णिमा / अमावास्या': 'पितृको लागि, ध्यान र साधनाको दिन',
}

const VARA_DESC: Record<string, { planet: string; color: string }> = {
  'आइतवार': { planet: 'सूर्य', color: '#ff9500' },
  'सोमवार': { planet: 'चन्द्र', color: '#c8a8f0' },
  'मङ्गलवार': { planet: 'मङ्गल', color: '#e63946' },
  'बुधवार': { planet: 'बुध', color: '#2ecc71' },
  'बिहीवार': { planet: 'बृहस्पति', color: '#f4d03f' },
  'शुक्रवार': { planet: 'शुक्र', color: '#ff85c2' },
  'शनिवार': { planet: 'शनि', color: '#708090' },
}

function PanchaCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div className="flex gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: color ? `${color}22` : 'rgba(255,122,10,0.1)' }}>
        <span style={{ color: color || 'var(--accent)' }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="font-bold text-sm leading-tight" style={{ color: 'var(--text-primary)' }}>{value}</p>
        {sub && <p className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
      </div>
    </div>
  )
}

export default function PanchangamDisplay({ panchangam, birthDate }: Props) {
  const varaInfo = VARA_DESC[panchangam.vara]
  const tithiDesc = TITHI_DESC[panchangam.tithi]

  return (
    <div>
      {birthDate && (
        <div className="mb-4 text-center">
          <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
            जन्म मितिको पञ्चाङ्ग
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{birthDate}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <PanchaCard
          icon={<Moon size={16} />}
          label="तिथि"
          value={panchangam.tithi}
          sub={tithiDesc}
          color="#c8a8f0"
        />
        <PanchaCard
          icon={<Sun size={16} />}
          label="वार"
          value={panchangam.vara}
          sub={varaInfo ? `${varaInfo.planet} ग्रहको दिन` : ''}
          color={varaInfo?.color}
        />
        <PanchaCard
          icon={<Star size={16} />}
          label="नक्षत्र"
          value={panchangam.nakshatra}
          color="#f4d03f"
        />
        <PanchaCard
          icon={<Zap size={16} />}
          label="योग"
          value={panchangam.yoga}
          color="#ff7a0a"
        />
        <PanchaCard
          icon={<Clock size={16} />}
          label="करण"
          value={panchangam.karana}
          color="#2ecc71"
        />
        <div className="flex gap-2">
          <PanchaCard
            icon={<Sun size={14} />}
            label="सूर्योदय"
            value={panchangam.sunriseTime}
            color="#ff9500"
          />
        </div>
      </div>

      {/* Panchanga table */}
      <div className="mt-5 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
        <p className="text-xs font-bold mb-3" style={{ color: 'var(--accent-gold)' }}>
          पञ्चाङ्गका पाँच अङ्ग
        </p>
        <div className="space-y-2">
          {[
            { num: '१', name: 'तिथि', val: panchangam.tithi, desc: 'चन्द्र र सूर्यको अन्तर' },
            { num: '२', name: 'वार', val: panchangam.vara, desc: 'सप्ताहको दिन' },
            { num: '३', name: 'नक्षत्र', val: panchangam.nakshatra, desc: 'चन्द्रको स्थान' },
            { num: '४', name: 'योग', val: panchangam.yoga, desc: 'सूर्य+चन्द्र योग' },
            { num: '५', name: 'करण', val: panchangam.karana, desc: 'अर्ध तिथि' },
          ].map(item => (
            <div key={item.num} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: 'rgba(255,122,10,0.15)', color: 'var(--accent)' }}>
                {item.num}
              </span>
              <span className="text-xs w-16 shrink-0 font-semibold" style={{ color: 'var(--text-muted)' }}>{item.name}</span>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.val}</span>
              <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
