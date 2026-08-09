import React from 'react';
import { CollegeLogo } from '../components/CollegeLogo';
import { Sparkles, ArrowLeft, BookOpen, Award, Users, ShieldCheck, PhoneCall, ChevronRight, CheckCircle2, Facebook, Bell } from 'lucide-react';
import { Program, Teacher, NotificationItem, AdmissionInfo, AboutInfo, GalleryItem, CarouselSlide, ContactInfo } from '../types';
import { CollegeCarousel } from '../components/CollegeCarousel';
import { WhatsAppButton, EmailButton, PhoneButton } from '../components/ContactComponents';

interface HomePageProps {
  programs: Program[];
  teachers: Teacher[];
  notifications: NotificationItem[];
  admissions: AdmissionInfo | null;
  about: AboutInfo | null;
  gallery: GalleryItem[];
  carousel?: CarouselSlide[];
  setActiveTab: (tab: string) => void;
  onTeacherSelect: (teacher: Teacher) => void;
  contact?: ContactInfo | null;
}

export const HomePage: React.FC<HomePageProps> = ({
  programs,
  teachers,
  notifications,
  admissions,
  about,
  gallery,
  carousel = [],
  setActiveTab,
  onTeacherSelect,
  contact
}) => {
  const activeNotifications = notifications.filter(n => n.status === 'active');

  return (
    <div className="space-y-16 pb-12">
      
      {/* Dynamic News / Ticker Bar */}
      {activeNotifications.length > 0 && (
        <div className="bg-blue-900 text-white font-bold py-2.5 px-4 shadow-sm border-b border-blue-800">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <span className="bg-blue-500/30 text-blue-100 border border-blue-400/30 text-xs px-3 py-1 rounded-full shrink-0 flex items-center gap-1 font-bold">
              <Bell className="w-3.5 h-3.5 text-blue-300 animate-bounce" />
              Latest News
            </span>
            <div className="overflow-hidden whitespace-nowrap text-sm sm:text-base flex-1">
              <div className="inline-block animate-marquee font-sans">
                {activeNotifications.map(n => `📢 ${n.title}: ${n.message}`).join('   |   ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-800 text-white overflow-hidden py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-blue-600">
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left/Main Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/30 border border-blue-400/30 px-3.5 py-1.5 rounded-full text-blue-100 text-xs sm:text-sm font-bold">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span>Jamal College of Sciences, Mayar, Dir Lower</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Empowering Minds with Knowledge & Scientific Excellence
            </h1>

            <p className="text-blue-100 text-base sm:text-lg opacity-90 leading-relaxed max-w-2xl">
              {about?.introduction || 'Jamal College of Sciences, Mayar provides world-class education in F.Sc Pre-Medical, Pre-Engineering, ICS Computer Science, and F.A Humanities under expert faculty.'}
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4 justify-start">
              <button
                onClick={() => setActiveTab('admissions')}
                className="bg-white text-blue-900 hover:bg-blue-50 font-extrabold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex items-center gap-2"
              >
                <span>Admissions Info</span>
                <ChevronRight className="w-5 h-5 text-blue-900" />
              </button>

              <button
                onClick={() => setActiveTab('programs')}
                className="bg-blue-800/60 hover:bg-blue-800 text-white border border-blue-400/30 font-bold px-6 py-3.5 rounded-xl transition-all text-sm sm:text-base flex items-center gap-2"
              >
                <span>Explore Programs</span>
                <BookOpen className="w-5 h-5 text-blue-200" />
              </button>
            </div>

            {/* Quick Status Pill */}
            {admissions?.status === 'open' && (
              <div className="pt-2 flex items-center gap-2 text-emerald-200 text-xs sm:text-sm font-semibold bg-emerald-900/40 border border-emerald-400/30 w-fit px-3.5 py-1.5 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Admissions open for Session 2026-2027!</span>
              </div>
            )}
          </div>

          {/* Hero Right: Official Crest Logo Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group w-full max-w-md">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 sm:p-10 rounded-2xl shadow-2xl flex flex-col items-center text-center space-y-6">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-white p-3 shadow-md flex items-center justify-center">
                  <img src="/logo.svg" alt="Jamal College Crest" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Jamal College of Sciences</h2>
                  <p className="text-sm font-bold text-blue-200 mt-1">MAYAR DIR LOWER</p>
                  <p className="text-xs text-blue-300 font-mono mt-0.5">ESTABLISHED 2015</p>
                </div>
                <div className="w-full pt-3 border-t border-white/20 flex items-center justify-around text-xs text-blue-100 font-semibold">
                  <span>Pre-Medical</span>
                  <span className="text-blue-300">•</span>
                  <span>Pre-Engineering</span>
                  <span className="text-blue-300">•</span>
                  <span>ICS</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Animated College Group Photo Banner & Carousel */}
      <CollegeCarousel slides={carousel} />

      {/* Why Choose Jamal College Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-left">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 border-l-4 border-blue-600 pl-3">
            Why Choose Jamal College of Sciences?
          </h2>
          <p className="text-slate-600 max-w-2xl text-sm sm:text-base mt-2">
            Our priority is conceptual learning, career development, and academic excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Experienced Faculty',
              desc: 'Qualified M.Sc and M.Phil educators offering concept-based instruction.',
              icon: Users,
              color: 'bg-red-100 text-red-600'
            },
            {
              title: 'Modern Science & IT Labs',
              desc: 'State-of-the-art physics, chemistry, biology, and computer laboratories.',
              icon: BookOpen,
              color: 'bg-indigo-100 text-indigo-600'
            },
            {
              title: 'Top Board Results',
              desc: 'Consistent top positions and high pass percentages in BISE Malakand board examinations.',
              icon: Award,
              color: 'bg-blue-100 text-blue-600'
            },
            {
              title: 'Disciplined Environment',
              desc: 'Strict attendance monitoring, monthly tests, and regular parent communication.',
              icon: ShieldCheck,
              color: 'bg-emerald-100 text-emerald-600'
            }
          ].map((feat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 hover:bg-blue-50/40 transition-all space-y-3 text-left">
              <div className={`w-10 h-10 rounded-lg ${feat.color} flex items-center justify-center font-bold`}>
                <feat.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Programs Section */}
      <section className="bg-slate-50/80 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 text-left">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 border-l-4 border-blue-600 pl-3">
                Academic Programs
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Intermediate level discipline tracks
              </p>
            </div>
            <button
              onClick={() => setActiveTab('programs')}
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <span>View All Programs</span>
              <ChevronRight className="w-4 h-4 text-blue-200" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.slice(0, 4).map((prog) => (
              <div key={prog.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition-all space-y-4 text-left flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded font-bold">
                    Duration: {prog.duration}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{prog.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {prog.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-xs text-slate-500 font-medium">
                  Eligibility: {prog.eligibility}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 text-left">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 border-l-4 border-blue-600 pl-3">
              Our Distinguished Faculty
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Dedicated educators shaping academic success
            </p>
          </div>
          <button
            onClick={() => setActiveTab('faculty')}
            className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <span>View Faculty Directory</span>
            <ChevronRight className="w-4 h-4 text-blue-200" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.slice(0, 4).map((teacher) => (
            <div
              key={teacher.id}
              onClick={() => onTeacherSelect(teacher)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group text-left"
            >
              <div className="h-48 w-full bg-slate-900 overflow-hidden relative">
                <img
                  src={teacher.photo}
                  alt={teacher.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-blue-900 text-white text-xs font-bold px-2.5 py-0.5 rounded-md shadow">
                  {teacher.subject}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="font-bold text-slate-900 text-lg group-hover:text-blue-900 transition-colors">
                  {teacher.name}
                </h4>
                <p className="text-xs text-blue-700 font-semibold">{teacher.designation}</p>
                <p className="text-xs text-slate-500">{teacher.qualification}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Preview */}
      {gallery.length > 0 && (
        <section className="bg-slate-900 text-white py-16 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 text-left">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white border-l-4 border-blue-500 pl-3">
                  Campus Life & Gallery
                </h2>
                <p className="text-slate-300 text-sm mt-1">
                  Science exhibitions, lab sessions, and college events
                </p>
              </div>
              <button
                onClick={() => setActiveTab('gallery')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md"
              >
                View Full Gallery
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-lg group">
                  <div className="h-52 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 text-left space-y-1">
                    <h4 className="font-bold text-blue-300 text-base">{item.title}</h4>
                    <p className="text-xs text-slate-300 line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-950 rounded-2xl p-8 sm:p-12 text-white shadow-xl text-left flex flex-col lg:flex-row items-center justify-between gap-8 border border-blue-800">
          <div className="space-y-3 max-w-2xl">
            <span className="bg-blue-500/30 border border-blue-400/30 text-blue-100 text-xs font-bold px-3 py-1 rounded-full">
              Admissions Help Desk
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Shape Your Academic Future at {contact?.collegeName || 'Jamal College of Science, Mayar'}!
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed opacity-90">
              Visit our admissions office or contact us today via WhatsApp, phone, or email for prospectus and admission details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0">
            <WhatsAppButton contact={contact || null} customText="WhatsApp Us" />
            <PhoneButton contact={contact || null} customText="Call" />
            <button
              onClick={() => setActiveTab('admissions')}
              className="bg-blue-800/80 hover:bg-blue-800 text-white font-bold px-5 py-3 rounded-xl border border-blue-400/30 transition-all text-sm"
            >
              Admissions Info
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
