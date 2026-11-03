import { TRACKS } from '../data/curriculum'
import { useProgress } from '../hooks/useProgress'
import { formatDayLong } from '../lib/progress'

type Info = { order: number; track: string; stage: string; title: string; day: number }

const INDEX = new Map<string, Info>()
TRACKS.forEach((t, order) => {
  let day = 0
  for (const s of t.stages) {
    for (const u of s.units) {
      day++
      INDEX.set(u.id, { order, track: t.title, stage: s.title, title: u.title, day })
    }
  }
})

export default function History() {
  const { done, error } = useProgress()

  if (error) return <p className="text-sm text-red-700">Gagal memuat riwayat. Coba muat ulang.</p>
  if (!done) return <p className="text-sm text-ink/60">Memuat…</p>

  const byDate = new Map<string, Info[]>()
  for (const [id, date] of Object.entries(done)) {
    const info = INDEX.get(id)
    if (!info) continue
    byDate.set(date, [...(byDate.get(date) ?? []), info])
  }
  const dates = [...byDate.keys()].sort().reverse()

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Riwayat</h1>
        <p className="mt-1 text-sm text-ink/60">Semua hari yang sudah kamu selesaikan.</p>
      </header>

      {dates.length === 0 ? (
        <p className="rounded-xl border border-mist/40 bg-cream p-5 text-sm text-ink/70">
          Belum ada riwayat. Selesaikan materi pertamamu di Dashboard.
        </p>
      ) : (
        <div className="space-y-6">
          {dates.map((date) => (
            <section
              key={date}
              className="overflow-hidden rounded-xl border border-mist/40 bg-cream"
            >
              <header className="border-b border-mist/40 px-5 py-3.5">
                <h2 className="text-sm font-semibold">{formatDayLong(date)}</h2>
              </header>
              <ul className="divide-y divide-mist/40">
                {byDate
                  .get(date)!
                  .sort((a, b) => a.order - b.order)
                  .map((i) => (
                    <li key={`${i.track}-${i.day}`} className="px-5 py-3.5">
                      <p className="font-mono text-xs text-ink/50">
                        {i.track} · Hari {i.day} · {i.stage}
                      </p>
                      <p className="mt-1 text-sm font-medium leading-snug">{i.title}</p>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
