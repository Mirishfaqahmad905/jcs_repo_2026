import {
  Teacher,
  Program,
  AdmissionInfo,
  AboutInfo,
  ContactInfo,
  NotificationItem,
  GalleryItem,
  CollegeSettings,
  CarouselSlide
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('jcs_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/* ==========================================================================
   PUBLIC API SERVICES
   ========================================================================== */

export async function fetchCollegeInfo() {
  const res = await fetch(`${API_BASE}/college`);
  return res.json();
}

export async function fetchFaculty(): Promise<Teacher[]> {
  try {
    const res = await fetch(`${API_BASE}/faculty`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    console.error('Failed to fetch faculty:', err);
    return [];
  }
}

export async function fetchPrograms(): Promise<Program[]> {
  try {
    const res = await fetch(`${API_BASE}/programs`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    console.error('Failed to fetch programs:', err);
    return [];
  }
}

export async function fetchAdmissions(): Promise<AdmissionInfo | null> {
  try {
    const res = await fetch(`${API_BASE}/admissions`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Failed to fetch admissions:', err);
    return null;
  }
}

export async function fetchAbout(): Promise<AboutInfo | null> {
  try {
    const res = await fetch(`${API_BASE}/about`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Failed to fetch about info:', err);
    return null;
  }
}

export async function fetchContact(): Promise<ContactInfo | null> {
  try {
    const res = await fetch(`${API_BASE}/contact`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Failed to fetch contact info:', err);
    return null;
  }
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  try {
    const res = await fetch(`${API_BASE}/notifications`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    console.error('Failed to fetch notifications:', err);
    return [];
  }
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  try {
    const res = await fetch(`${API_BASE}/gallery`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (err) {
    console.error('Failed to fetch gallery:', err);
    return [];
  }
}

export async function fetchSettings(): Promise<CollegeSettings | null> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    console.error('Failed to fetch settings:', err);
    return null;
  }
}

/* ==========================================================================
   AUTHENTICATION API SERVICES
   ========================================================================== */

export async function loginAdmin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const json = await res.json();
  if (json.success && json.token) {
    localStorage.setItem('jcs_admin_token', json.token);
    localStorage.setItem('jcs_admin_user', json.user.username);
  }
  return json;
}

export async function checkAdminSession() {
  const token = localStorage.getItem('jcs_admin_token');
  if (!token) return { success: false };

  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader()
    });
    return res.json();
  } catch (e) {
    return { success: false };
  }
}

export function logoutAdmin() {
  localStorage.removeItem('jcs_admin_token');
  localStorage.removeItem('jcs_admin_user');
}

export async function changeAdminPassword(currentPassword: string, newPassword: string, confirmPassword: string) {
  const res = await fetch(`${API_BASE}/admin/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
  });
  const json = await res.json();
  if (json.success && json.token) {
    localStorage.setItem('jcs_admin_token', json.token);
  }
  return json;
}

/* ==========================================================================
   ADMIN PROTECTED CRUD SERVICES
   ========================================================================== */

// Faculty
export async function adminGetFaculty(): Promise<Teacher[]> {
  const res = await fetch(`${API_BASE}/admin/faculty`, { headers: getAuthHeader() });
  const json = await res.json();
  return json.success ? json.data : [];
}

export async function adminAddTeacher(teacherData: Partial<Teacher>) {
  const res = await fetch(`${API_BASE}/admin/faculty`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(teacherData)
  });
  return res.json();
}

export async function adminUpdateTeacher(id: string, teacherData: Partial<Teacher>) {
  const res = await fetch(`${API_BASE}/admin/faculty/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(teacherData)
  });
  return res.json();
}

export async function adminDeleteTeacher(id: string) {
  const res = await fetch(`${API_BASE}/admin/faculty/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return res.json();
}

// Programs
export async function adminGetPrograms(): Promise<Program[]> {
  const res = await fetch(`${API_BASE}/admin/programs`, { headers: getAuthHeader() });
  const json = await res.json();
  return json.success ? json.data : [];
}

export async function adminAddProgram(programData: Partial<Program>) {
  const res = await fetch(`${API_BASE}/admin/programs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(programData)
  });
  return res.json();
}

export async function adminUpdateProgram(id: string, programData: Partial<Program>) {
  const res = await fetch(`${API_BASE}/admin/programs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(programData)
  });
  return res.json();
}

export async function adminDeleteProgram(id: string) {
  const res = await fetch(`${API_BASE}/admin/programs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return res.json();
}

// Admissions
export async function adminGetAdmissions(): Promise<AdmissionInfo | null> {
  const res = await fetch(`${API_BASE}/admin/admissions`, { headers: getAuthHeader() });
  const json = await res.json();
  return json.success ? json.data : null;
}

export async function adminUpdateAdmissions(admissionsData: Partial<AdmissionInfo>) {
  const res = await fetch(`${API_BASE}/admin/admissions`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(admissionsData)
  });
  return res.json();
}

// About
export async function adminGetAbout(): Promise<AboutInfo | null> {
  const res = await fetch(`${API_BASE}/admin/about`, { headers: getAuthHeader() });
  const json = await res.json();
  return json.success ? json.data : null;
}

export async function adminUpdateAbout(aboutData: Partial<AboutInfo>) {
  const res = await fetch(`${API_BASE}/admin/about`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(aboutData)
  });
  return res.json();
}

// Contact
export async function adminGetContact(): Promise<ContactInfo | null> {
  const res = await fetch(`${API_BASE}/admin/contact`, { headers: getAuthHeader() });
  const json = await res.json();
  return json.success ? json.data : null;
}

export async function adminUpdateContact(contactData: Partial<ContactInfo>) {
  const res = await fetch(`${API_BASE}/admin/contact`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(contactData)
  });
  return res.json();
}

