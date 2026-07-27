import type { CSSProperties } from "react";

import type { AdmissionEnquiry } from "@/features/admissions/domain/admission-enquiry";

interface AdmissionEnquiryEmailProps {
  enquiry: AdmissionEnquiry;
  submittedAt: Date;
}

const styles: Record<string, CSSProperties> = {
  body: {
    margin: 0,
    padding: "32px 16px",
    backgroundColor: "#edf3f6",
    color: "#334e68",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    overflow: "hidden",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
  },
  header: {
    padding: "28px 32px",
    backgroundColor: "#0a1f33",
    color: "#ffffff",
  },
  eyebrow: {
    margin: "0 0 8px",
    color: "#7cc3ed",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  heading: {
    margin: 0,
    fontSize: "24px",
    lineHeight: 1.3,
  },
  content: {
    padding: "28px 32px 32px",
  },
  intro: {
    margin: "0 0 24px",
    fontSize: "15px",
    lineHeight: 1.6,
  },
  label: {
    margin: "0 0 5px",
    color: "#627d98",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.7px",
    textTransform: "uppercase",
  },
  value: {
    margin: "0 0 20px",
    color: "#102a43",
    fontSize: "16px",
    lineHeight: 1.5,
  },
  phone: {
    color: "#1f5f8b",
    fontWeight: 700,
  },
  footer: {
    margin: "8px 0 0",
    paddingTop: "20px",
    borderTop: "1px solid #d9e2ec",
    color: "#829ab1",
    fontSize: "12px",
    lineHeight: 1.5,
  },
};

export function AdmissionEnquiryEmail({
  enquiry,
  submittedAt,
}: AdmissionEnquiryEmailProps) {
  return (
    <div style={styles.body}>
      <div style={styles.card}>
        <div style={styles.header}>
          <p style={styles.eyebrow}>Admissions enquiry</p>
          <h1 style={styles.heading}>A family has requested a call</h1>
        </div>
        <div style={styles.content}>
          <p style={styles.intro}>
            A new admission enquiry was submitted through the EduCanvas
            website. Please contact the family within one school day.
          </p>

          <p style={styles.label}>Parent or guardian</p>
          <p style={styles.value}>{enquiry.guardianName}</p>

          <p style={styles.label}>Phone number</p>
          <p style={styles.value}>
            <a
              href={`tel:${enquiry.phone.replace(/[^+\d]/g, "")}`}
              style={styles.phone}
            >
              {enquiry.phone}
            </a>
          </p>

          <p style={styles.label}>Interested class</p>
          <p style={styles.value}>{enquiry.classLevel}</p>

          <p style={styles.footer}>
            Submitted on{" "}
            {submittedAt.toLocaleString("en-BD", {
              dateStyle: "long",
              timeStyle: "short",
              timeZone: "Asia/Dhaka",
            })}{" "}
            (Bangladesh time).
          </p>
        </div>
      </div>
    </div>
  );
}
