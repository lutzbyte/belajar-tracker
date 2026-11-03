import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePageMeta } from '../hooks/usePageMeta'

const tracks = [
  { no: '01', name: 'Rust', desc: 'Dari hello world sampai ownership, crate, unit test, dan concurrency.' },
  { no: '02', name: 'Bahasa Jepang', desc: 'Hiragana, katakana, tata bahasa dasar, lalu kanji.' },
  { no: '03', name: 'Bahasa Inggris', desc: 'Dari dasar sampai bisa membaca dokumentasi teknis.' },
]

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3a7.2 7.2 0 0 1-4.06 1.14c-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.27 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.55.37-2.27v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.37l4-3.1z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.63l4 3.1C6.22 6.88 8.87 4.77 12 4.77z" />
    </svg>
  )
}

export default function Login() {
  const { user, loading, login } = useAuth()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  usePageMeta({ title: 'Masuk · Belajar Tracker', noindex: true })

  if (!loading && user) return <Navigate to="/dashboard" replace />

  const handleLogin = async () => {
    setError('')
    setBusy(true)
    try {
      await login()
    } catch {
      setError('Login gagal atau dibatalkan. Coba lagi.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="hidden flex-col justify-between bg-deep p-12 text-pale lg:flex">
        <span className="text-[15px] font-bold tracking-tight text-snow">Belajar Tracker</span>

        <div>
          <h1 className="max-w-md text-4xl font-extrabold leading-tight tracking-tight text-snow">
            Satu rencana, tiga jalur belajar.
          </h1>
          <ul className="mt-10 max-w-md space-y-6">
            {tracks.map((t) => (
              <li key={t.no} className="flex gap-5">
                <span className="pt-0.5 font-mono text-sm text-moss">{t.no}</span>
                <div>
                  <p className="font-semibold text-snow">{t.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-pale/70">{t.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-pale/50">Progress tersimpan otomatis ke akunmu.</p>
      </section>

      <section className="grid place-items-center bg-cream px-6 py-12">
        <div className="w-full max-w-sm">
          <span className="text-[15px] font-bold tracking-tight lg:hidden">Belajar Tracker</span>
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight lg:mt-0">Masuk</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            Gunakan akun Google untuk melanjutkan jadwal dan progress belajarmu.
          </p>

          <button
            onClick={handleLogin}
            disabled={busy || loading}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border border-mist bg-cream px-4 py-3 text-sm font-medium transition-colors hover:bg-sand focus:outline-none focus-visible:ring-2 focus-visible:ring-forest disabled:opacity-60"
          >
            <GoogleIcon />
            {busy ? 'Membuka Google…' : 'Lanjut dengan Google'}
          </button>

          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        </div>
      </section>
    </main>
  )
}