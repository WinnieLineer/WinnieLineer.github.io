import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { PostsPage } from './pages/PostsPage';
import { PostDetailPage } from './pages/PostDetailPage';

const basename = import.meta.env.DEV ? '/' : '/winnie-lin.space/';

// This component handles the redirect logic from the 404.html page.
const RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirectPath = params.get('p');

    if (redirectPath) {
      // Navigate to the correct path and replace the history entry.
      navigate(redirectPath, { replace: true });
    }
  }, [location, navigate]);

  return null; // This component does not render anything.
};

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
    <BrowserRouter basename={basename}>
      <RedirectHandler /> {/* Add the handler to the app */}
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
