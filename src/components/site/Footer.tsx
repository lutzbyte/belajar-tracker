import { site } from '../../data/site'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-deep text-pale">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()}{' '}
          <span className="font-semibold uppercase text-snow">{site.name}</span>. All rights
          reserved.
        </p>
        <p className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-moss" />
          {site.footerTag}
        </p>
      </div>
    </footer>
  )
}