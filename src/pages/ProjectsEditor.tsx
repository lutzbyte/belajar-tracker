import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { ImagePlus, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  createProject,
  loadProjects,
  removeProject,
  updateProject,
  type Project,
} from '../lib/projects'
import { fileToImage } from '../lib/image'
import { Field, ListInput, input } from '../components/admin/form'

type Draft = {
  id?: string
  title: string
  description: string
  url: string
  imageUrl: string
  tags: string[]
}

const blank: Draft = { title: '', description: '', url: '', imageUrl: '', tags: [] }

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[] | null>(null)
  const [editing, setEditing] = useState<Draft | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadProjects()
      .then(setProjects)
      .catch(() => setLoadError(true))
  }, [])

  if (loadError) return <p className="text-sm text-red-700">Gagal memuat proyek. Coba muat ulang.</p>
  if (!projects) return <p className="text-sm text-ink/60">Memuat…</p>

  const patch = (p: Partial<Draft>) => setEditing((e) => (e ? { ...e, ...p } : e))
  const isData = editing?.imageUrl.startsWith('data:') ?? false

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.')
      return
    }
    try {
      patch({ imageUrl: await fileToImage(file, 960, 600, 0.8) })
      setError('')
    } catch {
      setError('Gagal membaca gambar. Coba format JPG atau PNG.')
    }
  }

  const onSave = async () => {
    if (!editing) return
    const title = editing.title.trim()
    const url = editing.url.trim()
    const imageUrl = editing.imageUrl.trim()

    if (!title) return setError('Nama proyek wajib diisi.')
    if (url && !/^https?:\/\//i.test(url))
      return setError('Link proyek harus diawali http:// atau https://')
    if (imageUrl && !/^(https?:\/\/|data:image\/)/i.test(imageUrl))
      return setError('Link foto harus diawali http:// atau https://')

    const data = { title, description: editing.description.trim(), url, imageUrl, tags: editing.tags }

    setSaving(true)
    setError('')
    try {
      if (editing.id) await updateProject(editing.id, data)
      else await createProject(data)
      setProjects(await loadProjects())
      setEditing(null)
    } catch {
      setError('Gagal menyimpan. Pastikan akunmu admin dan Firestore Rules sudah dipublikasikan.')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (pr: Project) => {
    if (!window.confirm(`Hapus proyek "${pr.title}"?`)) return
    try {
      await removeProject(pr.id)
      setProjects((list) => list && list.filter((x) => x.id !== pr.id))
    } catch {
      setError('Gagal menghapus proyek.')
    }
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyek</h1>
          <p className="mt-1 text-sm text-ink/60">Proyek terbaru tampil paling atas di halaman utama.</p>
        </div>
        {!editing && (
          <button
            onClick={() => {
              setEditing(blank)
              setError('')
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-cream transition hover:bg-forest/90"
          >
            <Plus size={14} /> Tambah proyek
          </button>
        )}
      </header>

      {editing && (
        <section
          key={editing.id ?? 'new'}
          className="mb-8 space-y-4 rounded-xl border border-mist/40 bg-cream p-5"
        >
          <h2 className="text-sm font-semibold">{editing.id ? 'Ubah proyek' : 'Proyek baru'}</h2>

          <Field label="Nama proyek">
            <input
              className={input}
              maxLength={100}
              value={editing.title}
              onChange={(e) => patch({ title: e.target.value })}
            />
          </Field>
          <Field label="Deskripsi">
            <textarea
              rows={4}
              maxLength={600}
              className={input}
              value={editing.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </Field>
          <Field label="Link proyek" hint="opsional, demo atau repositori">
            <input
              className={input}
              placeholder="https://…"
              value={editing.url}
              onChange={(e) => patch({ url: e.target.value })}
            />
          </Field>
          <Field label="Tag" hint="pisahkan dengan koma">
            <ListInput
              value={editing.tags}
              onChange={(v) => patch({ tags: v })}
              placeholder="Rust, CLI"
            />
          </Field>

          <div>
            <p className="text-sm font-medium">Foto proyek</p>
            <div className="mt-2 grid gap-4 sm:grid-cols-[14rem_1fr]">
              <div className="aspect-[8/5] overflow-hidden rounded-lg bg-sand">
                {editing.imageUrl && (
                  <img src={editing.imageUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="space-y-3">
                <input
                  className={input}
                  placeholder={isData ? 'Memakai foto hasil unggahan' : 'https://…/foto.jpg'}
                  value={isData ? '' : editing.imageUrl}
                  onChange={(e) => patch({ imageUrl: e.target.value })}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-mist px-3 py-2 text-sm font-medium transition-colors hover:bg-sand"
                  >
                    <ImagePlus size={14} /> Unggah foto
                  </button>
                  {editing.imageUrl && (
                    <button
                      type="button"
                      onClick={() => patch({ imageUrl: '' })}
                      className="text-sm text-ink/60 hover:text-ink hover:underline"
                    >
                      Hapus foto
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFile}
                  />
                </div>
                <p className="text-xs text-ink/50">Foto dipotong rasio 8:5 dan diperkecil otomatis.</p>
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onSave}
              disabled={saving}
              className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-cream transition hover:bg-forest/90 disabled:opacity-50"
            >
              {saving ? 'Menyimpan…' : 'Simpan'}
            </button>
            <button
              onClick={() => {
                setEditing(null)
                setError('')
              }}
              className="text-sm text-ink/70 hover:text-ink hover:underline"
            >
              Batal
            </button>
          </div>
        </section>
      )}

      {!editing && error && <p className="mb-4 text-sm text-red-700">{error}</p>}

      {projects.length === 0 ? (
        <p className="rounded-xl border border-dashed border-mist p-8 text-center text-sm text-ink/60">
          Belum ada proyek. Klik "Tambah proyek" untuk memulai.
        </p>
      ) : (
        <ul className="space-y-3">
          {projects.map((pr) => (
            <li
              key={pr.id}
              className="flex gap-4 rounded-xl border border-mist/40 bg-cream p-4"
            >
              <div className="aspect-[8/5] w-28 shrink-0 overflow-hidden rounded-lg bg-sand sm:w-36">
                {pr.imageUrl && (
                  <img src={pr.imageUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">{pr.title}</h3>
                {pr.description && (
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink/60">
                    {pr.description}
                  </p>
                )}
                <div className="mt-3 flex items-center gap-4">
                  <button
                    onClick={() => {
                      setEditing({ ...pr })
                      setError('')
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:underline"
                  >
                    <Pencil size={13} /> Ubah
                  </button>
                  <button
                    onClick={() => onDelete(pr)}
                    className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-red-700"
                  >
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}