import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../context/AuthContext';
import { ScrollProgress } from './ScrollProgress';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Tracks', path: '/tracks' },
    { label: 'Timeline', path: '/timeline' },
    { label: 'Contact', path: '/contact' },
  ];

  // Handle scroll effect for glass navbar transition
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
    <>
      <ScrollProgress />
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled 
            ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-3' 
            : 'bg-white/60 backdrop-blur-xs border-b border-slate-100 py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <Link 
            to="/" 
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl group"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-2xs p-1 flex items-center justify-center group-hover:scale-105 group-hover:border-primary/40 transition-all duration-300">
              <img 
                src="/eventlogo.png" 
                alt="NEXUS 2026 Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-1">
                NEXUS<span className="text-primary font-bold">2026</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Research Competition</span>
            </div>
          </Link>

          {/* Desktop Nav - Multi-Page Navigation with Active Indicator */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/70 shadow-2xs" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`relative text-sm font-semibold transition-all px-4 py-1.5 rounded-full ${
                    isActive
                      ? 'text-primary' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-white rounded-full shadow-2xs border border-slate-200/60"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action Controls - Event Registration & Login */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link to={ROUTES.PRIVATE.DASHBOARD}>
                  <Button variant="ghost" className="text-sm font-semibold text-slate-700 hover:text-primary">Dashboard</Button>
                </Link>
                <Button onClick={logout} variant="outline" className="text-sm font-semibold text-slate-700">Logout</Button>
              </>
            ) : (
              <>
                <Link to={ROUTES.AUTH.LOGIN}>
                  <Button variant="ghost" className="text-sm font-semibold text-slate-700 hover:text-primary hover:bg-slate-100/80">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" className="text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-1.5 px-5 h-10 rounded-xl">
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    Event Registration
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl bg-slate-100/80"
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
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-xl"
            >
              <div className="container mx-auto px-4 py-4 space-y-1.5">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.label}
                      to={link.path}
                      className={`block px-4 py-3 text-base font-semibold rounded-xl transition-all ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-bold' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                
                <div className="pt-4 pb-2 px-2 flex flex-col space-y-2.5 border-t border-slate-100 mt-2">
                  {user ? (
                    <>
                      <Link to={ROUTES.PRIVATE.DASHBOARD}>
                        <Button variant="outline" className="w-full justify-center text-base">Dashboard</Button>
                      </Link>
                      <Button onClick={logout} variant="primary" className="w-full justify-center text-base shadow-md">Logout</Button>
                    </>
                  ) : (
                    <>
                      <Link to={ROUTES.AUTH.LOGIN}>
                        <Button variant="outline" className="w-full justify-center text-base font-semibold border-slate-300">
                          Login
                        </Button>
                      </Link>
                      <Link to="/register">
                        <Button variant="primary" className="w-full justify-center text-base font-bold shadow-md shadow-primary/20 flex items-center justify-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-200" />
                          Event Registration
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};


