import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: ROUTES.PUBLIC.HOME },
    { label: 'About', path: ROUTES.PUBLIC.ABOUT },
    { label: 'Tracks', path: ROUTES.PUBLIC.TRACKS },
    { label: 'Guidelines', path: ROUTES.PUBLIC.GUIDELINES },
    { label: 'Committee', path: ROUTES.PUBLIC.COMMITTEE },
    { label: 'FAQ', path: ROUTES.PUBLIC.FAQ },
    { label: 'Contact', path: ROUTES.PUBLIC.CONTACT },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to={ROUTES.PUBLIC.HOME} 
          className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
        >
          NEXUS<span className="text-primary">2026</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-6" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1 ${
                location.pathname === link.path ? 'text-primary' : 'text-gray-600'
              }`}
              aria-current={location.pathname === link.path ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center space-x-3">
          {user ? (
            <>
              <Link to={ROUTES.PRIVATE.DASHBOARD} tabIndex={-1}>
                <Button variant="ghost" className="text-sm font-medium">Dashboard</Button>
              </Link>
              <Button onClick={logout} variant="primary" className="text-sm font-medium shadow-sm">Logout</Button>
            </>
          ) : (
            <>
              <Link to={ROUTES.AUTH.LOGIN} tabIndex={-1}>
                <Button variant="ghost" className="text-sm font-medium">Login</Button>
              </Link>
              <Link to="/register" tabIndex={-1}>
                <Button variant="primary" className="text-sm font-medium shadow-sm">Register Now</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg"
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                    location.pathname === link.path 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-current={location.pathname === link.path ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6 pb-2 px-4 flex flex-col space-y-3 border-t border-gray-100 mt-4">
                {user ? (
                  <>
                    <Link to={ROUTES.PRIVATE.DASHBOARD} tabIndex={-1}>
                      <Button variant="outline" className="w-full justify-center">Dashboard</Button>
                    </Link>
                    <Button onClick={logout} variant="primary" className="w-full justify-center shadow-md">Logout</Button>
                  </>
                ) : (
                  <>
                    <Link to={ROUTES.AUTH.LOGIN} tabIndex={-1}>
                      <Button variant="outline" className="w-full justify-center">Login</Button>
                    </Link>
                    <Link to="/register" tabIndex={-1}>
                      <Button variant="primary" className="w-full justify-center shadow-md">Register Now</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
