'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star, Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '@/components/ui/AuthProvider'
import { useTheme } from '@/components/ui/ThemeProvider'
import { useToast } from '@/components/ui/ToastProvider'
import { Sun, Moon } from 'lucide-react'

export default function LoginPage() {
  const { user, login } = useAuth()
  const { theme, toggle } = useTheme()
  const { toast } = useToast()
  const router = useRouter()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (user) router.push('/create') }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(form.username, form.password)
    setLoading(false)
    if (result.error) {
      toast('error', result.error)
    } else {
      toast('success', 'स्वागत छ!')
      router.push('/create')
    }
  }

  return (
    <div className="min-h-screen flex mandala-bg" style={{ background: 'var(--bg-primary)' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: 'var(--sidebar-bg)' }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 30% 70%, #ff7a0a 0%, transparent 50%), radial-gradient(circle at 70% 30%, #d4ac0d 0%, transparent 50%)'
        }} />
        <div className="relative z-10 text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-float"
            style={{ background: 'linear-gradient(135deg, #ff7a0a, #d4ac0d)', boxShadow: '0 0 60px rgba(255,122,10,0.4)' }}>
            <Star size={40} className="text-white" fill="white" />
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#f4d03f', fontFamily: 'Yatra One, serif' }}>
            ज्योतिष कुण्डली
          </h1>
          <p className="text-base opacity-70 max-w-sm leading-relaxed" style={{ color: '#c8a8f0' }}>
            वैदिक ज्योतिष विज्ञानद्वारा तपाईंको जीवन र भविष्यको रहस्य उजागर गर्नुहोस्
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {['लग्न गणना', 'दशा विश्लेषण', 'AI व्याख्या', 'नेपाली भाषा'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm"
                style={{ color: '#c8a8f0', opacity: 0.8 }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#ff7a0a' }} />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Theme toggle */}
          <div className="flex justify-end mb-6">
            <button onClick={toggle} className="p-2 rounded-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--text-muted)' }} /> : <Moon size={18} style={{ color: 'var(--text-muted)' }} />}
            </button>
          </div>

          <div className="card">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #ff7a0a, #d4ac0d)' }}>
                <Star size={18} fill="white" className="text-white" />
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--accent)', fontFamily: 'Yatra One, serif' }}>ज्योतिष कुण्डली</span>
            </div>

            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)', fontFamily: 'Yatra One, serif' }}>
              स्वागत छ!
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>लगइन गर्नुहोस्</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="form-label">Username</label>
                <input className="form-input" placeholder="तपाईंको username" required
                  value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">पासवर्ड</label>
                <div className="relative">
                  <input className="form-input pr-10"
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••" required
                    value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity">
                    {showPw ? <EyeOff size={16} style={{ color: 'var(--text-muted)' }} /> : <Eye size={16} style={{ color: 'var(--text-muted)' }} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> लगइन गर्दै...</>
                ) : (
                  <><LogIn size={18} /> लगइन गर्नुहोस्</>
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-5" style={{ color: 'var(--text-muted)' }}>
              खाता छैन?{' '}
              <Link href="/register" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
                दर्ता गर्नुहोस्
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
