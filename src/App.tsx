import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { PostsPage } from './pages/PostsPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { FancyCursor } from './components/FancyCursor';

function App() {
  return (
    <BrowserRouter>
      <FancyCursor />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        {/* The route now uses a slug parameter, which is the most robust and SEO-friendly method */}
        <Route path="/posts/:slug" element={<PostDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
