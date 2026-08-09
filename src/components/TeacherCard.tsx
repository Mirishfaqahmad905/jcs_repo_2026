import React from 'react';
import { Teacher } from '../types';
import { Award, BookOpen, Briefcase, Eye } from 'lucide-react';

interface TeacherCardProps {
  teacher: Teacher;
  onSelect: (teacher: Teacher) => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onSelect }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-200 hover:border-blue-200 flex flex-col justify-between group">
      <div>
        {/* Photo Container */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-900">
          <img
            src={teacher.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'}
            alt={teacher.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-3 right-3 text-right">
            <span className="bg-blue-900 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow">
              {teacher.subject}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 text-left space-y-2">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
            {teacher.name}
          </h3>
          <p className="text-sm font-semibold text-blue-700">
            {teacher.designation}
          </p>

          <div className="pt-2 space-y-1 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{teacher.qualification}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{teacher.experience}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <button
          onClick={() => onSelect(teacher)}
          className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Eye className="w-4 h-4 text-blue-200" />
          View Full Profile
        </button>
      </div>
    </div>
  );
};
