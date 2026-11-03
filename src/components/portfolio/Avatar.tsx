import { useState } from 'react'

type Props = { src?: string; name: string; size?: number }

// Beri key={src} di pemanggil kalau src bisa berubah (misalnya di editor)
export default function Avatar({ src, name, size = 160 }: Props) {
  const [failed, setFailed] = useState(false)
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (failed) {
    return (
      <div
        role="img"
        aria-label={name}
        style={{ width: size, height: size, fontSize: size / 3.5 }}
        className="grid shrink-0 place-items-center rounded-full bg-forest font-bold text-cream"
      >
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src || '/foto.jpg'}
      alt={`Foto ${name}`}
      width={size}
      height={size}
      decoding="async"
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full object-cover ring-4 ring-cream"
    />
  )
}
