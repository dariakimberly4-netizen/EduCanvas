"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSchoolContent } from "@/features/school/lib/content-store";

type SubmissionState = "idle" | "submitting" | "success" | "error";

interface AdmissionApiResponse {
  ok: boolean;
  message?: string;
}

export function AdmissionInquiry() {
  const { landing } = useSchoolContent().content;
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const [statusMessage, setStatusMessage] = useState(landing.inquiryConsentText);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmissionState("submitting");
    setStatusMessage("Sending your enquiry securely…");

    try {
      const response = await fetch("/api/admission-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guardianName: formData.get("guardianName"),
          phone: formData.get("phone"),
          classLevel: formData.get("classLevel"),
          website: formData.get("website"),
        }),
      });
      const result = (await response.json()) as AdmissionApiResponse;

      if (!response.ok || !result.ok) {
        throw new Error(
          result.message ?? "We could not send your enquiry. Please try again.",
        );
      }

      form.reset();
      setSubmissionState("success");
      setStatusMessage(landing.inquirySuccessText);
    } catch (error) {
      setSubmissionState("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "We could not send your enquiry. Please try again.",
      );
    }
  }

  const isSubmitting = submissionState === "submitting";

  return (
    <section className="admissions-section" id="admissions">
      <div className="shell admissions-layout">
        <div>
          <p className="overline">Admissions {landing.admissionYear}</p>
          <h2>{landing.admissionsHeading}</h2>
          <p>{landing.admissionsIntro}</p>
          <ul>{landing.admissionBenefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
        </div>
        <form className="inquiry-form" onSubmit={handleSubmit}>
          <div className="form-heading"><h3>{landing.inquiryTitle}</h3><p>{landing.inquiryRequiredNote}</p></div>
          <label>{landing.guardianLabel} *<Input name="guardianName" required minLength={2} maxLength={80} autoComplete="name" placeholder={landing.guardianPlaceholder} /></label>
          <label>{landing.phoneLabel} *<Input name="phone" type="tel" required minLength={8} maxLength={25} autoComplete="tel" placeholder={landing.phonePlaceholder} /></label>
          <label>{landing.classLabel} *
            <select name="classLevel" required defaultValue="">
              <option value="" disabled>{landing.classPlaceholder}</option>
              {landing.classLevels.map((level) => <option key={level}>{level}</option>)}
            </select>
          </label>
          <div className="form-honeypot" aria-hidden="true">
            <label>
              Website
              <Input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <Button className="button button-primary" type="submit" disabled={isSubmitting}>
            {submissionState === "success"
              ? landing.inquiryReceivedLabel
              : isSubmitting
                ? landing.inquirySubmittingLabel
                : landing.inquirySubmitLabel}
          </Button>
          <small
            className={submissionState === "error" ? "form-status error" : "form-status"}
            role={submissionState === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {statusMessage}
          </small>
        </form>
      </div>
    </section>
  );
}
