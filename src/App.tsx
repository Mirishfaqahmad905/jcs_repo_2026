import React, { useState, useEffect } from 'react';
import {
  Teacher,
  Program,
  AdmissionInfo,
  AboutInfo,
  ContactInfo,
  NotificationItem,
  GalleryItem,
  CollegeSettings,
  CarouselSlide
} from './types';

import {
  fetchFaculty,
  fetchPrograms,
  fetchAdmissions,
  fetchAbout,
  fetchContact,
  fetchNotifications,
  fetchGallery,
  fetchSettings,
  fetchCarousel,
  checkAdminSession
} from './services/api';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NotificationModal } from './components/NotificationModal';
import { TeacherModal } from './components/TeacherModal';
import { FloatingWhatsApp } from './components/ContactComponents';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { FacultyPage } from './pages/FacultyPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Dynamic College Data State
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionInfo | null>(null);
  const [about, setAbout] = useState<AboutInfo | null>(null);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [carousel, setCarousel] = useState<CarouselSlide[]>([]);
  const [settings, setSettings] = useState<CollegeSettings | null>(null);

  // Global Selected Teacher Modal
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load public data from REST API
  const loadPublicData = async () => {
    try {
      const [facData, progData, admData, abtData, conData, notData, galData, carData, setData] = await Promise.all([
        fetchFaculty(),
        fetchPrograms(),
        fetchAdmissions(),
        fetchAbout(),
        fetchContact(),
        fetchNotifications(),
        fetchGallery(),
        fetchCarousel(),
        fetchSettings()
      ]);

      setTeachers(facData);
      setPrograms(progData);
      setAdmissions(admData);
      setAbout(abtData);
      setContact(conData);
      setNotifications(notData);
      setGallery(galData);
      setCarousel(carData);
      setSettings(setData);
    } catch (err) {
      console.error('Error fetching public college data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check admin session on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const authRes = await checkAdminSession();
      if (authRes.success) {
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(false);
      }
    };
    verifyAuth();
    loadPublicData();
  }, [activeTab]);

  const handleAdminNavClick = () => {
    if (isAdminLoggedIn) {
      setActiveTab('admin_dashboard');
    } else {
      setActiveTab('admin_login');
    }
  };

  // If in admin dashboard mode
  if (activeTab === 'admin_dashboard' && isAdminLoggedIn) {
    return (
      <AdminDashboard
        onLogout={() => {
          setIsAdminLoggedIn(false);
          setActiveTab('home');
          loadPublicData();
        }}
        onViewPublicSite={() => {
          setActiveTab('home');
          loadPublicData();
        }}
      />
    );
  }

  // If in admin login mode
  if (activeTab === 'admin_login') {
    return (
      <AdminLoginPage
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setActiveTab('admin_dashboard');
        }}
        onBackToSite={() => setActiveTab('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950">
      <div>
        {/* Sticky Header Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdminLoggedIn={isAdminLoggedIn}
          onAdminClick={handleAdminNavClick}
          contact={contact}
        />

        {/* Dynamic Notification Modal Popup */}
        <NotificationModal notifications={notifications} settings={settings} />

        {/* Page Routing */}
        <main>
          {loading ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-700 font-bold text-base">Loading Jamal College of Sciences portal...</p>
            </div>
          ) : (
            <>
              {activeTab === 'home' && (
                <HomePage
                  programs={programs}
                  teachers={teachers}
                  notifications={notifications}
                  admissions={admissions}
                  about={about}
                  gallery={gallery}
                  carousel={carousel}
                  setActiveTab={setActiveTab}
                  onTeacherSelect={(t) => setSelectedTeacher(t)}
                  contact={contact}
                />
              )}

              {activeTab === 'about' && <AboutPage about={about} />}

              {activeTab === 'programs' && (
                <ProgramsPage programs={programs} setActiveTab={setActiveTab} />
              )}

              {activeTab === 'faculty' && <FacultyPage teachers={teachers} />}

              {activeTab === 'admissions' && <AdmissionsPage admissions={admissions} contact={contact} />}

              {activeTab === 'gallery' && <GalleryPage gallery={gallery} />}

              {activeTab === 'contact' && <ContactPage contact={contact} />}
            </>
          )}
        </main>
      </div>

      {/* Global Floating WhatsApp Widget */}
      <FloatingWhatsApp contact={contact} />

      {/* Global Teacher Modal */}
      <TeacherModal teacher={selectedTeacher} onClose={() => setSelectedTeacher(null)} />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} onAdminClick={handleAdminNavClick} contact={contact} />
    </div>
  );
}
