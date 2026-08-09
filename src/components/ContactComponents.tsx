import React from 'react';
import { ContactInfo } from '../types';
import { MessageSquare, Mail, Phone, Facebook, Instagram, Youtube, Linkedin, MapPin, Clock } from 'lucide-react';

/**
 * Safely format WhatsApp URL with phone number and pre-encoded default message
 */
export function getWhatsAppUrl(num?: string, msg?: string): string {
  if (!num) return '';
  const cleanNum = num.replace(/[^\d]/g, '');
  if (!cleanNum) return '';
  let url = `https://wa.me/${cleanNum}`;
  if (msg && msg.trim()) {
    url += `?text=${encodeURIComponent(msg.trim())}`;
  }
  return url;
}

/**
 * Safely format mailto: link with optional subject and body
 */
export function getMailtoUrl(address?: string, subject?: string, body?: string): string {
  if (!address || !address.trim()) return '';
  let url = `mailto:${address.trim()}`;
  const params: string[] = [];
  if (subject && subject.trim()) {
    params.push(`subject=${encodeURIComponent(subject.trim())}`);
  }
  if (body && body.trim()) {
    params.push(`body=${encodeURIComponent(body.trim())}`);
  }
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  return url;
}

/**
 * Safely format tel: link
 */
export function getTelUrl(num?: string): string {
  if (!num) return '';
  const clean = num.replace(/[^\d+]/g, '');
  return clean ? `tel:${clean}` : '';
}

// --------------------------------------------------------------------------
// WHATSAPP BUTTON COMPONENT
// --------------------------------------------------------------------------
interface ButtonProps {
  contact: ContactInfo | null;
  className?: string;
  variant?: 'primary' | 'secondary' | 'compact' | 'outline';
  customText?: string;
}

export const WhatsAppButton: React.FC<ButtonProps> = ({ contact, className = '', variant = 'primary', customText }) => {
  if (!contact) return null;

  // Normalize structure in case backend returned legacy object
  const wa = contact.whatsapp || {};
  const isEnabled = wa.enabled !== false && Boolean(wa.number || (contact as any).whatsapp);
  const waNumber = wa.number || (typeof (contact as any).whatsapp === 'string' ? (contact as any).whatsapp : '');

  if (!isEnabled || !waNumber) return null;

  const url = getWhatsAppUrl(waNumber, wa.message);
  const label = customText || wa.displayNumber || waNumber || 'Contact on WhatsApp';

  if (variant === 'compact') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${className}`}
      >
        <MessageSquare className="w-3.5 h-3.5 fill-current" />
        <span>WhatsApp</span>
      </a>
    );
  }

  if (variant === 'outline') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white px-5 py-2.5 rounded-xl font-bold transition-all ${className}`}
      >
        <MessageSquare className="w-5 h-5" />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all ${className}`}
    >
      <MessageSquare className="w-5 h-5 fill-current shrink-0" />
      <span>{customText || 'Contact on WhatsApp'}</span>
    </a>
  );
};

// --------------------------------------------------------------------------
// EMAIL BUTTON COMPONENT
// --------------------------------------------------------------------------
export const EmailButton: React.FC<ButtonProps> = ({ contact, className = '', variant = 'primary', customText }) => {
  if (!contact) return null;

  const emailObj = contact.email || {};
  const isEnabled = emailObj.enabled !== false && Boolean(emailObj.address || (contact as any).email);
  const emailAddr = emailObj.address || (typeof (contact as any).email === 'string' ? (contact as any).email : '');

  if (!isEnabled || !emailAddr) return null;

  const url = getMailtoUrl(emailAddr, emailObj.defaultSubject, emailObj.defaultMessage);
  const label = customText || emailObj.displayText || emailAddr;

  if (variant === 'compact') {
    return (
      <a
        href={url}
        className={`inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${className}`}
      >
        <Mail className="w-3.5 h-3.5" />
        <span>Email Us</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      className={`inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all ${className}`}
    >
      <Mail className="w-5 h-5 shrink-0" />
      <span>{customText || 'Email Us'}</span>
    </a>
  );
};

// --------------------------------------------------------------------------
// PHONE BUTTON COMPONENT
// --------------------------------------------------------------------------
export const PhoneButton: React.FC<ButtonProps> = ({ contact, className = '', variant = 'primary', customText }) => {
  if (!contact) return null;

  const phoneObj = contact.phone || {};
  const isEnabled = phoneObj.enabled !== false && Boolean(phoneObj.number || (contact as any).phone);
  const phoneNum = phoneObj.number || (typeof (contact as any).phone === 'string' ? (contact as any).phone : '');

  if (!isEnabled || !phoneNum) return null;

  const url = getTelUrl(phoneNum);
  const label = customText || phoneObj.displayText || phoneNum;

  if (variant === 'compact') {
    return (
      <a
        href={url}
        className={`inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${className}`}
      >
        <Phone className="w-3.5 h-3.5" />
        <span>Call</span>
      </a>
    );
  }

  return (
    <a
      href={url}
      className={`inline-flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all ${className}`}
    >
      <Phone className="w-5 h-5 shrink-0" />
      <span>{customText || `Call: ${label}`}</span>
    </a>
  );
};

// --------------------------------------------------------------------------
// COMBINED CONTACT BUTTONS BAR
// --------------------------------------------------------------------------
export const ContactButtons: React.FC<{ contact: ContactInfo | null; className?: string }> = ({ contact, className = '' }) => {
  if (!contact) return null;
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3.5 ${className}`}>
      <WhatsAppButton contact={contact} />
      <EmailButton contact={contact} />
      <PhoneButton contact={contact} />
    </div>
  );
};

