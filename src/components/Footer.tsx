import React from 'react';
import { CollegeLogo } from './CollegeLogo';
import { Shield } from 'lucide-react';
import { ContactInfo } from '../types';
import { FooterContact, SocialLinks } from './ContactComponents';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onAdminClick: () => void;
  contact?: ContactInfo | null;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onAdminClick, contact }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          
          {/* Column 1: College Branding */}
          <div className="space-y-4">
            <CollegeLogo size="lg" />
            <p className="text-slate-400 text-sm leading-relaxed mt-3">
              {contact?.collegeName || 'Jamal College of Science, Mayar'} is a premier educational institution committed to delivering quality science and arts education under the guidance of experienced faculty.
            </p>
            <div className="pt-2">
              <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Follow Us</p>
              <SocialLinks contact={contact || null} showLabels={true} />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-blue-300 font-bold text-lg border-b border-slate-800 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { id: 'home', title: 'Home' },
                { id: 'about', title: 'About Us' },
                { id: 'programs', title: 'Academic Programs' },
                { id: 'faculty', title: 'Faculty Members' },
                { id: 'admissions', title: 'Admissions' },
                { id: 'gallery', title: 'Photo Gallery' },
                { id: 'contact', title: 'Contact Us' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setActiveTab(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-blue-300 transition-colors flex items-center gap-1.5 text-left w-full"
                  >
                    <span className="text-blue-500 font-bold">›</span>
                    <span>{link.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Academic Programs */}
          <div className="space-y-3">
            <h3 className="text-blue-300 font-bold text-lg border-b border-slate-800 pb-2">
              Academic Programs
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                F.Sc Pre-Medical
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                F.Sc Pre-Engineering
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                ICS Computer Science
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                F.A Humanities
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-3">
            <h3 className="text-blue-300 font-bold text-lg border-b border-slate-800 pb-2">
              Contact
            </h3>
            <FooterContact contact={contact || null} />
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p className="font-semibold text-center sm:text-left">
            © 2026 {contact?.collegeName || 'Jamal College of Science, Mayar'}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={onAdminClick}
              className="text-slate-400 hover:text-blue-300 text-xs flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
