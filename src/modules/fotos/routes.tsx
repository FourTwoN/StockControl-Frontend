import { Routes, Route } from 'react-router'
import { PhotosPage } from './pages/PhotosPage.tsx'
import { SessionDetailPage } from './pages/SessionDetailPage.tsx'

export default function FotosRoutes() {
  return (
    <Routes>
      <Route index element={<PhotosPage />} />
      <Route path=":sessionId" element={<SessionDetailPage />} />
    </Routes>
  )
}
