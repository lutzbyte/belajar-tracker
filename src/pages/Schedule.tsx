import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useSchedule } from '../hooks/useSchedule'
import {
  CATEGORIES,
  buildTimeline,
  defaultConfig,
  formatDuration,
  newBlock,
  summarize,
  type Category,
  type ScheduleConfig,
} from '../lib/schedule'
import Timeline from '../components/Timeline'

type Status = 'idle' | 'saving' | 'saved' | 'error'

const input =
  'rounded-lg border border-mist bg-cream px-3 py-2 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20'

export default function Schedule() {
  const { config, error, save } = useSchedule()
  const [draft, setDraft] = useState<ScheduleConfig | null>(null)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (config) setDraft(config)
  }, [config])

  if (error) return <p className="text-sm text-red-700">Gagal memuat jadwal. Coba muat ulang.</p>
  if (!config || !draft) return <p className="text-sm text-ink/60">Memuat…</p>

  const dirty = JSON.stringify(draft) !== JSON.stringify(config)
  const items = buildTimeline(draft)
  const total = summarize(draft.blocks).total
  const endTime = items.length ? items[items.length - 1].end : draft.startTime

  const edit = (next: ScheduleConfig) => {
    setDraft(next)
    setStatus('idle')
  }

  const patch = (id: string, p: Partial<ScheduleConfig['blocks'][number]>) =>
    edit({ ...draft, blocks: draft.blocks.map((b) => (b.id === id ? { ...b, ...p } : b)) })

  const move = (index: number, dir: -1 | 1) => {
    const to = index + dir
    if (to < 0 || to >= draft.blocks.length) return
    const blocks = [...draft.blocks]
    ;[blocks[index], blocks[to]] = [blocks[to], blocks[index]]
    edit({ ...draft, blocks })
  }

  const onSave = async () => {
    const clean: ScheduleConfig = {
      startTime: draft.startTime || '09:00',
      blocks: draft.blocks.filter((b) => b.title.trim() && b.minutes > 0),
    }
    setStatus('saving')
    try {
      await save(clean)
      setDraft(clean)
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jadwal</h1>
          <p className="mt-1 text-sm text-ink/60">
            Pilih jam mulai, jadwal lainnya dihitung otomatis dari durasi tiap sesi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink/60">
            {status === 'saving' && 'Menyimpan…'}
            {status === 'saved' && !dirty && 'Tersimpan'}
            {status === 'error' && 'Gagal menyimpan, coba lagi'}
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

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <div className="space-y-6">
          <section className="rounded-xl border border-mist/40 bg-cream p-5">
            <label htmlFor="start" className="text-sm font-semibold">
              Mulai belajar pukul
            </label>
            <div className="mt-3 flex items-center gap-4">
              <input
                id="start"
                type="time"
                value={draft.startTime}
                onChange={(e) => edit({ ...draft, startTime: e.target.value })}
                className={`${input} text-base font-semibold`}
              />
              <p className="text-sm text-ink/60">
                Total {formatDuration(total)}, selesai pukul {endTime}
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-mist/40 bg-cream">
            <header className="border-b border-mist/40 px-5 py-3.5">
              <h2 className="text-sm font-semibold">Durasi per sesi</h2>
            </header>

            <ul className="divide-y divide-mist/40">
              {draft.blocks.map((b, i) => (
                <li key={b.id} className="space-y-3 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <input
                      value={b.title}
                      placeholder="Nama sesi"
                      onChange={(e) => patch(b.id, { title: e.target.value })}
                      className={`${input} min-w-0 flex-1`}
                    />
                    <button
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Naikkan"
                      className="rounded-md p-1.5 text-ink/50 hover:bg-sand hover:text-ink disabled:opacity-30"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      disabled={i === draft.blocks.length - 1}
                      aria-label="Turunkan"
                      className="rounded-md p-1.5 text-ink/50 hover:bg-sand hover:text-ink disabled:opacity-30"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <button
                      onClick={() =>
                        edit({ ...draft, blocks: draft.blocks.filter((x) => x.id !== b.id) })
                      }
                      aria-label="Hapus"
                      className="rounded-md p-1.5 text-ink/50 hover:bg-sand hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={b.category}
                      onChange={(e) => patch(b.id, { category: e.target.value as Category })}
                      className={`${input} flex-1`}
                    >
                      {Object.entries(CATEGORIES).map(([key, c]) => (
                        <option key={key} value={key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={5}
                        max={600}
                        step={5}
                        value={b.minutes}
                        onChange={(e) =>
                          patch(b.id, {
                            minutes: Math.min(600, Math.max(0, Number(e.target.value) || 0)),
                          })
                        }
                        className={`${input} w-20 text-right`}
                      />
                      <span className="text-sm text-ink/60">menit</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="flex items-center justify-between border-t border-mist/40 px-5 py-3.5">
              <button
                onClick={() => edit({ ...draft, blocks: [...draft.blocks, newBlock()] })}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:underline"
              >
                <Plus size={14} /> Tambah sesi
              </button>
              <button
                onClick={() => edit(defaultConfig())}
                className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink"
              >
                <RotateCcw size={14} /> Kembalikan default
              </button>
            </footer>
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-mist/40 bg-cream lg:sticky lg:top-8">
          <header className="border-b border-mist/40 px-5 py-3.5">
            <h2 className="text-sm font-semibold">Pratinjau</h2>
          </header>
          <Timeline items={items} />
        </section>
      </div>
    </div>
  )
}
