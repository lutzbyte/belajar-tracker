import { useEffect, useState } from 'react'
import { todayKey } from '../lib/progress'

// Mengembalikan tanggal hari ini dan otomatis berganti saat lewat tengah malam
export function useToday() {
  const [today, setToday] = useState(todayKey())

  useEffect(() => {
    let timer = 0
    const sync = () => setToday(todayKey())

    const schedule = () => {
      const now = new Date()
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1)
      timer = window.setTimeout(() => {
        sync()
        schedule()
      }, nextMidnight.getTime() - now.getTime())
    }

    schedule()
    // Tab yang tertidur / laptop yang sleep: cek ulang saat kembali aktif
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('focus', sync)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('focus', sync)
    }
  }, [])

  return today
}
