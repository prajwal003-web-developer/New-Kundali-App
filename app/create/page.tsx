'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import KundaliForm from '@/components/forms/KundaliForm'
import KundaliResult from '@/components/charts/KundaliResult'
import LoadingSteps from '@/components/ui/LoadingSteps'
import { useAuth } from '@/components/ui/AuthProvider'
import { useToast } from '@/components/ui/ToastProvider'
import { FullKundaliData } from '@/lib/astrology'

type Step = { label: string; sublabel?: string; status: 'pending' | 'active' | 'done' }

const INITIAL_STEPS: Step[] = [
  { label: 'जानकारी प्रक्रिया गर्दै', sublabel: 'जन्म विवरण जाँच गरिँदै...', status: 'pending' },
  { label: 'ग्रह स्थिति गणना', sublabel: 'वैदिक गणना विधि प्रयोग...', status: 'pending' },
  { label: 'चार्ट निर्माण', sublabel: 'D1, D9, D10, D12 चार्ट...', status: 'pending' },
  { label: 'AI व्याख्या', sublabel: 'ज्योतिष विश्लेषण गरिँदै...', status: 'pending' },
  { label: 'डेटाबेसमा सुरक्षित', sublabel: 'कुण्डली सुरक्षित गरिँदै...', status: 'pending' },
]

export default function CreatePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [generating, setGenerating] = useState(false)
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS)
  const [result, setResult] = useState<{ chartData: FullKundaliData; aiInterpretation: string; personName: string } | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [user, authLoading, router])

  const updateStep = (index: number, status: Step['status']) => {
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, status } : s))
  }

  const handleSubmit = async (formData: any) => {
    setGenerating(true)
    setResult(null)
    const fresh = INITIAL_STEPS.map(s => ({ ...s, status: 'pending' as const }))
    setSteps(fresh)

    try {
      // Step 1
      updateStep(0, 'active')
      await new Promise(r => setTimeout(r, 600))
      updateStep(0, 'done')

      // Step 2
      updateStep(1, 'active')
      await new Promise(r => setTimeout(r, 800))
      updateStep(1, 'done')

      // Step 3
      updateStep(2, 'active')

      const res = await fetch('/api/kundali/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      updateStep(2, 'done')
      updateStep(3, 'active')

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'कुण्डली बनाउन असफल भयो।')
      }

      updateStep(3, 'done')
      updateStep(4, 'active')
      await new Promise(r => setTimeout(r, 400))
      updateStep(4, 'done')

      await new Promise(r => setTimeout(r, 300))

      setResult({
        chartData: data.chartData,
        aiInterpretation: data.aiInterpretation,
        personName: formData.fullName,
      })
      toast('success', 'कुण्डली सफलतापूर्वक बनाइयो!')
    } catch (err: any) {
      toast('error', err.message || 'त्रुटि भयो। पुनः प्रयास गर्नुहोस्।')
      setSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'pending' })))
    } finally {
      setGenerating(false)
    }
  }

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🪐</span>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'Yatra One, serif' }}>
              नयाँ कुण्डली बनाउनुहोस्
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            जन्म विवरण भर्नुहोस् र वैदिक कुण्डली तयार गर्नुहोस्
          </p>
        </div>

        {generating ? (
          <LoadingSteps steps={steps} />
        ) : result ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {result.personName}को कुण्डली
              </h2>
              <button onClick={() => setResult(null)} className="btn-secondary text-sm py-2">
                ← नयाँ बनाउनुहोस्
              </button>
            </div>
            <KundaliResult
              chartData={result.chartData}
              aiInterpretation={result.aiInterpretation}
              personName={result.personName}
            />
          </div>
        ) : (
          <KundaliForm onSubmit={handleSubmit} loading={generating} />
        )}
      </div>
    </AppLayout>
  )
}