// Notifications
export async function adminGetNotifications(): Promise<NotificationItem[]> {
  const res = await fetch(`${API_BASE}/admin/notifications`, { headers: getAuthHeader() });
  const json = await res.json();
  return json.success ? json.data : [];
}

export async function adminAddNotification(notificationData: Partial<NotificationItem>) {
  const res = await fetch(`${API_BASE}/admin/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(notificationData)
  });
  return res.json();
}

export async function adminUpdateNotification(id: string, notificationData: Partial<NotificationItem>) {
  const res = await fetch(`${API_BASE}/admin/notifications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(notificationData)
  });
  return res.json();
}

export async function adminDeleteNotification(id: string) {
  const res = await fetch(`${API_BASE}/admin/notifications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return res.json();
}

// Gallery
export async function adminGetGallery(): Promise<GalleryItem[]> {
  const res = await fetch(`${API_BASE}/admin/gallery`, { headers: getAuthHeader() });
  const json = await res.json();
  return json.success ? json.data : [];
}

export async function adminAddGalleryItem(galleryData: Partial<GalleryItem>) {
  const res = await fetch(`${API_BASE}/admin/gallery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(galleryData)
  });
  return res.json();
}

export async function adminUpdateGalleryItem(id: string, galleryData: Partial<GalleryItem>) {
  const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(galleryData)
  });
  return res.json();
}

export async function adminDeleteGalleryItem(id: string) {
  const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return res.json();
}

// Settings
export async function adminGetSettings(): Promise<CollegeSettings | null> {
  const res = await fetch(`${API_BASE}/admin/settings`, { headers: getAuthHeader() });
  const json = await res.json();
  return json.success ? json.data : null;
}

export async function adminUpdateSettings(settingsData: Partial<CollegeSettings>) {
  const res = await fetch(`${API_BASE}/admin/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(settingsData)
  });
  return res.json();
}

/* ==========================================================================
   CAROUSEL API SERVICE
   ========================================================================== */

export async function fetchCarousel(): Promise<CarouselSlide[]> {
  try {
    const res = await fetch(`${API_BASE}/carousel`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

export async function adminGetCarousel(): Promise<CarouselSlide[]> {
  const res = await fetch(`${API_BASE}/admin/carousel`, { headers: getAuthHeader() });
  const json = await res.json();
  return json.success ? json.data : [];
}

export async function adminAddCarouselSlide(slideData: Partial<CarouselSlide>) {
  const res = await fetch(`${API_BASE}/admin/carousel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(slideData)
  });
  return res.json();
}

export async function adminUpdateCarouselSlide(id: string, slideData: Partial<CarouselSlide>) {
  const res = await fetch(`${API_BASE}/admin/carousel/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify(slideData)
  });
  return res.json();
}

export async function adminDeleteCarouselSlide(id: string) {
  const res = await fetch(`${API_BASE}/admin/carousel/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return res.json();
}

export async function translateUrduToEnglish(text: string): Promise<{ success: boolean; translatedText?: string; message?: string; engine?: string }> {
  try {
    const res = await fetch(`${API_BASE}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error('Failed to call translate API:', err);
    return {
      success: false,
      message: 'سرور سے رابطہ نہ ہو سکا۔'
    };
  }
}

