import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Safely read JSON file with default fallback
 */
export function readJsonFile<T>(filename: string, defaultValue: T): T {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      writeJsonFile(filename, defaultValue);
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`[JSON Store] Error reading ${filename}:`, error);
    // Attempt to restore from backup if available
    const backupPath = path.join(BACKUP_DIR, `${filename}.bak`);
    if (fs.existsSync(backupPath)) {
      try {
        const backupContent = fs.readFileSync(backupPath, 'utf-8');
        console.log(`[JSON Store] Restored ${filename} from backup.`);
        return JSON.parse(backupContent) as T;
      } catch (e) {
        console.error(`[JSON Store] Failed to restore ${filename} from backup:`, e);
      }
    }
    return defaultValue;
  }
}

/**
 * Safely and atomically write JSON file with automatic backup
 */
export function writeJsonFile<T>(filename: string, data: T): boolean {
  const filePath = path.join(DATA_DIR, filename);
  const tempPath = path.join(DATA_DIR, `${filename}.${Date.now()}.tmp`);
  const backupPath = path.join(BACKUP_DIR, `${filename}.bak`);

  try {
    const jsonString = JSON.stringify(data, null, 2);
    
    // Write to temporary file first
    fs.writeFileSync(tempPath, jsonString, 'utf-8');

    // Create backup of current file if it exists
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    // Atomic rename
    fs.renameSync(tempPath, filePath);
    return true;
  } catch (error) {
    console.error(`[JSON Store] Error writing ${filename}:`, error);
    if (fs.existsSync(tempPath)) {
      try {
        fs.unlinkSync(tempPath);
      } catch (e) {
        // ignore
      }
    }
    return false;
  }
}

/**
 * Initialize default JSON seed data if not present
 */
