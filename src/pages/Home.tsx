import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  Download,
  GraduationCap,
  Heart,
  Laptop,
  Mail,
} from 'lucide-react'

import { site } from '../data/site'
import {
  defaultPortfolio,
  loadPortfolio,
  type Portfolio,
} from '../lib/portfolio'
import { loadProjects, type Project } from '../lib/projects'
import { downloadCv } from '../lib/cv'
import { usePageMeta } from '../hooks/usePageMeta'

import Navbar from '../components/site/Navbar'
import Footer from '../components/site/Footer'
import Pill from '../components/site/Pill'
import ProjectCard from '../components/site/ProjectCard'
import SkillIcon from '../components/portfolio/SkillIcon'

const SKILL_LIMIT = 11

const initial = site.name.charAt(0).toUpperCase()

const highlightIcons = {
  code: Laptop,
  learn: GraduationCap,
  heart: Heart,
}

const SOCIALS = [
  { key: 'github', label: 'GitHub', slug: 'github', short: 'GH' },
  { key: 'linkedin', label: 'LinkedIn', slug: 'linkedin', short: 'in' },
  { key: 'instagram', label: 'Instagram', slug: 'instagram', short: 'ig' },
  { key: 'x', label: 'X', slug: 'x', short: 'X' },
  { key: 'threads', label: 'Threads', slug: 'threads', short: 'TH' },
] as const

function HeroBlobs() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 700"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 -z-10 h-full w-full"
    >
      <circle cx="1080" cy="250" r="430" className="fill-leaf/10" />
      <path
        d="M-120 380C-40 240 60 160 190 230s150 190 40 330S-80 640-170 560Z"
        className="fill-leaf/30"
      />
      <path
        d="M980 700C1060 560 1220 520 1310 430s170-140 250-120V700Z"
        className="fill-page"
      />
    </svg>
  )
}

