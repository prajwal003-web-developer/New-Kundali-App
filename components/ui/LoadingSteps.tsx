'use client'
import { CheckCircle, Circle, Loader } from 'lucide-react'

interface Step {
  label: string
  sublabel?: string
  status: 'pending' | 'active' | 'done'
}

export default function LoadingSteps({ steps }: { steps: Step[] }) {
  return (
    <div className="card max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ background: 'linear-gradient(135deg, #ff7a0a22, #d4ac0d22)', border: '2px solid var(--accent)' }}>
          <span className="text-2xl">🪐</span>
        </div>
        <h2 className="font-display text-lg" style={{ color: 'var(--accent)', fontFamily: 'Yatra One, serif' }}>
          कुण्डली निर्माण भइरहेको छ
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>कृपया प्रतीक्षा गर्नुहोस्...</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              {step.status === 'done' && <CheckCircle size={20} style={{ color: '#22c55e' }} />}
              {step.status === 'active' && <Loader size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />}
              {step.status === 'pending' && <Circle size={20} style={{ color: 'var(--border)' }} />}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{
                color: step.status === 'done' ? '#22c55e' : step.status === 'active' ? 'var(--accent)' : 'var(--text-muted)'
              }}>
                {step.label}
              </p>
              {step.sublabel && (
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{step.sublabel}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            background: 'linear-gradient(90deg, var(--accent), var(--accent-gold))',
            width: `${(steps.filter(s => s.status === 'done').length / steps.length) * 100}%`,
          }}
        />
      </div>
    </div>
  )
}
