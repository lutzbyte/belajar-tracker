import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export type Category = 'rust' | 'japanese' | 'english' | 'review' | 'break' | 'other'

export type Block = {
  id: string
  title: string
  category: Category
  minutes: number
}

export type ScheduleConfig = {
  startTime: string // "HH:mm"
  blocks: Block[]
}

export type TimelineItem = Block & { start: string; end: string }

export const CATEGORIES: Record<Category, { label: string; swatch: string }> = {
  rust: { label: 'Rust', swatch: 'bg-forest' },
  japanese: { label: 'Jepang', swatch: 'bg-sage' },
  english: { label: 'Inggris', swatch: 'bg-mist' },
  review: { label: 'Review', swatch: 'bg-ink' },
  break: { label: 'Istirahat', swatch: 'bg-sand ring-1 ring-inset ring-mist' },
  other: { label: 'Lainnya', swatch: 'bg-mist/50' },
}

const block = (title: string, category: Category, minutes: number): Block => ({
  id: crypto.randomUUID(),
  title,
  category,
  minutes,
})

export const newBlock = () => block('', 'other', 30)

export const defaultConfig = (): ScheduleConfig => ({
  startTime: '09:00',
  blocks: [
    block('Rust: nonton video + ketik ulang kode', 'rust', 120),
    block('Istirahat', 'break', 15),
    block('Rust: latihan mini', 'rust', 45),
    block('Makan siang', 'break', 60),
    block('Bahasa Jepang: materi baru', 'japanese', 45),
    block('Bahasa Inggris: materi baru', 'english', 45),
    block('Istirahat sore', 'break', 90),
    block('Review Jepang + Inggris', 'review', 45),
    block('Praktek Rust tanpa video', 'rust', 60),
    block('Catat progress', 'other', 15),
  ],
})

const toMinutes = (t: string) => {
  const [h, m] = (t || '09:00').split(':').map(Number)
  return h * 60 + m
}

const toClock = (total: number) => {
  const t = ((total % 1440) + 1440) % 1440
  const h = String(Math.floor(t / 60)).padStart(2, '0')
  const m = String(t % 60).padStart(2, '0')
  return `${h}:${m}`
}

export function buildTimeline(config: ScheduleConfig): TimelineItem[] {
  let cursor = toMinutes(config.startTime)
  return config.blocks.map((b) => {
    const start = toClock(cursor)
    cursor += b.minutes
    return { ...b, start, end: toClock(cursor) }
  })
}

export function formatDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (!h) return `${m} mnt`
  if (!m) return `${h} jam`
  return `${h} jam ${m} mnt`
}

export function summarize(blocks: Block[]) {
  const sum = (fn: (b: Block) => boolean) =>
    blocks.filter(fn).reduce((acc, b) => acc + b.minutes, 0)
  return {
    study: sum((b) => b.category !== 'break'),
    rust: sum((b) => b.category === 'rust'),
    language: sum((b) => b.category === 'japanese' || b.category === 'english'),
    rest: sum((b) => b.category === 'break'),
    total: sum(() => true),
  }
}

const scheduleRef = (uid: string) => doc(db, 'users', uid, 'settings', 'schedule')

export async function loadSchedule(uid: string): Promise<ScheduleConfig> {
  const snap = await getDoc(scheduleRef(uid))
  const data = snap.data()
  if (data && typeof data.startTime === 'string' && Array.isArray(data.blocks)) {
    return data as ScheduleConfig
  }
  // Dokumen lama (format Phase 2) atau belum ada: pakai default
  return defaultConfig()
}

export async function saveSchedule(uid: string, config: ScheduleConfig) {
  await setDoc(scheduleRef(uid), config)
}
