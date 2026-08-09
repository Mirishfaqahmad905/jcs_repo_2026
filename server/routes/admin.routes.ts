import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readJsonFile, writeJsonFile } from '../dataStore';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.middleware';
import { Teacher, Program, AdmissionInfo, AboutInfo, ContactInfo, NotificationItem, GalleryItem, CollegeSettings, CarouselSlide } from '../../src/types';

interface AdminJson {
  username: string;
  passwordHash: string;
  jwtSecret: string;
}

const router = Router();

// Protect all admin routes
router.use(requireAdminAuth);

/* ==========================================================================
   ADMIN CHANGE PASSWORD
   ========================================================================== */

// POST /api/admin/change-password
router.post('/change-password', async (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'تمام فیلڈز پر کرنا لازمی ہے۔ (All password fields required)' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'نیا پاس ورڈ اور ہدف پاس ورڈ یکساں نہیں ہیں۔ (Passwords do not match)' });
  }

  if (newPassword.length < 4) {
    return res.status(400).json({ success: false, message: 'نیا پاس ورڈ کم از کم 4 حروف پر مشتمل ہونا چاہیے۔ (Minimum 4 characters required)' });
  }

  const adminData = readJsonFile<AdminJson>('admin.json', {
    username: 'jamal',
    passwordHash: '',
    jwtSecret: 'jcs_mayar_secret_token_key_2026_dir_lower'
  });

  // Verify current password
  const isCurrentMatch = await bcrypt.compare(currentPassword, adminData.passwordHash);
  if (!isCurrentMatch) {
    return res.status(400).json({ success: false, message: 'موجودہ پاس ورڈ غلط ہے۔ (Current password is incorrect)' });
  }

  // Hash new password
  const newHash = await bcrypt.hash(newPassword, 10);
  const jwtSecret = adminData.jwtSecret || 'jcs_mayar_secret_token_key_2026_dir_lower';

  const updatedAdminData: AdminJson = {
    username: adminData.username,
    passwordHash: newHash,
    jwtSecret
  };

  const saved = writeJsonFile('admin.json', updatedAdminData);

  if (!saved) {
    return res.status(500).json({ success: false, message: 'پاس ورڈ محفوظ کرنے میں ناکامی! (Failed to update password)' });
  }

  // Issue updated JWT token
  const newToken = jwt.sign(
    { username: adminData.username },
    jwtSecret,
    { expiresIn: '24h' }
  );

  return res.json({
    success: true,
    message: 'پاس ورڈ کامیابی سے تبدیل ہو گیا ہے۔ (Password updated successfully)',
    token: newToken
  });
});

/* ==========================================================================
   FACULTY MANAGEMENT
   ========================================================================== */

// GET /api/admin/faculty
router.get('/faculty', (_req: AuthenticatedRequest, res: Response) => {
  const faculty = readJsonFile<Teacher[]>('faculty.json', []);
  return res.json({ success: true, data: faculty });
});

// POST /api/admin/faculty
router.post('/faculty', (req: AuthenticatedRequest, res: Response) => {
  const { name, subject, designation, qualification, experience, age, address, biography, photo, status } = req.body;

  if (!name || !subject) {
    return res.status(400).json({ success: false, message: 'استاد کا نام اور مضمون فراہم کرنا لازمی ہے۔ (Name and subject are required)' });
  }

  const faculty = readJsonFile<Teacher[]>('faculty.json', []);
  const newTeacher: Teacher = {
    id: `teacher-${Date.now()}`,
    name: name.trim(),
    photo: photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    subject: subject.trim(),
    designation: designation ? designation.trim() : 'Lecturer',
    qualification: qualification ? qualification.trim() : 'Master Degree',
    experience: experience ? experience.trim() : 'Relevant Experience',
    age: age ? String(age).trim() : '',
    address: address ? address.trim() : '',
    biography: biography ? biography.trim() : '',
    status: status === 'disabled' ? 'disabled' : 'active'
  };

  faculty.unshift(newTeacher);
  const saved = writeJsonFile('faculty.json', faculty);

  if (!saved) {
    return res.status(500).json({ success: false, message: 'ڈیٹا محفوظ کرنے میں ناکامی! (Failed to save teacher)' });
  }

  return res.json({ success: true, message: 'نیا ٹیچر کامیابی سے شامل کر دیا گیا۔ (Teacher added successfully)', data: newTeacher });
});

