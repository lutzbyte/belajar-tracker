import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { ExternalLink, FileText, ImagePlus, Plus, Trash2, Upload, X } from 'lucide-react'
import { site } from '../data/site'
import { loadPortfolio, savePortfolio, type CvMeta } from '../lib/portfolio'
import { deleteCv, MAX_CV_BYTES, uploadCv } from '../lib/cv'
import { fileToImage } from '../lib/image'
import Avatar from '../components/portfolio/Avatar'
import SkillIcon from '../components/portfolio/SkillIcon'
import { Section, input } from '../components/admin/form'

type Draft = { photoUrl: string; skills: string[] }
type Status = 'idle' | 'saving' | 'saved' | 'error'

const formatSize = (b: number) =>
  b >= 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`

export default function PortfolioEditor() {
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saved, setSaved] = useState<Draft | null>(null)
  const [cv, setCv] = useState<CvMeta | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [cvBusy, setCvBusy] = useState(false)
  const [cvMsg, setCvMsg] = useState('')
  const [skillInput, setSkillInput] = useState('')
  const [loadError, setLoadError] = useState(false)
  const photoRef = useRef<HTMLInputElement>(null)
  const cvRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadPortfolio()
      .then((p) => {
        const d = { photoUrl: p.photoUrl, skills: p.skills }
        setDraft(d)
        setSaved(d)
        setCv(p.cv)
      })
      .catch(() => setLoadError(true))
  }, [])

  if (loadError) return <p className="text-sm text-red-700">Gagal memuat data. Coba muat ulang.</p>
  if (!draft || !saved) return <p className="text-sm text-ink/60">Memuat…</p>

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const isData = draft.photoUrl.startsWith('data:')

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft({ ...draft, [key]: value })
    setStatus('idle')
  }

  const addSkill = () => {
    const s = skillInput.trim()
    setSkillInput('')
    if (!s || draft.skills.some((x) => x.toLowerCase() === s.toLowerCase())) return
    set('skills', [...draft.skills, s])
  }

  const onPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoError('File harus berupa gambar.')
      return
    }
    try {
      set('photoUrl', await fileToImage(file, 400, 400, 0.85))
      setPhotoError('')
    } catch {
      setPhotoError('Gagal membaca gambar. Coba format JPG atau PNG.')
    }
  }

  const onCv = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setCvMsg('')
    if (file.type !== 'application/pdf') {
      setCvMsg('CV harus berformat PDF.')
      return
    }
    if (file.size > MAX_CV_BYTES) {
      setCvMsg('Ukuran CV maksimal 3 MB.')
      return
    }
    setCvBusy(true)
    try {
      setCv(await uploadCv(file, cv))
      setCvMsg('CV tersimpan.')
    } catch {
      setCvMsg('Gagal mengunggah CV. Pastikan akunmu admin dan Firestore Rules sudah dipublikasikan.')
    } finally {
      setCvBusy(false)
    }
  }

  const onDeleteCv = async () => {
    if (!cv || !window.confirm('Hapus CV? Tombol Download CV akan hilang dari halaman utama.')) return
    setCvBusy(true)
    setCvMsg('')
    try {
      await deleteCv(cv)
      setCv(null)
      setCvMsg('CV dihapus.')
    } catch {
      setCvMsg('Gagal menghapus CV.')
    } finally {
      setCvBusy(false)
    }
  }

  const onSave = async () => {
    const clean: Draft = { photoUrl: draft.photoUrl.trim(), skills: draft.skills }
    setStatus('saving')
    setMessage('')
    try {
      await savePortfolio(clean)
      setDraft(clean)
      setSaved(clean)
      setStatus('saved')
    } catch {
      setStatus('error')
      setMessage('Gagal menyimpan. Pastikan akunmu admin dan Firestore Rules sudah dipublikasikan.')
    }
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portofolio</h1>
          <p className="mt-1 text-sm text-ink/60">
            Foto, CV, dan keahlian di halaman utama.{' '}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-forest hover:underline"
            >
              Lihat halaman <ExternalLink size={12} />
            </a>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink/60">
            {status === 'saving' && 'Menyimpan…'}
            {status === 'saved' && !dirty && 'Tersimpan'}
          </span>
          <button
            onClick={onSave}
            disabled={!dirty || status === 'saving'}
            className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-cream transition hover:bg-forest/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-sand disabled:opacity-40"
          >
            Simpan
          </button>
        </div>
      </header>

      {status === 'error' && message && <p className="mb-4 text-sm text-red-700">{message}</p>}

      <div className="space-y-6">
        <Section
          title="Foto profil"
          desc="Pakai link gambar atau unggah file. File unggahan dipotong persegi dan diperkecil otomatis. Kalau kosong, dipakai /foto.jpg."
        >
          <div className="flex flex-wrap items-center gap-5">
            <Avatar key={draft.photoUrl} src={draft.photoUrl} name={site.name} size={96} />
            <div className="min-w-0 flex-1 space-y-3">
              <input
                className={input}
                placeholder={isData ? 'Memakai foto hasil unggahan' : 'https://…/foto.jpg'}
                value={isData ? '' : draft.photoUrl}
                onChange={(e) => set('photoUrl', e.target.value)}
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-mist px-3 py-2 text-sm font-medium transition-colors hover:bg-sand"
                >
                  <ImagePlus size={14} /> Unggah foto
                </button>
                {draft.photoUrl && (
                  <button
                    type="button"
                    onClick={() => set('photoUrl', '')}
                    className="text-sm text-ink/60 hover:text-ink hover:underline"
                  >
                    Hapus foto
                  </button>
                )}
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPhoto}
                />
              </div>
              {photoError && <p className="text-sm text-red-700">{photoError}</p>}
            </div>
          </div>
        </Section>

        <Section
          title="CV"
          desc="Format PDF, maksimal 3 MB. Perubahan CV langsung tersimpan tanpa menekan Simpan. Tombol Download CV di halaman utama hanya muncul kalau CV ada."
        >
          {cv ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-mist/50 px-4 py-3">
              <FileText size={18} className="shrink-0 text-forest" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{cv.name}</p>
                <p className="text-xs text-ink/50">{formatSize(cv.size)}</p>
              </div>
              <button
                type="button"
                onClick={onDeleteCv}
                disabled={cvBusy}
                className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-red-700 disabled:opacity-50"
              >
                <Trash2 size={14} /> Hapus
              </button>
            </div>
          ) : (
            <p className="text-sm text-ink/60">Belum ada CV.</p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => cvRef.current?.click()}
              disabled={cvBusy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-mist px-3 py-2 text-sm font-medium transition-colors hover:bg-sand disabled:opacity-50"
            >
              <Upload size={14} /> {cvBusy ? 'Memproses…' : cv ? 'Ganti CV' : 'Unggah CV'}
            </button>
            <input
              ref={cvRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={onCv}
            />
            {cvMsg && <span className="text-sm text-ink/70">{cvMsg}</span>}
          </div>
        </Section>

        <Section
          title="Keahlian"
          desc="Ketik nama bahasa atau tool, misalnya Rust, C++, React. Ikon muncul otomatis, dan kalau tidak ditemukan dipakai ikon kode umum."
        >
          <div className="flex gap-2">
            <input
              className={input}
              placeholder="Nama teknologi"
              maxLength={40}
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill()
                }
              }}
            />
            <button
              type="button"
              onClick={addSkill}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-mist px-3 py-2 text-sm font-medium transition-colors hover:bg-sand"
            >
              <Plus size={14} /> Tambah
            </button>
          </div>

          {draft.skills.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {draft.skills.map((s) => (
                <li
                  key={s}
                  className="inline-flex items-center gap-2 rounded-lg border border-mist/70 bg-sand py-1.5 pl-2.5 pr-1.5 text-sm"
                >
                  <SkillIcon name={s} size={18} />
                  {s}
                  <button
                    type="button"
                    onClick={() => set('skills', draft.skills.filter((x) => x !== s))}
                    aria-label={`Hapus ${s}`}
                    className="rounded p-0.5 text-ink/50 hover:bg-cream hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  )
}