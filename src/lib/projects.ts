import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from './firebase'

export type Project = {
  id: string
  title: string
  description: string
  url: string
  imageUrl: string // link https://... atau data URL hasil unggahan
  tags: string[]
}

export type ProjectData = Omit<Project, 'id'>

const col = () => collection(db, 'projects')

export async function loadProjects(max?: number): Promise<Project[]> {
  const base = query(col(), orderBy('createdAt', 'desc'))
  const snap = await getDocs(max ? query(base, limit(max)) : base)
  return snap.docs.map((d) => {
    const x = d.data()
    return {
      id: d.id,
      title: String(x.title ?? ''),
      description: String(x.description ?? ''),
      url: String(x.url ?? ''),
      imageUrl: String(x.imageUrl ?? ''),
      tags: Array.isArray(x.tags) ? x.tags.map(String) : [],
    }
  })
}

export async function createProject(data: ProjectData) {
  await addDoc(col(), { ...data, createdAt: serverTimestamp() })
}

export async function updateProject(id: string, data: ProjectData) {
  await setDoc(doc(db, 'projects', id), data, { merge: true })
}

export const removeProject = (id: string) => deleteDoc(doc(db, 'projects', id))