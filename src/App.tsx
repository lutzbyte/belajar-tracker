import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

const Home = lazy(() => import('./pages/Home'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const Login = lazy(() => import('./pages/Login'))
const AppLayout = lazy(() => import('./components/layout/AppLayout'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Schedule = lazy(() => import('./pages/Schedule'))
const Track = lazy(() => import('./pages/Track'))
const History = lazy(() => import('./pages/History'))
const PortfolioEditor = lazy(() => import('./pages/PortfolioEditor'))
const ProjectsEditor = lazy(() => import('./pages/ProjectsEditor'))

function AuthShell() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center text-sm text-ink/60">
          Memuat…
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proyek" element={<ProjectsPage />} />

        <Route element={<AuthShell />}>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="jadwal" element={<Schedule />} />
              <Route path="belajar/:trackId" element={<Track />} />
              <Route path="riwayat" element={<History />} />

              <Route element={<AdminRoute />}>
                <Route path="portofolio" element={<PortfolioEditor />} />
                <Route path="proyek" element={<ProjectsEditor />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
