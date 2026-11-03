import { Navigate, useParams } from 'react-router-dom'
import { Check, ChevronDown, ExternalLink, RotateCcw, Undo2 } from 'lucide-react'
import { TRACKS, type Link as ResourceLink } from '../data/curriculum'
import { useProgress } from '../hooks/useProgress'
import {
  canBackfill,
  formatDay,
  lastDoneOn,
  lastStudied,
  nextUnit,
  trackDoneOn,
  trackStats,
} from '../lib/progress'
import ProgressBar from '../components/ProgressBar'

function Chips({ links }: { links?: ResourceLink[] }) {
  if (!links?.length) return null
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {links.map((l) => (
        <a
          key={l.url}
          href={l.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-md border border-mist/70 px-2 py-1 text-xs font-medium text-forest transition-colors hover:bg-sand"
        >
          {l.label}
          <ExternalLink size={12} />
        </a>
      ))}
    </div>
  )
}

export default function Track() {
  const { trackId } = useParams()
  const { done, today, error, saveError, complete, undo, backfill, reset } = useProgress()
  const track = TRACKS.find((t) => t.id === trackId)

  if (!track) return <Navigate to="/dashboard" replace />
  if (error) return <p className="text-sm text-red-700">Gagal memuat progress. Coba muat ulang.</p>
  if (!done) return <p className="text-sm text-ink/60">Memuat…</p>

  const stats = trackStats(track, done)
  const next = nextUnit(track, done)
  const doneToday = !track.selfPaced && trackDoneOn(track, done, today)
  const undoId = lastDoneOn(track, done, today)

  const starts: number[] = []
  let total = 0
  for (const s of track.stages) {
    starts.push(total)
    total += s.units.length
  }

  const onReset = () => {
    if (window.confirm(`Reset semua progress ${track.title}? Riwayatnya ikut terhapus.`)) {
      reset(track)
    }
  }

  const onBackfill = () => {
    if (!next) return
    if (
      window.confirm(
        `Tandai sesi ke-${next.day} ${track.title} sebagai selesai kemarin? Pastikan kamu memang sudah mempelajarinya.`,
      )
    ) {
      backfill(track)
    }
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">{track.title}</h1>
          <p className="mt-1 text-sm text-ink/60">{track.subtitle}</p>
          <div className="mt-4 w-72 max-w-full">
            <ProgressBar value={stats.completed} max={stats.total} />
            <p className="mt-2 text-sm">
              <span className="font-semibold">{stats.completed}</span>
              <span className="text-ink/60"> dari {stats.total} materi selesai</span>
              <span className="text-ink/40"> · terakhir belajar {lastStudied(track, done, today)}</span>
            </p>
          </div>

          {doneToday && next && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-sm text-forest">
                Kamu sudah belajar jalur ini hari ini. Sesi berikutnya tersedia besok.
              </p>
              <button
                onClick={() => undo(track)}
                className="inline-flex items-center gap-1.5 text-sm text-ink/70 hover:text-ink hover:underline"
              >
                <Undo2 size={14} /> Batalkan hari ini
              </button>
            </div>
          )}

          {next && !track.selfPaced && canBackfill(track, done, today) && (
            <button
              onClick={onBackfill}
              className="mt-3 block text-left text-xs text-ink/60 underline-offset-2 hover:text-ink hover:underline"
            >
              Kemarin sudah belajar tapi lupa centang? Tandai selesai untuk kemarin
            </button>
          )}

          {saveError && (
            <p className="mt-3 text-sm text-red-700">Gagal menyimpan perubahan terakhir. Coba lagi.</p>
          )}
        </div>

        {stats.completed > 0 && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-mist px-3 py-2 text-sm text-ink/70 transition-colors hover:bg-cream hover:text-ink"
          >
            <RotateCcw size={14} /> Reset progress
          </button>
        )}
      </header>

      <div className="space-y-4">
        {track.stages.map((stage, si) => {
          const stageDone = stage.units.filter((u) => done[u.id]).length
          return (
            <details
              key={stage.id}
              className="group overflow-hidden rounded-xl border border-mist/40 bg-cream"
            >
              <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="font-mono text-sm text-sage">{String(si + 1).padStart(2, '0')}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-[15px] font-semibold">{stage.title}</h2>
                  <p className="mt-0.5 text-xs text-ink/60">
                    {stageDone}/{stage.units.length} selesai · Sesi {starts[si] + 1}–
                    {starts[si] + stage.units.length}
                  </p>
                </div>
                <ChevronDown
                  size={18}
                  className="shrink-0 text-ink/50 transition-transform group-open:rotate-180"
                />
              </summary>

              <div className="border-t border-mist/40">
                <div className="px-5 py-4 text-sm leading-relaxed">
                  <p className="text-ink/70">{stage.description}</p>
                  {stage.routine && (
                    <>
                      <p className="mt-4 font-semibold">Cara belajar tiap hari</p>
                      <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink/70">
                        {stage.routine.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ol>
                    </>
                  )}
                  <Chips links={stage.links} />
                </div>

                <ol className="divide-y divide-mist/40 border-t border-mist/40">
                  {stage.units.map((u, ui) => {
                    const doneDate = done[u.id]
                    const isNext = next?.unit.id === u.id
                    const canCheck = isNext && !doneToday
                    const canUndo = undoId === u.id

                    const hint = canUndo
                      ? 'Batalkan selesai hari ini'
                      : doneDate
                        ? 'Sudah selesai'
                        : isNext
                          ? 'Sudah belajar hari ini, lanjut besok'
                          : 'Selesaikan hari sebelumnya dulu'

                    return (
                      <li
                        key={u.id}
                        className={`flex gap-4 px-5 py-4 ${isNext ? 'bg-forest/5' : ''}`}
                      >
                        <button
                          role="checkbox"
                          aria-checked={Boolean(doneDate)}
                          aria-label={canCheck ? 'Tandai selesai' : hint}
                          title={canCheck ? 'Tandai selesai' : hint}
                          disabled={!canCheck && !canUndo}
                          onClick={() => (canUndo ? undo(track) : complete(track, u.id))}
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed ${
                            doneDate
                              ? 'border-forest bg-forest text-cream'
                              : canCheck
                                ? 'border-mist hover:border-forest'
                                : 'border-mist/60 opacity-40'
                          }`}
                        >
                          {doneDate && <Check size={14} strokeWidth={3} />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="font-mono text-xs text-ink/50">
                              Sesi {starts[si] + ui + 1}
                            </span>
                            {isNext && (
                              <span className="rounded bg-forest/10 px-1.5 py-0.5 text-[11px] font-semibold text-forest">
                                {doneToday ? 'Besok' : 'Berikutnya'}
                              </span>
                            )}
                            {doneDate && (
                              <span className="text-[11px] text-ink/50">
                                selesai {formatDay(doneDate)}
                              </span>
                            )}
                          </div>
                          <h3
                            className={`mt-1 text-sm font-semibold leading-snug ${
                              doneDate ? 'text-ink/50' : ''
                            }`}
                          >
                            {u.title}
                          </h3>
                          {u.tasks && (
                            <ul className="mt-2 space-y-1 text-[13px] leading-relaxed text-ink/70">
                              {u.tasks.map((t, i) => (
                                <li key={i}>{t}</li>
                              ))}
                            </ul>
                          )}
                          {u.practice && (
                            <p className="mt-3 rounded-lg bg-sand/70 px-3 py-2 text-[13px] leading-relaxed">
                              <span className="font-semibold">Latihan:</span> {u.practice}
                            </p>
                          )}
                          <Chips links={u.links} />
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}
