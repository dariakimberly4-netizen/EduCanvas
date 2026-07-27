"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { HeroSlide, LandingContent, SchoolContent } from "@/features/school/domain/types";

interface AdminLandingProps {
  content: SchoolContent;
  updateContent: (content: SchoolContent) => void;
  notify: (title: string, message: string) => void;
}

const editableFields: { key: keyof LandingContent; label: string }[] = [
  { key: "admissionStatus", label: "Admission status" },
  { key: "schoolDescriptor", label: "School description" },
  { key: "heroTitle", label: "Main heading" },
  { key: "heroSummary", label: "Introduction" },
  { key: "phone", label: "Phone number" },
  { key: "admissionYear", label: "Admission year" },
  { key: "schoolHeading", label: "School story heading" },
  { key: "schoolIntro", label: "School introduction" },
];

function formatPublishedAt() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date());
}

function formatActivityDate() {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());
}

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("The image could not be read."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export function AdminLanding({ content, updateContent, notify }: AdminLandingProps) {
  const [draft, setDraft] = useState(content.landing);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);

  const changes = useMemo(
    () => editableFields.filter(({ key }) => draft[key] !== content.landing[key]),
    [content.landing, draft],
  );
  const dirty = changes.length > 0;

  function updateField(key: keyof LandingContent, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function publishLanding() {
    const nextLanding = { ...draft, publishedAt: formatPublishedAt() };
    updateContent({
      ...content,
      landing: nextLanding,
      activity: [{ action: "Updated landing page", item: "School information", time: formatActivityDate() }, ...content.activity].slice(0, 8),
    });
    setDraft(nextLanding);
    setReviewOpen(false);
    notify("Landing page published", "Your changes are now visible on the public website.");
  }

  function updateSlides(slides: HeroSlide[], message: string) {
    updateContent({ ...content, heroSlides: slides });
    notify("Carousel updated", message);
  }

  function moveSlide(id: number, direction: -1 | 1) {
    const index = content.heroSlides.findIndex((slide) => slide.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= content.heroSlides.length) return;
    const slides = [...content.heroSlides];
    [slides[index], slides[target]] = [slides[target], slides[index]];
    updateSlides(slides, "The new slide order is visible on the home page.");
  }

  async function addSlide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (content.heroSlides.length >= 6) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("image");
    if (!(file instanceof File) || !file.size) return;
    const src = await readFile(file);
    const nextSlide: HeroSlide = {
      id: Date.now(),
      src,
      heading: String(data.get("heading")),
      supporting: String(data.get("supporting")),
      alt: String(data.get("alt")),
    };
    updateSlides([...content.heroSlides, nextSlide], "The new image was added to the home-page carousel.");
    form.reset();
  }

  return (
    <>
      <div className="workspace-heading">
        <div><p className="overline">Landing page</p><h2 id="landing-title">Edit school information</h2><p>Update the main information prospective families see when they visit the website.</p></div>
        <span className="publish-badge"><i />Currently published</span>
      </div>
      <ol className="stepper" aria-label="Publishing steps">
        <li className="active"><span>1</span><div><b>Edit content</b><small>Update the fields below</small></div></li>
        <li className={reviewOpen ? "active" : undefined}><span>2</span><div><b>Review changes</b><small>Check the live preview</small></div></li>
        <li><span>3</span><div><b>Publish</b><small>Make changes public</small></div></li>
      </ol>

      <div className="editor-layout">
        <form className="content-editor" onSubmit={(event) => { event.preventDefault(); setReviewOpen(true); }}>
          <div className="editor-section">
            <div className="editor-section-heading"><span>Hero section</span><p>The first information families see.</p></div>
            <label>Admission status<Input value={draft.admissionStatus} onChange={(event) => updateField("admissionStatus", event.target.value)} maxLength={60} required /></label>
            <label>School description line<Input value={draft.schoolDescriptor} onChange={(event) => updateField("schoolDescriptor", event.target.value)} maxLength={90} required /></label>
            <label>Main heading<textarea value={draft.heroTitle} onChange={(event) => updateField("heroTitle", event.target.value)} rows={3} maxLength={100} required /><small><b>{draft.heroTitle.length}</b>/100 characters</small></label>
            <label>Introduction<textarea value={draft.heroSummary} onChange={(event) => updateField("heroSummary", event.target.value)} rows={4} maxLength={240} required /><small><b>{draft.heroSummary.length}</b>/240 characters</small></label>
          </div>
          <div className="editor-section">
            <div className="editor-section-heading"><span>Admissions contact</span><p>How families contact the school.</p></div>
            <div className="form-grid-two">
              <label>Phone number<Input value={draft.phone} onChange={(event) => updateField("phone", event.target.value)} type="tel" required /></label>
              <label>Admission year<Input value={draft.admissionYear} onChange={(event) => updateField("admissionYear", event.target.value)} required /></label>
            </div>
          </div>
          <div className="editor-section">
            <div className="editor-section-heading"><span>School story</span><p>Your positioning on the public page.</p></div>
            <label>Section heading<Input value={draft.schoolHeading} onChange={(event) => updateField("schoolHeading", event.target.value)} maxLength={90} required /></label>
            <label>School introduction<textarea value={draft.schoolIntro} onChange={(event) => updateField("schoolIntro", event.target.value)} rows={5} maxLength={360} required /></label>
          </div>
          <div className="editor-actions">
            <span className={dirty ? "dirty" : undefined}>{dirty ? "You have unpublished changes" : "No unpublished changes"}</span>
            <Button className="button button-secondary" onClick={() => setDraft(content.landing)} type="button">Discard changes</Button>
            <Button className="button button-primary" type="submit">Review changes</Button>
          </div>
        </form>

        <aside className="live-preview">
          <div className="preview-toolbar"><div><span /><span /><span /></div><b>Live preview</b><button onClick={() => setMobilePreview((value) => !value)} type="button">{mobilePreview ? "Desktop view" : "Mobile view"}</button></div>
          <div className={`preview-frame${mobilePreview ? " mobile" : ""}`}>
            <div className="mini-nav"><b>Shapla Grove</b><span>Admissions</span></div>
            <div className="mini-hero">
              <small>{draft.admissionStatus}</small><p>{draft.schoolDescriptor}</p><h3>{draft.heroTitle}</h3><p>{draft.heroSummary}</p><button type="button">Start an admission enquiry</button>
            </div>
          </div>
          <p className="preview-help">This preview updates as you type. Use “Review changes” before publishing.</p>
        </aside>
      </div>

      <section className="carousel-manager" aria-labelledby="carousel-manager-title">
        <div className="carousel-manager-heading">
          <div><p className="overline">Hero carousel</p><h2 id="carousel-manager-title">Manage carousel images</h2><p>Images appear in this order on the Home page. Add up to six landscape images.</p></div>
          <span><b>{content.heroSlides.length}</b>/6 images</span>
        </div>
        <div className="carousel-admin-layout">
          <div className="slide-manager-list">
            {content.heroSlides.map((slide, index) => (
              <article className="slide-manager-item" key={slide.id}>
                <div className="slide-thumbnail"><Image src={slide.src} alt="" width={112} height={64} unoptimized={slide.src.startsWith("data:")} /></div>
                <div className="slide-details"><span>Slide {index + 1}</span><strong>{slide.heading}</strong><small>{slide.supporting || "No supporting line"}</small></div>
                <div className="slide-order">
                  <button type="button" onClick={() => moveSlide(slide.id, -1)} aria-label={`Move slide ${index + 1} earlier`} disabled={index === 0}>↑</button>
                  <button type="button" onClick={() => moveSlide(slide.id, 1)} aria-label={`Move slide ${index + 1} later`} disabled={index === content.heroSlides.length - 1}>↓</button>
                </div>
                <button className="slide-remove" type="button" onClick={() => updateSlides(content.heroSlides.filter((item) => item.id !== slide.id), "The image was removed from the carousel.")} disabled={content.heroSlides.length === 1}>Remove</button>
              </article>
            ))}
          </div>
          <form className={`slide-upload-form${content.heroSlides.length >= 6 ? " at-limit" : ""}`} onSubmit={addSlide}>
            <div><h3>Add a carousel image</h3><p>The image is resized for the prototype before it is saved.</p></div>
            <label className="image-drop">
              <input name="image" type="file" accept="image/jpeg,image/png,image/webp" required />
              <span>＋</span><strong>Choose a landscape image</strong><small>JPG, PNG or WebP · Maximum 8 MB</small>
            </label>
            <label>Slide heading *<Input name="heading" maxLength={70} placeholder="Example: Learning beyond the classroom" required /></label>
            <label>Supporting line<Input name="supporting" maxLength={100} placeholder="Example: Clubs · Sport · Creative arts" /></label>
            <label>Image description *<textarea name="alt" rows={3} maxLength={160} placeholder="Describe what is visible for screen-reader users" required /></label>
            <Button className="button button-primary" type="submit" disabled={content.heroSlides.length >= 6}>{content.heroSlides.length >= 6 ? "Carousel is full" : "Add image to carousel"}</Button>
          </form>
        </div>
      </section>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="admin-dialog review-dialog !max-w-[700px] !gap-0 !rounded-[7px] !p-0" showCloseButton={false}>
          <form onSubmit={(event) => { event.preventDefault(); publishLanding(); }}>
            <div className="dialog-heading"><div><p className="overline">Review changes</p><DialogTitle>Publish landing-page updates?</DialogTitle></div><DialogClose asChild><button type="button" aria-label="Close review">×</button></DialogClose></div>
            <DialogDescription className="sr-only">Review and publish changes to the public landing page.</DialogDescription>
            <div className="change-summary">
              {changes.length ? changes.map(({ key, label }) => <article key={key}><span>{label}</span><p>{draft[key]}</p></article>) : <p className="no-changes">No changes were made.</p>}
            </div>
            <p className="review-note">Publishing will replace the current landing-page content and make these changes visible on the public prototype.</p>
            <div className="dialog-actions"><DialogClose asChild><Button className="button button-secondary" type="button">Continue editing</Button></DialogClose><Button className="button button-primary" type="submit">Publish changes</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
