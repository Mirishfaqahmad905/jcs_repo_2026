import React, { useState } from 'react';
import { Program } from '../types';
import { BookOpen, Search, Clock, CheckCircle2, Award } from 'lucide-react';

interface ProgramsPageProps {
  programs: Program[];
  setActiveTab: (tab: string) => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({ programs, setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrograms = programs.filter(p => {
    const query = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-left">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl border-b-4 border-blue-600 space-y-4">
        <div className="flex items-center justify-start gap-3">
          <span className="bg-blue-500/30 text-blue-100 font-bold text-xs px-3 py-1 rounded-full border border-blue-400/30">
            Departments & Curriculum
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Academic Programs
        </h1>
        <p className="text-blue-100 text-base sm:text-lg max-w-3xl opacity-90 leading-relaxed">
          Intermediate level discipline tracks offered at Jamal College of Sciences, Mayar.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 max-w-xl">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search programs or subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Programs Grid */}
      {filteredPrograms.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 p-8 rounded-2xl text-center space-y-2">
          <p className="text-slate-800 font-bold text-lg">No Program Found</p>
          <p className="text-slate-600 text-sm">Please try searching with a different term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    {prog.name}
                  </h3>
                  <span className="bg-blue-100 text-blue-700 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Duration: {prog.duration}
                  </span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed">
                  {prog.description}
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <p className="text-xs font-bold text-slate-500">Eligibility Criteria:</p>
                  <p className="text-sm font-semibold text-slate-900">{prog.eligibility}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Admissions Open</span>
                </div>
                <button
                  onClick={() => setActiveTab('admissions')}
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition-all"
                >
                  Apply / Admission Info
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
