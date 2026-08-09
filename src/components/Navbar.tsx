import React, { useState } from 'react';
import { CollegeLogo } from './CollegeLogo';
import { Menu, X, Phone, Mail, ShieldAlert, Facebook, Sparkles, MessageSquare } from 'lucide-react';
import { ContactInfo } from '../types';
import { getTelUrl, getMailtoUrl, getWhatsAppUrl } from './ContactComponents';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  onAdminClick: () => void;
  contact?: ContactInfo | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAdminLoggedIn,
  onAdminClick,
  contact,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const phoneObj = contact?.phone;
  const showPhone = phoneObj?.enabled !== false && (phoneObj?.number || (contact as any)?.phone);
  const phoneNum = phoneObj?.number || (contact as any)?.phone || '';
  const phoneDisplay = phoneObj?.displayText || phoneNum;

  const emailObj = contact?.email;
  const showEmail = emailObj?.enabled !== false && (emailObj?.address || (contact as any)?.email);
  const emailAddr = emailObj?.address || (contact as any)?.email || '';
  const emailDisplay = emailObj?.displayText || emailAddr;

  const waObj = contact?.whatsapp;
  const showWa = waObj?.enabled !== false && (waObj?.number || (contact as any)?.whatsapp);
  const waNum = waObj?.number || (contact as any)?.whatsapp || '';

  const fbObj = contact?.socialMedia?.facebook;
  const showFb = fbObj?.enabled !== false && (fbObj?.url || contact?.facebookUrl || (contact as any)?.facebook);
  const fbUrl = fbObj?.url || contact?.facebookUrl || (contact as any)?.facebook || '';

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'programs', label: 'Programs' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200">
      {/* Top Notification / Contact Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-blue-100 text-xs py-2 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-xs font-medium flex-wrap">
            {showPhone && phoneNum && (
              <a href={getTelUrl(phoneNum)} className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-blue-300" />
                <span dir="ltr">{phoneDisplay}</span>
              </a>
            )}

            {showEmail && emailAddr && (
              <a href={getMailtoUrl(emailAddr, emailObj?.defaultSubject, emailObj?.defaultMessage)} className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-blue-300" />
                <span>{emailDisplay}</span>
              </a>
            )}

            {showWa && waNum && (
              <a
                href={getWhatsAppUrl(waNum, waObj?.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 transition-colors font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </a>
            )}

            {showFb && fbUrl && (
              <a 
                href={fbUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-blue-500/20 hover:bg-blue-600 px-2.5 py-0.5 rounded-full border border-blue-400/30 text-blue-100 hover:text-white transition-all"
              >
                <Facebook className="w-3.5 h-3.5 fill-current" />
                <span className="text-[11px] font-semibold">Facebook</span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-blue-100 font-bold bg-blue-500/30 px-3 py-0.5 rounded-full border border-blue-400/30">
              <Sparkles className="w-3 h-3 text-blue-300" />
              Admissions Open - Session 2026-2027
            </span>

            <button
              onClick={onAdminClick}
              className="flex items-center gap-1.5 bg-blue-800 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-bold transition-all shadow-sm border border-blue-600/50"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-blue-300" />
              {isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* College Logo */}
        <button onClick={() => handleNavClick('home')} className="text-left focus:outline-none group">
          <CollegeLogo size="md" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-blue-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop Nav Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={onAdminClick}
            className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-full text-xs font-bold shadow transition-all flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4 text-blue-300" />
            <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-blue-700" /> : <Menu className="w-6 h-6 text-slate-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-slate-100 border-t border-slate-800 py-3 px-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base font-bold flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-blue-900 text-white font-extrabold shadow-md'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-blue-300'
                  }`}
                >
                  <span className="text-base">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

