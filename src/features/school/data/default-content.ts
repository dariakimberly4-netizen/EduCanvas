import type { SchoolContent } from "@/features/school/domain/types";

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
  heroSlides: [],
  faculty: [],
  documents: [],
  activity: [],
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
