import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

// Satu-satunya kontrol tema berada di navbar publik homepage.
export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const btn = (on: boolean) =>
    `grid h-8 w-8 place-items-center rounded-full transition-colors ${
      on ? 'bg-leaf text-snow' : 'text-pale/70 hover:text-snow'
    }`

  return (
    <div role="group" aria-label="Pilih tema" className="flex items-center gap-0.5 rounded-full bg-white/10 p-1">
      <button type="button" aria-pressed={theme === 'light'} aria-label="Tema terang" onClick={() => setTheme('light')} className={btn(theme === 'light')}>
        <Sun size={15} />
      </button>
      <button type="button" aria-pressed={theme === 'dark'} aria-label="Tema gelap" onClick={() => setTheme('dark')} className={btn(theme === 'dark')}>
        <Moon size={15} />
      </button>
    </div>
  )
}
