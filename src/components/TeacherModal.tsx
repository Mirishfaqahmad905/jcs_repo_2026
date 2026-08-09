import React from 'react';
import { Teacher } from '../types';
import { X, Award, Briefcase, MapPin, User, BookOpen, Calendar } from 'lucide-react';

interface TeacherModalProps {
  teacher: Teacher | null;
  onClose: () => void;
}

export const TeacherModal: React.FC<TeacherModalProps> = ({ teacher, onClose }) => {
  if (!teacher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors"
          aria-label="بند کریں"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero Photo */}
        <div className="relative h-64 sm:h-72 bg-slate-900 overflow-hidden">
          <img
            src={teacher.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
            alt={teacher.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 text-left text-white">
            <span className="bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1 rounded-full shadow mb-2 inline-block">
              {teacher.subject}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {teacher.name}
            </h2>
            <p className="text-amber-300 font-semibold text-sm">
              {teacher.designation}
            </p>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="p-6 sm:p-8 space-y-6 text-left">
          
          {/* Key Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Award className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Qualification</p>
                <p className="font-bold text-slate-900">{teacher.qualification || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Briefcase className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">Experience</p>
                <p className="font-bold text-slate-900">{teacher.experience || 'N/A'}</p>
              </div>
            </div>

            {teacher.age && (
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Calendar className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Age</p>
                  <p className="font-bold text-slate-900">{teacher.age} Years</p>
                </div>
              </div>
            )}

            {teacher.address && (
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="font-bold text-slate-900">{teacher.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Short Biography */}
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-900" />
              <span>Biography & Background</span>
            </h4>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {teacher.biography || 'Biography details will be updated soon.'}
            </p>
          </div>

          {/* Footer Close */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-blue-900 text-white font-bold py-2.5 rounded-xl transition-colors text-sm"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
