export type PublicationStatus = "Published" | "Draft";
export type DocumentType = "Notice" | "Result";

export interface LandingContent {
  admissionStatus: string;
  schoolDescriptor: string;
  heroTitle: string;
  heroSummary: string;
  phone: string;
  admissionYear: string;
  schoolHeading: string;
  schoolIntro: string;
  publishedAt: string;
}

export interface HeroSlide {
  id: number;
  src: string;
  heading: string;
  supporting: string;
  alt: string;
  isLocalAsset?: boolean;
}

export interface FacultyMember {
  id: number;
  name: string;
  role: string;
  department: string;
  subject: string;
  experience: number;
  status: PublicationStatus;
  bio: string;
}

export interface SchoolDocument {
  id: number;
  title: string;
  type: DocumentType;
  category: string;
  date: string;
  fileName: string;
  status: PublicationStatus;
  academicYear?: string;
  publisher?: string;
  fileSize?: string;
}

export interface ActivityItem {
  action: string;
  item: string;
  time: string;
}

export interface SchoolContent {
  landing: LandingContent;
  heroSlides: HeroSlide[];
  faculty: FacultyMember[];
  documents: SchoolDocument[];
  activity: ActivityItem[];
}
