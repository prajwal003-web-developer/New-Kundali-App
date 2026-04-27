'use client'
import { useState, useEffect } from 'react'
import { NEPAL_PROVINCES, INDIA_STATES } from '@/lib/locationData'
import { BS_MONTHS_NP, adToBs } from '@/lib/bsConverter'
import { MapPin, Calendar, User, Globe } from 'lucide-react'

interface FormData {
  fullName: string
  gender: string
  calendarType: 'AD' | 'BS'
  adYear: string; adMonth: string; adDay: string
  bsYear: string; bsMonth: string; bsDay: string
  birthHour: string; birthMinute: string
  country: 'Nepal' | 'India'
  province: string; district: string; state: string
  latitude: string; longitude: string; altitude: string
}

interface Props {
  onSubmit: (data: FormData) => void
  loading: boolean
}

export default function KundaliForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<FormData>({
    fullName: '', gender: 'male',
    calendarType: 'AD',
    adYear: '', adMonth: '', adDay: '',
    bsYear: '', bsMonth: '', bsDay: '',
    birthHour: '12', birthMinute: '0',
    country: 'Nepal',
    province: '', district: '', state: '',
    latitude: '', longitude: '', altitude: '',
  })

  const set = (key: keyof FormData, val: string) =>
    setForm(prev => ({ ...prev, [key]: val }))

  // Sync BS <-> AD when calendarType changes or date changes
  useEffect(() => {
    if (form.calendarType === 'AD' && form.adYear && form.adMonth && form.adDay) {
      try {
        const bs = adToBs({ year: +form.adYear, month: +form.adMonth, day: +form.adDay })
        setForm(prev => ({ ...prev, bsYear: String(bs.year), bsMonth: String(bs.month), bsDay: String(bs.day) }))
      } catch {}
    }
  }, [form.adYear, form.adMonth, form.adDay, form.calendarType])

  // Auto-fill location from district/state
  useEffect(() => {
    if (form.country === 'Nepal' && form.province && form.district) {
      const prov = NEPAL_PROVINCES.find(p => p.name === form.province)
      const dist = prov?.districts.find(d => d.name === form.district)
      if (dist) {
        setForm(prev => ({
          ...prev,
          latitude: String(dist.lat),
          longitude: String(dist.lng),
          altitude: String(dist.altitude),
        }))
      }
    }
  }, [form.country, form.province, form.district])

  useEffect(() => {
    if (form.country === 'India' && form.state) {
      const st = INDIA_STATES.find(s => s.name === form.state)
      if (st) {
        setForm(prev => ({
          ...prev,
          latitude: String(st.lat),
          longitude: String(st.lng),
          altitude: String(st.altitude),
        }))
      }
    }
  }, [form.country, form.state])

  const selectedProvince = NEPAL_PROVINCES.find(p => p.name === form.province)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  const inputCls = 'form-input'
  const labelCls = 'form-label'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Personal Info */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} style={{ color: 'var(--accent)' }} />
          <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>व्यक्तिगत जानकारी</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>पूरा नाम *</label>
            <input className={inputCls} placeholder="जस्तै: राम बहादुर थापा" required
              value={form.fullName} onChange={e => set('fullName', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>लिङ्ग *</label>
            <select className={inputCls} value={form.gender} onChange={e => set('gender', e.target.value)}>
              <option value="male">पुरुष</option>
              <option value="female">महिला</option>
              <option value="other">अन्य</option>
            </select>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} style={{ color: 'var(--accent)' }} />
          <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>जन्म मिति र समय</h2>
        </div>

        {/* Calendar type toggle */}
        <div className="flex rounded-lg overflow-hidden border mb-4 w-fit" style={{ borderColor: 'var(--border)' }}>
          {(['AD', 'BS'] as const).map(type => (
            <button key={type} type="button"
              onClick={() => set('calendarType', type)}
              className="px-5 py-2 text-sm font-semibold transition-all"
              style={{
                background: form.calendarType === type ? 'var(--accent)' : 'transparent',
                color: form.calendarType === type ? '#fff' : 'var(--text-muted)',
              }}>
              {type === 'AD' ? 'ईस्वी (AD)' : 'बिक्रम (BS)'}
            </button>
          ))}
        </div>

        {form.calendarType === 'AD' ? (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className={labelCls}>वर्ष *</label>
              <input className={inputCls} type="number" placeholder="जस्तै: 1990" min="1900" max="2025"
                value={form.adYear} onChange={e => set('adYear', e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>महिना *</label>
              <select className={inputCls} value={form.adMonth} onChange={e => set('adMonth', e.target.value)} required>
                <option value="">महिना</option>
                {['जनवरी','फेब्रुअरी','मार्च','अप्रिल','मे','जुन','जुलाई','अगस्ट','सेप्टेम्बर','अक्टोबर','नोभेम्बर','डिसेम्बर'].map((m,i) => (
                  <option key={i+1} value={i+1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>दिन *</label>
              <input className={inputCls} type="number" placeholder="दिन" min="1" max="31"
                value={form.adDay} onChange={e => set('adDay', e.target.value)} required />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className={labelCls}>वर्ष (BS) *</label>
              <input className={inputCls} type="number" placeholder="जस्तै: 2047" min="2000" max="2082"
                value={form.bsYear} onChange={e => set('bsYear', e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>महिना *</label>
              <select className={inputCls} value={form.bsMonth} onChange={e => set('bsMonth', e.target.value)} required>
                <option value="">महिना</option>
                {BS_MONTHS_NP.map((m, i) => (
                  <option key={i+1} value={i+1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>गते *</label>
              <input className={inputCls} type="number" placeholder="गते" min="1" max="32"
                value={form.bsDay} onChange={e => set('bsDay', e.target.value)} required />
            </div>
          </div>
        )}

        {/* Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>घण्टा *</label>
            <select className={inputCls} value={form.birthHour} onChange={e => set('birthHour', e.target.value)}>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{String(i).padStart(2, '0')}:०० बजे</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>मिनेट *</label>
            <select className={inputCls} value={form.birthMinute} onChange={e => set('birthMinute', e.target.value)}>
              {[0,5,10,15,20,25,30,35,40,45,50,55].map(m => (
                <option key={m} value={m}>{String(m).padStart(2, '0')} मिनेट</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Birth Place */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={18} style={{ color: 'var(--accent)' }} />
          <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>जन्म स्थान</h2>
        </div>

        <div className="mb-4">
          <label className={labelCls}>देश *</label>
          <div className="flex gap-3">
            {(['Nepal', 'India'] as const).map(c => (
              <button key={c} type="button"
                onClick={() => { set('country', c); setForm(prev => ({ ...prev, country: c, province: '', district: '', state: '', latitude: '', longitude: '', altitude: '' })) }}
                className="flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-all"
                style={{
                  background: form.country === c ? 'rgba(255,122,10,0.15)' : 'var(--bg-secondary)',
                  borderColor: form.country === c ? 'var(--accent)' : 'var(--border)',
                  color: form.country === c ? 'var(--accent)' : 'var(--text-muted)',
                }}>
                {c === 'Nepal' ? '🇳🇵 नेपाल' : '🇮🇳 भारत'}
              </button>
            ))}
          </div>
        </div>

        {form.country === 'Nepal' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>प्रदेश *</label>
              <select className={inputCls} value={form.province}
                onChange={e => { set('province', e.target.value); set('district', '') }} required>
                <option value="">प्रदेश छान्नुहोस्</option>
                {NEPAL_PROVINCES.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>जिल्ला *</label>
              <select className={inputCls} value={form.district} onChange={e => set('district', e.target.value)} required
                disabled={!form.province}>
                <option value="">जिल्ला छान्नुहोस्</option>
                {selectedProvince?.districts.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className={labelCls}>राज्य *</label>
            <select className={inputCls} value={form.state} onChange={e => set('state', e.target.value)} required>
              <option value="">राज्य छान्नुहोस्</option>
              {INDIA_STATES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
        )}

        {/* Auto-fetched location */}
        {form.latitude && (
          <div className="mt-4 p-3 rounded-lg flex items-start gap-3"
            style={{ background: 'rgba(255,122,10,0.08)', border: '1px solid rgba(255,122,10,0.2)' }}>
            <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
            <div className="grid grid-cols-3 gap-3 flex-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div><span className="opacity-60">अक्षांश</span><br /><strong>{form.latitude}</strong></div>
              <div><span className="opacity-60">देशान्तर</span><br /><strong>{form.longitude}</strong></div>
              <div><span className="opacity-60">उचाई (m)</span><br /><strong>{form.altitude}</strong></div>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading || !form.latitude} className="btn-primary w-full py-3.5 text-base">
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            कुण्डली बनाउँदै...
          </>
        ) : '✨ कुण्डली बनाउनुहोस्'}
      </button>
    </form>
  )
}
