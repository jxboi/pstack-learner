import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { Layout, useApplyTheme } from './components/Layout'
import { useProfile } from './lib/store'
import { findLesson } from './content/course'
import { Welcome } from './pages/Welcome'
import { Dashboard } from './pages/Dashboard'
import { UnitPage } from './pages/UnitPage'
import { ProfilePage } from './pages/ProfilePage'
import { GlossaryPage } from './pages/GlossaryPage'
import { ToolboxPage } from './pages/ToolboxPage'
import { LessonPlayer } from './player/LessonPlayer'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function LessonRoute() {
  const { unitId = '', lessonId = '' } = useParams()
  const profile = useProfile()
  const found = findLesson(unitId, lessonId)
  if (!profile) return <Navigate to="/" replace />
  if (!found) return <Navigate to="/" replace />
  return <LessonPlayer key={`${unitId}/${lessonId}`} unit={found.unit} lesson={found.lesson} />
}

function Home() {
  const profile = useProfile()
  return profile ? <Dashboard profile={profile} /> : <Welcome />
}

function RequireProfile({ children }: { children: (p: NonNullable<ReturnType<typeof useProfile>>) => React.ReactNode }) {
  const profile = useProfile()
  if (!profile) return <Navigate to="/" replace />
  return <>{children(profile)}</>
}

export default function App() {
  const profile = useProfile()
  useApplyTheme(profile?.settings.theme)
  return (
    <BrowserRouter>
      <ScrollTop />
      <Routes>
        <Route path="/learn/:unitId/:lessonId" element={<LessonRoute />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/unit/:unitId" element={<UnitPage />} />
          <Route path="/profile" element={<RequireProfile>{(p) => <ProfilePage profile={p} />}</RequireProfile>} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/toolbox" element={<ToolboxPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
