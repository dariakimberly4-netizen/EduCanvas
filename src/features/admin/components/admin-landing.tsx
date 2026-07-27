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
import { AdminHomeContentFields } from "@/features/admin/components/admin-home-content-fields";
import type { HeroSlide, SchoolContent } from "@/features/school/domain/types";
import { resolveStoredAssetUrl } from "@/features/storage/domain/asset-url";
import {
  deleteAsset,
  uploadAsset,
} from "@/features/storage/lib/asset-client";
import { useFilePreview } from "@/features/storage/lib/use-file-preview";

interface AdminLandingProps {
  content: SchoolContent;
  updateContent: (content: SchoolContent) => Promise<void>;
  notify: (title: string, message: string) => void;
}

function formatPublishedAt() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date());
}

export function AdminLanding({ content, updateContent, notify }: AdminLandingProps) {
  const [draft, setDraft] = useState(content.landing);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [pendingSlideDelete, setPendingSlideDelete] = useState<HeroSlide | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const {
    preview: selectedImage,
    selectFile: selectImage,
    clearPreview: clearImagePreview,
  } = useFilePreview();

  const changes = useMemo(
    () => JSON.stringify(draft) === JSON.stringify(content.landing)
      ? []
      : [{ label: "Homepage content", value: "One or more homepage sections were updated." }],
    [content.landing, draft],
  );
  const dirty = changes.length > 0;

  async function publishLanding() {
    const nextLanding = { ...draft, publishedAt: formatPublishedAt() };
    try {
      await updateContent({
        ...content,
        landing: nextLanding,
      });
      setDraft(nextLanding);
      setReviewOpen(false);
      notify("Landing page published", "Your changes are now visible on the public website.");
    } catch (error) {
      notify("Publishing failed", error instanceof Error ? error.message : "The landing page could not be saved.");
    }
  }

  async function updateSlides(slides: HeroSlide[], message: string) {
    await updateContent({ ...content, heroSlides: slides });
    notify("Carousel updated", message);
  }

  async function moveSlide(id: number, direction: -1 | 1) {
    const index = content.heroSlides.findIndex((slide) => slide.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= content.heroSlides.length) return;
    const slides = [...content.heroSlides];
    [slides[index], slides[target]] = [slides[target], slides[index]];
    try {
      await updateSlides(slides, "The new slide order is visible on the home page.");
    } catch (error) {
      notify("Carousel update failed", error instanceof Error ? error.message : "The slide order could not be saved.");
    }
  }

  async function addSlide(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (content.heroSlides.length >= 6) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("image");
    if (!(file instanceof File) || !file.size) return;
    let uploadedFileId: string | undefined;
    setIsUploadingImage(true);

    try {
      const uploaded = await uploadAsset(file, "image");
      uploadedFileId = uploaded.fileId;
      const nextSlide: HeroSlide = {
        id: Date.now(),
        src: uploaded.directUrl,
        heading: String(data.get("heading")),
        supporting: String(data.get("supporting")),
        alt: String(data.get("alt")),
        storageFileId: uploaded.fileId,
      };
      await updateSlides([...content.heroSlides, nextSlide], "The new image was added to the home-page carousel.");
      form.reset();
      clearImagePreview();
    } catch (error) {
      if (uploadedFileId) {
        await deleteAsset(uploadedFileId).catch(() => undefined);
      }
      notify("Image upload failed", error instanceof Error ? error.message : "The carousel image could not be uploaded.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function removeSlide() {
    if (!pendingSlideDelete) return;

    try {
      await updateSlides(
        content.heroSlides.filter((item) => item.id !== pendingSlideDelete.id),
        "The image was removed from the carousel.",
      );
      setPendingSlideDelete(null);
    } catch (error) {
      notify("Image removal failed", error instanceof Error ? error.message : "The carousel image could not be removed.");
    }
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
          <AdminHomeContentFields draft={draft} onChange={setDraft} />
          <div className="editor-actions">
            <span className={dirty ? "dirty" : undefined}>{dirty ? "You have unpublished changes" : "No unpublished changes"}</span>
            <Button className="button button-secondary" onClick={() => setDraft(content.landing)} type="button">Discard changes</Button>
            <Button className="button button-primary" type="submit">Review changes</Button>
          </div>
        </form>

        <aside className="live-preview">
          <div className="preview-toolbar"><div><span /><span /><span /></div><b>Live preview</b><button onClick={() => setMobilePreview((value) => !value)} type="button">{mobilePreview ? "Desktop view" : "Mobile view"}</button></div>
          <div className={`preview-frame${mobilePreview ? " mobile" : ""}`}>
            <div className="mini-nav"><b>{draft.brandName}</b><span>{draft.navigationLabels.admissions}</span></div>
            <div className="mini-hero">
              <small>{draft.admissionStatus}</small><p>{draft.schoolDescriptor}</p><h3>{draft.heroTitle}</h3><p>{draft.heroSummary}</p><button type="button">{draft.heroPrimaryAction}</button>
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
                <div className="slide-thumbnail"><Image src={resolveStoredAssetUrl(slide.storageFileId, slide.src)} alt="" width={112} height={64} unoptimized={!slide.isLocalAsset} /></div>
                <div className="slide-details"><span>Slide {index + 1}</span><strong>{slide.heading}</strong><small>{slide.supporting || "No supporting line"}</small></div>
                <div className="slide-order">
                  <button type="button" onClick={() => moveSlide(slide.id, -1)} aria-label={`Move slide ${index + 1} earlier`} disabled={index === 0}>↑</button>
                  <button type="button" onClick={() => moveSlide(slide.id, 1)} aria-label={`Move slide ${index + 1} later`} disabled={index === content.heroSlides.length - 1}>↓</button>
                </div>
                <button className="slide-remove" type="button" onClick={() => setPendingSlideDelete(slide)} disabled={content.heroSlides.length === 1}>Remove</button>
              </article>
            ))}
          </div>
          <form className={`slide-upload-form${content.heroSlides.length >= 6 ? " at-limit" : ""}`} onSubmit={addSlide}>
            <div><h3>Add a carousel image</h3><p>The image is stored securely in the configured Google Drive folder.</p></div>
            <label className="image-drop">
              <input
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  selectImage(event.target.files?.[0] ?? null)
                }
                required
              />
              <span>＋</span><strong>Choose a landscape image</strong><small>JPG, PNG or WebP · Maximum 8 MB</small>
              {selectedImage && (
                <div
                  className="selected-image-preview"
                  role="img"
                  aria-label={`Preview of ${selectedImage.fileName}`}
                  style={{ backgroundImage: `url("${selectedImage.url}")` }}
                >
                  <span>{selectedImage.fileName} · Click to change</span>
                </div>
              )}
            </label>
            <label>Slide heading *<Input name="heading" maxLength={70} placeholder="Example: Learning beyond the classroom" required /></label>
            <label>Supporting line<Input name="supporting" maxLength={100} placeholder="Example: Clubs · Sport · Creative arts" /></label>
            <label>Image description *<textarea name="alt" rows={3} maxLength={160} placeholder="Describe what is visible for screen-reader users" required /></label>
            <Button className="button button-primary" type="submit" disabled={content.heroSlides.length >= 6 || isUploadingImage}>{content.heroSlides.length >= 6 ? "Carousel is full" : isUploadingImage ? "Uploading image…" : "Add image to carousel"}</Button>
          </form>
        </div>
      </section>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="admin-dialog review-dialog !max-w-[700px] !gap-0 !rounded-[7px] !p-0" showCloseButton={false}>
          <form onSubmit={(event) => { event.preventDefault(); publishLanding(); }}>
            <div className="dialog-heading"><div><p className="overline">Review changes</p><DialogTitle>Publish landing-page updates?</DialogTitle></div><DialogClose asChild><button type="button" aria-label="Close review">×</button></DialogClose></div>
            <DialogDescription className="sr-only">Review and publish changes to the public landing page.</DialogDescription>
            <div className="change-summary">
              {changes.length ? changes.map(({ label, value }) => <article key={label}><span>{label}</span><p>{value}</p></article>) : <p className="no-changes">No changes were made.</p>}
            </div>
            <p className="review-note">Publishing will replace the current landing-page content and make these changes visible on the public prototype.</p>
            <div className="dialog-actions"><DialogClose asChild><Button className="button button-secondary" type="button">Continue editing</Button></DialogClose><Button className="button button-primary" type="submit">Publish changes</Button></div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(pendingSlideDelete)}
        onOpenChange={(open) => !open && setPendingSlideDelete(null)}
      >
        <DialogContent
          className="admin-dialog confirm-dialog !max-w-[440px] !gap-0 !rounded-[7px] !p-0"
          showCloseButton={false}
        >
          <div className="confirm-dialog-inner">
            <span className="warning-icon" aria-hidden="true">!</span>
            <DialogTitle>Remove this carousel image?</DialogTitle>
            <DialogDescription>
              {pendingSlideDelete?.heading} will no longer appear on the
              homepage, and its image will be deleted from Google Drive. This
              action cannot be undone.
            </DialogDescription>
            <div className="dialog-actions">
              <DialogClose asChild>
                <Button className="button button-secondary" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="button button-danger"
                onClick={() => void removeSlide()}
                type="button"
              >
                Remove
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
