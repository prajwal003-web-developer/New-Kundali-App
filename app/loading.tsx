export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full animate-spin"
            style={{ border: '2px solid var(--border)', borderTopColor: 'var(--accent)' }} />
          <div className="absolute inset-2 rounded-full flex items-center justify-center text-xl">
            🪐
          </div>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>लोड गर्दै...</p>
      </div>
    </div>
  )
}
