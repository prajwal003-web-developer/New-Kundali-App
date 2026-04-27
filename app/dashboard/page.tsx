'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Star, Trash2, Eye, PlusCircle, Search, ExternalLink } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import KundaliResult from '@/components/charts/KundaliResult'
import { useAuth } from '@/components/ui/AuthProvider'
import { useToast } from '@/components/ui/ToastProvider'

interface KundaliCard {
  _id: string
  personalInfo: {
    fullName: string
    gender: string
    dateOfBirth: { adYear: number; adMonth: number; adDay: number; calendarType: string }
    birthPlace: { country: string; district?: string; state?: string }
  }
  chartData: { lagna: string; rashi: string; nakshatra: string }
  createdAt: string
}

function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton h-5 w-2/3 mb-3" />
      <div className="skeleton h-3 w-1/3 mb-4" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16" />
        <div className="skeleton h-6 w-16" />
        <div className="skeleton h-6 w-16" />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [kundalis, setKundalis] = useState<KundaliCard[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewingId, setViewingId] = useState<string | null>(null)
  const [viewData, setViewData] = useState<any>(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchKundalis = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/kundali/list')
      if (res.ok) {
        const data = await res.json()
        setKundalis(data.kundalis)
      } else if (res.status === 401) {
        router.push('/login')
      }
    } catch {
      toast('error', 'डेटा लोड गर्न असफल भयो।')
    } finally {
      setLoading(false)
    }
  }, [router, toast])

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return }
    if (user) fetchKundalis()
  }, [user, authLoading, router, fetchKundalis])

  const handleView = async (id: string) => {
    setViewingId(id)
    setViewLoading(true)
    try {
      const res = await fetch(`/api/kundali/${id}`)
      const data = await res.json()
      if (res.ok) setViewData(data.kundali)
      else toast('error', 'कुण्डली लोड गर्न असफल।')
    } catch {
      toast('error', 'कुण्डली लोड गर्न असफल।')
    } finally {
      setViewLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('के तपाईं यो कुण्डली मेटाउन चाहनुहुन्छ?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/kundali/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setKundalis(prev => prev.filter(k => k._id !== id))
        if (viewingId === id) { setViewingId(null); setViewData(null) }
        toast('success', 'कुण्डली मेटाइयो।')
      } else {
        toast('error', 'मेटाउन असफल भयो।')
      }
    } catch {
      toast('error', 'मेटाउन असफल भयो।')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = kundalis.filter(k =>
    k.personalInfo.fullName.toLowerCase().includes(search.toLowerCase())
  )

  const months = ['', 'जन', 'फेब', 'मार', 'अप्र', 'मे', 'जुन', 'जुल', 'अग', 'सेप', 'अक्ट', 'नोभ', 'डिस']

  if (authLoading) return (
    <AppLayout>
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
      </div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <div className="flex h-full">
        {/* Sidebar list */}
        <div className="w-full lg:w-80 shrink-0 border-r flex flex-col"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>

          {/* Header */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <LayoutDashboard size={18} style={{ color: 'var(--accent)' }} />
              <h1 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                मेरो कुण्डली ({kundalis.length})
              </h1>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                className="form-input pl-8 text-sm"
                placeholder="नाम खोज्नुहोस्..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🌟</div>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {search ? 'कुण्डली फेला परेन' : 'अझै कुण्डली बनाइएको छैन'}
                </p>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                  पहिलो कुण्डली बनाउनुहोस्!
                </p>
                <Link href="/create" className="btn-primary text-sm py-2 px-4 inline-flex">
                  <PlusCircle size={16} />
                  नयाँ कुण्डली
                </Link>
              </div>
            ) : (
              filtered.map(k => (
                <div
                  key={k._id}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${viewingId === k._id ? 'border-[var(--accent)]' : 'border-transparent'}`}
                  style={{
                    background: viewingId === k._id ? 'rgba(255,122,10,0.08)' : 'var(--bg-secondary)',
                  }}
                  onClick={() => handleView(k._id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
                        {k.personalInfo.fullName}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {k.personalInfo.dateOfBirth.adYear} {months[k.personalInfo.dateOfBirth.adMonth]} {k.personalInfo.dateOfBirth.adDay}
                        {' · '}
                        {k.personalInfo.birthPlace.district || k.personalInfo.birthPlace.state || k.personalInfo.birthPlace.country}
                      </p>
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {[k.chartData.lagna, k.chartData.rashi].map((v, i) => (
                          <span key={i} className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{ background: 'rgba(255,122,10,0.12)', color: 'var(--accent)', fontSize: '0.65rem' }}>
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(k._id) }}
                      disabled={deleting === k._id}
                      className="opacity-40 hover:opacity-100 hover:text-red-400 transition-all shrink-0 p-1"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {deleting === k._id
                        ? <div className="w-3.5 h-3.5 border border-current rounded-full animate-spin border-t-transparent" />
                        : <Trash2 size={14} />}
                    </button>
                    <Link
                      href={`/kundali/${k._id}`}
                      onClick={e => e.stopPropagation()}
                      className="opacity-40 hover:opacity-100 transition-all shrink-0 p-1"
                      style={{ color: 'var(--text-muted)' }}
                      title="पूर्ण पृष्ठमा हेर्नुहोस्"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* New button */}
          <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link href="/create" className="btn-primary w-full py-2.5 text-sm">
              <PlusCircle size={16} />
              नयाँ कुण्डली बनाउनुहोस्
            </Link>
          </div>
        </div>

        {/* Right panel - view detail */}
        <div className="hidden lg:flex flex-1 flex-col overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
          {viewLoading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <div className="w-10 h-10 border-2 rounded-full animate-spin mx-auto mb-3"
                  style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>लोड गर्दै...</p>
              </div>
            </div>
          ) : viewData ? (
            <div className="max-w-2xl mx-auto w-full p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Yatra One, serif' }}>
                  {viewData.personalInfo.fullName}को कुण्डली
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  बनाइएको: {new Date(viewData.createdAt).toLocaleDateString('ne-NP')}
                </p>
              </div>
              <KundaliResult
                chartData={viewData.chartData}
                aiInterpretation={viewData.aiInterpretation}
                personName={viewData.personalInfo.fullName}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <div className="text-6xl mb-4">🌌</div>
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  कुण्डली छान्नुहोस्
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  बाँयापट्टि सूचीबाट कुण्डली छान्नुहोस्
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
