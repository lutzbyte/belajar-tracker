export default function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-1.5 w-full overflow-hidden rounded-full bg-sand"
    >
      <div className="h-full rounded-full bg-forest transition-all" style={{ width: `${pct}%` }} />
    </div>
  )
}
