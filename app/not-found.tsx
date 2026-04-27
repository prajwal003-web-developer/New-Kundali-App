import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🌌</div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--accent)', fontFamily: 'Yatra One, serif' }}>
          ४०४
        </h1>
        <p className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          पृष्ठ फेला परेन
        </p>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          तपाईंले खोज्नुभएको पृष्ठ अवस्थित छैन।
        </p>
        <Link href="/" className="btn-primary inline-flex">
          ← गृहपृष्ठमा फर्कनुहोस्
        </Link>
      </div>
    </div>
  )
}
