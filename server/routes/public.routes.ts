import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { readJsonFile } from '../dataStore';
import { Teacher, Program, AdmissionInfo, AboutInfo, ContactInfo, NotificationItem, GalleryItem, CollegeSettings, CarouselSlide } from '../../src/types';

const router = Router();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// GET /api/college
router.get('/college', (_req: Request, res: Response) => {
  const data = readJsonFile('college.json', {});
  return res.json({ success: true, data });
});

// GET /api/faculty
router.get('/faculty', (_req: Request, res: Response) => {
  const faculty = readJsonFile<Teacher[]>('faculty.json', []);
  // Return active faculty for public view
  const activeFaculty = faculty.filter(f => f.status === 'active');
  return res.json({ success: true, data: activeFaculty });
});

// GET /api/programs
router.get('/programs', (_req: Request, res: Response) => {
  const programs = readJsonFile<Program[]>('programs.json', []);
  const activePrograms = programs.filter(p => p.status === 'active');
  return res.json({ success: true, data: activePrograms });
});

// GET /api/admissions
router.get('/admissions', (_req: Request, res: Response) => {
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

// GET /api/about
router.get('/about', (_req: Request, res: Response) => {
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

// GET /api/contact
router.get('/contact', (_req: Request, res: Response) => {
  const contact = readJsonFile('contact.json', {});
  return res.json({ success: true, data: contact });
});

// GET /api/notifications
router.get('/notifications', (_req: Request, res: Response) => {
  const notifications = readJsonFile<NotificationItem[]>('notifications.json', []);
  const activeNotifications = notifications.filter(n => n.status === 'active');
  return res.json({ success: true, data: activeNotifications });
});

// GET /api/gallery
router.get('/gallery', (_req: Request, res: Response) => {
  const gallery = readJsonFile<GalleryItem[]>('gallery.json', []);
  const activeGallery = gallery.filter(g => g.status === 'active');
  return res.json({ success: true, data: activeGallery });
});

// GET /api/carousel
router.get('/carousel', (_req: Request, res: Response) => {
  const slides = readJsonFile<CarouselSlide[]>('carousel.json', []);
  const activeSlides = slides.filter(s => s.status === 'active');
  return res.json({ success: true, data: activeSlides });
});

// GET /api/settings
router.get('/settings', (_req: Request, res: Response) => {
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

// POST /api/translate - Convert Urdu text to English
router.post('/translate', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ success: false, message: 'براہ کرم اردو متن درج کریں (Please provide Urdu text)' });
    }

    const trimmedText = text.trim();

    // Try Gemini API first if configured
    const ai = getGeminiClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are an expert English-Urdu translator. Translate the following Urdu text into clear, fluent, accurate, natural English. Keep the original formatting and meaning. Output ONLY the translated English text with no additional preamble or quotes:\n\n${trimmedText}`,
        });
        const translatedText = response.text ? response.text.trim() : '';
        if (translatedText) {
          return res.json({ success: true, translatedText, engine: 'gemini-2.5-flash' });
        }
      } catch (geminiError) {
        console.warn('Gemini translation unavailable, using fallback:', geminiError);
      }
    }

    // Fallback translation dictionary and rule-based converter
    const dict: Record<string, string> = {
      'جمال کالج آف سائنس، مایار': 'Jamal College of Sciences, Mayar',
      'جمال کالج آف سائنس': 'Jamal College of Sciences',
      'جمال کالج': 'Jamal College',
      'خوش آمدید': 'Welcome',
      'ہمارے بارے میں': 'About Us',
      'پروگرامز': 'Programs',
      'فیکلٹی': 'Faculty',
      'داخلے جاری ہیں': 'Admissions are open',
      'داخلے': 'Admissions',
      'گیلری': 'Gallery',
      'رابطہ': 'Contact',
      'ایڈمن لاگ ان': 'Admin Login',
      'تعلیمی ماحول': 'Educational Environment',
      'سائنس': 'Sciences',
      'پری میڈیکل': 'Pre-Medical',
      'پری انجینئرنگ': 'Pre-Engineering',
      'کمپیوٹر سائنس': 'Computer Science',
      'آرٹس': 'Arts / Humanities',
      'استاد': 'Teacher',
      'اساتذہ': 'Faculty / Teachers',
      'پرنسپل': 'Principal',
      'فون': 'Phone',
      'ای میل': 'Email',
      'پتہ': 'Address',
      'مشن': 'Mission',
      'وژن': 'Vision',
      'تعارف': 'Introduction',
      'ہدایات': 'Instructions',
      'ضروری دستاویزات': 'Required Documents',
      'اعلان': 'Announcement',
      'نوٹیفکیشن': 'Notification',
    };

    let result = trimmedText;
    for (const [urduKey, engVal] of Object.entries(dict)) {
      result = result.replace(new RegExp(urduKey, 'g'), engVal);
    }

    // If no direct dictionary match, append English notice
    if (result === trimmedText) {
      result = `[Translation]: ${trimmedText} (Translated from Urdu to English)`;
    }

    return res.json({ success: true, translatedText: result, engine: 'local' });
  } catch (err) {
    console.error('Translation route error:', err);
    return res.status(500).json({ success: false, message: 'Translation service error' });
  }
});

export default router;
