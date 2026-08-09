import React, { useState } from 'react';
import { Teacher } from '../types';
import { TeacherCard } from '../components/TeacherCard';
import { TeacherModal } from '../components/TeacherModal';
import { Search, GraduationCap } from 'lucide-react';

interface FacultyPageProps {
  teachers: Teacher[];
}

export const FacultyPage: React.FC<FacultyPageProps> = ({ teachers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = teachers.filter((t) => {
    const query = searchTerm.toLowerCase();
    return (
      t.name.toLowerCase().includes(query) ||
      t.subject.toLowerCase().includes(query) ||
      t.designation.toLowerCase().includes(query) ||
      t.qualification.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-left">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl border-b-4 border-blue-600 space-y-4">
        <div className="flex items-center justify-start gap-3">
          <span className="bg-blue-500/30 text-blue-100 font-bold text-xs px-3 py-1 rounded-full border border-blue-400/30">
            Teaching Staff
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Faculty Directory
        </h1>
        <p className="text-blue-100 text-base sm:text-lg max-w-3xl opacity-90 leading-relaxed">
          Meet our experienced and qualified faculty members dedicated to student success at Jamal College of Sciences, Mayar.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 max-w-xl">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by teacher name, subject, or designation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 p-12 rounded-2xl text-center space-y-2">
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto" />
          <p className="text-slate-800 font-bold text-lg">No Faculty Member Found</p>
          <p className="text-slate-500 text-sm">Please try searching with a different keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onSelect={(t) => setSelectedTeacher(t)}
            />
          ))}
        </div>
      )}

      {/* Teacher Detail Modal */}
      <TeacherModal
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />

    </div>
  );
};
