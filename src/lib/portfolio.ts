import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from './firebase'

export type CvMeta = { name: string; size: number; type: string; chunks: number }

export type Portfolio = {
  photoUrl: string // link https://... atau data URL hasil unggahan
  skills: string[]
  cv: CvMeta | null
}

export const defaultPortfolio: Portfolio = { photoUrl: '', skills: [], cv: null }

const portfolioRef = () => doc(db, 'site', 'portfolio')

function parseCv(v: unknown): CvMeta | null {
  if (!v || typeof v !== 'object') return null
  const c = v as Record<string, unknown>
  if (typeof c.name !== 'string' || typeof c.chunks !== 'number' || c.chunks < 1) return null
  return {
    name: c.name,
    size: typeof c.size === 'number' ? c.size : 0,
    type: typeof c.type === 'string' ? c.type : 'application/pdf',
    chunks: c.chunks,
  }
}

export async function loadPortfolio(): Promise<Portfolio> {
  const d = ((await getDoc(portfolioRef())).data() ?? {}) as Record<string, unknown>
  return {
    photoUrl: typeof d.photoUrl === 'string' ? d.photoUrl : '',
    skills: Array.isArray(d.skills)
      ? d.skills.filter((s): s is string => typeof s === 'string')
      : [],
    cv: parseCv(d.cv),
  }
}

// merge: true supaya info CV tidak ikut tertimpa
export const savePortfolio = (p: Pick<Portfolio, 'photoUrl' | 'skills'>) =>
  setDoc(portfolioRef(), { photoUrl: p.photoUrl, skills: p.skills }, { merge: true })