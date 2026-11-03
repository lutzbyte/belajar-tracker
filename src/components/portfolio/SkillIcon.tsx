import { useState } from 'react'

const ALIAS: Record<string, string> = {
  // Programming languages
  js: 'javascript',
  javascript: 'javascript',
  ts: 'typescript',
  typescript: 'typescript',
  java: 'java',
  python: 'python',
  php: 'php',
  go: 'go',
  golang: 'go',
  rust: 'rust',
  kotlin: 'kotlin',
  swift: 'swift',
  dart: 'dart',
  ruby: 'ruby',
  c: 'c',
  'c++': 'cplusplus',
  'c#': 'csharp',
  'f#': 'fsharp',

  // Frontend
  react: 'react',
  'react.js': 'react',
  'react native': 'react',
  next: 'nextdotjs',
  'next.js': 'nextdotjs',
  vue: 'vuedotjs',
  'vue.js': 'vuedotjs',
  angular: 'angular',
  svelte: 'svelte',
  nuxt: 'nuxt',
  'nuxt.js': 'nuxt',
  html: 'html5',
  css: 'css3',
  tailwind: 'tailwindcss',
  'tailwind css': 'tailwindcss',
  bootstrap: 'bootstrap',
  sass: 'sass',

  // Backend
  node: 'nodedotjs',
  nodejs: 'nodedotjs',
  express: 'express',
  laravel: 'laravel',
  django: 'django',
  flask: 'flask',
  spring: 'spring',
  'spring boot': 'spring',
  'asp.net': 'dotnet',
  '.net': 'dotnet',

  // Database
  mysql: 'mysql',
  postgresql: 'postgresql',
  postgres: 'postgresql',
  mongodb: 'mongodb',
  firebase: 'firebase',
  supabase: 'supabase',
  redis: 'redis',
  sqlite: 'sqlite',

  // Tools
  git: 'git',
  github: 'github',
  gitlab: 'gitlab',
  docker: 'docker',
  kubernetes: 'kubernetes',
  vscode: 'visualstudiocode',
  'vs code': 'visualstudiocode',
  'visual studio code': 'visualstudiocode',
  figma: 'figma',
  postman: 'postman',
  npm: 'npm',
  pnpm: 'pnpm',
  yarn: 'yarn',

  // Cloud
  aws: 'amazonwebservices',
  'amazon web services': 'amazonwebservices',
  'google cloud': 'googlecloud',
  azure: 'microsoftazure',
  'microsoft azure': 'microsoftazure',
}

export function iconSlug(name: string) {
  const key = name.trim().toLowerCase()

  if (ALIAS[key]) return ALIAS[key]

  return key
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/\./g, 'dot')
    .replace(/[^a-z0-9]/g, '')
}

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)

  return (
    words.length > 1
      ? words.slice(0, 2).map((word) => word[0]).join('')
      : (words[0] ?? '?').slice(0, 2)
  ).toUpperCase()
}

export default function SkillIcon({
  name,
  size = 32,
}: {
  name: string
  size?: number
}) {
  const [failed, setFailed] = useState(false)
  const slug = iconSlug(name)

  if (failed || !slug) {
    return (
      <span
        aria-hidden="true"
        className="grid shrink-0 place-items-center rounded-lg bg-forest/10 font-bold tracking-tight text-forest"
        style={{
          width: size,
          height: size,
          fontSize: Math.max(9, size * 0.34),
        }}
      >
        {initials(name)}
      </span>
    )
  }

  return (
    <img
      key={slug}
      className="skill-icon shrink-0"
      src={`https://cdn.simpleicons.org/${slug}`}
      alt={`${name} icon`}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}