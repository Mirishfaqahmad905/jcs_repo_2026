import React, { useState } from 'react';
import { ContactInfo } from '../types';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { WhatsAppButton, EmailButton, PhoneButton, SocialLinks, getTelUrl, getMailtoUrl, getWhatsAppUrl } from '../components/ContactComponents';

interface ContactPageProps {
  contact: ContactInfo | null;
}

export const ContactPage: React.FC<ContactPageProps> = ({ contact }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', subject: '', message: '' });
    }, 4000);
  };

  const addrObj = contact?.address;
  const phoneObj = contact?.phone;
  const emailObj = contact?.email;
  const waObj = contact?.whatsapp;
  const mapObj = contact?.map;

  const showAddr = addrObj?.enabled !== false && Boolean(addrObj?.text);
  const showPhone = phoneObj?.enabled !== false && Boolean(phoneObj?.number || (contact as any)?.phone);
  const phoneNum = phoneObj?.number || (contact as any)?.phone || '';

  const showEmail = emailObj?.enabled !== false && Boolean(emailObj?.address || (contact as any)?.email);
  const emailAddr = emailObj?.address || (contact as any)?.email || '';

  const showWa = waObj?.enabled !== false && Boolean(waObj?.number || (contact as any)?.whatsapp);
  const waNum = waObj?.number || (contact as any)?.whatsapp || '';

  const showMap = mapObj?.enabled !== false && Boolean(mapObj?.googleMapsUrl || contact?.mapUrl || (contact as any)?.mapUrl);
  const mapUrl = mapObj?.googleMapsUrl || contact?.mapUrl || (contact as any)?.mapUrl || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border-b-4 border-blue-600 space-y-4">
        <div className="flex items-center justify-start gap-3">
          <span className="bg-blue-500/30 text-blue-100 font-bold text-xs px-3 py-1 rounded-full border border-blue-400/30">
            Get in Touch
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Contact Us
        </h1>
        <p className="text-blue-100 text-base sm:text-lg max-w-3xl opacity-90 leading-relaxed">
          Have questions or need guidance regarding admissions or courses at {contact?.collegeName || 'Jamal College of Science, Mayar'}? Visit our campus, contact us via WhatsApp, phone, email, or fill out the inquiry form below.
        </p>

        {/* Quick Contact Buttons Row */}
        <div className="pt-2 flex flex-wrap gap-3">
          <WhatsAppButton contact={contact} customText="Quick WhatsApp Chat" />
          <EmailButton contact={contact} customText="Send Email" />
          <PhoneButton contact={contact} customText="Call Campus" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Information Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3">
              College Information
            </h2>

            <div className="space-y-5 text-slate-700 text-sm">
              {showAddr && (
                <div className="flex items-start justify-start gap-3">
                  <div className="p-2.5 bg-red-100 text-red-600 rounded-lg shrink-0 font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Campus Address</h4>
                    <p className="text-slate-600 mt-0.5">{addrObj?.text}</p>
                  </div>
                </div>
              )}

              {showPhone && (
                <div className="flex items-start justify-start gap-3">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg shrink-0 font-bold">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Phone Number</h4>
                    <a href={getTelUrl(phoneNum)} className="text-blue-700 font-semibold hover:underline mt-0.5 block">
                      {phoneObj?.displayText || phoneNum}
                    </a>
                  </div>
                </div>
              )}

              {showEmail && (
                <div className="flex items-start justify-start gap-3">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg shrink-0 font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Official Email</h4>
                    <a href={getMailtoUrl(emailAddr, emailObj?.defaultSubject, emailObj?.defaultMessage)} className="text-blue-700 font-semibold hover:underline mt-0.5 block">
                      {emailObj?.displayText || emailAddr}
                    </a>
                  </div>
                </div>
              )}

              {showWa && (
                <div className="flex items-start justify-start gap-3">
                  <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg shrink-0 font-bold">
                    <MessageSquare className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">WhatsApp Number</h4>
                    <a
                      href={getWhatsAppUrl(waNum, waObj?.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-semibold hover:underline mt-0.5 block"
                    >
                      {waObj?.displayNumber || waNum}
                    </a>
                  </div>
                </div>
              )}

              {contact?.officeHours && (
                <div className="flex items-start justify-start gap-3">
                  <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-lg shrink-0 font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Office Hours</h4>
                    <p className="text-slate-600 mt-0.5">{contact.officeHours}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm mb-3">Follow Us on Social Media</h4>
              <SocialLinks contact={contact} showLabels={true} />
            </div>
          </div>

          {/* Map Preview Banner */}
          {showMap && (
            <div className="bg-blue-950 text-white p-6 rounded-2xl border border-blue-800 shadow-md space-y-3">
              <h3 className="font-bold text-lg text-white">Campus Location</h3>
              <p className="text-xs text-blue-100 opacity-90">
                {contact?.collegeName || 'Jamal College of Science'} is situated in Mayar, Dir Lower, Khyber Pakhtunkhwa.
              </p>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow"
              >
                <MapPin className="w-4 h-4 text-blue-900" />
                <span>Open Location in Google Maps</span>
              </a>
            </div>
          )}
        </div>

        {/* Message / Inquiry Form Column */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3">
              Send an Online Inquiry
            </h2>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-emerald-950">Your inquiry has been submitted!</h3>
                <p className="text-sm text-slate-600">
                  Our administration team will get back to you shortly at your provided phone number.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                    placeholder="Enter your full name..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                    placeholder="+92 345 0000000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                    placeholder="e.g. F.Sc Admission Query, Fee Structure..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
                    placeholder="Write your message or inquiry details here..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-blue-200" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
