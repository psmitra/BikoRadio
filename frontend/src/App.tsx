import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { ToastProvider } from './components/ui/Toast'
import Discover from './pages/Discover'
import LiveShows from './pages/LiveShows'
import MyChannels from './pages/MyChannels'
import Placeholder from './pages/Placeholder'

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Discover />} />
          <Route path="live-shows" element={<LiveShows />} />
          <Route path="my-channels" element={<MyChannels />} />
          <Route path="replays" element={<Placeholder title="Replays" />} />
          <Route path="membership" element={<Placeholder title="Membership" />} />
          <Route path="*" element={<Placeholder title="Page not found" />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}
