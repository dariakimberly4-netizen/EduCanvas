"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SubmissionState = "idle" | "submitting" | "success" | "error";

interface AdmissionApiResponse {
  ok: boolean;
  message?: string;
}

export function AdmissionInquiry() {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const [statusMessage, setStatusMessage] = useState(
    "By continuing, you agree that our admissions office may contact you about this enquiry.",
  );

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
      setStatusMessage(
        "Our admissions office will contact you within one school day.",
      );
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
          <p className="overline">Admissions 2026–27</p>
          <h2>See whether Shapla Grove is right for your child.</h2>
          <p>Tell us which class you are considering. Our admissions team will call you to explain availability, requirements, fees, and the next campus visit.</p>
          <ul><li>No application fee for an initial enquiry</li><li>Response within one school day</li><li>Campus visits available Sunday–Thursday</li></ul>
        </div>
        <form className="inquiry-form" onSubmit={handleSubmit}>
          <div className="form-heading"><h3>Request admission information</h3><p>Fields marked * are required.</p></div>
          <label>Parent or guardian name *<Input name="guardianName" required minLength={2} maxLength={80} autoComplete="name" placeholder="Enter your full name" /></label>
          <label>Phone number *<Input name="phone" type="tel" required minLength={8} maxLength={25} autoComplete="tel" placeholder="+880 1XXX XXXXXX" /></label>
          <label>Class you are interested in *
            <select name="classLevel" required defaultValue="">
              <option value="" disabled>Select a class level</option>
              <option>Playgroup–KG</option><option>Classes I–V</option><option>Classes VI–X</option><option>Classes XI–XII</option>
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
              ? "Enquiry received"
              : isSubmitting
                ? "Sending enquiry…"
                : "Request a call from admissions"}
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
