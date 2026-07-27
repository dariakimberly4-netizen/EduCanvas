import Link from "next/link";

import type { AdminView } from "@/features/admin/domain/admin-view";
import type { SchoolContent } from "@/features/school/domain/types";

interface AdminOverviewProps {
  content: SchoolContent;
  openView: (view: AdminView) => void;
}

export function AdminOverview({ content, openView }: AdminOverviewProps) {
  const facultyCount = content.faculty.filter((item) => item.status === "Published").length;
  const noticeCount = content.documents.filter((item) => item.type === "Notice" && item.status === "Published").length;
  const resultCount = content.documents.filter((item) => item.type === "Result" && item.status === "Published").length;

  return (
    <>
      <div className="admin-welcome">
        <div><p className="overline">Website overview</p><h2 id="overview-title">Everything families see, managed in one place.</h2><p>Update the school landing page, maintain faculty profiles, and publish notice or result PDFs. Published changes appear on the public prototype immediately.</p></div>
        <Link className="button button-secondary" href="/" target="_blank">Preview public website</Link>
      </div>
      <div className="workflow-note">
        <span>How publishing works</span>
        <ol><li><b>1</b>Edit content</li><li><b>2</b>Review the preview</li><li><b>3</b>Publish to the website</li></ol>
      </div>
      <section className="admin-actions" aria-labelledby="manage-title">
        <div className="admin-section-title"><div><p className="overline">Website areas</p><h2 id="manage-title">What do you want to manage?</h2></div><p>Choose an area to begin.</p></div>
        <div className="management-grid">
          <button type="button" onClick={() => openView("landing")}><span>Landing page</span><h3>School information</h3><p>Hero message, admissions information, mission, and contact details.</p><strong>Edit landing page →</strong></button>
          <button type="button" onClick={() => openView("faculty")}><span>Faculty</span><h3>Teacher profiles</h3><p>Add or update names, roles, subjects, experience, and profile status.</p><strong>Manage <i>{facultyCount}</i> profiles →</strong></button>
          <button type="button" onClick={() => openView("documents")}><span>Notices</span><h3>School notices</h3><p>Publish examination, holiday, event, and parent notice PDFs.</p><strong>Publish a notice →</strong></button>
          <button type="button" onClick={() => openView("documents")}><span>Results</span><h3>Student results</h3><p>Publish verified term, model test, SSC, and HSC result PDFs.</p><strong>Publish results →</strong></button>
        </div>
      </section>
      <section className="admin-health">
        <div className="admin-section-title"><div><p className="overline">Website status</p><h2>Published content</h2></div><p>Landing page published {content.landing.publishedAt}</p></div>
        <div className="admin-summary">
          <article><span>Notices</span><strong>{noticeCount}</strong><small><i /> Published documents</small></article>
          <article><span>Faculty profiles</span><strong>{facultyCount}</strong><small><i /> Published profiles</small></article>
          <article><span>Result documents</span><strong>{resultCount}</strong><small><i /> Published documents</small></article>
          <article><span>Landing page</span><strong className="text-status">Up to date</strong><small><i /> Public website</small></article>
        </div>
      </section>
      <section className="activity-panel">
        <div className="admin-section-title"><div><p className="overline">Recent activity</p><h2>Latest website changes</h2></div></div>
        <div className="activity-list">
          {content.activity.map((item, index) => (
            <article key={`${item.action}-${item.time}-${index}`}><span className="activity-icon">{index === 0 ? "✓" : "↻"}</span><div><strong>{item.action}</strong><p>{item.item}</p></div><time>{item.time}</time></article>
          ))}
        </div>
      </section>
    </>
  );
}
