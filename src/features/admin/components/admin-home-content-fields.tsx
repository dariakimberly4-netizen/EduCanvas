"use client";

import { Input } from "@/components/ui/input";
import type {
  AcademicLevel,
  HomePrinciple,
  HomeStat,
  HomeTask,
  LandingContent,
} from "@/features/school/domain/types";

interface AdminHomeContentFieldsProps {
  draft: LandingContent;
  onChange: (landing: LandingContent) => void;
}

function replaceItem<T>(items: T[], index: number, patch: Partial<T>) {
  return items.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...patch } : item,
  );
}

export function AdminHomeContentFields({
  draft,
  onChange,
}: AdminHomeContentFieldsProps) {
  function updateField<Key extends keyof LandingContent>(
    key: Key,
    value: LandingContent[Key],
  ) {
    onChange({ ...draft, [key]: value });
  }

  function updateStat(index: number, patch: Partial<HomeStat>) {
    updateField("schoolStats", replaceItem(draft.schoolStats, index, patch));
  }

  function updateTask(index: number, patch: Partial<HomeTask>) {
    updateField("tasks", replaceItem(draft.tasks, index, patch));
  }

  function updatePrinciple(index: number, patch: Partial<HomePrinciple>) {
    updateField(
      "principles",
      replaceItem(draft.principles, index, patch),
    );
  }

  function updateAcademicLevel(index: number, patch: Partial<AcademicLevel>) {
    updateField(
      "academicLevels",
      replaceItem(draft.academicLevels, index, patch),
    );
  }

  function updateStringItem(
    key: "admissionBenefits" | "classLevels",
    index: number,
    value: string,
  ) {
    updateField(
      key,
      draft[key].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    );
  }

  return (
    <>
      <div className="editor-section">
        <div className="editor-section-heading"><span>Site identity & navigation</span><p>Brand and navigation copy shared across the public website.</p></div>
        <div className="form-grid-two">
          <label>School name<Input value={draft.brandName} onChange={(event) => updateField("brandName", event.target.value)} required /></label>
          <label>School tagline<Input value={draft.brandTagline} onChange={(event) => updateField("brandTagline", event.target.value)} required /></label>
          <label>Office hours<Input value={draft.utilityHours} onChange={(event) => updateField("utilityHours", event.target.value)} required /></label>
          <label>Staff login label<Input value={draft.staffLoginLabel} onChange={(event) => updateField("staffLoginLabel", event.target.value)} required /></label>
        </div>
        <div className="editable-card-grid">
          {Object.entries(draft.navigationLabels).map(([key, value]) => (
            <label key={key}>{key[0].toUpperCase() + key.slice(1)} navigation label<Input value={value} onChange={(event) => updateField("navigationLabels", { ...draft.navigationLabels, [key]: event.target.value })} required /></label>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-section-heading"><span>Hero section</span><p>The first information families see.</p></div>
        <label>Admission status<Input value={draft.admissionStatus} onChange={(event) => updateField("admissionStatus", event.target.value)} maxLength={60} required /></label>
        <label>School description line<Input value={draft.schoolDescriptor} onChange={(event) => updateField("schoolDescriptor", event.target.value)} maxLength={90} required /></label>
        <label>Main heading<textarea value={draft.heroTitle} onChange={(event) => updateField("heroTitle", event.target.value)} rows={3} maxLength={100} required /><small><b>{draft.heroTitle.length}</b>/100 characters</small></label>
        <label>Introduction<textarea value={draft.heroSummary} onChange={(event) => updateField("heroSummary", event.target.value)} rows={4} maxLength={240} required /><small><b>{draft.heroSummary.length}</b>/240 characters</small></label>
        <div className="form-grid-two">
          <label>Primary action label<Input value={draft.heroPrimaryAction} onChange={(event) => updateField("heroPrimaryAction", event.target.value)} required /></label>
          <label>Secondary action label<Input value={draft.heroSecondaryAction} onChange={(event) => updateField("heroSecondaryAction", event.target.value)} required /></label>
        </div>
        <label>Phone help text<Input value={draft.heroHelpText} onChange={(event) => updateField("heroHelpText", event.target.value)} required /></label>
      </div>

      <div className="editor-section">
        <div className="editor-section-heading"><span>School at a glance</span><p>Edit the statistics displayed directly below the hero.</p></div>
        <label>Section heading<Input value={draft.schoolGlanceHeading} onChange={(event) => updateField("schoolGlanceHeading", event.target.value)} required /></label>
        <div className="editable-card-grid">
          {draft.schoolStats.map((stat, index) => (
            <fieldset className="editable-card" key={index}>
              <legend>Statistic {index + 1}</legend>
              <label>Value<Input value={stat.value} onChange={(event) => updateStat(index, { value: event.target.value })} required /></label>
              <label>Label<Input value={stat.label} onChange={(event) => updateStat(index, { label: event.target.value })} required /></label>
            </fieldset>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-section-heading"><span>Quick actions</span><p>Manage the four cards that guide visitors through the website.</p></div>
        <label>Section kicker<Input value={draft.tasksKicker} onChange={(event) => updateField("tasksKicker", event.target.value)} required /></label>
        <label>Section heading<Input value={draft.tasksHeading} onChange={(event) => updateField("tasksHeading", event.target.value)} required /></label>
        <label>Section introduction<Input value={draft.tasksIntro} onChange={(event) => updateField("tasksIntro", event.target.value)} required /></label>
        <div className="editable-card-grid">
          {draft.tasks.map((task, index) => (
            <fieldset className="editable-card" key={index}>
              <legend>Quick action {index + 1}</legend>
              <label>Number<Input value={task.number} onChange={(event) => updateTask(index, { number: event.target.value })} required /></label>
              <label>Title<Input value={task.title} onChange={(event) => updateTask(index, { title: event.target.value })} required /></label>
              <label>Description<textarea value={task.description} onChange={(event) => updateTask(index, { description: event.target.value })} rows={3} required /></label>
              <label>Action label<Input value={task.action} onChange={(event) => updateTask(index, { action: event.target.value })} required /></label>
            </fieldset>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-section-heading"><span>School story</span><p>Your positioning and educational principles.</p></div>
        <label>Section kicker<Input value={draft.storyKicker} onChange={(event) => updateField("storyKicker", event.target.value)} required /></label>
        <label>Section heading<Input value={draft.schoolHeading} onChange={(event) => updateField("schoolHeading", event.target.value)} maxLength={90} required /></label>
        <label>School introduction<textarea value={draft.schoolIntro} onChange={(event) => updateField("schoolIntro", event.target.value)} rows={5} maxLength={360} required /></label>
        <label>Faculty action label<Input value={draft.schoolStoryAction} onChange={(event) => updateField("schoolStoryAction", event.target.value)} required /></label>
        <div className="editable-card-grid">
          {draft.principles.map((principle, index) => (
            <fieldset className="editable-card" key={index}>
              <legend>Principle {index + 1}</legend>
              <label>Marker<Input value={principle.marker} onChange={(event) => updatePrinciple(index, { marker: event.target.value })} required /></label>
              <label>Title<Input value={principle.title} onChange={(event) => updatePrinciple(index, { title: event.target.value })} required /></label>
              <label>Description<textarea value={principle.description} onChange={(event) => updatePrinciple(index, { description: event.target.value })} rows={3} required /></label>
            </fieldset>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-section-heading"><span>Academic pathway</span><p>Edit the academic stages shown on the homepage.</p></div>
        <label>Section kicker<Input value={draft.academicsKicker} onChange={(event) => updateField("academicsKicker", event.target.value)} required /></label>
        <label>Section heading<Input value={draft.academicsHeading} onChange={(event) => updateField("academicsHeading", event.target.value)} required /></label>
        <label>Section introduction<textarea value={draft.academicsIntro} onChange={(event) => updateField("academicsIntro", event.target.value)} rows={3} required /></label>
        <div className="editable-card-grid">
          {draft.academicLevels.map((level, index) => (
            <fieldset className="editable-card" key={index}>
              <legend>Academic stage {index + 1}</legend>
              <label>Classes<Input value={level.classes} onChange={(event) => updateAcademicLevel(index, { classes: event.target.value })} required /></label>
              <label>Title<Input value={level.title} onChange={(event) => updateAcademicLevel(index, { title: event.target.value })} required /></label>
              <label>Description<textarea value={level.description} onChange={(event) => updateAcademicLevel(index, { description: event.target.value })} rows={3} required /></label>
              <label>Action label<Input value={level.action} onChange={(event) => updateAcademicLevel(index, { action: event.target.value })} required /></label>
            </fieldset>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <div className="editor-section-heading"><span>Latest updates</span><p>Documents are managed separately under Notices & results.</p></div>
        <div className="form-grid-two">
          <label>Section kicker<Input value={draft.updatesKicker} onChange={(event) => updateField("updatesKicker", event.target.value)} required /></label>
          <label>Action label<Input value={draft.updatesAction} onChange={(event) => updateField("updatesAction", event.target.value)} required /></label>
        </div>
        <label>Section heading<Input value={draft.updatesHeading} onChange={(event) => updateField("updatesHeading", event.target.value)} required /></label>
      </div>

      <div className="editor-section">
        <div className="editor-section-heading"><span>Admissions content</span><p>Contact details, section copy, benefits, and enquiry form labels.</p></div>
        <div className="form-grid-two">
          <label>Phone number<Input value={draft.phone} onChange={(event) => updateField("phone", event.target.value)} type="tel" required /></label>
          <label>Admission year<Input value={draft.admissionYear} onChange={(event) => updateField("admissionYear", event.target.value)} required /></label>
        </div>
        <label>Admissions heading<Input value={draft.admissionsHeading} onChange={(event) => updateField("admissionsHeading", event.target.value)} required /></label>
        <label>Admissions introduction<textarea value={draft.admissionsIntro} onChange={(event) => updateField("admissionsIntro", event.target.value)} rows={4} required /></label>
        <div className="editable-card-grid">
          {draft.admissionBenefits.map((benefit, index) => (
            <label key={index}>Benefit {index + 1}<Input value={benefit} onChange={(event) => updateStringItem("admissionBenefits", index, event.target.value)} required /></label>
          ))}
        </div>
        <div className="form-grid-two">
          <label>Form heading<Input value={draft.inquiryTitle} onChange={(event) => updateField("inquiryTitle", event.target.value)} required /></label>
          <label>Required-fields note<Input value={draft.inquiryRequiredNote} onChange={(event) => updateField("inquiryRequiredNote", event.target.value)} required /></label>
          <label>Guardian field label<Input value={draft.guardianLabel} onChange={(event) => updateField("guardianLabel", event.target.value)} required /></label>
          <label>Guardian placeholder<Input value={draft.guardianPlaceholder} onChange={(event) => updateField("guardianPlaceholder", event.target.value)} required /></label>
          <label>Phone field label<Input value={draft.phoneLabel} onChange={(event) => updateField("phoneLabel", event.target.value)} required /></label>
          <label>Phone placeholder<Input value={draft.phonePlaceholder} onChange={(event) => updateField("phonePlaceholder", event.target.value)} required /></label>
          <label>Class field label<Input value={draft.classLabel} onChange={(event) => updateField("classLabel", event.target.value)} required /></label>
          <label>Class placeholder<Input value={draft.classPlaceholder} onChange={(event) => updateField("classPlaceholder", event.target.value)} required /></label>
        </div>
        <div className="editable-card-grid">
          {draft.classLevels.map((level, index) => (
            <label key={index}>Class option {index + 1}<Input value={level} onChange={(event) => updateStringItem("classLevels", index, event.target.value)} required /></label>
          ))}
        </div>
        <label>Submit button label<Input value={draft.inquirySubmitLabel} onChange={(event) => updateField("inquirySubmitLabel", event.target.value)} required /></label>
        <div className="form-grid-two">
          <label>Submitting button label<Input value={draft.inquirySubmittingLabel} onChange={(event) => updateField("inquirySubmittingLabel", event.target.value)} required /></label>
          <label>Received button label<Input value={draft.inquiryReceivedLabel} onChange={(event) => updateField("inquiryReceivedLabel", event.target.value)} required /></label>
        </div>
        <label>Consent message<textarea value={draft.inquiryConsentText} onChange={(event) => updateField("inquiryConsentText", event.target.value)} rows={2} required /></label>
        <label>Success message<textarea value={draft.inquirySuccessText} onChange={(event) => updateField("inquirySuccessText", event.target.value)} rows={2} required /></label>
      </div>

      <div className="editor-section">
        <div className="editor-section-heading"><span>Footer</span><p>School summary and public contact information.</p></div>
        <label>Footer summary<textarea value={draft.footerSummary} onChange={(event) => updateField("footerSummary", event.target.value)} rows={3} required /></label>
        <div className="form-grid-two">
          <label>Explore heading<Input value={draft.footerExploreHeading} onChange={(event) => updateField("footerExploreHeading", event.target.value)} required /></label>
          <label>Families heading<Input value={draft.footerFamiliesHeading} onChange={(event) => updateField("footerFamiliesHeading", event.target.value)} required /></label>
          <label>Results link label<Input value={draft.footerResultsLabel} onChange={(event) => updateField("footerResultsLabel", event.target.value)} required /></label>
          <label>Contact heading<Input value={draft.footerContactHeading} onChange={(event) => updateField("footerContactHeading", event.target.value)} required /></label>
          <label>Email address<Input value={draft.email} onChange={(event) => updateField("email", event.target.value)} type="email" required /></label>
          <label>Address line 1<Input value={draft.addressLineOne} onChange={(event) => updateField("addressLineOne", event.target.value)} required /></label>
          <label>Address line 2<Input value={draft.addressLineTwo} onChange={(event) => updateField("addressLineTwo", event.target.value)} required /></label>
        </div>
        <label>Copyright line<Input value={draft.copyright} onChange={(event) => updateField("copyright", event.target.value)} required /></label>
      </div>
    </>
  );
}
