import {
  deleteField,
  doc,
  FieldPath,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Track } from '../data/curriculum'

// unitId -> tanggal selesai ("YYYY-MM-DD", waktu lokal)
export type DoneMap = Record<string, string>

const progressRef = (uid: string) => doc(db, 'users', uid, 'progress', 'main')

export async function loadProgress(uid: string): Promise<DoneMap> {
  const snap = await getDoc(progressRef(uid))
  return (snap.data()?.done as DoneMap | undefined) ?? {}
}

export async function markDone(uid: string, unitId: string, date: string) {
  await setDoc(progressRef(uid), { done: { [unitId]: date } }, { merge: true })
}

export async function unmarkDone(uid: string, unitId: string) {
  await updateDoc(progressRef(uid), new FieldPath('done', unitId), deleteField())
}

// Menimpa seluruh map (dipakai untuk reset progress)
export async function saveAll(uid: string, done: DoneMap) {
  await setDoc(progressRef(uid), { done })
}

const pad = (n: number) => String(n).padStart(2, '0')

// Waktu lokal, bukan toISOString (UTC), supaya pergantian hari tepat jam 00:00 lokal
export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const fromKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const yesterdayKey = (today: string) => {
  const d = fromKey(today)
  d.setDate(d.getDate() - 1)
  return todayKey(d)
}

export const formatDay = (key: string) =>
  fromKey(key).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

export const formatDayLong = (key: string) =>
  fromKey(key).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export function calcStreak(dates: Set<string>) {
  const d = new Date()
  if (!dates.has(todayKey(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (dates.has(todayKey(d))) {
    n++
    d.setDate(d.getDate() - 1)
  }
  return n
}

export const trackUnitIds = (track: Track) =>
  track.stages.flatMap((s) => s.units.map((u) => u.id))

export function trackStats(track: Track, done: DoneMap) {
  const ids = trackUnitIds(track)
  return { total: ids.length, completed: ids.filter((id) => done[id]).length }
}

// Hari pertama yang belum selesai, sesuai urutan kurikulum
export function nextUnit(track: Track, done: DoneMap) {
  let day = 0
  for (const stage of track.stages) {
    for (const unit of stage.units) {
      day++
      if (!done[unit.id]) return { unit, stage, day }
    }
  }
  return null
}

// Id hari terakhir (urutan kurikulum) yang selesai pada tanggal tersebut
export function lastDoneOn(track: Track, done: DoneMap, date: string) {
  const ids = trackUnitIds(track).filter((id) => done[id] === date)
  return ids.length ? ids[ids.length - 1] : null
}

export const trackDoneOn = (track: Track, done: DoneMap, date: string) =>
  lastDoneOn(track, done, date) !== null

// "Lupa centang kemarin": hanya kalau jalur masih punya materi, hari ini belum
// selesai, dan kemarin memang kosong
export function canBackfill(track: Track, done: DoneMap, today: string) {
  if (!nextUnit(track, done)) return false
  return !trackDoneOn(track, done, today) && !trackDoneOn(track, done, yesterdayKey(today))
}

export function lastStudied(track: Track, done: DoneMap, today: string) {
  const dates = trackUnitIds(track)
    .map((id) => done[id])
    .filter(Boolean)
    .sort()
  if (!dates.length) return 'belum pernah'
  const diff = Math.round(
    (fromKey(today).getTime() - fromKey(dates[dates.length - 1]).getTime()) / 86_400_000,
  )
  if (diff <= 0) return 'hari ini'
  if (diff === 1) return 'kemarin'
  return `${diff} hari lalu`
}