export async function initializeSeedData() {
  // 1. admin.json
  const adminFile = path.join(DATA_DIR, 'admin.json');
  if (!fs.existsSync(adminFile)) {
    const defaultPasswordHash = await bcrypt.hash('jamal', 10);
    writeJsonFile('admin.json', {
      username: 'jamal',
      passwordHash: defaultPasswordHash,
      jwtSecret: 'jcs_mayar_secret_token_key_2026_dir_lower'
    });
    console.log('[Seed] Created default admin credentials for username: jamal');
  }

  // 2. college.json
  const collegeDefault = {
    name: "Jamal College of Sciences, Mayar",
    tagline: "Inspiring Excellence in Science, Arts & Technology",
    address: "Mayar, Dir Lower, Khyber Pakhtunkhwa, Pakistan",
    phone: "+92 345 9001234",
    email: "info@jamalcollege.edu.pk",
    facebook: "https://www.facebook.com/JCSmayar/",
    established: "2015"
  };
  readJsonFile('college.json', collegeDefault);

  // 3. faculty.json
  const defaultFaculty = [
    {
      id: "teacher-001",
      name: "Prof. Muhammad Jamal",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      subject: "Physics & Science",
      designation: "Principal / Senior Lecturer",
      qualification: "M.Sc. Physics (UOP), B.Ed",
      experience: "15 Years Teaching Experience",
      age: "45",
      address: "Mayar, Dir Lower, KPK",
      biography: "Prof. Muhammad Jamal is the founding principal of Jamal College of Sciences. With over 15 years of experience in higher secondary physics education, he has guided thousands of students to top medical and engineering universities.",
      status: "active"
    },
    {
      id: "teacher-002",
      name: "Dr. Shahab Khan",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      subject: "Chemistry",
      designation: "Head of Chemistry Dept.",
      qualification: "Ph.D. Chemistry",
      experience: "12 Years Teaching Experience",
      age: "41",
      address: "Timergara, Dir Lower",
      biography: "Specialist in Organic and Analytical Chemistry with extensive experience in board examination prep and lab instruction.",
      status: "active"
    },
    {
      id: "teacher-003",
      name: "Engr. Rashid Ahmad",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      subject: "Computer Science & Mathematics",
      designation: "Assistant Professor",
      qualification: "M.S. Computer Software Engineering",
      experience: "8 Years Teaching Experience",
      age: "34",
      address: "Mayar, Dir Lower",
      biography: "Passionate computer scientist and mathematics educator focusing on modern algorithms, web technologies, and pre-engineering math preparation.",
      status: "active"
    },
    {
      id: "teacher-004",
      name: "Prof. Tariq Mahmood",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
      subject: "Biology / Pre-Medical Specialist",
      designation: "Senior Lecturer",
      qualification: "M.Sc. Zoology, M.Phil Biology",
      experience: "10 Years Teaching Experience",
      age: "38",
      address: "Chakdara, Dir Lower",
      biography: "Dedicated biology lecturer with proven success in coaching students for Medical College Entry Tests (MDCAT).",
      status: "active"
    }
  ];
  readJsonFile('faculty.json', defaultFaculty);

  // 4. programs.json
  const defaultPrograms = [
    {
      id: "prog-001",
      name: "Pre-Medical (F.Sc)",
      description: "Designed for students aspiring to pursue MBBS, BDS, Pharmacy, Biotechnology, and Allied Health Sciences.",
      eligibility: "Matriculation with Science (Minimum 60% Marks)",
      duration: "2 Years (Part-I & Part-II)",
      status: "active"
    },
    {
      id: "prog-002",
      name: "Pre-Engineering (F.Sc)",
      description: "Comprehensive preparation for engineering disciplines including Electrical, Civil, Mechanical, and Software Engineering.",
      eligibility: "Matriculation with Science (Minimum 60% Marks)",
      duration: "2 Years (Part-I & Part-II)",
      status: "active"
    },
    {
      id: "prog-003",
      name: "Computer Science (ICS)",
      description: "Focuses on Computer Science, Physics/Statistics, and Mathematics for future tech leaders and software engineers.",
      eligibility: "Matriculation with Science or Computer Science (Minimum 50% Marks)",
      duration: "2 Years (Part-I & Part-II)",
      status: "active"
    },
    {
      id: "prog-004",
      name: "Humanities & Arts (F.A)",
      description: "A versatile program covering Islamic Studies, Literature, Civics, Economics, and English Literature.",
      eligibility: "Matriculation (Arts or Science)",
      duration: "2 Years (Part-I & Part-II)",
      status: "active"
    }
  ];
  readJsonFile('programs.json', defaultPrograms);

  // 5. admissions.json
  const defaultAdmissions = {
    status: "open",
    announcement: "Admissions Open for Session 2026-2027 in F.Sc (Pre-Medical, Pre-Engineering), ICS (Computer Science) and F.A (Arts). Limited seats available!",
    availablePrograms: [
      "Pre-Medical",
      "Pre-Engineering",
      "Computer Science (ICS)",
      "Arts / FA"
    ],
    instructions: "1. Obtain the admission prospectus from the college office or apply online through this portal.\n2. Fill out the application form with accurate credentials.\n3. Submit attested copies of required documents along with 4 passport-size photographs.\n4. Merit list will be displayed on the college notice board and website.",
    requiredDocuments: [
      "Matriculation DMC (Detailed Marks Certificate) - 3 Attested Copies",
      "Character Certificate from School Last Attended - Original + 2 Copies",
      "Father/Guardian's CNIC Copy - 2 Copies",
      "Candidate CNIC or Form-B - 2 Copies",
      "Passport Size Recent Photographs - 4 Copies (Blue Background)",
      "Migration Certificate (for board other than BISE Malakand)"
    ],
    importantDates: [
      { event: "Admission Form Issuance Starts", date: "10 August 2026" },
      { event: "Last Date for Form Submission", date: "31 August 2026" },
      { event: "First Merit List Display", date: "02 September 2026" },
      { event: "Fee Submission & Interview", date: "03 - 07 September 2026" },
      { event: "Commencement of Classes", date: "10 September 2026" }
    ],
    eligibilityInfo: "Candidates who have passed SSC (Matric) Examination from BISE Malakand or any recognized Board with minimum 50% marks are eligible to apply.",
    contactPhone: "+92 345 9001234",
    contactEmail: "admissions@jamalcollege.edu.pk"
  };
  readJsonFile('admissions.json', defaultAdmissions);

  // 6. about.json
  const defaultAbout = {
    collegeName: "Jamal College of Sciences, Mayar",
    introduction: "Jamal College of Sciences, Mayar is a premier educational institution in Dir Lower dedicated to nurturing academic excellence, moral integrity, and scientific inquiry in intermediate students.",
    mission: "To provide world-class, accessible science and arts education in Mayar and surrounding regions, empowering students to achieve top university admissions and become future leaders.",
    vision: "To be recognized as a center of educational distinction in Khyber Pakhtunkhwa, known for academic rigor, modern laboratory facilities, and holistic personality development.",
    history: "Founded with a vision to eliminate the educational gap in Dir Lower, Jamal College of Sciences has grown from a humble academic institute into one of the most respected science colleges in the region.",
    educationalEnvironment: "State-of-the-art physics, chemistry, and computer laboratories, disciplined atmosphere, regular monthly testing, and personalized mentorship for board examination preparation.",
    teachingPhilosophy: "We believe in concept-based teaching rather than rote learning. Our experienced faculty encourages critical thinking, interactive question-and-answer sessions, and practical experimentation."
  };
  readJsonFile('about.json', defaultAbout);

  // 7. contact.json
  const defaultContact = {
    collegeName: "Jamal College of Science, Mayar",
    email: {
      enabled: true,
      address: "info@jamalcollege.edu.pk",
      displayText: "info@jamalcollege.edu.pk",
      defaultSubject: "Admission Inquiry - Jamal College of Science",
      defaultMessage: "Respected Administration, I would like to inquire about admissions at Jamal College of Science, Mayar."
    },
    phone: {
      enabled: true,
      number: "+923459001234",
      displayText: "+92 345 9001234"
    },
    whatsapp: {
      enabled: true,
      number: "923459001234",
      displayNumber: "+92 345 9001234",
      message: "Hello Jamal College of Science, I want information regarding admissions and courses."
    },
    floatingWhatsapp: {
      enabled: true,
      buttonText: "Contact on WhatsApp",
      number: "923459001234",
      message: "Hello Jamal College of Science, Mayar! I need assistance regarding admissions.",
      position: "bottom-right"
    },
    address: {
      enabled: true,
      text: "Jamal College of Science, Main Road, Mayar, Dir Lower, Khyber Pakhtunkhwa, Pakistan"
    },
    map: {
      enabled: true,
      latitude: "34.7333",
      longitude: "71.9500",
      googleMapsUrl: "https://maps.google.com/?q=Mayar+Dir+Lower+Pakistan"
    },
    socialMedia: {
      facebook: { enabled: true, url: "https://www.facebook.com/JCSmayar/" },
      instagram: { enabled: true, url: "https://www.instagram.com/JCSmayar/" },
      youtube: { enabled: false, url: "" },
      linkedin: { enabled: false, url: "" }
    },
    officeHours: "Monday to Saturday: 08:00 AM - 02:00 PM",
    admissionContact: "+92 345 9001234 / +92 333 9876543"
  };
  readJsonFile('contact.json', defaultContact);

  // 8. notifications.json
  const defaultNotifications = [
    {
      id: "notif-001",
      title: "Admissions Open - Session 2026-2027",
      message: "Admissions are currently open for F.Sc (Pre-Medical, Pre-Engineering), ICS, and F.A at Jamal College of Sciences, Mayar.",
      status: "active",
      date: "2026-08-08",
      priority: "high",
      showAsPopup: true
    },
    {
      id: "notif-002",
      title: "Entry Test Coaching Classes",
      message: "Special MDCAT & ETEA preparation classes starting for 2nd year F.Sc students.",
      status: "active",
      date: "2026-08-01",
      priority: "medium",
      showAsPopup: false
    }
  ];
  readJsonFile('notifications.json', defaultNotifications);

  // 9. gallery.json
  const defaultGallery = [
    {
      id: "gal-001",
      title: "College Science Exhibition & Lab Session",
      description: "Students demonstrating physics and chemistry experiments in our modern college laboratory.",
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
      status: "active",
      category: "Labs & Science",
      date: "2026-05-15"
    },
    {
      id: "gal-002",
      title: "Annual Prize Distribution Ceremony",
      description: "Recognizing high-achieving students of BISE Malakand board examinations.",
      imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80",
      status: "active",
      category: "Events",
      date: "2026-04-10"
    },
    {
      id: "gal-003",
      title: "Computer Science IT Workshop",
      description: "ICS students working on modern computer software and coding exercises.",
      imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      status: "active",
      category: "Computer Lab",
      date: "2026-03-22"
    }
  ];
  readJsonFile('gallery.json', defaultGallery);

  // 10. settings.json
  const defaultSettings = {
    collegeName: "Jamal College of Sciences, Mayar",
    logoUrl: "/logo.png",
    websiteTitle: "Jamal College of Sciences, Mayar",
    description: "Official portal for Jamal College of Sciences, Mayar, Dir Lower.",
    popupEnabled: true,
    popupDelay: 3000,
    popupMessage: "Welcome to Jamal College of Sciences portal. Admissions for Session 2026-2027 are currently open!",
    theme: "blue-gold"
  };
  readJsonFile('settings.json', defaultSettings);

  // 11. carousel.json
  const defaultCarousel = [
    {
      id: "slide-001",
      title: "Jamal College of Sciences, Mayar",
      subtitle: "Dedicated faculty members & talented science students of Session 2026-2027",
      imageUrl: "/images/jamal_college_1.jpg",
      badge: "Session 2026-2027",
      status: "active",
      order: 1
    },
    {
      id: "slide-002",
      title: "Faculty & Students Group Photo",
      subtitle: "Providing excellence in Pre-Medical, Pre-Engineering & Computer Sciences",
      imageUrl: "/images/jamal_college_2.jpg",
      badge: "Campus Life",
      status: "active",
      order: 2
    },
    {
      id: "slide-003",
      title: "Modern Science & Computer Labs",
      subtitle: "State-of-the-art physics, chemistry, biology and computer labs",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
      badge: "Science & Tech",
      status: "active",
      order: 3
    }
  ];
  readJsonFile('carousel.json', defaultCarousel);
}
