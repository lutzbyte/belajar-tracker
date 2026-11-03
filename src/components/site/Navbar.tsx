import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, Menu, X } from 'lucide-react'
import { site } from '../../data/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { ThemeSwitch } from './ThemeSwitch'

const links = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'tentang', label: 'Tentang' },
  { id: 'proyek', label: 'Proyek' },
  { id: 'kontak', label: 'Kontak' },
]

const IDS = [
  'beranda',
  'tentang',
  'keahlian',
  'proyek',
  'kontak',
]

export default function Navbar({
  page,
}: {
  page: 'home' | 'projects'
}) {
  const [open, setOpen] = useState(false)
  const [desktopActive, setDesktopActive] = useState('beranda')

  const spy = useActiveSection(IDS)

  const mobileActive =
    spy === 'keahlian' ? 'tentang' : spy

  const active =
    page === 'projects'
      ? 'proyek'
      : desktopActive

  const cls = (id: string, block = false) =>
    `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      block ? 'w-full' : ''
    } ${
      active === id
        ? 'bg-leaf text-snow'
        : 'text-pale/80 hover:text-snow'
    }`

  const renderLink = (
    l: (typeof links)[number],
    block = false,
  ) => {
    const handleClick = () => {
      setDesktopActive(l.id)
      setOpen(false)
    }

    const content = (
      <>
        {l.id === 'beranda' && active === 'beranda' && (
          <Home size={14} />
        )}
        {l.label}
      </>
    )

    return page === 'home' ? (
      <a
        key={l.id}
        href={`#${l.id}`}
        onClick={handleClick}
        className={cls(l.id, block)}
      >
        {content}
      </a>
    ) : (
      <Link
        key={l.id}
        to={`/#${l.id}`}
        onClick={handleClick}
        className={cls(l.id, block)}
      >
        {content}
      </Link>
    )
  }

  const brand = (
    <>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-snow text-sm font-extrabold text-pine">
        {site.name.charAt(0).toUpperCase()}
      </span>
      <span className="text-sm font-bold uppercase tracking-wide text-snow">
        {site.name}
      </span>
    </>
  )

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-pine/70 py-2 pl-3 pr-2 shadow-lg shadow-black/10 backdrop-blur-xl sm:pl-4">
          {page === 'home' ? (
            <a
              href="#beranda"
              onClick={() => setDesktopActive('beranda')}
              className="flex items-center gap-3"
            >
              {brand}
            </a>
          ) : (
            <Link to="/" className="flex items-center gap-3">
              {brand}
            </Link>
          )}

          <nav
            aria-label="Navigasi utama"
            className="hidden items-center gap-1 md:flex"
          >
            {links.map((l) => renderLink(l))}
          </nav>

          <div className="hidden md:block">
            <ThemeSwitch />
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-full text-snow transition-colors hover:bg-white/10 md:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="mt-2 rounded-3xl border border-white/10 bg-pine/90 p-3 shadow-lg shadow-black/10 backdrop-blur-xl md:hidden">
            <nav
              aria-label="Navigasi seluler"
              className="flex flex-col gap-1"
            >
              {links.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className={`inline-flex w-full items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    mobileActive === l.id
                      ? 'bg-leaf text-snow'
                      : 'text-pale/80 hover:text-snow'
                  }`}
                >
                  {l.id === 'beranda' &&
                    mobileActive === 'beranda' && (
                      <Home size={14} />
                    )}
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="mt-3 flex items-center justify-between border-t border-white/10 px-2 pt-3">
              <span className="text-sm text-pale/70">Tema</span>
              <ThemeSwitch />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
