import { Link } from 'react-router-dom'
import { ArrowRight, Check, RotateCcw, Undo2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSchedule } from '../hooks/useSchedule'
import { useProgress } from '../hooks/useProgress'
import { MAIN_TRACKS } from '../data/curriculum'
import { buildTimeline } from '../lib/schedule'
import {
  calcStreak,
  canBackfill,
  lastStudied,
  nextUnit,
  trackDoneOn,
  trackStats,
} from '../lib/progress'
import Timeline from '../components/Timeline'
import ProgressBar from '../components/ProgressBar'

export default function Dashboard() {
  const { user } = useAuth()
  const { config, error: scheduleError } = useSchedule()
  const {
    done,
    today,
    error: progressError,
    saveError,
    complete,
    undo,
    backfill,
    reset,
  } = useProgress()
  const firstName = user?.displayName?.split(' ')[0] ?? 'kamu'

  if (scheduleError || progressError) {
    return <p className="text-sm text-red-700">Gagal memuat data. Coba muat ulang.</p>
  }
  if (!config || !done) return <p className="text-sm text-ink/60">Memuat…</p>

  const items = buildTimeline(config)
  const dates = new Set(Object.values(done))
  const streak = calcStreak(dates)
  const all = MAIN_TRACKS.map((t) => trackStats(t, done))
  const completedAll = all.reduce((a, s) => a + s.completed, 0)
  const totalAll = all.reduce((a, s) => a + s.total, 0)

  const stats = [
    { label: 'Streak', value: `${streak} hari` },
    { label: 'Hari aktif', value: `${dates.size} hari` },
    { label: 'Materi selesai', value: `${completedAll}/${totalAll}` },
    { label: 'Mulai belajar', value: config.startTime },
  ]

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Halo, {firstName}</h1>
        <p className="mt-1 text-sm text-ink/60">Pilih jalur yang ingin kamu pelajari. Tidak harus mengambil semuanya setiap hari.</p>
        {saveError && (
          <p className="mt-3 text-sm text-red-700">Gagal menyimpan perubahan terakhir. Coba lagi.</p>
        )}
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((st) => (
          <div key={st.label} className="rounded-xl border border-mist/40 bg-cream p-4">
            <p className="text-xs text-ink/60">{st.label}</p>
            <p className="mt-2 text-xl font-semibold tracking-tight">{st.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-10 text-sm font-semibold">Lanjutkan jalur belajar</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {MAIN_TRACKS.map((track) => {
          const s = trackStats(track, done)
          const next = nextUnit(track, done)
          const doneToday = !track.selfPaced && trackDoneOn(track, done, today)
          const last = lastStudied(track, done, today)

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
            <article
              key={track.id}
              className="flex flex-col rounded-xl border border-mist/40 bg-cream p-5"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold">{track.title}</h3>
                <span className="text-xs text-ink/50">
                  {s.completed}/{s.total}{track.optional ? ' · opsional' : track.selfPaced ? ' · fleksibel' : ''}
                </span>
              </div>
              <div className="mt-3">
                <ProgressBar value={s.completed} max={s.total} />
              </div>
              <p className="mt-3 text-xs text-ink/50">Terakhir belajar: {last}</p>

              {!next ? (
                <>
                  <p className="mt-5 text-sm font-semibold">Semua materi selesai</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink/60">
                    Mau belajar ulang dari awal? Riwayat jalur ini akan dihapus.
                  </p>
                  <div className="mt-auto pt-5">
                    <button
                      onClick={onReset}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-mist px-3 py-2 text-sm font-medium transition-colors hover:bg-sand"
                    >
                      <RotateCcw size={14} /> Reset progress
                    </button>
                  </div>
                </>
              ) : doneToday ? (
                <>
                  <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-forest">
                    <Check size={16} /> Selesai hari ini
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink/60">
                    Lanjut besok. Materi yang sudah selesai ada di Riwayat.
                  </p>
                  <div className="mt-auto flex items-center gap-4 pt-5">
                    <button
                      onClick={() => undo(track)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-mist px-3 py-2 text-sm font-medium transition-colors hover:bg-sand"
                    >
                      <Undo2 size={14} /> Batalkan
                    </button>
                    <Link to="/dashboard/riwayat" className="text-sm font-medium text-forest hover:underline">
                      Lihat riwayat
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="mt-5 font-mono text-xs text-ink/50">
                    Sesi {next.day} · {next.stage.title}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-snug">{next.unit.title}</p>
                  {next.unit.practice && (
                    <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-ink/70">
                      {next.unit.practice}
                    </p>
                  )}
                  <div className="mt-auto pt-5">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => complete(track, next.unit.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-3 py-2 text-sm font-medium text-cream transition hover:bg-forest/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                      >
                        <Check size={14} /> Selesai
                      </button>
                      <Link
                        to={`/dashboard/belajar/${track.id}`}
                        className="text-sm font-medium text-forest hover:underline"
                      >
                        Buka materi
                      </Link>
                    </div>
                    {!track.selfPaced && canBackfill(track, done, today) && (
                      <button
                        onClick={onBackfill}
                        className="mt-3 text-left text-xs text-ink/60 underline-offset-2 hover:text-ink hover:underline"
                      >
                        Kemarin sudah belajar tapi lupa centang? Tandai selesai untuk kemarin
                      </button>
                    )}
                  </div>
                </>
              )}
            </article>
          )
        })}
      </div>

      <section className="mt-10 overflow-hidden rounded-xl border border-mist/40 bg-cream">
        <header className="flex items-center justify-between border-b border-mist/40 px-5 py-3.5">
          <h2 className="text-sm font-semibold">Jadwal hari ini</h2>
          <Link
            to="/dashboard/jadwal"
            className="inline-flex items-center gap-1 text-sm font-medium text-forest hover:underline"
          >
            Atur jadwal <ArrowRight size={14} />
          </Link>
        </header>
        <Timeline items={items} />
      </section>
    </div>
  )
}