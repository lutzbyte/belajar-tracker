import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import type { Track } from '../data/curriculum'
import {
  canBackfill,
  lastDoneOn,
  loadProgress,
  markDone,
  nextUnit,
  saveAll,
  todayKey,
  trackDoneOn,
  trackUnitIds,
  unmarkDone,
  yesterdayKey,
  type DoneMap,
} from '../lib/progress'
import { useToday } from './useToday'

export function useProgress() {
  const { user } = useAuth()
  const today = useToday()
  const [done, setDone] = useState<DoneMap | null>(null)
  const [error, setError] = useState(false)
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    if (!user) return
    let alive = true
    loadProgress(user.uid)
      .then((d) => alive && setDone(d))
      .catch(() => alive && setError(true))
    return () => {
      alive = false
    }
  }, [user])

  const drop = (id: string) =>
    setDone((d) => {
      if (!d) return d
      const copy = { ...d }
      delete copy[id]
      return copy
    })

  // Hanya materi berikutnya; jalur utama dibatasi satu sesi per hari, jalur self-paced bebas.
  const complete = async (track: Track, unitId: string) => {
    if (!user || !done) return
    const date = todayKey()
    const next = nextUnit(track, done)
    if (!next || next.unit.id !== unitId) return
    if (!track.selfPaced && trackDoneOn(track, done, date)) return

    setSaveError(false)
    setDone({ ...done, [unitId]: date })
    try {
      await markDone(user.uid, unitId, date)
    } catch {
      drop(unitId)
      setSaveError(true)
    }
  }

  // Membatalkan hari yang diselesaikan HARI INI saja
  const undo = async (track: Track) => {
    if (!user || !done) return
    const date = todayKey()
    const id = lastDoneOn(track, done, date)
    if (!id) return

    setSaveError(false)
    drop(id)
    try {
      await unmarkDone(user.uid, id)
    } catch {
      setDone((d) => (d ? { ...d, [id]: date } : d))
      setSaveError(true)
    }
  }

  // Lupa centang: mencatat hari berikutnya dengan tanggal KEMARIN
  const backfill = async (track: Track) => {
    if (!user || !done) return
    const date = todayKey()
    if (!canBackfill(track, done, date)) return
    const next = nextUnit(track, done)
    if (!next) return
    const yesterday = yesterdayKey(date)

    setSaveError(false)
    setDone({ ...done, [next.unit.id]: yesterday })
    try {
      await markDone(user.uid, next.unit.id, yesterday)
    } catch {
      drop(next.unit.id)
      setSaveError(true)
    }
  }

  const reset = async (track: Track) => {
    if (!user || !done) return
    const prev = done
    const ids = new Set(trackUnitIds(track))
    const next = Object.fromEntries(Object.entries(done).filter(([id]) => !ids.has(id)))

    setSaveError(false)
    setDone(next)
    try {
      await saveAll(user.uid, next)
    } catch {
      setDone(prev)
      setSaveError(true)
    }
  }

  return { done, today, error, saveError, complete, undo, backfill, reset }
}
