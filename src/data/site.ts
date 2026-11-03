type Highlight = { icon: 'code' | 'learn' | 'heart'; label: string }

type SiteConfig = {
  name: string
  role: string
  tagline: string
  intro: string
  aboutTitle: string
  about: string
  highlights: Highlight[]
  skillsIntro: string
  projectsIntro: string
  ctaTitle: string
  ctaText: string
  email: string
  socials: {
    github: string
    linkedin: string
    instagram: string
    x: string
    threads: string
  }
  footerTag: string
}

export const site: SiteConfig = {
  name: 'Rus Manto',
  role: 'Developer',
  tagline: 'Developer • Tech Enthusiast • Lifelong Learner',
  intro:
    'Selamat datang di portofolio saya. Di sini, kamu bisa menemukan perjalanan, karya, dan eksplorasi saya di dunia teknologi.',
  aboutTitle: 'Siapa Saya?',
  about:
    'Saya adalah seorang pengembang perangkat lunak yang selalu tertarik pada teknologi, desain, dan pembelajaran baru. Saya suka membangun sesuatu yang bermanfaat, baik itu aplikasi, website, maupun proyek teknologi lainnya.',
  highlights: [
    { icon: 'code', label: 'Web & Mobile Development' },
    { icon: 'learn', label: 'Continuous Learning' },
    { icon: 'heart', label: 'Open Source Enthusiast' },
  ],
  skillsIntro: 'Berikut adalah beberapa teknologi dan tools yang saya gunakan:',
  projectsIntro:
    'Beberapa proyek yang pernah saya kerjakan, mulai dari aplikasi mobile, website, hingga proyek open source.',
  ctaTitle: 'Mari Terhubung!',
  ctaText:
    'Jika kamu tertarik untuk berdiskusi, berkolaborasi, atau sekadar menyapa, jangan ragu untuk menghubungi saya.',
  email: 'rusmanto.co@gmail.com',
  socials: {
    github: 'https://github.com/lutzbyte',
    linkedin: 'https://linkedin.com/in/rus-manto-42a66a3a0',
    instagram: 'https://instagram.com/lutzbyte',
    x: 'https://x.com/lutzbyte',
    threads: 'https://threads.com/@lutzbyte',
  },
  footerTag: 'Build. Learn. Share.',
}
