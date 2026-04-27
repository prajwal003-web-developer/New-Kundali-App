'use client'
import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <html>
      <body style={{ margin: 0, fontFamily: 'Mukta, sans-serif', background: '#0a0514', color: '#f0e6ff' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ color: '#ff7a0a', fontFamily: 'Yatra One, serif', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              अनपेक्षित त्रुटि
            </h1>
            <p style={{ color: '#8060a8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {error.message || 'सर्भरमा त्रुटि भयो। पुनः प्रयास गर्नुहोस्।'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={reset}
                style={{ background: '#ff7a0a', color: '#1a0d00', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 700 }}>
                पुनः प्रयास
              </button>
              <a href="/"
                style={{ background: 'transparent', color: '#c8a8f0', border: '1px solid #2d1a5e', borderRadius: 8, padding: '10px 20px', textDecoration: 'none', fontWeight: 600 }}>
                गृहपृष्ठ
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
