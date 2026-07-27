import type { SchoolContent } from "@/features/school/domain/types";

const MAX_CONTENT_BYTES = 500_000;

function isStringRecord(value: unknown, keys: string[]) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return keys.every((key) => typeof record[key] === "string");
}

function isStringArray(value: unknown, maximum: number) {
  return Array.isArray(value) &&
    value.length <= maximum &&
    value.every((item) => typeof item === "string");
}

function isLandingContent(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const landing = value as Record<string, unknown>;
  const requiredStrings = [
    "brandName", "brandTagline", "utilityHours", "staffLoginLabel",
    "admissionStatus", "schoolDescriptor", "heroTitle", "heroSummary",
    "heroPrimaryAction", "heroSecondaryAction", "heroHelpText", "phone",
    "schoolGlanceHeading", "tasksKicker", "tasksHeading", "tasksIntro",
    "storyKicker", "admissionYear", "schoolHeading", "schoolIntro",
    "schoolStoryAction", "academicsKicker", "academicsHeading",
    "academicsIntro", "updatesKicker", "updatesHeading", "updatesAction",
    "admissionsHeading", "admissionsIntro", "inquiryTitle",
    "inquiryRequiredNote", "guardianLabel", "guardianPlaceholder",
    "phoneLabel", "phonePlaceholder", "classLabel", "classPlaceholder",
    "inquirySubmitLabel", "inquirySubmittingLabel", "inquiryReceivedLabel",
    "inquiryConsentText", "inquirySuccessText",
    "footerSummary", "footerExploreHeading", "footerFamiliesHeading",
    "footerResultsLabel", "footerContactHeading", "addressLineOne",
    "addressLineTwo", "email", "copyright", "publishedAt",
  ];

  return requiredStrings.every((key) => typeof landing[key] === "string") &&
    isStringRecord(landing.navigationLabels, [
      "home", "school", "academics", "faculty", "notices", "admissions",
    ]) &&
    Array.isArray(landing.schoolStats) &&
    landing.schoolStats.length <= 8 &&
    landing.schoolStats.every((item) => isStringRecord(item, ["value", "label"])) &&
    Array.isArray(landing.tasks) &&
    landing.tasks.length <= 8 &&
    landing.tasks.every((item) => isStringRecord(item, ["number", "title", "description", "action"])) &&
    Array.isArray(landing.principles) &&
    landing.principles.length <= 8 &&
    landing.principles.every((item) => isStringRecord(item, ["marker", "title", "description"])) &&
    Array.isArray(landing.academicLevels) &&
    landing.academicLevels.length <= 8 &&
    landing.academicLevels.every((item) => isStringRecord(item, ["classes", "title", "description", "action"])) &&
    isStringArray(landing.admissionBenefits, 8) &&
    isStringArray(landing.classLevels, 20);
}

export function isSchoolContent(value: unknown): value is SchoolContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Partial<SchoolContent>;

  return Boolean(
    isLandingContent(candidate.landing) &&
      Array.isArray(candidate.heroSlides) &&
      candidate.heroSlides.length <= 6 &&
      candidate.heroSlides.every(
        (slide) =>
          slide &&
          typeof slide.id === "number" &&
          typeof slide.src === "string" &&
          typeof slide.heading === "string" &&
          typeof slide.alt === "string",
      ) &&
      Array.isArray(candidate.faculty) &&
      candidate.faculty.length <= 250 &&
      candidate.faculty.every(
        (member) =>
          member &&
          typeof member.id === "number" &&
          typeof member.name === "string" &&
          (member.status === "Published" || member.status === "Draft"),
      ) &&
      Array.isArray(candidate.documents) &&
      candidate.documents.length <= 500 &&
      candidate.documents.every(
        (document) =>
          document &&
          typeof document.id === "number" &&
          typeof document.title === "string" &&
          (document.type === "Notice" || document.type === "Result"),
      ) &&
      Array.isArray(candidate.activity) &&
      candidate.activity.length <= 8 &&
      JSON.stringify(candidate).length <= MAX_CONTENT_BYTES
  );
}
