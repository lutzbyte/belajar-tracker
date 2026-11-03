import { useEffect, useState } from 'react'
import { site } from '../data/site'
import { loadProjects, type Project } from '../lib/projects'
import { usePageMeta } from '../hooks/usePageMeta'
import Navbar from '../components/site/Navbar'
import Footer from '../components/site/Footer'
import Pill from '../components/site/Pill'
import ProjectCard from '../components/site/ProjectCard'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null)

  useEffect(() => {
    loadProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
  }, [])

  usePageMeta({ title: `Proyek — ${site.name}`, description: site.projectsIntro })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar page="projects" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-20 pt-32 sm:px-8 sm:pt-40">
        <Pill>Proyek</Pill>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Semua Karya Saya</h1>
        <p className="mt-3 max-w-xl leading-relaxed text-ink/70">{site.projectsIntro}</p>

        <div className="mt-10">
          {!projects ? (
            <p className="text-sm text-ink/60">Memuat…</p>
          ) : projects.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-mist p-8 text-center text-sm text-ink/60">
              Belum ada proyek yang ditampilkan.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}