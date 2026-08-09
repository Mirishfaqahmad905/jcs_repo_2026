import React from 'react';
import { AdmissionInfo, ContactInfo } from '../types';
import { Sparkles, CheckCircle, FileText, Calendar } from 'lucide-react';
import { WhatsAppButton, PhoneButton, EmailButton } from '../components/ContactComponents';

interface AdmissionsPageProps {
  admissions: AdmissionInfo | null;
  contact?: ContactInfo | null;
}

export const AdmissionsPage: React.FC<AdmissionsPageProps> = ({ admissions, contact }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border-b-4 border-blue-600 space-y-4">
        <div className="flex items-center justify-start gap-3">
          <span className={`font-bold text-xs px-3 py-1 rounded-full ${
            admissions?.status === 'open' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {admissions?.status === 'open' ? 'Admissions Open' : 'Admissions Currently Closed'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Admissions Guidelines
        </h1>
        <p className="text-blue-100 text-base sm:text-lg max-w-3xl opacity-90 leading-relaxed">
          Detailed admission requirements, procedures, and documentation guidelines for Session 2026-2027 at {contact?.collegeName || 'Jamal College of Science, Mayar'}.
        </p>
      </div>

      {/* Main Announcement Box */}
      {admissions?.announcement && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-sm flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-blue-900 flex items-center justify-start gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Important Admission Notice</span>
            </h3>
            <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
              {admissions.announcement}
            </p>
          </div>
        </div>
      )}

      {/* Grid for Instructions & Available Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Step-by-Step Instructions */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-900" />
            <span>Admission Procedure</span>
          </h2>
          <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line space-y-2">
            {admissions?.instructions || 'Obtain application form from college admission office.'}
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <span>Required Documents</span>
          </h2>
          <ul className="space-y-3 text-sm text-slate-700">
            {admissions?.requiredDocuments.map((doc, i) => (
              <li key={i} className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                <span className="leading-relaxed">{doc}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Important Dates Table */}
      {admissions?.importantDates && admissions.importantDates.length > 0 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>Important Dates & Schedule</span>
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="p-3.5 rounded-l-xl">Event / Stage</th>
                  <th className="p-3.5 rounded-r-xl">Date / Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admissions.importantDates.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/30">
                    <td className="p-3.5 font-bold text-slate-800">{item.event}</td>
                    <td className="p-3.5 text-blue-900 font-bold">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Helpline Contact Card */}
      <div className="bg-blue-950 text-white p-8 sm:p-10 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-blue-800">
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Have Questions Regarding Admission?
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 opacity-90">
            Contact our admission helpline via WhatsApp, phone, or email during office hours.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <WhatsAppButton contact={contact || null} customText="WhatsApp Helpline" />
          <PhoneButton contact={contact || null} customText="Call Helpline" />
          <EmailButton contact={contact || null} customText="Email Helpline" />
        </div>
      </div>

    </div>
  );
};