// --------------------------------------------------------------------------
// SOCIAL LINKS COMPONENT
// --------------------------------------------------------------------------
export const SocialLinks: React.FC<{ contact: ContactInfo | null; showLabels?: boolean; className?: string }> = ({
  contact,
  showLabels = false,
  className = ''
}) => {
  if (!contact) return null;

  const sm = contact.socialMedia || {};
  const fb = sm.facebook || { enabled: Boolean(contact.facebookUrl || (contact as any).facebook), url: contact.facebookUrl || (contact as any).facebook || '' };
  const ig = sm.instagram || { enabled: false, url: '' };
  const yt = sm.youtube || { enabled: false, url: '' };
  const li = sm.linkedin || { enabled: false, url: '' };

  const links = [
    { key: 'facebook', name: 'Facebook', data: fb, icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700 text-white' },
    { key: 'instagram', name: 'Instagram', data: ig, icon: Instagram, color: 'bg-pink-600 hover:bg-pink-700 text-white' },
    { key: 'youtube', name: 'YouTube', data: yt, icon: Youtube, color: 'bg-red-600 hover:bg-red-700 text-white' },
    { key: 'linkedin', name: 'LinkedIn', data: li, icon: Linkedin, color: 'bg-blue-700 hover:bg-blue-800 text-white' }
  ];

  const activeLinks = links.filter((l) => l.data && l.data.enabled && l.data.url && l.data.url.trim().length > 0);

  if (activeLinks.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {activeLinks.map(({ key, name, data, icon: Icon, color }) => (
        <a
          key={key}
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          title={name}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${color}`}
        >
          <Icon className="w-4 h-4 fill-current" />
          {showLabels && <span>{name}</span>}
        </a>
      ))}
    </div>
  );
};

// --------------------------------------------------------------------------
// CONTACT CARD COMPONENT
// --------------------------------------------------------------------------
export const ContactCard: React.FC<{ contact: ContactInfo | null }> = ({ contact }) => {
  if (!contact) return null;

  const addrObj = contact.address || {};
  const phoneObj = contact.phone || {};
  const emailObj = contact.email || {};

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200/80 space-y-6">
      <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
        {contact.collegeName || 'Jamal College of Science, Mayar'}
      </h3>

      <div className="space-y-4 text-sm text-slate-700">
        {addrObj.enabled !== false && addrObj.text && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Address</p>
              <p className="text-slate-600 mt-0.5">{addrObj.text}</p>
            </div>
          </div>
        )}

        {phoneObj.enabled !== false && phoneObj.number && (
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Phone</p>
              <a href={getTelUrl(phoneObj.number)} className="text-blue-700 font-semibold hover:underline mt-0.5 block">
                {phoneObj.displayText || phoneObj.number}
              </a>
            </div>
          </div>
        )}

        {emailObj.enabled !== false && emailObj.address && (
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Official Email</p>
              <a href={getMailtoUrl(emailObj.address)} className="text-blue-700 font-semibold hover:underline mt-0.5 block">
                {emailObj.displayText || emailObj.address}
              </a>
            </div>
          </div>
        )}

        {contact.officeHours && (
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Office Hours</p>
              <p className="text-slate-600 mt-0.5">{contact.officeHours}</p>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2">
        <WhatsAppButton contact={contact} className="w-full" />
      </div>
    </div>
  );
};

// --------------------------------------------------------------------------
// FLOATING WHATSAPP BUTTON COMPONENT
// --------------------------------------------------------------------------
export const FloatingWhatsApp: React.FC<{ contact: ContactInfo | null }> = ({ contact }) => {
  if (!contact) return null;

  const fw = contact.floatingWhatsapp;
  const wa = contact.whatsapp || {};

  // Check if enabled
  const isEnabled = fw?.enabled !== false && (wa.enabled !== false || fw?.enabled === true);
  const num = fw?.number || wa.number || (typeof (contact as any).whatsapp === 'string' ? (contact as any).whatsapp : '');

  if (!isEnabled || !num) return null;

  const msg = fw?.message || wa.message || 'Hello Jamal College of Science, Mayar! I need assistance.';
  const url = getWhatsAppUrl(num, msg);
  const text = fw?.buttonText || 'Contact on WhatsApp';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group">
      <span className="hidden sm:inline-block bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {text}
      </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className="flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-white ring-4 ring-emerald-500/20"
      >
        <MessageSquare className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
};

// --------------------------------------------------------------------------
// FOOTER CONTACT LINKS
// --------------------------------------------------------------------------
export const FooterContact: React.FC<{ contact: ContactInfo | null }> = ({ contact }) => {
  if (!contact) return null;

  const addr = contact.address?.enabled !== false ? contact.address?.text : null;
  const phoneObj = contact.phone?.enabled !== false ? contact.phone : null;
  const emailObj = contact.email?.enabled !== false ? contact.email : null;
  const waObj = contact.whatsapp?.enabled !== false ? contact.whatsapp : null;

  return (
    <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
      {addr && (
        <li className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
          <span>{addr}</span>
        </li>
      )}

      {phoneObj && phoneObj.number && (
        <li className="flex items-center gap-2.5">
          <Phone className="w-4 h-4 text-blue-400 shrink-0" />
          <a href={getTelUrl(phoneObj.number)} className="hover:text-blue-300 transition-colors" dir="ltr">
            {phoneObj.displayText || phoneObj.number}
          </a>
        </li>
      )}

      {emailObj && emailObj.address && (
        <li className="flex items-center gap-2.5">
          <Mail className="w-4 h-4 text-blue-400 shrink-0" />
          <a href={getMailtoUrl(emailObj.address)} className="hover:text-blue-300 transition-colors">
            {emailObj.displayText || emailObj.address}
          </a>
        </li>
      )}

      {waObj && waObj.number && (
        <li className="flex items-center gap-2.5">
          <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 fill-current" />
          <a
            href={getWhatsAppUrl(waObj.number, waObj.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            WhatsApp: {waObj.displayNumber || waObj.number}
          </a>
        </li>
      )}

      {contact.officeHours && (
        <li className="flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
          <span>{contact.officeHours}</span>
        </li>
      )}
    </ul>
  );
};
