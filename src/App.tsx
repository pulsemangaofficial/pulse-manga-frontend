import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { MangaDetailPage } from '@/pages/MangaDetailPage';
import { ReaderPage } from '@/pages/ReaderPage';

import { PlaceholderPage } from '@/pages/PlaceholderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/manga/:id" element={<MangaDetailPage />} />
          <Route path="/read/:id" element={<ReaderPage />} />

          {/* New Menu Routes */}
          <Route path="/popular" element={<PlaceholderPage title="Popular Manga" />} />
          <Route path="/latest" element={<PlaceholderPage title="Latest Updates" />} />
          <Route path="/top" element={<PlaceholderPage title="Top Ranked" />} />
          <Route path="/genres" element={<PlaceholderPage title="Genres" />} />
          <Route path="/list" element={<PlaceholderPage title="Manga List" />} />
          <Route path="/discussions" element={<PlaceholderPage title="Discussions" />} />
          <Route path="/ai-recommendation" element={<PlaceholderPage title="AI Recommendations" />} />

          {/* Action Routes */}
          <Route path="/bookmarks" element={<PlaceholderPage title="My Bookmarks" />} />
          <Route path="/history" element={<PlaceholderPage title="Reading History" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