function HeroAvatar({ src }: { src: string }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="grid h-44 w-44 place-items-center rounded-full border border-white/15 p-3 sm:h-64 sm:w-64 sm:p-4 md:h-80 md:w-80">
      <div className="h-full w-full overflow-hidden rounded-full bg-leaf/90 shadow-2xl shadow-black/25">
        {failed ? (
          <div className="grid h-full w-full place-items-center text-7xl font-extrabold text-snow sm:text-9xl">
            {initial}
          </div>
        ) : (
          <img
            src={src || '/foto.jpg'}
            alt={`Foto ${site.name}`}
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  )
}

function SocialIcon({
  slug,
  short,
}: {
  slug: string
  short: string
}) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return <span className="text-xs font-bold">{short}</span>
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/E8E8D8`}
      alt=""
      width={18}
      height={18}
      onError={() => setFailed(true)}
    />
  )
}

export default function Home() {
  const { hash } = useLocation()

  const [data, setData] = useState<Portfolio | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [expanded, setExpanded] = useState(false)
  const [cvBusy, setCvBusy] = useState(false)
  const [cvError, setCvError] = useState('')

  useEffect(() => {
    Promise.all([
      loadPortfolio().catch(() => defaultPortfolio),
      loadProjects(3).catch(() => [] as Project[]),
    ]).then(([portfolio, projectList]) => {
      setData(portfolio)
      setProjects(projectList)
    })
  }, [])

  // Navigasi dari halaman lain menggunakan hash.
  useEffect(() => {
    if (!data || !hash) return

    requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    })
  }, [data, hash])

  usePageMeta({
    title: `${site.name} — ${site.role}`,
    description: site.intro,
  })

  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-ink/60">
        Memuat…
      </div>
    )
  }

  const [first, ...rest] = site.name.split(' ')
  const skills = expanded
    ? data.skills
    : data.skills.slice(0, SKILL_LIMIT)

  const hasMore = data.skills.length > SKILL_LIMIT

  const socials = SOCIALS.filter(
    (social) => site.socials[social.key],
  )

  const onCv = async () => {
    if (!data.cv) return

    setCvBusy(true)
    setCvError('')

    try {
      await downloadCv(data.cv)
    } catch {
      setCvError('CV gagal diunduh. Coba lagi sebentar lagi.')
    } finally {
      setCvBusy(false)
    }
  }

  return (
    <div>
      <Navbar page="home" />

      <main>
        {/* Hero */}
        <section
          id="beranda"
          className="relative isolate overflow-hidden bg-pine pb-24 pt-32 text-snow sm:pt-40 md:pb-32"
        >
          <HeroBlobs />

          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="grid items-center gap-10 md:grid-cols-[1.25fr_1fr]">
              <div>
                <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-pale">
                  Hello, I’m
                </span>

                <h1 className="mt-5 text-5xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-7xl">
                  {first}{' '}
                  <span className="text-moss">
                    {rest.join(' ')}
                  </span>
                </h1>

                <p className="mt-4 text-lg font-semibold sm:text-xl">
                  {site.tagline}
                </p>

                <p className="mt-5 max-w-lg leading-relaxed text-pale/80">
                  {site.intro}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#proyek"
                    className="inline-flex items-center gap-2 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-pine transition-colors hover:bg-moss/90"
                  >
                    <Laptop size={16} />
                    Lihat Proyek
                    <ArrowRight size={15} />
                  </a>

                  {data.cv && (
                    <button
                      type="button"
                      onClick={onCv}
                      disabled={cvBusy}
                      className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/10 disabled:opacity-60"
                    >
                      <Download size={16} />
                      {cvBusy ? 'Mengunduh…' : 'Download CV'}
                    </button>
                  )}
                </div>

                {cvError && (
                  <p className="mt-3 text-sm text-red-300">
                    {cvError}
                  </p>
                )}
              </div>

              <div className="order-first justify-self-start md:order-none md:justify-self-end">
                <HeroAvatar src={data.photoUrl} />
              </div>
            </div>
          </div>

          <a
            href="#tentang"
            className="absolute bottom-8 left-8 hidden items-center gap-3 text-sm text-pale/70 transition-colors hover:text-snow md:flex"
          >
            <span className="relative h-9 w-6 rounded-full border border-current">
              <span className="absolute left-1/2 top-2 h-1.5 w-0.5 -translate-x-1/2 rounded-full bg-current" />
            </span>
            Scroll ke bawah
          </a>
        </section>

        {/* Tentang */}
        <section
          id="tentang"
          className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-4xl">
            <Pill>Tentang Saya</Pill>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {site.aboutTitle}
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink/70 sm:text-lg">
              {site.about}
            </p>

            <ul className="mt-6 flex flex-wrap gap-3">
              {site.highlights.map((highlight) => {
                const Icon = highlightIcons[highlight.icon]

                return (
                  <li
                    key={highlight.label}
                    className="flex items-center gap-3 rounded-full bg-panel py-2.5 pl-4 pr-5 text-sm font-medium"
                  >
                    <Icon
                      size={20}
                      className="shrink-0 text-forest"
                    />
                    {highlight.label}
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* Keahlian */}
        <section
          id="keahlian"
          className="scroll-mt-24 px-5 sm:px-8"
        >
          <div className="mx-auto max-w-6xl rounded-[2rem] bg-panel p-6 sm:p-10">
            <Pill>Keahlian</Pill>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Teknologi yang Saya Kuasai
            </h2>

            <p className="mt-2 text-ink/70">
              {site.skillsIntro}
            </p>

            {data.skills.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-dashed border-mist p-6 text-center text-sm text-ink/60">
                Belum ada teknologi yang ditampilkan.
              </p>
            ) : (
              <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-3 rounded-full bg-card px-4 py-2.5 text-sm font-medium shadow-sm shadow-black/5"
                  >
                    <SkillIcon name={skill} size={22} />
                    <span className="truncate">{skill}</span>
                  </li>
                ))}

                {hasMore && (
                  <li>
                    <button
                      type="button"
                      onClick={() => setExpanded((value) => !value)}
                      aria-expanded={expanded}
                      className="flex h-full w-full items-center justify-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm font-medium text-ink/70 shadow-sm shadow-black/5 transition-colors hover:text-ink"
                    >
                      <span className="tracking-widest text-forest">
                        •••
                      </span>
                      {expanded ? 'Lebih sedikit' : 'Dan lainnya…'}
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>
        </section>

        {/* Proyek */}
        <section
          id="proyek"
          className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24"
        >
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[18rem_1fr]">
            <div>
              <Pill>Proyek</Pill>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Karya Terbaik Saya
              </h2>

              <p className="mt-4 leading-relaxed text-ink/70">
                {site.projectsIntro}
              </p>

              <Link
                to="/proyek"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-cream transition-colors hover:bg-forest/90"
              >
                Lihat Semua Proyek
                <ArrowRight size={15} />
              </Link>
            </div>

            {projects.length === 0 ? (
              <p className="self-start rounded-2xl border border-dashed border-mist p-8 text-center text-sm text-ink/60">
                Belum ada proyek yang ditampilkan.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    p={project}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Kontak */}
        <section
          id="kontak"
          className="scroll-mt-24 px-5 pb-16 sm:px-8 sm:pb-24"
        >
          <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-pine px-6 py-10 text-snow sm:px-10 sm:py-12">
            <svg
              aria-hidden="true"
              viewBox="0 0 1200 300"
              preserveAspectRatio="none"
              className="absolute inset-0 -z-10 h-full w-full"
            >
              <path
                d="M0 220C200 120 360 300 600 210S1000 60 1200 140V300H0Z"
                className="fill-leaf/15"
              />
              <circle
                cx="1080"
                cy="40"
                r="170"
                className="fill-leaf/10"
              />
            </svg>

            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-3xl font-extrabold tracking-tight">
                  {site.ctaTitle}
                </h2>

                <p className="mt-3 leading-relaxed text-pale/80">
                  {site.ctaText}
                </p>

                {socials.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-3">
                    {socials.map((social) => (
                      <li key={social.key}>
                        <a
                          href={site.socials[social.key]}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={social.label}
                          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-pale transition-colors hover:bg-white/20"
                        >
                          <SocialIcon
                            slug={social.slug}
                            short={social.short}
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {site.email && (
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
                >
                  <Mail size={16} />
                  Kirim Pesan
                  <ArrowRight size={15} />
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
