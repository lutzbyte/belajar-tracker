import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const listeners = new Set<() => void>()

const read = (): Theme =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light'

export function setTheme(t: Theme) {
  document.documentElement.classList.toggle('dark', t === 'dark')
  try {
    localStorage.setItem('theme', t)
  } catch {
    /* penyimpanan browser tidak tersedia, abaikan */
  }
  listeners.forEach((l) => l())
}

export function useTheme() {
  const theme = useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => {
        listeners.delete(cb)
      }
    },
    read,
    () => 'light' as Theme,
  )
  return { theme, setTheme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') }
}