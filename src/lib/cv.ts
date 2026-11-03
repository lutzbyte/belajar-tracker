import { deleteField, doc, getDoc, writeBatch } from 'firebase/firestore'
import { db } from './firebase'
import type { CvMeta } from './portfolio'

export const MAX_CV_BYTES = 3 * 1024 * 1024
const CHUNK = 450 * 1024 // tiap potongan jadi ±600 KB base64, aman di bawah batas 1 MB dokumen

const part = (i: number) => doc(db, 'cv', `part_${i}`)
const siteRef = () => doc(db, 'site', 'portfolio')

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '')
    r.onerror = () => reject(r.error)
    r.readAsDataURL(blob)
  })
}

// Semua potongan dan info CV ditulis dalam satu batch, jadi tidak pernah setengah tersimpan
export async function uploadCv(file: File, prev: CvMeta | null): Promise<CvMeta> {
  if (file.type !== 'application/pdf') throw new Error('type')
  if (file.size > MAX_CV_BYTES) throw new Error('size')

  const chunks = Math.max(1, Math.ceil(file.size / CHUNK))
  const batch = writeBatch(db)
  for (let i = 0; i < chunks; i++) {
    batch.set(part(i), { data: await toBase64(file.slice(i * CHUNK, (i + 1) * CHUNK)) })
  }
  for (let i = chunks; i < (prev?.chunks ?? 0); i++) batch.delete(part(i))

  const meta: CvMeta = { name: file.name, size: file.size, type: file.type, chunks }
  batch.set(siteRef(), { cv: meta }, { merge: true })
  await batch.commit()
  return meta
}

export async function deleteCv(prev: CvMeta) {
  const batch = writeBatch(db)
  for (let i = 0; i < prev.chunks; i++) batch.delete(part(i))
  batch.set(siteRef(), { cv: deleteField() }, { merge: true })
  await batch.commit()
}

export async function downloadCv(meta: CvMeta) {
  const snaps = await Promise.all(Array.from({ length: meta.chunks }, (_, i) => getDoc(part(i))))
  const bytes = snaps.map((s) => {
    const bin = atob(String(s.data()?.data ?? ''))
    const arr = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
    return arr
  })

  const url = URL.createObjectURL(new Blob(bytes, { type: meta.type }))
  const a = document.createElement('a')
  a.href = url
  a.download = meta.name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}