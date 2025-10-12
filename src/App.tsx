import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { PostsPage } from './pages/PostsPage';
import { PostDetailPage } from './pages/PostDetailPage';

// No longer need a dynamic basename. The relative paths will handle everything.

function App() {
  // This effect is for the cursor glow.
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX + window.scrollX;
      const y = e.clientY + window.scrollY;
      document.documentElement.style.setProperty('--x', `${x}px`);
      document.documentElement.style.setProperty('--y', `${y}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    // Use BrowserRouter without a basename prop.
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:postId" element={<PostDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;