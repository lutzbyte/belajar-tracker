import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, googleProvider } from '../lib/auth'
import { db } from '../lib/firebase'

type Role = 'admin' | 'user'

type AuthState = {
  user: User | null
  role: Role
  isAdmin: boolean
  loading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

// Membuat dokumen profil (role 'user') saat pertama login, lalu membaca role-nya
async function fetchRole(u: User): Promise<Role> {
  const ref = doc(db, 'users', u.uid)
  try {
    const snap = await getDoc(ref)
    if (snap.exists()) return snap.data().role === 'admin' ? 'admin' : 'user'
    await setDoc(ref, { role: 'user', email: u.email })
    return 'user'
  } catch {
    return 'user'
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role>('user')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setRole(u ? await fetchRole(u) : 'user')
      setLoading(false)
    })
  }, [])

  const login = async () => {
    await signInWithPopup(auth, googleProvider)
  }
  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{ user, role, isAdmin: role === 'admin', loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}
