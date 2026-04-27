'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import KundaliResult from '@/components/charts/KundaliResult'
import { SkeletonResult } from '@/components/ui/Skeleton'
import { useAuth } from '@/components/ui/AuthProvider'
import { useToast } from '@/components/ui/ToastProvider'

export default function KundaliViewPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [kundali, setKundali] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return }
    if (user) loadKundali()
  }, [user, authLoading])

  const loadKundali = async () => {
    try {
      const res = await fetch(`/api/kundali/${params.id}`)
      if (!res.ok) {
        if (res.status === 404) { toast('error', 'कुण्डली फेला परेन।'); router.push('/dashboard') }
        return
      }
      const data = await res.json()
      setKundali(data.kundali)
    } catch {
      toast('error', 'कुण्डली लोड गर्न असफल।')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('के तपाईं यो कुण्डली मेटाउन चाहनुहुन्छ?')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/kundali/${params.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast('success', 'कुण्डली मेटाइयो।')
        router.push('/dashboard')
      } else {
        toast('error', 'मेटाउन असफल भयो।')
      }
    } catch {
      toast('error', 'मेटाउन असफल भयो।')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back bar */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold hover:underline"
            style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={16} />
            ड्यासबोर्ड
          </Link>
          {kundali && (
            <button onClick={handleDelete} disabled={deleting}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all"
              style={{ borderColor: 'rgba(230,57,70,0.3)', color: '#e63946', background: 'rgba(230,57,70,0.05)' }}>
              {deleting
                ? <div className="w-3.5 h-3.5 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                : <Trash2 size={13} />}
              मेटाउनुहोस्
            </button>
          )}
        </div>

        {loading ? (
          <SkeletonResult />
        ) : kundali ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Yatra One, serif' }}>
                {kundali.personalInfo.fullName}को कुण्डली
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                बनाइएको: {new Date(kundali.createdAt).toLocaleDateString('ne-NP', { year: 'numeric', month: 'long', day: 'numeric' })}
                {' · '}
                {kundali.personalInfo.birthPlace.district || kundali.personalInfo.birthPlace.state}, {kundali.personalInfo.birthPlace.country}
              </p>
            </div>
            <KundaliResult
              chartData={kundali.chartData}
              aiInterpretation={kundali.aiInterpretation}
              personName={kundali.personalInfo.fullName}
            />
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🌌</div>
            <p style={{ color: 'var(--text-muted)' }}>कुण्डली फेला परेन।</p>
            <Link href="/dashboard" className="btn-primary inline-flex mt-4 text-sm py-2 px-4">
              ड्यासबोर्ड
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
