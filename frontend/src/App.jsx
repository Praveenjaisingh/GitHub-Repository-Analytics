import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import RepositoryDetail from './pages/RepositoryDetail';
import Bookmarks from './pages/Bookmarks';
import OAuthCallback from './pages/OAuthCallback';

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/repo/:owner/:repo" element={<RepositoryDetail />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
    </MainLayout>
  );
}