// PUT /api/admin/faculty/:id
router.put('/faculty/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const faculty = readJsonFile<Teacher[]>('faculty.json', []);
  const index = faculty.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'ٹیچر کی معلومات نہیں ملیں! (Teacher not found)' });
  }

  const current = faculty[index];
  const updatedTeacher: Teacher = {
    ...current,
    name: req.body.name !== undefined ? req.body.name.trim() : current.name,
    photo: req.body.photo !== undefined ? req.body.photo : current.photo,
    subject: req.body.subject !== undefined ? req.body.subject.trim() : current.subject,
    designation: req.body.designation !== undefined ? req.body.designation.trim() : current.designation,
    qualification: req.body.qualification !== undefined ? req.body.qualification.trim() : current.qualification,
    experience: req.body.experience !== undefined ? req.body.experience.trim() : current.experience,
    age: req.body.age !== undefined ? String(req.body.age).trim() : current.age,
    address: req.body.address !== undefined ? req.body.address.trim() : current.address,
    biography: req.body.biography !== undefined ? req.body.biography.trim() : current.biography,
    status: req.body.status === 'disabled' ? 'disabled' : 'active'
  };

  faculty[index] = updatedTeacher;
  const saved = writeJsonFile('faculty.json', faculty);

  if (!saved) {
    return res.status(500).json({ success: false, message: 'ڈیٹا محفوظ کرنے میں ناکامی!' });
  }

  return res.json({ success: true, message: 'ٹیچر کی معلومات اپڈیٹ ہو گئیں۔ (Teacher profile updated)', data: updatedTeacher });
});

// DELETE /api/admin/faculty/:id
router.delete('/faculty/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const faculty = readJsonFile<Teacher[]>('faculty.json', []);
  const filtered = faculty.filter(t => t.id !== id);

  if (filtered.length === faculty.length) {
    return res.status(404).json({ success: false, message: 'ٹیچر نہیں ملا!' });
  }

  const saved = writeJsonFile('faculty.json', filtered);
  if (!saved) {
    return res.status(500).json({ success: false, message: 'محفوظ کرنے میں ناکامی!' });
  }

  return res.json({ success: true, message: 'ٹیچر کامیابی سے حذف کر دیا گیا۔ (Teacher deleted)' });
});


/* ==========================================================================
   PROGRAMS MANAGEMENT
   ========================================================================== */

// GET /api/admin/programs
router.get('/programs', (_req: AuthenticatedRequest, res: Response) => {
  const programs = readJsonFile<Program[]>('programs.json', []);
  return res.json({ success: true, data: programs });
});

// POST /api/admin/programs
router.post('/programs', (req: AuthenticatedRequest, res: Response) => {
  const { name, description, eligibility, duration, status } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: 'Program name is required.' });
  }

  const programs = readJsonFile<Program[]>('programs.json', []);
  const newProg: Program = {
    id: `prog-${Date.now()}`,
    name: name.trim(),
    description: description ? description.trim() : '',
    eligibility: eligibility ? eligibility.trim() : 'Matric Science',
    duration: duration ? duration.trim() : '2 Years',
    status: status === 'inactive' ? 'inactive' : 'active'
  };

  programs.push(newProg);
  writeJsonFile('programs.json', programs);

  return res.json({ success: true, message: 'Program added successfully!', data: newProg });
});

