import { Suspense, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  BookOpen,
  CalendarClock,
  Calculator,
  GitBranch,
  Table,
  FileSpreadsheet,
  Binary,
  Code,
  Folder,
  Globe,
  History,
  LayoutDashboard,
  Languages,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { usePageMeta } from '../../hooks/usePageMeta'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true, admin: false },
  { to: '/dashboard/jadwal', label: 'Jadwal', icon: CalendarClock, end: false, admin: false },
  { to: '/dashboard/belajar/rust', label: 'Rust', icon: Code, end: false, admin: false },
  { to: '/dashboard/belajar/jepang', label: 'Bahasa Jepang', icon: Languages, end: false, admin: false },
  { to: '/dashboard/belajar/inggris', label: 'Bahasa Inggris', icon: BookOpen, end: false, admin: false },
  { to: '/dashboard/belajar/matematika', label: 'Matematika', icon: Calculator, end: false, admin: false },
  { to: '/dashboard/belajar/git-github', label: 'Git & GitHub', icon: GitBranch, end: false, admin: false },
  { to: '/dashboard/belajar/google-sheets', label: 'Google Sheets', icon: Table, end: false, admin: false },
  { to: '/dashboard/belajar/excel', label: 'Excel (opsional)', icon: FileSpreadsheet, end: false, admin: false },
  { to: '/dashboard/belajar/sistem-bilangan', label: 'Sistem Bilangan', icon: Binary, end: false, admin: false },
  { to: '/dashboard/riwayat', label: 'Riwayat', icon: History, end: false, admin: false },
  { to: '/dashboard/portofolio', label: 'Portofolio', icon: Globe, end: false, admin: true },
  { to: '/dashboard/proyek', label: 'Proyek', icon: Folder, end: false, admin: true },
]

export default function AppLayout() {
  const { user, logout, isAdmin } = useAuth()
  const [open, setOpen] = useState(false)
  const name = user?.displayName ?? user?.email ?? 'Pengguna'
  const items = nav.filter((n) => !n.admin || isAdmin)

  usePageMeta({ title: 'Dashboard · Belajar Tracker', noindex: true })

  return (
    <div className="min-h-screen bg-sand text-ink">
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-deep text-pale transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link
            to="/dashboard"
            className="text-[15px] font-bold tracking-tight text-snow"
            onClick={() => setOpen(false)}
          >
            Belajar Tracker
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
            className="rounded-md p-1 text-pale/70 hover:text-snow lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-leaf text-snow'
                    : 'text-pale/70 hover:bg-white/5 hover:text-snow'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-2">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt=""
                referrerPolicy="no-referrer"
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-leaf text-sm font-semibold text-snow">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-snow">{name}</p>
              <p className="truncate text-xs text-pale/60">
                {isAdmin ? 'Admin · ' : ''}
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              aria-label="Keluar"
              className="rounded-md p-2 text-pale/70 hover:bg-white/5 hover:text-snow"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-mist/40 bg-sand/90 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Buka menu" className="-ml-1 p-1">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold">Belajar Tracker</span>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
          <Suspense fallback={<p className="text-sm text-ink/60">Memuat…</p>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}