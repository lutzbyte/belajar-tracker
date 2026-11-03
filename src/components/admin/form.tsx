import { useState, type ReactNode } from 'react'

export const input =
  'w-full rounded-lg border border-mist bg-cream px-3 py-2 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20'

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {hint && <span className="ml-2 text-xs text-ink/50">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

export function Section({
  title,
  desc,
  children,
}: {
  title: string
  desc?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-mist/40 bg-cream p-5">
      <h2 className="text-sm font-semibold">{title}</h2>
      {desc && <p className="mt-1 text-[13px] leading-relaxed text-ink/60">{desc}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

// Teks mentah disimpan lokal supaya koma dan spasi bisa diketik dengan normal
export function ListInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  const [raw, setRaw] = useState(value.join(', '))
  return (
    <input
      className={input}
      value={raw}
      placeholder={placeholder}
      onChange={(e) => {
        setRaw(e.target.value)
        onChange(
          e.target.value
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        )
      }}
    />
  )
}