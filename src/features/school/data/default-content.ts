import type { SchoolContent } from "@/features/school/domain/types";

export const defaultSchoolContent: SchoolContent = {
  landing: {
    admissionStatus: "Admissions open for 2026–27",
    schoolDescriptor: "English-version national curriculum · Dhanmondi, Dhaka",
    heroTitle: "A complete education from Playgroup to Class XII.",
    heroSummary:
      "Shapla Grove is a co-educational school where strong academics, attentive teachers, and a safe campus help every student progress with confidence.",
    phone: "+880 1712 345 678",
    admissionYear: "2026–27",
    schoolHeading: "A clear standard for learning and care.",
    schoolIntro:
      "Families choose Shapla Grove for a balanced education: structured teaching, close guidance, and room for students to discover what they do well.",
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
