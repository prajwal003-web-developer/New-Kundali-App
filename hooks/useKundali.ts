'use client'
import { useState, useCallback } from 'react'
import { useToast } from '@/components/ui/ToastProvider'

export interface KundaliListItem {
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

export function useKundaliList() {
  const [kundalis, setKundalis] = useState<KundaliListItem[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/kundali/list')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setKundalis(data.kundalis || [])
    } catch {
      toast('error', 'कुण्डली सूची लोड गर्न असफल भयो।')
    } finally {
      setLoading(false)
    }
  }, [toast])

  const remove = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/kundali/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setKundalis(prev => prev.filter(k => k._id !== id))
      toast('success', 'कुण्डली मेटाइयो।')
      return true
    } catch {
      toast('error', 'मेटाउन असफल भयो।')
      return false
    }
  }, [toast])

  return { kundalis, loading, fetch: fetch_, remove }
}

export function useKundaliDetail() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const load = useCallback(async (id: string) => {
    setLoading(true)
    setData(null)
    try {
      const res = await fetch(`/api/kundali/${id}`)
      if (!res.ok) throw new Error('Not found')
      const json = await res.json()
      setData(json.kundali)
    } catch {
      toast('error', 'कुण्डली लोड गर्न असफल।')
    } finally {
      setLoading(false)
    }
  }, [toast])

  return { data, loading, load }
}
