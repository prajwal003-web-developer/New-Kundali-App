'use client'
import { useState } from 'react'
import { Share2, Printer, Copy, Check } from 'lucide-react'
import { useToast } from '@/components/ui/ToastProvider'

interface Props {
  personName: string
  lagna: string
  rashi: string
  nakshatra: string
  kundaliId?: string
}

export default function SharePrintBar({ personName, lagna, rashi, nakshatra, kundaliId }: Props) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    const text = `${personName}को कुण्डली\nलग्न: ${lagna} | राशि: ${rashi} | नक्षत्र: ${nakshatra}\nज्योतिष कुण्डली App द्वारा`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast('success', 'क्लिपबोर्डमा कपी भयो!')
    } catch {
      toast('error', 'कपी गर्न असफल भयो।')
    }
  }

  const handlePrint = () => window.print()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
        style={{
          background: copied ? 'rgba(34,197,94,0.1)' : 'var(--bg-secondary)',
          borderColor: copied ? 'rgba(34,197,94,0.4)' : 'var(--border)',
          color: copied ? '#22c55e' : 'var(--text-muted)',
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? 'कपी भयो!' : 'कपी गर्नुहोस्'}
      </button>
      <button
        onClick={handlePrint}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      >
        <Printer size={13} />
        प्रिन्ट
      </button>
    </div>
  )
}
