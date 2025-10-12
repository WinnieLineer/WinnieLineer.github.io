import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-lg transition-colors duration-300 hover:text-white ${isActive ? 'text-white font-semibold' : 'text-gray-400'}`;

  return (
    <nav className={`fixed top-0 left-0 w-full p-4 z-50 transition-all duration-300 ${scrolled ? 'bg-black/20 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-white transition-colors hover:text-violet-300">
          Shi Ting Lin
        </NavLink>
        <div className="space-x-8">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/posts" className={linkClass}>
            Posts
          </NavLink>
        </div>
      </div>
    </nav>
  );
};