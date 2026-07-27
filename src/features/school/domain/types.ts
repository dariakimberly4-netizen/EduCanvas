export type PublicationStatus = "Published" | "Draft";
export type DocumentType = "Notice" | "Result";

export interface HomeStat {
  value: string;
  label: string;
}

export interface HomeTask {
  number: string;
  title: string;
  description: string;
  action: string;
}

export interface HomePrinciple {
  marker: string;
  title: string;
  description: string;
}

export interface AcademicLevel {
  classes: string;
  title: string;
  description: string;
  action: string;
}

export interface LandingContent {
  brandName: string;
  brandTagline: string;
  utilityHours: string;
  staffLoginLabel: string;
  navigationLabels: {
    home: string;
    school: string;
    academics: string;
    faculty: string;
    notices: string;
    admissions: string;
  };
  admissionStatus: string;
  schoolDescriptor: string;
  heroTitle: string;
  heroSummary: string;
  heroPrimaryAction: string;
  heroSecondaryAction: string;
  heroHelpText: string;
  phone: string;
  schoolGlanceHeading: string;
  schoolStats: HomeStat[];
  tasksKicker: string;
  tasksHeading: string;
  tasksIntro: string;
  tasks: HomeTask[];
  storyKicker: string;
  admissionYear: string;
  schoolHeading: string;
  schoolIntro: string;
  schoolStoryAction: string;
  principles: HomePrinciple[];
  academicsKicker: string;
  academicsHeading: string;
  academicsIntro: string;
  academicLevels: AcademicLevel[];
  updatesKicker: string;
  updatesHeading: string;
  updatesAction: string;
  admissionsHeading: string;
  admissionsIntro: string;
  admissionBenefits: string[];
  inquiryTitle: string;
  inquiryRequiredNote: string;
  guardianLabel: string;
  guardianPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  classLabel: string;
  classPlaceholder: string;
  classLevels: string[];
  inquirySubmitLabel: string;
  inquirySubmittingLabel: string;
  inquiryReceivedLabel: string;
  inquiryConsentText: string;
  inquirySuccessText: string;
  footerSummary: string;
  footerExploreHeading: string;
  footerFamiliesHeading: string;
  footerResultsLabel: string;
  footerContactHeading: string;
  addressLineOne: string;
  addressLineTwo: string;
  email: string;
  copyright: string;
  publishedAt: string;
}

export interface HeroSlide {
  id: number;
  src: string;
  heading: string;
  supporting: string;
  alt: string;
  isLocalAsset?: boolean;
  storageFileId?: string;
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
  imageUrl?: string;
  imageStorageFileId?: string;
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
  fileUrl?: string;
  previewUrl?: string;
  storageFileId?: string;
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
