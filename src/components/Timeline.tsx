import { CATEGORIES, formatDuration, type TimelineItem } from '../lib/schedule'

export default function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="divide-y divide-mist/40">
      {items.map((i) => (
        <li key={i.id} className="flex items-center gap-3 px-5 py-3.5 sm:gap-4">
          <span className="w-[6.5rem] shrink-0 whitespace-nowrap font-mono text-[13px] tabular-nums text-ink/60">
            {i.start} – {i.end}
          </span>
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${CATEGORIES[i.category].swatch}`} />
          <span className="min-w-0 flex-1 text-sm font-medium leading-snug">{i.title}</span>
          <span className="shrink-0 text-xs text-ink/50">{formatDuration(i.minutes)}</span>
        </li>
      ))}
    </ol>
  )
}
