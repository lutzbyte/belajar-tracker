import type { ReactNode } from 'react'

export default function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-mist/40 px-3.5 py-1 text-xs font-semibold text-forest">
      {children}
    </span>
  )
}