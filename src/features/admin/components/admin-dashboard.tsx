"use client";

import Link from "next/link";
import { useState } from "react";

import { Brand } from "@/components/site/brand";
import { AdminAdmissionEnquiries } from "@/features/admin/components/admin-admission-enquiries";
import { AdminDocuments } from "@/features/admin/components/admin-documents";
import { AdminFaculty } from "@/features/admin/components/admin-faculty";
import { AdminLanding } from "@/features/admin/components/admin-landing";
import { AdminOverview } from "@/features/admin/components/admin-overview";
import { adminViewTitles, type AdminView } from "@/features/admin/domain/admin-view";
import { AdminAccount } from "@/features/auth/components/admin-account";
import type { AdminUser } from "@/features/auth/domain/admin-user";
import { useSchoolContent } from "@/features/school/lib/content-store";

const navigation: { view: AdminView; label: string; icon: string }[] = [
  { view: "overview", label: "Overview", icon: "⌂" },
  { view: "landing", label: "Landing page", icon: "✎" },
  { view: "faculty", label: "Faculty profiles", icon: "♙" },
  { view: "documents", label: "Notices & results", icon: "□" },
  { view: "enquiries", label: "Admission enquiries", icon: "✉" },
];

export function AdminDashboard({ user }: { user: AdminUser }) {
  const { content, isSaving, updateContent } = useSchoolContent();
  const [view, setView] = useState<AdminView>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);
  const [kicker, title] = adminViewTitles[view];

  function openView(nextView: AdminView) {
    setView(nextView);
    setSidebarOpen(false);
    window.history.replaceState(null, "", `#${nextView}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showToast(titleText: string, message: string) {
    setToast({ title: titleText, message });
    window.setTimeout(() => setToast(null), 4200);
  }

  return (
    <div className="admin-body">
      <aside className={`admin-sidebar${sidebarOpen ? " mobile-open" : ""}`} id="admin-sidebar">
        <Brand light admin />
        <nav aria-label="Admin navigation">
          <p>Workspace</p>
          {navigation.map((item) => (
            <Link
              className={view === item.view ? "active" : undefined}
              href={`#${item.view}`}
              onClick={(event) => { event.preventDefault(); openView(item.view); }}
              key={item.view}
            >
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-help"><strong>Live publishing</strong><p>Content is stored in MongoDB. Images and documents are stored in Google Drive.</p></div>
        <Link className="back-site" href="/" target="_blank">↗ View public website</Link>
      </aside>
      <button
        className={`admin-sidebar-backdrop${sidebarOpen ? " show" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close admin menu"
        type="button"
      />

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="mobile-admin-menu" onClick={() => setSidebarOpen(true)} aria-label="Open admin menu">☰</button>
          <div><p>{kicker}</p><h1>{title}</h1></div>
          <div className="admin-top-actions">
            <span className="save-state"><i />{isSaving ? "Saving changes…" : "All changes saved"}</span>
            <Link className="preview-site" href="/" target="_blank">Preview website ↗</Link>
            <AdminAccount user={user} />
          </div>
        </header>

        <section className={`admin-view${view === "overview" ? " active" : ""}`} aria-labelledby="overview-title">
          <AdminOverview content={content} openView={openView} />
        </section>
        <section className={`admin-view${view === "landing" ? " active" : ""}`} aria-labelledby="landing-title">
          <AdminLanding key={content.landing.publishedAt} content={content} updateContent={updateContent} notify={showToast} />
        </section>
        <section className={`admin-view${view === "faculty" ? " active" : ""}`} aria-labelledby="faculty-title">
          <AdminFaculty content={content} updateContent={updateContent} notify={showToast} />
        </section>
        <section className={`admin-view${view === "documents" ? " active" : ""}`} aria-labelledby="documents-title">
          <AdminDocuments content={content} updateContent={updateContent} notify={showToast} />
        </section>
        <section className={`admin-view${view === "enquiries" ? " active" : ""}`} aria-labelledby="enquiries-title">
          <AdminAdmissionEnquiries />
        </section>
      </main>

      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
        <span>✓</span><div><strong>{toast?.title ?? "Published"}</strong><p>{toast?.message ?? "Your changes are now visible."}</p></div>
        <button onClick={() => setToast(null)} aria-label="Dismiss notification">×</button>
      </div>
    </div>
  );
}