// PUT /api/admin/programs/:id
router.put('/programs/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const programs = readJsonFile<Program[]>('programs.json', []);
  const index = programs.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Program not found!' });
  }

  programs[index] = {
    ...programs[index],
    name: req.body.name !== undefined ? req.body.name.trim() : programs[index].name,
    description: req.body.description !== undefined ? req.body.description.trim() : programs[index].description,
    eligibility: req.body.eligibility !== undefined ? req.body.eligibility.trim() : programs[index].eligibility,
    duration: req.body.duration !== undefined ? req.body.duration.trim() : programs[index].duration,
    status: req.body.status === 'inactive' ? 'inactive' : 'active'
  };

  writeJsonFile('programs.json', programs);
  return res.json({ success: true, message: 'Program updated successfully!', data: programs[index] });
});

// DELETE /api/admin/programs/:id
router.delete('/programs/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const programs = readJsonFile<Program[]>('programs.json', []);
  const filtered = programs.filter(p => p.id !== id);

  writeJsonFile('programs.json', filtered);
  return res.json({ success: true, message: 'پروگرام حذف کر دیا گیا۔ (Program deleted)' });
});


/* ==========================================================================
   ADMISSIONS MANAGEMENT
   ========================================================================== */

// GET /api/admin/admissions
router.get('/admissions', (_req: AuthenticatedRequest, res: Response) => {
  const admissions = readJsonFile<AdmissionInfo>('admissions.json', {
    status: 'open',
    announcement: '',
    availablePrograms: [],
    instructions: '',
    requiredDocuments: [],
    importantDates: [],
    eligibilityInfo: '',
    contactPhone: '',
    contactEmail: ''
  });
  return res.json({ success: true, data: admissions });
});

// PUT /api/admin/admissions
router.put('/admissions', (req: AuthenticatedRequest, res: Response) => {
  const updatedData: AdmissionInfo = {
    status: req.body.status === 'closed' ? 'closed' : 'open',
    announcement: req.body.announcement !== undefined ? req.body.announcement : '',
    availablePrograms: Array.isArray(req.body.availablePrograms) ? req.body.availablePrograms : [],
    instructions: req.body.instructions !== undefined ? req.body.instructions : '',
    requiredDocuments: Array.isArray(req.body.requiredDocuments) ? req.body.requiredDocuments : [],
    importantDates: Array.isArray(req.body.importantDates) ? req.body.importantDates : [],
    eligibilityInfo: req.body.eligibilityInfo !== undefined ? req.body.eligibilityInfo : '',
    contactPhone: req.body.contactPhone !== undefined ? req.body.contactPhone : '',
    contactEmail: req.body.contactEmail !== undefined ? req.body.contactEmail : ''
  };

  writeJsonFile('admissions.json', updatedData);
  return res.json({ success: true, message: 'داخلہ معلوماتی سیکشن اپڈیٹ ہو گیا۔ (Admissions info updated)', data: updatedData });
});


/* ==========================================================================
   ABOUT COLLEGE MANAGEMENT
   ========================================================================== */

// GET /api/admin/about
router.get('/about', (_req: AuthenticatedRequest, res: Response) => {
  const about = readJsonFile<AboutInfo>('about.json', {
    collegeName: 'Jamal College of Sciences, Mayar',
    introduction: '',
    mission: '',
    vision: '',
    history: '',
    educationalEnvironment: '',
    teachingPhilosophy: ''
  });
  return res.json({ success: true, data: about });
});

// PUT /api/admin/about
router.put('/about', (req: AuthenticatedRequest, res: Response) => {
  const updatedAbout: AboutInfo = {
    collegeName: req.body.collegeName || 'Jamal College of Sciences, Mayar',
    introduction: req.body.introduction || '',
    mission: req.body.mission || '',
    vision: req.body.vision || '',
    history: req.body.history || '',
    educationalEnvironment: req.body.educationalEnvironment || '',
    teachingPhilosophy: req.body.teachingPhilosophy || ''
  };

  writeJsonFile('about.json', updatedAbout);
  return res.json({ success: true, message: 'کالج کی معلومات کامیابی سے اپڈیٹ کر دی گئیں۔ (About page updated)', data: updatedAbout });
});


/* ==========================================================================
   CONTACT MANAGEMENT
   ========================================================================== */

