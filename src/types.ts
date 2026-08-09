export interface Teacher {
  id: string;
  name: string;
  photo: string;
  subject: string;
  designation: string;
  qualification: string;
  experience: string;
  age?: string;
  address?: string;
  biography?: string;
  status: 'active' | 'disabled';
}

export interface Program {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  duration: string;
  status: 'active' | 'inactive';
}

export interface ImportantDate {
  event: string;
  date: string;
}

export interface AdmissionInfo {
  status: 'open' | 'closed';
  announcement: string;
  availablePrograms: string[];
  instructions: string;
  requiredDocuments: string[];
  importantDates: ImportantDate[];
  eligibilityInfo: string;
  contactPhone: string;
  contactEmail: string;
}

export interface AboutInfo {
  collegeName: string;
  introduction: string;
  mission: string;
  vision: string;
  history: string;
  educationalEnvironment: string;
  teachingPhilosophy: string;
}

export interface EnabledUrl {
  enabled: boolean;
  url: string;
}

export interface ContactInfo {
  collegeName?: string;
  email: {
    enabled: boolean;
    address: string;
    displayText?: string;
    defaultSubject?: string;
    defaultMessage?: string;
  };
  phone: {
    enabled: boolean;
    number: string;
    displayText?: string;
  };
  whatsapp: {
    enabled: boolean;
    number: string;
    displayNumber?: string;
    message?: string;
  };
  floatingWhatsapp?: {
    enabled: boolean;
    buttonText?: string;
    number?: string;
    message?: string;
    position?: string;
  };
  address: {
    enabled: boolean;
    text: string;
  };
  map?: {
    enabled: boolean;
    latitude?: string;
    longitude?: string;
    googleMapsUrl?: string;
  };
  socialMedia: {
    facebook: EnabledUrl;
    instagram: EnabledUrl;
    youtube: EnabledUrl;
    linkedin: EnabledUrl;
  };
  officeHours?: string;
  admissionContact?: string;
  // Legacy fields for backward compatibility fallback
  facebookUrl?: string;
  mapUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  status: 'active' | 'expired';
  date: string;
  priority: 'low' | 'medium' | 'high';
  showAsPopup?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'hidden';
  category: string;
  date: string;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  badge?: string;
  status: 'active' | 'hidden';
  order?: number;
}

export interface CollegeSettings {
  collegeName: string;
  logoUrl: string;
  websiteTitle: string;
  description: string;
  popupEnabled: boolean;
  popupDelay: number;
  popupMessage: string;
  theme: string;
}

export interface AdminUser {
  username: string;
  token?: string;
}
