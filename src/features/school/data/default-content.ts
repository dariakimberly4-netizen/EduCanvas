import type { SchoolContent } from "@/features/school/domain/types";

export const defaultSchoolContent: SchoolContent = {
  landing: {
    brandName: "Shapla Grove",
    brandTagline: "School & College · Est. 1998",
    utilityHours: "Sunday–Thursday, 8:00 AM–4:00 PM",
    staffLoginLabel: "Staff login",
    navigationLabels: {
      home: "Home",
      school: "Our school",
      academics: "Academics",
      faculty: "Faculty",
      notices: "Notices & results",
      admissions: "Admissions",
    },
    admissionStatus: "Admissions open for 2026–27",
    schoolDescriptor: "English-version national curriculum · Dhanmondi, Dhaka",
    heroTitle: "A complete education from Playgroup to Class XII.",
    heroSummary:
      "Shapla Grove is a co-educational school where strong academics, attentive teachers, and a safe campus help every student progress with confidence.",
    heroPrimaryAction: "Start an admission enquiry",
    heroSecondaryAction: "Explore our school",
    heroHelpText: "Need help? Call our admissions office at",
    phone: "+880 1712 345 678",
    schoolGlanceHeading: "School at a glance",
    schoolStats: [
      { value: "Playgroup–XII", label: "Classes offered" },
      { value: "18:1", label: "Student–teacher ratio" },
      { value: "Bangla & English", label: "Languages of instruction" },
      { value: "96%", label: "2025 board pass rate" },
    ],
    tasksKicker: "How can we help?",
    tasksHeading: "Find what you need.",
    tasksIntro: "Quick access for parents, students, and prospective families.",
    tasks: [
      { number: "01", title: "Apply for admission", description: "Check eligibility, class availability, and request a campus visit.", action: "Start enquiry" },
      { number: "02", title: "Read school notices", description: "View examination schedules, events, holidays, and parent updates.", action: "View notices" },
      { number: "03", title: "Check results", description: "Find verified term, model test, and board result documents.", action: "View results" },
      { number: "04", title: "Meet our faculty", description: "Learn about our teachers, subject leaders, and school leadership.", action: "Meet the team" },
    ],
    storyKicker: "Why Shapla Grove",
    admissionYear: "2026–27",
    schoolHeading: "A clear standard for learning and care.",
    schoolIntro:
      "Families choose Shapla Grove for a balanced education: structured teaching, close guidance, and room for students to discover what they do well.",
    schoolStoryAction: "Meet the educators behind our approach",
    principles: [
      { marker: "A", title: "Strong academic foundations", description: "National curriculum teaching supported by laboratories, technology, language practice, and regular feedback." },
      { marker: "B", title: "Every student is known", description: "An 18:1 student–teacher ratio helps teachers identify strengths, provide support, and keep families informed." },
      { marker: "C", title: "Character beyond the classroom", description: "Clubs, sport, arts, leadership, and service help students become responsible and confident young people." },
    ],
    academicsKicker: "Academic pathway",
    academicsHeading: "Learning that progresses with your child.",
    academicsIntro: "Each stage has clear academic goals, age-appropriate support, and preparation for what comes next.",
    academicLevels: [
      { classes: "Playgroup–KG", title: "Early years", description: "Language, number sense, movement, routines, and learning through guided play.", action: "Ask about early years" },
      { classes: "Classes I–V", title: "Primary school", description: "Strong foundations in Bangla, English, mathematics, science, and social studies.", action: "Ask about primary" },
      { classes: "Classes VI–X", title: "Secondary school", description: "Deeper subject study, practical science, digital skills, and SSC preparation.", action: "Ask about secondary" },
      { classes: "Classes XI–XII", title: "Higher secondary", description: "Focused academic streams, university guidance, and HSC exam preparation.", action: "Ask about college" },
    ],
    updatesKicker: "Current information",
    updatesHeading: "Latest from the school.",
    updatesAction: "View all notices & results",
    admissionsHeading: "See whether Shapla Grove is right for your child.",
    admissionsIntro: "Tell us which class you are considering. Our admissions team will call you to explain availability, requirements, fees, and the next campus visit.",
    admissionBenefits: [
      "No application fee for an initial enquiry",
      "Response within one school day",
      "Campus visits available Sunday–Thursday",
    ],
    inquiryTitle: "Request admission information",
    inquiryRequiredNote: "Fields marked * are required.",
    guardianLabel: "Parent or guardian name",
    guardianPlaceholder: "Enter your full name",
    phoneLabel: "Phone number",
    phonePlaceholder: "+880 1XXX XXXXXX",
    classLabel: "Class you are interested in",
    classPlaceholder: "Select a class level",
    classLevels: ["Playgroup–KG", "Classes I–V", "Classes VI–X", "Classes XI–XII"],
    inquirySubmitLabel: "Request a call from admissions",
    inquirySubmittingLabel: "Sending enquiry…",
    inquiryReceivedLabel: "Enquiry received",
    inquiryConsentText: "By continuing, you agree that our admissions office may contact you about this enquiry.",
    inquirySuccessText: "Our admissions office will contact you within one school day.",
    footerSummary: "Structured learning, individual guidance, and a safe campus from Playgroup to Class XII.",
    footerExploreHeading: "Explore",
    footerFamiliesHeading: "For families",
    footerResultsLabel: "Results",
    footerContactHeading: "Contact",
    addressLineOne: "12 Lakeview Road, Dhanmondi",
    addressLineTwo: "Dhaka 1209",
    email: "office@shaplagrove.edu.bd",
    copyright: "© 2026 Shapla Grove School & College. Prototype website.",
    publishedAt: "26 Jul 2026, 10:24 AM",
  },
  heroSlides: [
    {
      id: 201,
      src: "/assets/school-campus-hero.png",
      heading: "A school built around the student",
      supporting: "Small classes · Individual guidance · Safe campus",
      alt: "Shapla Grove students walking through the school courtyard with their teacher",
      isLocalAsset: true,
    },
  ],
  faculty: [
    { id: 1, name: "Hasan Ahmed", role: "Head of Secondary", department: "Mathematics", subject: "Mathematics", experience: 14, status: "Published", bio: "Leads secondary academics and teaches mathematics." },
    { id: 2, name: "Nusrat Islam", role: "Senior Teacher", department: "Languages", subject: "Bangla & Literature", experience: 11, status: "Published", bio: "Helps students become thoughtful readers and writers." },
    { id: 3, name: "Arif Khan", role: "Science Coordinator", department: "Science", subject: "Physics", experience: 9, status: "Published", bio: "Coordinates practical science and inquiry-led learning." },
    { id: 4, name: "Farzana Sultana", role: "Head of Primary", department: "Primary", subject: "Early Learning", experience: 16, status: "Published", bio: "Leads the primary team and early learning programme." },
    { id: 5, name: "Rafiul Mahmud", role: "Senior Teacher", department: "Languages", subject: "English", experience: 8, status: "Published", bio: "Teaches English language and communication." },
    { id: 6, name: "Tahmina Jahan", role: "Wellbeing Lead", department: "Humanities", subject: "Social Science", experience: 12, status: "Published", bio: "Supports student wellbeing and teaches social science." },
    { id: 7, name: "Mehedi Islam", role: "Senior Teacher", department: "Science", subject: "Biology", experience: 10, status: "Published", bio: "Teaches biology through observation and investigation." },
    { id: 8, name: "Sharmin Kabir", role: "Creative Arts Lead", department: "Creative Arts", subject: "Fine Arts", experience: 7, status: "Published", bio: "Leads visual arts and student exhibitions." },
  ],
  documents: [
    { id: 101, title: "Half-yearly examination schedule for Classes VI–X", type: "Notice", category: "Examination", date: "2026-07-24", fileName: "half-yearly-schedule.pdf", status: "Published", publisher: "Academic Office", fileSize: "1.2 MB" },
    { id: 102, title: "School closure for Ashura", type: "Notice", category: "General", date: "2026-07-18", fileName: "school-closure.pdf", status: "Published", publisher: "Administration", fileSize: "420 KB" },
    { id: 103, title: "Inter-house science fair: registration details", type: "Notice", category: "Event", date: "2026-07-12", fileName: "science-fair.pdf", status: "Published", publisher: "Science Department", fileSize: "860 KB" },
    { id: 104, title: "Parent–teacher meeting schedule, Term I", type: "Notice", category: "Parents", date: "2026-07-05", fileName: "parent-meeting.pdf", status: "Published", publisher: "Academic Office", fileSize: "615 KB" },
    { id: 105, title: "First term results — Classes VI–VIII", type: "Result", category: "Academic result", date: "2026-06-28", fileName: "term-results-6-8.pdf", status: "Published", academicYear: "2026–27", fileSize: "2.4 MB" },
    { id: 106, title: "First term results — Classes I–V", type: "Result", category: "Academic result", date: "2026-06-25", fileName: "term-results-1-5.pdf", status: "Published", academicYear: "2026–27", fileSize: "1.8 MB" },
    { id: 107, title: "SSC model test results", type: "Result", category: "Academic result", date: "2026-05-14", fileName: "ssc-model-test.pdf", status: "Published", academicYear: "2025–26", fileSize: "940 KB" },
  ],
  activity: [
    { action: "Published notice", item: "Half-yearly examination schedule", time: "24 Jul 2026" },
    { action: "Updated faculty profile", item: "Hasan Ahmed", time: "22 Jul 2026" },
    { action: "Updated landing page", item: "Admissions information", time: "20 Jul 2026" },
  ],
};

export const cloneSchoolContent = (content: SchoolContent): SchoolContent =>
  structuredClone(content);

export function normalizeSchoolContent(content: SchoolContent): SchoolContent {
  const defaults = defaultSchoolContent.landing;
  const landing = content.landing as Partial<SchoolContent["landing"]>;

  return {
    ...content,
    landing: {
      ...defaults,
      ...landing,
      navigationLabels: {
        ...defaults.navigationLabels,
        ...landing.navigationLabels,
      },
      schoolStats: landing.schoolStats ?? defaults.schoolStats,
      tasks: landing.tasks ?? defaults.tasks,
      principles: landing.principles ?? defaults.principles,
      academicLevels: landing.academicLevels ?? defaults.academicLevels,
      admissionBenefits:
        landing.admissionBenefits ?? defaults.admissionBenefits,
      classLevels: landing.classLevels ?? defaults.classLevels,
    },
  };
}
