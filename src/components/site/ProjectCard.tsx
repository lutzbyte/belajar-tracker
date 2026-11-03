import { ExternalLink, Folder } from 'lucide-react'
import type { Project } from '../../lib/projects'

export default function ProjectCard({ p }: { p: Project }) {
  const link = /^https?:\/\//i.test(p.url) ? p.url : ''

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-mist/25 bg-card shadow-sm shadow-black/5">
      <div className="aspect-[16/10] overflow-hidden bg-panel">
        {p.imageUrl ? (
          <img
            src={p.imageUrl}
            alt={`Tampilan proyek ${p.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-sage">
            <Folder size={30} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug">{p.title}</h3>
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Buka ${p.title}`}
              className="shrink-0 rounded-md p-1 text-ink/60 transition-colors hover:text-forest"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
        {p.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink/65">{p.description}</p>
        )}
        {p.tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
            {p.tags.map((t) => (
              <li key={t} className="rounded-full bg-panel px-2.5 py-1 text-xs text-ink/70">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}