// GET /api/admin/contact
router.get('/contact', (_req: AuthenticatedRequest, res: Response) => {
  const contact = readJsonFile('contact.json', {});
  return res.json({ success: true, data: contact });
});

// Helper function to sanitize text input
function sanitizeText(str: any): string {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

// Helper function to validate safe HTTP/HTTPS URL
function isValidUrl(urlStr: string): boolean {
  if (!urlStr) return true; // empty is allowed
  try {
    const parsed = new URL(urlStr);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Helper function to normalize & sanitize phone/WhatsApp numbers (allow digits and +)
function sanitizePhoneNumber(num: any): string {
  if (typeof num !== 'string') return '';
  // strip HTML/JS tags, script words and dangerous protocols
  const clean = num.replace(/javascript:|data:|vbscript:/gi, '').replace(/[^\d+]/g, '');
  return clean;
}

// PUT /api/admin/contact
router.put('/contact', (req: AuthenticatedRequest, res: Response) => {
  const existingContact = readJsonFile('contact.json', {}) as Record<string, any>;

  const body = req.body || {};

  // Validate URLs if provided
  const fbUrl = sanitizeText(body.socialMedia?.facebook?.url ?? existingContact.socialMedia?.facebook?.url ?? '');
  const igUrl = sanitizeText(body.socialMedia?.instagram?.url ?? existingContact.socialMedia?.instagram?.url ?? '');
  const ytUrl = sanitizeText(body.socialMedia?.youtube?.url ?? existingContact.socialMedia?.youtube?.url ?? '');
  const liUrl = sanitizeText(body.socialMedia?.linkedin?.url ?? existingContact.socialMedia?.linkedin?.url ?? '');
  const mapUrl = sanitizeText(body.map?.googleMapsUrl ?? existingContact.map?.googleMapsUrl ?? '');

  if (!isValidUrl(fbUrl) || !isValidUrl(igUrl) || !isValidUrl(ytUrl) || !isValidUrl(liUrl) || !isValidUrl(mapUrl)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid URL detected. Social media and map URLs must be valid HTTP/HTTPS links.'
    });
  }

  // Safe merge without losing unedited properties
  const updatedContact = {
    ...existingContact,
    collegeName: sanitizeText(body.collegeName ?? existingContact.collegeName ?? 'Jamal College of Science, Mayar'),
    
    email: {
      enabled: Boolean(body.email?.enabled ?? existingContact.email?.enabled ?? true),
      address: sanitizeText(body.email?.address ?? existingContact.email?.address ?? ''),
      displayText: sanitizeText(body.email?.displayText ?? existingContact.email?.displayText ?? ''),
      defaultSubject: sanitizeText(body.email?.defaultSubject ?? existingContact.email?.defaultSubject ?? ''),
      defaultMessage: sanitizeText(body.email?.defaultMessage ?? existingContact.email?.defaultMessage ?? '')
    },

    phone: {
      enabled: Boolean(body.phone?.enabled ?? existingContact.phone?.enabled ?? true),
      number: sanitizePhoneNumber(body.phone?.number ?? existingContact.phone?.number ?? ''),
      displayText: sanitizeText(body.phone?.displayText ?? existingContact.phone?.displayText ?? '')
    },

    whatsapp: {
      enabled: Boolean(body.whatsapp?.enabled ?? existingContact.whatsapp?.enabled ?? true),
      number: sanitizePhoneNumber(body.whatsapp?.number ?? existingContact.whatsapp?.number ?? ''),
      displayNumber: sanitizeText(body.whatsapp?.displayNumber ?? existingContact.whatsapp?.displayNumber ?? ''),
      message: sanitizeText(body.whatsapp?.message ?? existingContact.whatsapp?.message ?? '')
    },

    floatingWhatsapp: {
      enabled: Boolean(body.floatingWhatsapp?.enabled ?? existingContact.floatingWhatsapp?.enabled ?? true),
      buttonText: sanitizeText(body.floatingWhatsapp?.buttonText ?? existingContact.floatingWhatsapp?.buttonText ?? 'Contact on WhatsApp'),
      number: sanitizePhoneNumber(body.floatingWhatsapp?.number ?? existingContact.floatingWhatsapp?.number ?? body.whatsapp?.number ?? ''),
      message: sanitizeText(body.floatingWhatsapp?.message ?? existingContact.floatingWhatsapp?.message ?? ''),
      position: sanitizeText(body.floatingWhatsapp?.position ?? existingContact.floatingWhatsapp?.position ?? 'bottom-right')
    },

    address: {
      enabled: Boolean(body.address?.enabled ?? existingContact.address?.enabled ?? true),
      text: sanitizeText(body.address?.text ?? (typeof body.address === 'string' ? body.address : existingContact.address?.text) ?? '')
    },

    map: {
      enabled: Boolean(body.map?.enabled ?? existingContact.map?.enabled ?? false),
      latitude: sanitizeText(body.map?.latitude ?? existingContact.map?.latitude ?? ''),
      longitude: sanitizeText(body.map?.longitude ?? existingContact.map?.longitude ?? ''),
      googleMapsUrl: mapUrl
    },

    socialMedia: {
      facebook: {
        enabled: Boolean(body.socialMedia?.facebook?.enabled ?? existingContact.socialMedia?.facebook?.enabled ?? true),
        url: fbUrl
      },
      instagram: {
        enabled: Boolean(body.socialMedia?.instagram?.enabled ?? existingContact.socialMedia?.instagram?.enabled ?? true),
        url: igUrl
      },
      youtube: {
        enabled: Boolean(body.socialMedia?.youtube?.enabled ?? existingContact.socialMedia?.youtube?.enabled ?? false),
        url: ytUrl
      },
      linkedin: {
        enabled: Boolean(body.socialMedia?.linkedin?.enabled ?? existingContact.socialMedia?.linkedin?.enabled ?? false),
        url: liUrl
      }
    },

    officeHours: sanitizeText(body.officeHours ?? existingContact.officeHours ?? ''),
    admissionContact: sanitizeText(body.admissionContact ?? existingContact.admissionContact ?? '')
  };

  writeJsonFile('contact.json', updatedContact);
  return res.json({
    success: true,
    message: 'Contact details updated successfully.',
    data: updatedContact
  });
});


/* ==========================================================================
   NOTIFICATIONS MANAGEMENT
   ========================================================================== */

// GET /api/admin/notifications
router.get('/notifications', (_req: AuthenticatedRequest, res: Response) => {
  const notifications = readJsonFile<NotificationItem[]>('notifications.json', []);
  return res.json({ success: true, data: notifications });
});

// POST /api/admin/notifications
router.post('/notifications', (req: AuthenticatedRequest, res: Response) => {
  const { title, message, priority, status, showAsPopup } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'عنوان اور پیغام ضروری ہیں۔ (Title and message are required)' });
  }

  const notifications = readJsonFile<NotificationItem[]>('notifications.json', []);
  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}`,
    title: title.trim(),
    message: message.trim(),
    status: status === 'expired' ? 'expired' : 'active',
    date: new Date().toISOString().split('T')[0],
    priority: priority || 'medium',
    showAsPopup: Boolean(showAsPopup)
  };

  notifications.unshift(newNotif);
  writeJsonFile('notifications.json', notifications);

  return res.json({ success: true, message: 'نیا نوٹیفکیشن جاری کر دیا گیا! (Notification posted)', data: newNotif });
});

// PUT /api/admin/notifications/:id
router.put('/notifications/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const notifications = readJsonFile<NotificationItem[]>('notifications.json', []);
  const index = notifications.findIndex(n => n.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'نوٹیفکیشن نہیں ملا!' });
  }

  notifications[index] = {
    ...notifications[index],
    title: req.body.title !== undefined ? req.body.title.trim() : notifications[index].title,
    message: req.body.message !== undefined ? req.body.message.trim() : notifications[index].message,
    status: req.body.status === 'expired' ? 'expired' : 'active',
    priority: req.body.priority || notifications[index].priority,
    showAsPopup: req.body.showAsPopup !== undefined ? Boolean(req.body.showAsPopup) : notifications[index].showAsPopup
  };

  writeJsonFile('notifications.json', notifications);
  return res.json({ success: true, message: 'نوٹیفکیشن اپڈیٹ ہو گیا۔', data: notifications[index] });
});

// DELETE /api/admin/notifications/:id
router.delete('/notifications/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const notifications = readJsonFile<NotificationItem[]>('notifications.json', []);
  const filtered = notifications.filter(n => n.id !== id);

  writeJsonFile('notifications.json', filtered);
  return res.json({ success: true, message: 'نوٹیفکیشن حذف کر دیا گیا۔' });
});


/* ==========================================================================
   GALLERY MANAGEMENT
   ========================================================================== */

// GET /api/admin/gallery
router.get('/gallery', (_req: AuthenticatedRequest, res: Response) => {
  const gallery = readJsonFile<GalleryItem[]>('gallery.json', []);
  return res.json({ success: true, data: gallery });
});

// POST /api/admin/gallery
router.post('/gallery', (req: AuthenticatedRequest, res: Response) => {
  const { title, description, imageUrl, category, status } = req.body;

  if (!title || !imageUrl) {
    return res.status(400).json({ success: false, message: 'تصویر کا عنوان اور تصویر کا لنک/ڈیٹا ضروری ہے۔' });
  }

  const gallery = readJsonFile<GalleryItem[]>('gallery.json', []);
  const newItem: GalleryItem = {
    id: `gal-${Date.now()}`,
    title: title.trim(),
    description: description ? description.trim() : '',
    imageUrl,
    category: category ? category.trim() : 'Events',
    status: status === 'hidden' ? 'hidden' : 'active',
    date: new Date().toISOString().split('T')[0]
  };

  gallery.unshift(newItem);
  writeJsonFile('gallery.json', gallery);

  return res.json({ success: true, message: 'گیلری میں تصویر شامل کر دی گئی۔', data: newItem });
});

// PUT /api/admin/gallery/:id
router.put('/gallery/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const gallery = readJsonFile<GalleryItem[]>('gallery.json', []);
  const index = gallery.findIndex(g => g.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'گیلری کا ائٹم نہیں ملا!' });
  }

  gallery[index] = {
    ...gallery[index],
    title: req.body.title !== undefined ? req.body.title.trim() : gallery[index].title,
    description: req.body.description !== undefined ? req.body.description.trim() : gallery[index].description,
    imageUrl: req.body.imageUrl !== undefined ? req.body.imageUrl : gallery[index].imageUrl,
    category: req.body.category !== undefined ? req.body.category.trim() : gallery[index].category,
    status: req.body.status === 'hidden' ? 'hidden' : 'active'
  };

  writeJsonFile('gallery.json', gallery);
  return res.json({ success: true, message: 'گیلری ائٹم اپڈیٹ کر دیا گیا۔', data: gallery[index] });
});

// DELETE /api/admin/gallery/:id
router.delete('/gallery/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const gallery = readJsonFile<GalleryItem[]>('gallery.json', []);
  const filtered = gallery.filter(g => g.id !== id);

  writeJsonFile('gallery.json', filtered);
  return res.json({ success: true, message: 'گیلری سے ائٹم حذف ہو گیا۔' });
});


/* ==========================================================================
   SETTINGS MANAGEMENT
   ========================================================================== */

// GET /api/admin/settings
router.get('/settings', (_req: AuthenticatedRequest, res: Response) => {
  const settings = readJsonFile<CollegeSettings>('settings.json', {
    collegeName: 'Jamal College of Sciences, Mayar',
    logoUrl: '/logo.png',
    websiteTitle: 'Jamal College of Sciences, Mayar',
    description: '',
    popupEnabled: true,
    popupDelay: 3000,
    popupMessage: '',
    theme: 'blue-gold'
  });
  return res.json({ success: true, data: settings });
});

// PUT /api/admin/settings
router.put('/settings', (req: AuthenticatedRequest, res: Response) => {
  const current = readJsonFile<CollegeSettings>('settings.json', {
    collegeName: 'Jamal College of Sciences, Mayar',
    logoUrl: '/logo.png',
    websiteTitle: 'Jamal College of Sciences, Mayar',
    description: '',
    popupEnabled: true,
    popupDelay: 3000,
    popupMessage: '',
    theme: 'blue-gold'
  });

  const updatedSettings: CollegeSettings = {
    ...current,
    collegeName: req.body.collegeName || current.collegeName,
    logoUrl: req.body.logoUrl || current.logoUrl,
    websiteTitle: req.body.websiteTitle || current.websiteTitle,
    description: req.body.description !== undefined ? req.body.description : current.description,
    popupEnabled: req.body.popupEnabled !== undefined ? Boolean(req.body.popupEnabled) : current.popupEnabled,
    popupDelay: req.body.popupDelay !== undefined ? Number(req.body.popupDelay) : current.popupDelay,
    popupMessage: req.body.popupMessage !== undefined ? req.body.popupMessage : current.popupMessage,
    theme: req.body.theme || current.theme
  };

  writeJsonFile('settings.json', updatedSettings);
  return res.json({ success: true, message: 'Settings saved successfully!', data: updatedSettings });
});


/* ==========================================================================
   CAROUSEL MANAGEMENT
   ========================================================================== */

// GET /api/admin/carousel
router.get('/carousel', (_req: AuthenticatedRequest, res: Response) => {
  const slides = readJsonFile<CarouselSlide[]>('carousel.json', []);
  return res.json({ success: true, data: slides });
});

// POST /api/admin/carousel
router.post('/carousel', (req: AuthenticatedRequest, res: Response) => {
  const { title, subtitle, imageUrl, badge, status } = req.body;

  if (!title || !imageUrl) {
    return res.status(400).json({ success: false, message: 'Slide title and image URL are required.' });
  }

  const slides = readJsonFile<CarouselSlide[]>('carousel.json', []);
  const newSlide: CarouselSlide = {
    id: `slide-${Date.now()}`,
    title: title.trim(),
    subtitle: subtitle ? subtitle.trim() : '',
    imageUrl,
    badge: badge ? badge.trim() : 'Jamal College',
    status: status === 'hidden' ? 'hidden' : 'active',
    order: slides.length + 1
  };

  slides.unshift(newSlide);
  writeJsonFile('carousel.json', slides);

  return res.json({ success: true, message: 'Carousel slide added successfully!', data: newSlide });
});

// PUT /api/admin/carousel/:id
router.put('/carousel/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const slides = readJsonFile<CarouselSlide[]>('carousel.json', []);
  const index = slides.findIndex(s => s.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Slide not found!' });
  }

  slides[index] = {
    ...slides[index],
    title: req.body.title !== undefined ? req.body.title.trim() : slides[index].title,
    subtitle: req.body.subtitle !== undefined ? req.body.subtitle.trim() : slides[index].subtitle,
    imageUrl: req.body.imageUrl !== undefined ? req.body.imageUrl : slides[index].imageUrl,
    badge: req.body.badge !== undefined ? req.body.badge.trim() : slides[index].badge,
    status: req.body.status === 'hidden' ? 'hidden' : 'active',
    order: req.body.order !== undefined ? Number(req.body.order) : slides[index].order
  };

  writeJsonFile('carousel.json', slides);
  return res.json({ success: true, message: 'Slide updated successfully!', data: slides[index] });
});

// DELETE /api/admin/carousel/:id
router.delete('/carousel/:id', (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const slides = readJsonFile<CarouselSlide[]>('carousel.json', []);
  const filtered = slides.filter(s => s.id !== id);

  writeJsonFile('carousel.json', filtered);
  return res.json({ success: true, message: 'سلائیڈ کامیابی سے حذف کر دی گئی۔' });
});

export default router;
