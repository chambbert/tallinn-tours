import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAdminSession } from '@/lib/auth'
import AdminLogoutButton from '@/components/AdminLogoutButton'
import { LayoutDashboard, Map, Users, LogOut } from 'lucide-react'

export const metadata = {
  title: 'Admin — Tallinn Tours',
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: '/admin/tours', label: 'Tours', icon: <Map size={18} /> },
    { href: '/admin/registrations', label: 'Registrations', icon: <Users size={18} /> },
  ]

  return (
    <div className="min-h-screen bg-[#0f1623] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a2235] border-r border-[#232d42] flex flex-col fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[#232d42]">
          <Link href="/" className="flex items-center gap-2.5">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c9a84c"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            <span className="text-[#c9a84c] font-semibold tracking-[0.12em] text-sm uppercase">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#8892a4] hover:text-white hover:bg-[#232d42] transition-colors text-sm font-medium group"
            >
              <span className="group-hover:text-[#c9a84c] transition-colors">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-[#232d42] space-y-2">
          <div className="px-3 py-2">
            <p className="text-[#8892a4] text-xs">Signed in as</p>
            <p className="text-white text-sm font-medium truncate">{session.email}</p>
          </div>
          <AdminLogoutButton />
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#8892a4] hover:text-white hover:bg-[#232d42] transition-colors text-sm"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            View Site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  )
}
