import type { SchoolContent } from "@/features/school/domain/types";
import { ADMISSION_CLASS_LEVELS } from "@/features/admissions/domain/admission-enquiry";

export const defaultSchoolContent: SchoolContent = {
  landing: {
    brandName: "Theresian School of Cavite",
    brandTagline: "Where Holistic Formation Begins",
    utilityHours: "Monday–Friday, 8:00 AM–5:00 PM · Saturday, 8:00 AM–12:00 PM",
    staffLoginLabel: "School portal",
    navigationLabels: {
      home: "Home",
      school: "Our School",
      academics: "Academics",
      faculty: "School Community",
      notices: "News & Updates",
      admissions: "Admissions",
    },
    admissionStatus: "Admissions ongoing for S.Y. 2026–2027",
    schoolDescriptor: "Pre-School to Senior High School · Bacoor, Cavite",
    heroTitle: "Where Holistic Formation Begins.",
    heroSummary:
      "Theresian School of Cavite nurtures creative thinkers, good communicators, collaborators, and lifelong learners through balanced academic, personal, and social formation.",
    heroPrimaryAction: "Apply to TSC",
    heroSecondaryAction: "Begin your journey",
    heroHelpText: "Need help? Call the TSC office at",
    phone: "(046) 434-3109",
    schoolGlanceHeading: "TSC at a glance",
    schoolStats: [
      { value: "1988", label: "Founded" },
      { value: "Since 2005", label: "ESC accredited" },
      { value: "Pre-School–SHS", label: "Learning journey" },
      { value: "K–12", label: "Basic education curriculum" },
    ],
    tasksKicker: "Start here",
    tasksHeading: "Find your next step at TSC.",
    tasksIntro: "Quick access for prospective families, students, and the Theresian community.",
    tasks: [
      { number: "01", title: "Apply for admission", description: "Review the current application process and begin your Theresian journey.", action: "Start application" },
      { number: "02", title: "Explore academics", description: "Discover the learning path from Pre-School through Senior High School.", action: "View programs" },
      { number: "03", title: "Experience campus life", description: "Explore facilities, activities, guidance, wellbeing, and community life.", action: "Explore campus" },
      { number: "04", title: "Visit TSC", description: "Plan a visit to the Bacoor campus and speak with the school team.", action: "Contact TSC" },
    ],
    storyKicker: "Our school",
    admissionYear: "2026–2027",
    schoolHeading: "A school journey built around the whole learner.",
    schoolIntro:
      "Founded in 1988, Theresian School of Cavite is committed to holistic formation, educational leadership, global competitiveness, sustainability, and lifelong learning.",
    schoolStoryAction: "Discover the Theresian formation approach",
    principles: [
      { marker: "C", title: "Commitment", description: "Give time and energy to what matters and follow through with purpose." },
      { marker: "O", title: "Orderliness", description: "Work with a clear system, organization, and responsibility." },
      { marker: "D", title: "Discipline", description: "Practice self-control and respect standards that help the community thrive." },
      { marker: "E", title: "Excellence", description: "Give your best while staying within the bounds of what is right." },
    ],
    academicsKicker: "Academic journey",
    academicsHeading: "Learning that grows with every Theresian.",
    academicsIntro: "Each stage develops knowledge, character, confidence, communication, collaboration, and readiness for what comes next.",
    academicLevels: [
      { classes: "Early years", title: "Pre-School", description: "A warm beginning built around curiosity, language, movement, creativity, routines, and discovery.", action: "Ask about Pre-School" },
      { classes: "Elementary", title: "Grade School", description: "Strong academic foundations alongside creativity, communication, values, and social development.", action: "Ask about Grade School" },
      { classes: "Grades 7–10", title: "Junior High School", description: "Deeper subject learning, critical thinking, leadership, collaboration, and preparation for Senior High School.", action: "Ask about Junior High" },
      { classes: "Grades 11–12", title: "Senior High School", description: "Future-focused preparation through STEM, BE, and ASSH clusters.", action: "Ask about Senior High" },
    ],
    updatesKicker: "Current at TSC",
    updatesHeading: "News & Updates",
    updatesAction: "View school updates",
    admissionsHeading: "Your Theresian journey can begin here.",
    admissionsIntro: "Tell us which level you are considering. Use this enquiry form to start a conversation with the school and learn about current requirements, schedules, and next steps.",
    admissionBenefits: [
      "Walk-in and online application options",
      "Pre-School through Senior High School",
      "Admissions for S.Y. 2026–2027 are ongoing",
    ],
    inquiryTitle: "Request admission information",
    inquiryRequiredNote: "Fields marked * are required.",
    guardianLabel: "Parent or guardian name",
    guardianPlaceholder: "Enter your full name",
    phoneLabel: "Phone number",
    phonePlaceholder: "09XX XXX XXXX",
    classLabel: "Level you are interested in",
    classPlaceholder: "Select a school level",
    classLevels: ["Pre-School", "Grades 1–6", "Grades 7–10", "Grade 11"],
    inquirySubmitLabel: "Request information",
    inquirySubmittingLabel: "Sending enquiry…",
    inquiryReceivedLabel: "Enquiry received",
    inquiryConsentText: "By continuing, you agree that the school may contact you about this enquiry.",
    inquirySuccessText: "Thank you. The admissions team can follow up using the contact details you provided.",
    footerSummary: "Holistic formation, purposeful learning, and a caring school community in Bacoor, Cavite.",
    footerExploreHeading: "Explore",
    footerFamiliesHeading: "For families",
    footerResultsLabel: "School updates",
    footerContactHeading: "Contact",
    addressLineOne: "Agueda Lane, Tirona Highway, Habay 1",
    addressLineTwo: "Bacoor, Cavite 4102, Philippines",
    email: "admissons.tsc88@gmail.com",
    copyright: "© 2026 Theresian School of Cavite, Inc. Concept redesign.",
    publishedAt: "22 Sep 2026",
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
