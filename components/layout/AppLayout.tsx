'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Star, LayoutDashboard, PlusCircle, Menu, X, Sun, Moon,
  LogOut, User, ChevronRight, Sparkles,
} from 'lucide-react'
import { useAuth } from '@/components/ui/AuthProvider'
import { useTheme } from '@/components/ui/ThemeProvider'
import { useToast } from '@/components/ui/ToastProvider'

const navLinks = [
  { href: '/create', label: 'नयाँ कुण्डली', icon: PlusCircle },
  { href: '/dashboard', label: 'मेरो कुण्डली', icon: LayoutDashboard },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const { toast } = useToast()

  const handleLogout = async () => {
    await logout()
    toast('info', 'लगआउट सफल भयो।')
  }

  const Sidebar = () => (
    <aside className="flex flex-col h-full" style={{ background: 'var(--sidebar-bg)' }}>
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ff7a0a, #d4ac0d)' }}>
            <Star size={18} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-display text-lg leading-none" style={{ color: '#f4d03f', fontFamily: 'Yatra One, serif' }}>
              ज्योतिष
            </h1>
            <p className="text-xs opacity-60" style={{ color: 'var(--sidebar-text)' }}>Vedic Kundali</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`sidebar-link ${pathname === href ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
            {pathname === href && <ChevronRight size={14} className="ml-auto opacity-60" />}
          </Link>
        ))}
      </nav>

      {/* User info */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="sidebar-link w-full"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span>{theme === 'dark' ? 'उज्यालो थिम' : 'अँध्यारो थिम'}</span>
        </button>

        {user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #ff7a0a, #d4ac0d)', color: '#1a0d00' }}>
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--sidebar-text)' }}>{user.name}</p>
              <p className="text-xs opacity-50 truncate" style={{ color: 'var(--sidebar-text)' }}>@{user.username}</p>
            </div>
            <button onClick={handleLogout} className="opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--sidebar-text)' }}>
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-60 shrink-0 flex-col" style={{ background: 'var(--sidebar-bg)' }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 flex flex-col z-10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={22} style={{ color: 'var(--text-primary)' }} />
          </button>
          <span className="font-display text-base" style={{ color: '#d4ac0d', fontFamily: 'Yatra One, serif' }}>ज्योतिष कुण्डली</span>
          <button onClick={toggle}>
            {theme === 'dark' ? <Sun size={18} style={{ color: 'var(--text-muted)' }} /> : <Moon size={18} style={{ color: 'var(--text-muted)' }} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
