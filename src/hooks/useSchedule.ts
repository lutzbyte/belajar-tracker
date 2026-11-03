import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { loadSchedule, saveSchedule, type ScheduleConfig } from '../lib/schedule'

export function useSchedule() {
  const { user } = useAuth()
  const [config, setConfig] = useState<ScheduleConfig | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!user) return
    let alive = true
    loadSchedule(user.uid)
      .then((c) => alive && setConfig(c))
      .catch(() => alive && setError(true))
    return () => {
      alive = false
    }
  }, [user])

  const save = async (next: ScheduleConfig) => {
    if (!user) return
    await saveSchedule(user.uid, next)
    setConfig(next)
  }

  return { config, error, save }
}
