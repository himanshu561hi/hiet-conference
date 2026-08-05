import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { brandingConfig } from '../../config/branding';
import { ROUTES } from '../../constants/routes';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-1 flex flex-col items-start">
            <Link to={ROUTES.PUBLIC.HOME} className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
              NEXUS<span className="text-primary">2026</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {brandingConfig.tagline}
            </p>
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">
              Organized By
            </div>
            <div className="font-bold text-gray-200">
              {brandingConfig.organization.name}
            </div>
            <div className="text-sm text-gray-400">
              {brandingConfig.organization.club}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to={ROUTES.PUBLIC.ABOUT} className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to={ROUTES.PUBLIC.TRACKS} className="hover:text-primary transition-colors">Conference Tracks</Link></li>
              <li><Link to={ROUTES.PUBLIC.COMMITTEE} className="hover:text-primary transition-colors">Committee</Link></li>
              <li><Link to={ROUTES.PUBLIC.FAQ} className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to={ROUTES.PUBLIC.CONTACT} className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources & Downloads */}
          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <a href="/assets/documents/nexus-2026-brochure.pdf" target="_blank" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">
                  Download Brochure <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </li>
              <li><Link to="/guidelines" className="hover:text-primary transition-colors">Submission Guidelines</Link></li>
              <li><Link to="/format" className="hover:text-primary transition-colors">Paper Format</Link></li>
            </ul>
          </div>

          {/* Partners & Legal */}
          <div>
            <h4 className="text-white font-bold mb-6">Legal & Social</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
            </ul>
            <div className="flex items-center gap-4 mt-8">
              {Object.entries(brandingConfig.socialLinks).map(([platform, link]) => (
                <a key={platform} href={link} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-colors capitalize text-xs font-bold">
                  {platform.substring(0,2)}
                </a>
              ))}
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} {brandingConfig.appName}. All rights reserved.
          </p>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-primary transition-colors focus:outline-none"
          >
            Back to top
            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
              <ArrowUp className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
