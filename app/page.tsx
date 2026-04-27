'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/ui/AuthProvider'
import { Star } from 'lucide-react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      router.replace(user ? '/create' : '/login')
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow"
          style={{ background: 'linear-gradient(135deg, #ff7a0a, #d4ac0d)' }}>
          <Star size={28} fill="white" className="text-white" />
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>लोड गर्दै...</p>
      </div>
    </div>
  )
}
