'use client'
import { useState } from 'react'
import { Star, Calendar, Zap, Moon, Sun, BookOpen, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import KundaliChartDisplay from '@/components/charts/KundaliChartDisplay'
import PanchangamDisplay from '@/components/charts/PanchangamDisplay'
import DashaTimeline from '@/components/charts/DashaTimeline'
import SharePrintBar from '@/components/ui/SharePrintBar'
import { FullKundaliData } from '@/lib/astrology'

interface Props {
  chartData: FullKundaliData
  aiInterpretation: string
  personName: string
}

function Section({ title, icon, children, defaultOpen = true }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="card mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--accent)' }}>{icon}</span>
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        </div>
        {open ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  )
}

function InfoBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-3 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="font-bold text-sm" style={{ color: 'var(--accent-gold)', fontFamily: 'Mukta, sans-serif' }}>{value}</p>
    </div>
  )
}

function renderInterpretation(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (line.startsWith('## ')) return <h2 key={i} className="font-display text-lg mt-4 mb-2" style={{ color: 'var(--accent)', fontFamily: 'Yatra One, serif' }}>{line.slice(3)}</h2>
    if (line.startsWith('### ')) return <h3 key={i} className="font-bold mt-3 mb-1" style={{ color: 'var(--accent-gold)' }}>{line.slice(4)}</h3>
    if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 text-sm" style={{ color: 'var(--text-secondary)', listStyle: 'disc' }}>{line.slice(2)}</li>
    if (line.trim() === '') return <br key={i} />
    const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    return <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: bold }} />
  })
}

export default function KundaliResult({ chartData, aiInterpretation, personName }: Props) {
  const [activeChart, setActiveChart] = useState<'D1' | 'D9' | 'D10' | 'D12'>('D1')

  const charts = { D1: chartData.D1, D9: chartData.D9, D10: chartData.D10, D12: chartData.D12 }
  const chartLabels = {
    D1: 'D1 - लग्न चार्ट',
    D9: 'D9 - नवमांश',
    D10: 'D10 - दशमांश',
    D12: 'D12 - द्वादशांश',
  }

  return (
    <div>
      {/* Share/Print bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          वैदिक ज्योतिष गणनाको आधारमा
        </p>
        <SharePrintBar
          personName={personName}
          lagna={chartData.lagna}
          rashi={chartData.rashi}
          nakshatra={chartData.nakshatra}
        />
      </div>

      {/* Summary badges */}
      <Section title="मूल विवरण" icon={<Star size={18} />}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <InfoBadge label="लग्न" value={chartData.lagna} />
          <InfoBadge label="राशि" value={chartData.rashi} />
          <InfoBadge label="नक्षत्र" value={`${chartData.nakshatra} (पाद ${chartData.nakshatraPada})`} />
          <InfoBadge label="योग" value={chartData.yoga} />
          <InfoBadge label="करण" value={chartData.karana} />
          <InfoBadge label="अयनांश" value={`${chartData.birthDetails.ayanamsa}°`} />
        </div>
      </Section>

      {/* Panchangam */}
      <Section title="पञ्चाङ्ग" icon={<Calendar size={18} />}>
        <PanchangamDisplay panchangam={chartData.panchangam} />
      </Section>

      {/* Charts */}
      <Section title="कुण्डली चार्ट" icon={<Sun size={18} />}>
        {/* Chart type selector */}
        <div className="flex gap-2 flex-wrap mb-5">
          {(Object.keys(chartLabels) as Array<keyof typeof chartLabels>).map(key => (
            <button key={key} onClick={() => setActiveChart(key)}
              className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={{
                background: activeChart === key ? 'var(--accent)' : 'var(--bg-secondary)',
                borderColor: activeChart === key ? 'var(--accent)' : 'var(--border)',
                color: activeChart === key ? '#1a0d00' : 'var(--text-muted)',
              }}>
              {chartLabels[key]}
            </button>
          ))}
        </div>
        <KundaliChartDisplay chart={charts[activeChart]} title={chartLabels[activeChart]} />
      </Section>

      {/* Planet positions table */}
      <Section title="ग्रह स्थिति" icon={<Moon size={18} />}>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs min-w-[500px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['ग्रह','राशि','भाव','अंश','नक्षत्र','पाद','अवस्था'].map(h => (
                  <th key={h} className="text-left py-2 px-2 font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.D1.planets.map(p => (
                <tr key={p.name} className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-2 px-2 font-semibold" style={{ color: 'var(--accent)' }}>{p.nameNepali}</td>
                  <td className="py-2 px-2" style={{ color: 'var(--text-primary)' }}>{p.signNameNepali}</td>
                  <td className="py-2 px-2" style={{ color: 'var(--text-primary)' }}>{p.house}</td>
                  <td className="py-2 px-2" style={{ color: 'var(--text-secondary)' }}>{p.degree.toFixed(2)}°</td>
                  <td className="py-2 px-2" style={{ color: 'var(--text-secondary)' }}>{p.nakshatraNameNepali}</td>
                  <td className="py-2 px-2" style={{ color: 'var(--text-secondary)' }}>{p.nakshatraPada}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold`}
                      style={{
                        background: p.isRetrograde ? 'rgba(230,57,70,0.1)' : 'rgba(34,197,94,0.1)',
                        color: p.isRetrograde ? '#e63946' : '#22c55e',
                      }}>
                      {p.isRetrograde ? 'वक्री' : 'मार्गी'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Dasha */}
      <Section title="दशा विवरण" icon={<TrendingUp size={18} />}>
        <DashaTimeline dasha={chartData.dasha} />
      </Section>

      {/* AI Interpretation */}
      <Section title="ज्योतिष व्याख्या (AI)" icon={<BookOpen size={18} />}>
        <div className="interpretation-content prose-sm max-w-none">
          {renderInterpretation(aiInterpretation)}
        </div>
      </Section>
    </div>
  )
}
