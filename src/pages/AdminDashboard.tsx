import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Building2,
  PhoneCall,
  Bell,
  Image,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Lock,
  Key,
  Globe,
  Sparkles,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';

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
} from '../types';

import {
  adminGetFaculty,
  adminAddTeacher,
  adminUpdateTeacher,
  adminDeleteTeacher,
  adminGetPrograms,
  adminAddProgram,
  adminUpdateProgram,
  adminDeleteProgram,
  adminGetAdmissions,
  adminUpdateAdmissions,
  adminGetAbout,
  adminUpdateAbout,
  adminGetContact,
  adminUpdateContact,
  adminGetNotifications,
  adminAddNotification,
  adminUpdateNotification,
  adminDeleteNotification,
  adminGetGallery,
  adminAddGalleryItem,
  adminUpdateGalleryItem,
  adminDeleteGalleryItem,
  adminGetCarousel,
  adminAddCarouselSlide,
  adminUpdateCarouselSlide,
  adminDeleteCarouselSlide,
  adminGetSettings,
  adminUpdateSettings,
  changeAdminPassword,
  logoutAdmin
} from '../services/api';

import { compressImageFile } from '../utils/imageCompressor';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewPublicSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onViewPublicSite }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'faculty' | 'programs' | 'admissions' | 'about' | 'contact' | 'notifications' | 'gallery' | 'carousel' | 'settings'>('dashboard');

  // Master Data State
  const [faculty, setFaculty] = useState<Teacher[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionInfo | null>(null);
  const [about, setAbout] = useState<AboutInfo | null>(null);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [carousel, setCarousel] = useState<CarouselSlide[]>([]);
  const [collegeSettings, setCollegeSettings] = useState<CollegeSettings | null>(null);

  // Status & Feedback messages
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // Modal / Form States
  // 1. Faculty Form
  const [teacherModalOpen, setTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherForm, setTeacherForm] = useState<Partial<Teacher>>({
    name: '',
    photo: '',
    subject: '',
    designation: 'Lecturer',
    qualification: 'M.Sc',
    experience: '5 Years',
    age: '30',
    address: 'Mayar, Dir Lower',
    biography: '',
    status: 'active'
  });

  // 2. Program Form
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programForm, setProgramForm] = useState<Partial<Program>>({
    name: '',
    description: '',
    eligibility: 'Matric Science',
    duration: '2 Years',
    status: 'active'
  });

  // 3. Notification Form
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [notifForm, setNotifForm] = useState<Partial<NotificationItem>>({
    title: '',
    message: '',
    priority: 'high',
    status: 'active',
    showAsPopup: true
  });

  // 4. Gallery Form
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    title: '',
    description: '',
    imageUrl: '',
    category: 'Events',
    status: 'active'
  });

  // 5. Carousel Form
  const [carouselModalOpen, setCarouselModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [carouselForm, setCarouselForm] = useState<Partial<CarouselSlide>>({
    title: '',
    subtitle: '',
    imageUrl: '',
    badge: 'Session 2026-2027',
    status: 'active'
  });

  // 6. Change Password Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // Load All Data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [facData, progData, admData, abtData, conData, notData, galData, carData, setData] = await Promise.all([
        adminGetFaculty(),
        adminGetPrograms(),
        adminGetAdmissions(),
        adminGetAbout(),
        adminGetContact(),
        adminGetNotifications(),
        adminGetGallery(),
        adminGetCarousel(),
        adminGetSettings()
      ]);

      setFaculty(facData);
      setPrograms(progData);
      setAdmissions(admData);
      setAbout(abtData);
      setContact(conData);
      setNotifications(notData);
      setGallery(galData);
      setCarousel(carData);
      setCollegeSettings(setData);
    } catch (err) {
      showFeedback('error', 'Failed to load data! Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showFeedback = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  /* ==========================================================================
     HANDLERS: FACULTY
     ========================================================================== */

  const handleOpenTeacherModal = (teacher: Teacher | null = null) => {
    if (teacher) {
      setEditingTeacher(teacher);
      setTeacherForm(teacher);
    } else {
      setEditingTeacher(null);
      setTeacherForm({
        name: '',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        subject: '',
        designation: 'Lecturer',
        qualification: 'M.Sc',
        experience: '5 Years',
        age: '30',
        address: 'Mayar, Dir Lower',
        biography: '',
        status: 'active'
      });
    }
    setTeacherModalOpen(true);
  };

  const handleTeacherPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedDataUri = await compressImageFile(file, 800, 800, 0.75);
      setTeacherForm(prev => ({ ...prev, photo: compressedDataUri }));
    } catch (err) {
      showFeedback('error', 'Failed to upload photo!');
    }
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.name || !teacherForm.subject) {
      showFeedback('error', 'Teacher name and subject are required.');
      return;
    }

    if (editingTeacher) {
      const res = await adminUpdateTeacher(editingTeacher.id, teacherForm);
      if (res.success) {
        showFeedback('success', 'Teacher information updated.');
        setTeacherModalOpen(false);
        loadAllData();
      } else {
        showFeedback('error', res.message || 'Operation failed!');
      }
    } else {
      const res = await adminAddTeacher(teacherForm);
      if (res.success) {
        showFeedback('success', 'New teacher added successfully.');
        setTeacherModalOpen(false);
        loadAllData();
      } else {
        showFeedback('error', res.message || 'Operation failed!');
      }
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;
    const res = await adminDeleteTeacher(id);
    if (res.success) {
      showFeedback('success', 'Teacher deleted.');
      loadAllData();
    }
  };

  const handleToggleTeacherStatus = async (teacher: Teacher) => {
    const newStatus = teacher.status === 'active' ? 'disabled' : 'active';
    const res = await adminUpdateTeacher(teacher.id, { status: newStatus });
    if (res.success) {
      showFeedback('success', `Teacher status set to ${newStatus}.`);
      loadAllData();
    }
  };


  /* ==========================================================================
     HANDLERS: PROGRAMS
     ========================================================================== */

  const handleOpenProgramModal = (prog: Program | null = null) => {
    if (prog) {
      setEditingProgram(prog);
      setProgramForm(prog);
    } else {
      setEditingProgram(null);
      setProgramForm({
        name: '',
        description: '',
        eligibility: 'Matric Science (Minimum 50% Marks)',
        duration: '2 Years',
        status: 'active'
      });
    }
    setProgramModalOpen(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm.name) {
      showFeedback('error', 'Program name is required.');
      return;
    }

    if (editingProgram) {
      const res = await adminUpdateProgram(editingProgram.id, programForm);
      if (res.success) {
        showFeedback('success', 'Program updated successfully.');
        setProgramModalOpen(false);
        loadAllData();
      }
    } else {
      const res = await adminAddProgram(programForm);
      if (res.success) {
        showFeedback('success', 'New program added successfully.');
        setProgramModalOpen(false);
        loadAllData();
      }
    }
  };

  const handleDeleteProgram = async (id: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;
    const res = await adminDeleteProgram(id);
    if (res.success) {
      showFeedback('success', 'Program deleted.');
      loadAllData();
    }
  };


  /* ==========================================================================
     HANDLERS: ADMISSIONS, ABOUT, CONTACT, SETTINGS
     ========================================================================== */

  const handleSaveAdmissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissions) return;
    const res = await adminUpdateAdmissions(admissions);
    if (res.success) {
      showFeedback('success', 'Admissions section updated successfully.');
      loadAllData();
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!about) return;
    const res = await adminUpdateAbout(about);
    if (res.success) {
      showFeedback('success', 'College information updated.');
      loadAllData();
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    const res = await adminUpdateContact(contact);
    if (res.success) {
      showFeedback('success', 'Contact details updated.');
      loadAllData();
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeSettings) return;
    const res = await adminUpdateSettings(collegeSettings);
    if (res.success) {
      showFeedback('success', 'Settings saved.');
      loadAllData();
    }
  };


  /* ==========================================================================
     HANDLERS: NOTIFICATIONS
     ========================================================================== */

  const handleSaveNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifForm.title || !notifForm.message) {
      showFeedback('error', 'Both title and message are required.');
      return;
    }
    const res = await adminAddNotification(notifForm);
    if (res.success) {
      showFeedback('success', 'Notification published.');
      setNotifModalOpen(false);
      setNotifForm({ title: '', message: '', priority: 'high', status: 'active', showAsPopup: true });
      loadAllData();
    }
  };

  const handleDeleteNotification = async (id: string) => {
    const res = await adminDeleteNotification(id);
    if (res.success) {
      showFeedback('success', 'Notification deleted.');
      loadAllData();
    }
  };


  /* ==========================================================================
     HANDLERS: GALLERY
     ========================================================================== */

  const handleGalleryPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1200, 1200, 0.8);
      setGalleryForm(prev => ({ ...prev, imageUrl: compressed }));
    } catch (err) {
      showFeedback('error', 'Failed to upload gallery image!');
    }
  };

  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.imageUrl) {
      showFeedback('error', 'Title and image are required.');
      return;
    }
    const res = await adminAddGalleryItem(galleryForm);
    if (res.success) {
      showFeedback('success', 'Image added to gallery.');
      setGalleryModalOpen(false);
      setGalleryForm({ title: '', description: '', imageUrl: '', category: 'Events', status: 'active' });
      loadAllData();
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    const res = await adminDeleteGalleryItem(id);
    if (res.success) {
      showFeedback('success', 'Gallery item deleted.');
      loadAllData();
    }
  };


  /* ==========================================================================
     HANDLERS: CAROUSEL SLIDES
     ========================================================================== */

  const handleOpenCarouselModal = (slide: CarouselSlide | null = null) => {
    if (slide) {
      setEditingSlide(slide);
      setCarouselForm(slide);
    } else {
      setEditingSlide(null);
      setCarouselForm({
        title: '',
        subtitle: '',
        imageUrl: '',
        badge: 'Session 2026-2027',
        status: 'active'
      });
    }
    setCarouselModalOpen(true);
  };

  const handleCarouselImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1600, 1000, 0.8);
      setCarouselForm(prev => ({ ...prev, imageUrl: compressed }));
    } catch (err) {
      showFeedback('error', 'Failed to upload slide image!');
    }
  };

  const handleSaveCarouselSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carouselForm.title || !carouselForm.imageUrl) {
      showFeedback('error', 'Title and image are required.');
      return;
    }

    if (editingSlide) {
      const res = await adminUpdateCarouselSlide(editingSlide.id, carouselForm);
      if (res.success) {
        showFeedback('success', 'Carousel slide updated successfully.');
        setCarouselModalOpen(false);
        loadAllData();
      } else {
        showFeedback('error', res.message || 'Operation failed!');
      }
    } else {
      const res = await adminAddCarouselSlide(carouselForm);
      if (res.success) {
        showFeedback('success', 'New carousel slide added successfully.');
        setCarouselModalOpen(false);
        loadAllData();
      } else {
        showFeedback('error', res.message || 'Operation failed!');
      }
    }
  };

  const handleDeleteCarouselSlide = async (id: string) => {
    const res = await adminDeleteCarouselSlide(id);
    if (res.success) {
      showFeedback('success', 'Slide deleted.');
      loadAllData();
    }
  };


  /* ==========================================================================
     HANDLERS: CHANGE PASSWORD
     ========================================================================== */

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showFeedback('error', 'New password and confirm password do not match!');
      return;
    }

    const res = await changeAdminPassword(
      passwordForm.currentPassword,
      passwordForm.newPassword,
      passwordForm.confirmPassword
    );

    if (res.success) {
      showFeedback('success', 'Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      showFeedback('error', res.message || 'Failed to change password!');
    }
  };

  const sidebarNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'admissions', label: 'Admissions', icon: GraduationCap },
    { id: 'about', label: 'About College', icon: Building2 },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'carousel', label: 'Carousel Slides', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-slate-900 border-r border-slate-800 shrink-0 p-5 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <div className="w-10 h-10 rounded-full bg-blue-600 p-1 flex items-center justify-center shrink-0 shadow">
              <img src="/logo.svg" alt="Jamal College Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-tight">Jamal College Admin Portal</h2>
              <p className="text-[11px] text-blue-200/70">Jamal College Management</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarNavItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md font-extrabold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions in Sidebar */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <button
            onClick={onViewPublicSite}
            className="w-full bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4" />
            <span>View Public Website</span>
          </button>
          
          <button
            onClick={() => {
              logoutAdmin();
              onLogout();
            }}
            className="w-full bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-red-800/40"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-6">
        
        {/* Feedback Alert Bar */}
        {feedback && (
          <div className={`p-4 rounded-xl text-sm font-bold flex items-center justify-between shadow-lg animate-in fade-in duration-200 ${
            feedback.type === 'success' ? 'bg-emerald-950 text-emerald-200 border border-emerald-500/50' : 'bg-red-950 text-red-200 border border-red-500/50'
          }`}>
            <span>{feedback.msg}</span>
            {feedback.type === 'success' ? <Check className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
          </div>
        )}

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 text-left">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Welcome, Admin! (Overview)</h1>
              <p className="text-slate-400 text-sm mt-1">Manage all information for Jamal College of Science, Mayar.</p>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">Total Faculty</span>
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-black text-white">{faculty.length}</div>
                <div className="text-xs text-slate-400">Active: {faculty.filter(f => f.status === 'active').length}</div>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">Academic Programs</span>
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-black text-white">{programs.length}</div>
                <div className="text-xs text-slate-400">Active: {programs.filter(p => p.status === 'active').length}</div>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">Admission Status</span>
                  <GraduationCap className="w-5 h-5 text-blue-400" />
                </div>
                <div className={`text-2xl font-black ${admissions?.status === 'open' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {admissions?.status === 'open' ? 'Admissions Open' : 'Closed'}
                </div>
                <div className="text-xs text-slate-400">Session 2026-2027</div>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold">Active Notifications</span>
                  <Bell className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-3xl font-black text-white">{notifications.filter(n => n.status === 'active').length}</div>
                <div className="text-xs text-slate-400">Popup Active: {notifications.filter(n => n.showAsPopup).length}</div>
              </div>

            </div>

            {/* Quick Actions Bar */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Quick Actions</h3>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => { setActiveTab('faculty'); handleOpenTeacherModal(); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
                >
                  <Plus className="w-4 h-4" />
                  Add New Teacher
                </button>

                <button
                  onClick={() => { setActiveTab('notifications'); setNotifModalOpen(true); }}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
                >
                  <Bell className="w-4 h-4 text-blue-300" />
                  Send New Notification
                </button>

                <button
                  onClick={() => { setActiveTab('gallery'); setGalleryModalOpen(true); }}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
                >
                  <Upload className="w-4 h-4 text-blue-300" />
                  Upload Gallery Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FACULTY MANAGEMENT */}
        {activeTab === 'faculty' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-white">Faculty Management</h1>
                <p className="text-slate-400 text-xs mt-1">Manage teachers list, photos, experience, age, and biographies.</p>
              </div>
              <button
                onClick={() => handleOpenTeacherModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                Add Teacher
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-950 text-blue-300 border-b border-slate-800">
                      <th className="p-3.5">Photo</th>
                      <th className="p-3.5">Name</th>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5">Designation</th>
                      <th className="p-3.5">Qualification</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {faculty.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-slate-800/50">
                        <td className="p-3.5">
                          <img
                            src={teacher.photo}
                            alt={teacher.name}
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/60"
                          />
                        </td>
                        <td className="p-3.5 font-bold text-white">{teacher.name}</td>
                        <td className="p-3.5 text-blue-300 font-semibold">{teacher.subject}</td>
                        <td className="p-3.5 text-slate-300">{teacher.designation}</td>
                        <td className="p-3.5 text-slate-400">{teacher.qualification}</td>
                        <td className="p-3.5">
                          <button
                            onClick={() => handleToggleTeacherStatus(teacher)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              teacher.status === 'active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'
                            }`}
                          >
                            {teacher.status === 'active' ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenTeacherModal(teacher)}
                              className="p-2 bg-blue-900/60 hover:bg-blue-900 text-blue-200 rounded-lg text-xs"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTeacher(teacher.id)}
                              className="p-2 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg text-xs"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROGRAMS MANAGEMENT */}
        {activeTab === 'programs' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-white">Programs Management</h1>
                <p className="text-slate-400 text-xs mt-1">Update details and eligibility for Pre-Medical, Pre-Engineering, Computer Science, and Arts.</p>
              </div>
              <button
                onClick={() => handleOpenProgramModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                Add New Program
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.map((prog) => (
                <div key={prog.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      prog.status === 'active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-red-950 text-red-300 border border-red-500/30'
                    }`}>
                      {prog.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                    <h3 className="text-xl font-bold text-blue-300">{prog.name}</h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{prog.description}</p>

                  <div className="text-xs text-slate-400 space-y-1 bg-slate-950 p-3 rounded-xl">
                    <p><span className="text-blue-400 font-bold">Eligibility:</span> {prog.eligibility}</p>
                    <p><span className="text-blue-400 font-bold">Duration:</span> {prog.duration}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleOpenProgramModal(prog)}
                      className="bg-blue-900 hover:bg-blue-800 text-blue-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProgram(prog.id)}
                      className="bg-red-950 hover:bg-red-900 text-red-300 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ADMISSIONS MANAGEMENT */}
        {activeTab === 'admissions' && admissions && (
          <div className="space-y-6 text-left">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Admissions Management</h1>
              <p className="text-slate-400 text-xs mt-1">Control college admission notices, instructions, and required documents.</p>
            </div>

            <form onSubmit={handleSaveAdmissions} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-blue-300 mb-1">Admission Status</label>
                  <select
                    value={admissions.status}
                    onChange={(e) => setAdmissions({ ...admissions, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                  >
                    <option value="open">Admissions Open</option>
                    <option value="closed">Admissions Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-300 mb-1">Admission Helpline Phone</label>
                  <input
                    type="text"
                    value={admissions.contactPhone}
                    onChange={(e) => setAdmissions({ ...admissions, contactPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-300 mb-1">Announcement Notice</label>
                <textarea
                  rows={3}
                  value={admissions.announcement}
                  onChange={(e) => setAdmissions({ ...admissions, announcement: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-300 mb-1">Instructions</label>
                <textarea
                  rows={5}
                  value={admissions.instructions}
                  onChange={(e) => setAdmissions({ ...admissions, instructions: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-xl shadow text-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Admissions Info</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: ABOUT COLLEGE */}
        {activeTab === 'about' && about && (
          <div className="space-y-6 text-left">
            <div>
              <h1 className="text-3xl font-extrabold text-white">About College</h1>
              <p className="text-slate-400 text-xs mt-1">Edit introduction, mission, and vision.</p>
            </div>

            <form onSubmit={handleSaveAbout} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-4">
              <div>
                <label className="block text-xs font-bold text-blue-300 mb-1">College Name</label>
                <input
                  type="text"
                  value={about.collegeName}
                  onChange={(e) => setAbout({ ...about, collegeName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-300 mb-1">Short Introduction</label>
                <textarea
                  rows={4}
                  value={about.introduction}
                  onChange={(e) => setAbout({ ...about, introduction: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-300 mb-1">Our Mission</label>
                <textarea
                  rows={3}
                  value={about.mission}
                  onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-300 mb-1">Our Vision</label>
                <textarea
                  rows={3}
                  value={about.vision}
                  onChange={(e) => setAbout({ ...about, vision: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-xl shadow text-sm flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save College Info</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: CONTACT */}
        {activeTab === 'contact' && contact && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
                  <PhoneCall className="w-8 h-8 text-emerald-400" />
                  <span>Dynamic Contact & Communication Center</span>
                </h1>
                <p className="text-slate-400 text-xs mt-1">
                  Control all public WhatsApp, Email, Phone, Social Media, Address, Map, and Floating WhatsApp widget settings without editing source code.
                </p>
              </div>
              <button
                onClick={handleSaveContact}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg text-sm flex items-center gap-2 shrink-0 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save All Contact Settings</span>
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-8">

              {/* 1. College Name & Office Hours */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
                <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span>General Information & Campus Hours</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-blue-300 mb-1">College Display Name</label>
                    <input
                      type="text"
                      value={contact.collegeName || 'Jamal College of Science, Mayar'}
                      onChange={(e) => setContact({ ...contact, collegeName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                      placeholder="Jamal College of Science, Mayar"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-300 mb-1">Office Working Hours</label>
                    <input
                      type="text"
                      value={contact.officeHours || ''}
                      onChange={(e) => setContact({ ...contact, officeHours: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                      placeholder="Monday to Saturday: 08:00 AM - 02:00 PM"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-blue-300">Campus Address</label>
                      <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={contact.address?.enabled !== false}
                          onChange={(e) =>
                            setContact({
                              ...contact,
                              address: {
                                enabled: e.target.checked,
                                text: contact.address?.text || ''
                              }
                            })
                          }
                          className="rounded text-blue-600 focus:ring-0 w-4 h-4"
                        />
                        <span>Enable Address Display</span>
                      </label>
                    </div>
                    <textarea
                      rows={2}
                      value={contact.address?.text || (typeof contact.address === 'string' ? (contact as any).address : '')}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          address: {
                            enabled: contact.address?.enabled !== false,
                            text: e.target.value
                          }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                      placeholder="Enter full campus postal address..."
                    />
                  </div>
                </div>
              </div>

              {/* 2. WhatsApp Settings */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <PhoneCall className="w-5 h-5 text-emerald-400" />
                    <span>WhatsApp Direct Chat System</span>
                  </h2>
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 cursor-pointer bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-lg">
                    <input
                      type="checkbox"
                      checked={contact.whatsapp?.enabled !== false}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          whatsapp: {
                            ...(contact.whatsapp || { number: '', displayNumber: '', message: '' }),
                            enabled: e.target.checked
                          }
                        })
                      }
                      className="rounded text-emerald-500 focus:ring-0 w-4 h-4"
                    />
                    <span>WhatsApp Service Active</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-blue-300 mb-1">
                      WhatsApp Number (International format, digits only)
                    </label>
                    <input
                      type="text"
                      value={contact.whatsapp?.number || (typeof (contact as any).whatsapp === 'string' ? (contact as any).whatsapp : '')}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          whatsapp: {
                            ...(contact.whatsapp || { enabled: true, displayNumber: '', message: '' }),
                            number: e.target.value
                          }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm font-mono"
                      placeholder="e.g. 923459001234"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Do not include +, -, or spaces in number (e.g. 923459001234).</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-300 mb-1">Display Number Label</label>
                    <input
                      type="text"
                      value={contact.whatsapp?.displayNumber || ''}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          whatsapp: {
                            ...(contact.whatsapp || { enabled: true, number: '', message: '' }),
                            displayNumber: e.target.value
                          }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                      placeholder="e.g. +92 345 9001234"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-blue-300 mb-1">
                    Pre-filled WhatsApp Greeting Message
                  </label>
                  <input
                    type="text"
                    value={contact.whatsapp?.message || ''}
                    onChange={(e) =>
                      setContact({
                        ...contact,
                        whatsapp: {
                          ...(contact.whatsapp || { enabled: true, number: '', displayNumber: '' }),
                          message: e.target.value
                        }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                    placeholder="e.g. Hello Jamal College of Science, Mayar! I need information regarding admissions."
                  />
                  <p className="text-[11px] text-slate-400 mt-1">This message will auto-fill when a student clicks the WhatsApp button.</p>
                </div>

                {/* Floating WhatsApp Widget Settings */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-emerald-300">Sticky Floating WhatsApp Widget</h3>
                    <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contact.floatingWhatsapp?.enabled !== false}
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            floatingWhatsapp: {
                              ...(contact.floatingWhatsapp || { buttonText: 'Contact on WhatsApp', number: '', message: '', position: 'bottom-right' }),
                              enabled: e.target.checked
                            }
                          })
                        }
                        className="rounded text-emerald-500 focus:ring-0 w-4 h-4"
                      />
                      <span>Show Floating WhatsApp Button on Website</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Floating Widget Tooltip Text</label>
                      <input
                        type="text"
                        value={contact.floatingWhatsapp?.buttonText || 'Contact on WhatsApp'}
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            floatingWhatsapp: {
                              ...(contact.floatingWhatsapp || { enabled: true, number: '', message: '', position: 'bottom-right' }),
                              buttonText: e.target.value
                            }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Widget Position</label>
                      <select
                        value={contact.floatingWhatsapp?.position || 'bottom-right'}
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            floatingWhatsapp: {
                              ...(contact.floatingWhatsapp || { enabled: true, buttonText: 'Contact on WhatsApp', number: '', message: '' }),
                              position: e.target.value
                            }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs"
                      >
                        <option value="bottom-right">Bottom Right Corner</option>
                        <option value="bottom-left">Bottom Left Corner</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Phone & Email Settings */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
                <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-blue-400" />
                  <span>Phone Hotline & Email Inquiry System</span>
                </h2>

                {/* Phone Hotline */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-blue-300">Official Phone Helpline</h3>
                    <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contact.phone?.enabled !== false}
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            phone: {
                              ...(contact.phone || { number: '', displayText: '' }),
                              enabled: e.target.checked
                            }
                          })
                        }
                        className="rounded text-blue-600 focus:ring-0 w-4 h-4"
                      />
                      <span>Phone Helpline Enabled</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number (For dialer tel: links)</label>
                      <input
                        type="text"
                        value={contact.phone?.number || (typeof (contact as any).phone === 'string' ? (contact as any).phone : '')}
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            phone: {
                              ...(contact.phone || { enabled: true, displayText: '' }),
                              number: e.target.value
                            }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                        placeholder="+923459001234"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Display Phone Text</label>
                      <input
                        type="text"
                        value={contact.phone?.displayText || ''}
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            phone: {
                              ...(contact.phone || { enabled: true, number: '' }),
                              displayText: e.target.value
                            }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                        placeholder="+92 345 9001234"
                      />
                    </div>
                  </div>
                </div>

                {/* Official Email */}
                <div className="pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-blue-300">Official College Email</h3>
                    <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contact.email?.enabled !== false}
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            email: {
                              ...(contact.email || { address: '', displayText: '', defaultSubject: '', defaultMessage: '' }),
                              enabled: e.target.checked
                            }
                          })
                        }
                        className="rounded text-blue-600 focus:ring-0 w-4 h-4"
                      />
                      <span>Email System Enabled</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Official Email Address</label>
                      <input
                        type="email"
                        value={contact.email?.address || (typeof (contact as any).email === 'string' ? (contact as any).email : '')}
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            email: {
                              ...(contact.email || { enabled: true, displayText: '', defaultSubject: '', defaultMessage: '' }),
                              address: e.target.value
                            }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm font-mono"
                        placeholder="info@jamalcollege.edu.pk"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Display Email Text</label>
                      <input
                        type="text"
                        value={contact.email?.displayText || ''}
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            email: {
                              ...(contact.email || { enabled: true, address: '', defaultSubject: '', defaultMessage: '' }),
                              displayText: e.target.value
                            }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                        placeholder="info@jamalcollege.edu.pk"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Default Email Subject Line</label>
                      <input
                        type="text"
                        value={contact.email?.defaultSubject || ''}
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            email: {
                              ...(contact.email || { enabled: true, address: '', displayText: '', defaultMessage: '' }),
                              defaultSubject: e.target.value
                            }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs"
                        placeholder="e.g. Admission Inquiry - Jamal College of Science"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Default Email Message Body</label>
                      <input
                        type="text"
                        value={contact.email?.defaultMessage || ''}
                        onChange={(e) =>
                          setContact({
                            ...contact,
                            email: {
                              ...(contact.email || { enabled: true, address: '', displayText: '', defaultSubject: '' }),
                              defaultMessage: e.target.value
                            }
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs"
                        placeholder="e.g. Respected Administration, I would like to inquire about..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Social Media Links */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
                <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <span>Official Social Media Pages</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Facebook */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400">Facebook Page</span>
                      <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={contact.socialMedia?.facebook?.enabled !== false}
                          onChange={(e) =>
                            setContact({
                              ...contact,
                              socialMedia: {
                                ...contact.socialMedia,
                                facebook: {
                                  enabled: e.target.checked,
                                  url: contact.socialMedia?.facebook?.url || ''
                                }
                              }
                            })
                          }
                          className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
                        />
                        <span>Active</span>
                      </label>
                    </div>
                    <input
                      type="url"
                      value={contact.socialMedia?.facebook?.url || (contact as any).facebook || ''}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          socialMedia: {
                            ...contact.socialMedia,
                            facebook: {
                              enabled: contact.socialMedia?.facebook?.enabled !== false,
                              url: e.target.value
                            }
                          }
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono"
                      placeholder="https://www.facebook.com/JCSmayar/"
                    />
                  </div>

                  {/* Instagram */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-400">Instagram Profile</span>
                      <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={contact.socialMedia?.instagram?.enabled ?? false}
                          onChange={(e) =>
                            setContact({
                              ...contact,
                              socialMedia: {
                                ...contact.socialMedia,
                                instagram: {
                                  enabled: e.target.checked,
                                  url: contact.socialMedia?.instagram?.url || ''
                                }
                              }
                            })
                          }
                          className="rounded text-pink-600 focus:ring-0 w-3.5 h-3.5"
                        />
                        <span>Active</span>
                      </label>
                    </div>
                    <input
                      type="url"
                      value={contact.socialMedia?.instagram?.url || ''}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          socialMedia: {
                            ...contact.socialMedia,
                            instagram: {
                              enabled: contact.socialMedia?.instagram?.enabled ?? true,
                              url: e.target.value
                            }
                          }
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono"
                      placeholder="https://www.instagram.com/JCSmayar/"
                    />
                  </div>

                  {/* YouTube */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-400">YouTube Channel</span>
                      <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={contact.socialMedia?.youtube?.enabled ?? false}
                          onChange={(e) =>
                            setContact({
                              ...contact,
                              socialMedia: {
                                ...contact.socialMedia,
                                youtube: {
                                  enabled: e.target.checked,
                                  url: contact.socialMedia?.youtube?.url || ''
                                }
                              }
                            })
                          }
                          className="rounded text-red-600 focus:ring-0 w-3.5 h-3.5"
                        />
                        <span>Active</span>
                      </label>
                    </div>
                    <input
                      type="url"
                      value={contact.socialMedia?.youtube?.url || ''}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          socialMedia: {
                            ...contact.socialMedia,
                            youtube: {
                              enabled: contact.socialMedia?.youtube?.enabled ?? true,
                              url: e.target.value
                            }
                          }
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono"
                      placeholder="https://www.youtube.com/@JamalCollegeMayar"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-500">LinkedIn Page</span>
                      <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={contact.socialMedia?.linkedin?.enabled ?? false}
                          onChange={(e) =>
                            setContact({
                              ...contact,
                              socialMedia: {
                                ...contact.socialMedia,
                                linkedin: {
                                  enabled: e.target.checked,
                                  url: contact.socialMedia?.linkedin?.url || ''
                                }
                              }
                            })
                          }
                          className="rounded text-blue-600 focus:ring-0 w-3.5 h-3.5"
                        />
                        <span>Active</span>
                      </label>
                    </div>
                    <input
                      type="url"
                      value={contact.socialMedia?.linkedin?.url || ''}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          socialMedia: {
                            ...contact.socialMedia,
                            linkedin: {
                              enabled: contact.socialMedia?.linkedin?.enabled ?? true,
                              url: e.target.value
                            }
                          }
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs font-mono"
                      placeholder="https://www.linkedin.com/company/jamal-college-mayar"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Map Settings */}
              <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-400" />
                    <span>Google Maps Campus Location</span>
                  </h2>
                  <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contact.map?.enabled !== false}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          map: {
                            ...(contact.map || { latitude: '', longitude: '', googleMapsUrl: '' }),
                            enabled: e.target.checked
                          }
                        })
                      }
                      className="rounded text-amber-500 focus:ring-0 w-4 h-4"
                    />
                    <span>Map Active</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Latitude</label>
                    <input
                      type="text"
                      value={contact.map?.latitude || ''}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          map: {
                            ...(contact.map || { enabled: true, longitude: '', googleMapsUrl: '' }),
                            latitude: e.target.value
                          }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm font-mono"
                      placeholder="34.7333"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Longitude</label>
                    <input
                      type="text"
                      value={contact.map?.longitude || ''}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          map: {
                            ...(contact.map || { enabled: true, latitude: '', googleMapsUrl: '' }),
                            longitude: e.target.value
                          }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm font-mono"
                      placeholder="71.9500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Google Maps Direct Link</label>
                    <input
                      type="url"
                      value={contact.map?.googleMapsUrl || contact.mapUrl || (contact as any).mapUrl || ''}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          map: {
                            ...(contact.map || { enabled: true, latitude: '', longitude: '' }),
                            googleMapsUrl: e.target.value
                          }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm font-mono"
                      placeholder="https://maps.google.com/?q=Mayar+Dir+Lower+Pakistan"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-xl text-base flex items-center gap-2 transition-all"
                >
                  <Save className="w-5 h-5" />
                  <span>Save All Contact Changes</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 7: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-white">Notifications</h1>
                <p className="text-slate-400 text-xs mt-1">Publish popups and ticker notices on the website.</p>
              </div>
              <button
                onClick={() => setNotifModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                Issue New Notification
              </button>
            </div>

            <div className="space-y-4">
              {notifications.map((n) => (
                <div key={n.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        n.status === 'active' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                      }`}>
                        {n.status}
                      </span>
                      {n.showAsPopup && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          Popup Active
                        </span>
                      )}
                      <h4 className="font-bold text-blue-300 text-base">{n.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300">{n.message}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteNotification(n.id)}
                    className="p-2 bg-red-950 hover:bg-red-900 text-red-300 rounded-lg text-xs shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-white">Photo Gallery</h1>
                <p className="text-slate-400 text-xs mt-1">Add photos of science exhibitions and college events.</p>
              </div>
              <button
                onClick={() => setGalleryModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                Add Image
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((g) => (
                <div key={g.id} className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden space-y-3 p-4">
                  <div className="h-44 rounded-xl overflow-hidden bg-slate-950">
                    <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-blue-300 text-base">{g.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{g.description}</p>
                  <button
                    onClick={() => handleDeleteGalleryItem(g.id)}
                    className="w-full bg-red-950 hover:bg-red-900 text-red-300 font-bold py-1.5 rounded-lg text-xs"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8.5: CAROUSEL SLIDES MANAGEMENT */}
        {activeTab === 'carousel' && (
          <div className="space-y-6 text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-7 h-7 text-amber-400" />
                  <span>Home Carousel Management</span>
                </h1>
                <p className="text-slate-400 text-xs mt-1">
                  Manage hero banners, science exhibition images, and group photos. You can add, edit, or delete slides dynamically.
                </p>
              </div>
              <button
                onClick={() => handleOpenCarouselModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Carousel Slide</span>
              </button>
            </div>

            {/* Slides List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {carousel.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-blue-500/50 transition-all"
                >
                  <div className="relative h-56 bg-slate-950 overflow-hidden">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-300 font-bold text-xs px-2.5 py-1 rounded-full border border-amber-400/30">
                      #{idx + 1} {slide.badge || 'Banner'}
                    </span>

                    <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      slide.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {slide.status === 'active' ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-extrabold text-amber-300 text-lg leading-snug">
                      {slide.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium line-clamp-2">
                      {slide.subtitle || slide.title}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleOpenCarouselModal(slide)}
                      className="flex-1 bg-slate-800 hover:bg-blue-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteCarouselSlide(slide.id)}
                      className="p-2 bg-red-950/80 hover:bg-red-900 text-red-300 rounded-xl text-xs transition-all border border-red-800/40"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: SETTINGS & CHANGE PASSWORD */}
        {activeTab === 'settings' && (
          <div className="space-y-8 text-left">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Settings & Security</h1>
              <p className="text-slate-400 text-xs mt-1">Change password and manage general website settings.</p>
            </div>

            {/* Change Password Card */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-blue-300 border-b border-slate-800 pb-3">
                <Key className="w-5 h-5 text-blue-400" />
                <h3 className="text-xl font-bold">Change Password</h3>
              </div>

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 focus:outline-none"
                      title={showCurrentPw ? "Hide password" : "Show password"}
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        required
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 focus:outline-none"
                        title={showNewPw ? "Hide password" : "Show password"}
                      >
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        required
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 focus:outline-none"
                        title={showConfirmPw ? "Hide password" : "Show password"}
                      >
                        {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow text-sm flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </form>
            </div>

            {/* General Popup Settings */}
            {collegeSettings && (
              <form onSubmit={handleSaveSettings} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-blue-300 border-b border-slate-800 pb-3">Website Popup Settings</h3>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="popupEnabled"
                    checked={collegeSettings.popupEnabled}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, popupEnabled: e.target.checked })}
                    className="w-5 h-5 text-blue-600 accent-blue-600"
                  />
                  <label htmlFor="popupEnabled" className="text-sm font-bold text-slate-200">
                    Enable Website Popup Notification
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Popup Display Message</label>
                  <textarea
                    rows={3}
                    value={collegeSettings.popupMessage}
                    onChange={(e) => setCollegeSettings({ ...collegeSettings, popupMessage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2.5 rounded-xl shadow text-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </form>
            )}

          </div>
        )}

      </main>


      {/* ==========================================================================
         MODALS
         ========================================================================== */}

      {/* Teacher Modal */}
      {teacherModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 text-left max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
              {editingTeacher ? 'Edit Teacher Details' : 'Add Teacher'}
            </h3>

            <form onSubmit={handleSaveTeacher} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Teacher Name *</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.name || ''}
                    onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={teacherForm.subject || ''}
                    onChange={(e) => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Designation</label>
                  <input
                    type="text"
                    value={teacherForm.designation || ''}
                    onChange={(e) => setTeacherForm({ ...teacherForm, designation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Qualification</label>
                  <input
                    type="text"
                    value={teacherForm.qualification || ''}
                    onChange={(e) => setTeacherForm({ ...teacherForm, qualification: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Experience</label>
                  <input
                    type="text"
                    value={teacherForm.experience || ''}
                    onChange={(e) => setTeacherForm({ ...teacherForm, experience: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Age</label>
                  <input
                    type="text"
                    value={teacherForm.age || ''}
                    onChange={(e) => setTeacherForm({ ...teacherForm, age: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status</label>
                  <select
                    value={teacherForm.status || 'active'}
                    onChange={(e) => setTeacherForm({ ...teacherForm, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Address</label>
                <input
                  type="text"
                  value={teacherForm.address || ''}
                  onChange={(e) => setTeacherForm({ ...teacherForm, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Short Biography</label>
                <textarea
                  rows={3}
                  value={teacherForm.biography || ''}
                  onChange={(e) => setTeacherForm({ ...teacherForm, biography: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              {/* Photo Upload with Compression */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Upload Teacher Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTeacherPhotoUpload}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white file:font-bold hover:file:bg-blue-700"
                />
                {teacherForm.photo && (
                  <img src={teacherForm.photo} alt="Preview" className="w-16 h-16 rounded-xl object-cover mt-2 ring-2 ring-blue-500" />
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setTeacherModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2 rounded-xl shadow"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Program Modal */}
      {programModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 text-left shadow-2xl">
            <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
              {editingProgram ? 'Edit Program' : 'Add Academic Program'}
            </h3>

            <form onSubmit={handleSaveProgram} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Program Name *</label>
                <input
                  type="text"
                  required
                  value={programForm.name || ''}
                  onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                  placeholder="e.g. Pre-Medical (F.Sc)"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={programForm.description || ''}
                  onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Eligibility</label>
                <input
                  type="text"
                  value={programForm.eligibility || ''}
                  onChange={(e) => setProgramForm({ ...programForm, eligibility: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Duration</label>
                <input
                  type="text"
                  value={programForm.duration || ''}
                  onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setProgramModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2 rounded-xl shadow"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {notifModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 text-left shadow-2xl">
            <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
              Issue New Notification or Popup
            </h3>

            <form onSubmit={handleSaveNotification} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={notifForm.title || ''}
                  onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Message *</label>
                <textarea
                  rows={3}
                  required
                  value={notifForm.message || ''}
                  onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showAsPopup"
                  checked={notifForm.showAsPopup || false}
                  onChange={(e) => setNotifForm({ ...notifForm, showAsPopup: e.target.checked })}
                  className="w-4 h-4 text-blue-600 accent-blue-600"
                />
                <label htmlFor="showAsPopup" className="text-slate-300 font-bold">
                  Show in website popup box
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setNotifModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2 rounded-xl shadow"
                >
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 text-left shadow-2xl">
            <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-2">
              Add Image to Gallery
            </h3>

            <form onSubmit={handleSaveGalleryItem} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={galleryForm.title || ''}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={galleryForm.description || ''}
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Upload Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryPhotoUpload}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white file:font-bold hover:file:bg-blue-700"
                />
                {galleryForm.imageUrl && (
                  <img src={galleryForm.imageUrl} alt="Preview" className="w-24 h-24 rounded-xl object-cover mt-2 ring-2 ring-blue-500" />
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2 rounded-xl shadow"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Carousel Modal */}
      {carouselModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-left space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>{editingSlide ? 'Edit Carousel Slide' : 'Add New Carousel Slide'}</span>
              </h3>
              <button
                onClick={() => setCarouselModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveCarouselSlide} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Slide Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jamal College of Science, Mayar - Faculty & Science Students"
                  value={carouselForm.title || ''}
                  onChange={(e) => setCarouselForm({ ...carouselForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dedicated faculty members & talented science students"
                  value={carouselForm.subtitle || ''}
                  onChange={(e) => setCarouselForm({ ...carouselForm, subtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Badge Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Session 2026-2027"
                    value={carouselForm.badge || ''}
                    onChange={(e) => setCarouselForm({ ...carouselForm, badge: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Status</label>
                  <select
                    value={carouselForm.status || 'active'}
                    onChange={(e) => setCarouselForm({ ...carouselForm, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm"
                  >
                    <option value="active">Active / Visible</option>
                    <option value="hidden">Hidden / Inactive</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload or URL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Upload Image or Enter Image URL *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCarouselImageUpload}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white file:font-bold hover:file:bg-blue-700"
                />
                <input
                  type="text"
                  placeholder="or image URL (http://...)"
                  value={carouselForm.imageUrl || ''}
                  onChange={(e) => setCarouselForm({ ...carouselForm, imageUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-xs mt-2"
                />

                {carouselForm.imageUrl && (
                  <div className="mt-3 relative h-40 rounded-xl overflow-hidden border border-slate-700">
                    <img
                      src={carouselForm.imageUrl}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCarouselModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2 rounded-xl text-xs shadow"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
