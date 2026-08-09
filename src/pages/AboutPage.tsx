import React from 'react';
import { AboutInfo } from '../types';
import { CollegeLogo } from '../components/CollegeLogo';
import { Target, Compass, History, GraduationCap, Lightbulb, Building2 } from 'lucide-react';

interface AboutPageProps {
  about: AboutInfo | null;
}

export const AboutPage: React.FC<AboutPageProps> = ({ about }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl border-b-4 border-blue-600 space-y-4">
        <div className="flex items-center justify-start gap-3">
          <span className="bg-blue-500/30 text-blue-100 font-bold text-xs px-3 py-1 rounded-full border border-blue-400/30">
            About & Mission
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          About Us
        </h1>
        <p className="text-blue-100 text-base sm:text-lg max-w-3xl opacity-90 leading-relaxed">
          Full introduction, educational history, mission, and vision of {about?.collegeName || 'Jamal College of Sciences, Mayar, Dir Lower'}.
        </p>
      </div>

      {/* Main Introduction Card */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-900" />
          <span>College Introduction</span>
        </h2>
        <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
          {about?.introduction || 'Jamal College of Sciences, Mayar is dedicated to delivering standard intermediate education in science and arts disciplines.'}
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mission Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 hover:bg-blue-50/40 transition-all space-y-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {about?.mission || 'To provide high quality education, foster critical thinking, and build strong character.'}
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 hover:bg-blue-50/40 transition-all space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Our Vision</h3>
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {about?.vision || 'To become the premier science college in Dir Lower through academic rigor and character building.'}
          </p>
        </div>

      </div>

      {/* History & Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* History */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all space-y-3">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-lg">
            <History className="w-5 h-5 text-blue-600" />
            <span>History & Background</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {about?.history}
          </p>
        </div>

        {/* Educational Environment */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all space-y-3">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-lg">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span>Academic Environment</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {about?.educationalEnvironment}
          </p>
        </div>

        {/* Teaching Philosophy */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all space-y-3">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-lg">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <span>Teaching Methodology</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {about?.teachingPhilosophy}
          </p>
        </div>

      </div>

    </div>
  );
};
