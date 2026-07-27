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
import type { FacultyMember, PublicationStatus, SchoolContent } from "@/features/school/domain/types";
import { resolveStoredAssetUrl } from "@/features/storage/domain/asset-url";
import {
  deleteAsset,
  uploadAsset,
} from "@/features/storage/lib/asset-client";
import { useFilePreview } from "@/features/storage/lib/use-file-preview";

interface AdminFacultyProps {
  content: SchoolContent;
  updateContent: (content: SchoolContent) => Promise<void>;
  notify: (title: string, message: string) => void;
}

const departments = ["Leadership", "Primary", "Science", "Mathematics", "Languages", "Humanities", "Creative Arts"];

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function AdminFaculty({ content, updateContent, notify }: AdminFacultyProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | PublicationStatus>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FacultyMember | null>(null);
  const [pendingDelete, setPendingDelete] = useState<FacultyMember | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const {
    preview: selectedImage,
    selectFile: selectImage,
    clearPreview: clearImagePreview,
  } = useFilePreview();

  const profiles = useMemo(() => content.faculty.filter((profile) => {
    const matchesQuery = `${profile.name} ${profile.role} ${profile.department} ${profile.subject}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (status === "all" || profile.status === status);
  }), [content.faculty, query, status]);

  function openEditor(profile: FacultyMember | null) {
    clearImagePreview();
    setEditing(profile);
    setDialogOpen(true);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const image = data.get("image");
    let uploadedFileId: string | undefined;
    setIsUploadingImage(true);

    try {
      const uploaded =
        image instanceof File && image.size
          ? await uploadAsset(image, "image")
          : null;
      uploadedFileId = uploaded?.fileId;
      const profile: FacultyMember = {
        id: editing?.id ?? Date.now(),
        name: String(data.get("name")),
        role: String(data.get("role")),
        department: String(data.get("department")),
        subject: String(data.get("subject")),
        experience: Number(data.get("experience")),
        status: String(data.get("status")) as PublicationStatus,
        bio: String(data.get("bio")),
        imageUrl: uploaded?.directUrl ?? editing?.imageUrl,
        imageStorageFileId:
          uploaded?.fileId ?? editing?.imageStorageFileId,
      };
      const faculty = editing
        ? content.faculty.map((item) =>
            item.id === editing.id ? profile : item,
          )
        : [...content.faculty, profile];

      await updateContent({
        ...content,
        faculty,
      });

      setDialogOpen(false);
      clearImagePreview();
      notify(editing ? "Profile updated" : "Profile added", `${profile.name} is ${profile.status.toLowerCase()} on the faculty page.`);
    } catch (error) {
      if (uploadedFileId) {
        await deleteAsset(uploadedFileId).catch(() => undefined);
      }
      notify("Profile save failed", error instanceof Error ? error.message : "The faculty profile could not be saved.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function deleteProfile() {
    if (!pendingDelete) return;
    try {
      await updateContent({
        ...content,
        faculty: content.faculty.filter((item) => item.id !== pendingDelete.id),
      });
      notify("Profile removed", `${pendingDelete.name} was removed from the teaching team.`);
      setPendingDelete(null);
    } catch (error) {
      notify("Profile removal failed", error instanceof Error ? error.message : "The faculty profile could not be removed.");
    }
  }

  return (
    <>
      <div className="workspace-heading workspace-heading-actions">
        <div><p className="overline">Faculty profiles</p><h2 id="faculty-title">Manage the teaching team</h2><p>Add, update, reorder, publish, or remove profiles shown on the Faculty page.</p></div>
        <Button className="button button-primary" onClick={() => openEditor(null)} type="button">+ Add faculty member</Button>
      </div>
      <div className="manager-toolbar">
        <label className="manager-search"><span>⌕</span><Input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search by name, role, or subject" /></label>
        <label>Status<select value={status} onChange={(event) => setStatus(event.target.value as "all" | PublicationStatus)}><option value="all">All profiles</option><option value="Published">Published</option><option value="Draft">Draft</option></select></label>
        <p><strong>{profiles.length}</strong> profiles shown</p>
      </div>
      <div className="data-panel">
        <div className="faculty-manager-head"><span>Faculty member</span><span>Department</span><span>Experience</span><span>Status</span><span>Actions</span></div>
        <div>
          {profiles.map((profile) => (
            <article className="faculty-manager-row" key={profile.id}>
              <div className="manager-person">
                <div className="manager-avatar">
                  {profile.imageUrl ? (
                    <Image
                      src={resolveStoredAssetUrl(
                        profile.imageStorageFileId,
                        profile.imageUrl,
                      )}
                      alt=""
                      width={38}
                      height={38}
                      unoptimized
                    />
                  ) : (
                    <span>{initials(profile.name)}</span>
                  )}
                </div>
                <div><strong>{profile.name}</strong><small>{profile.role} · {profile.subject}</small></div>
              </div>
              <span>{profile.department}</span><span>{profile.experience} years</span>
              <span><i className={`status-chip ${profile.status.toLowerCase()}`}>{profile.status}</i></span>
              <div className="row-actions"><button onClick={() => openEditor(profile)} type="button">Edit</button><button className="danger-link" onClick={() => setPendingDelete(profile)} type="button">Remove</button></div>
            </article>
          ))}
        </div>
      </div>
      {!profiles.length && <div className="empty-state"><span>⌕</span><h3>No matching profiles</h3><p>Try a different search term or status filter.</p></div>}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) clearImagePreview();
        }}
      >
        <DialogContent className="admin-dialog !max-w-[660px] !gap-0 !rounded-[7px] !p-0" showCloseButton={false}>
          <form onSubmit={saveProfile} key={editing?.id ?? "new"}>
            <div className="dialog-heading"><div><p className="overline">Faculty profile</p><DialogTitle>{editing ? "Edit faculty member" : "Add faculty member"}</DialogTitle></div><DialogClose asChild><button type="button" aria-label="Close dialog">×</button></DialogClose></div>
            <DialogDescription className="sr-only">Enter the faculty member’s public profile information.</DialogDescription>
            <div className="faculty-form-grid">
              <label>Full name *<Input name="name" defaultValue={editing?.name} required placeholder="Enter the teacher's name" /></label>
              <label>Role *<Input name="role" defaultValue={editing?.role} required placeholder="Example: Senior Teacher" /></label>
              <label>Department *<select name="department" defaultValue={editing?.department ?? "Leadership"} required>{departments.map((department) => <option key={department}>{department}</option>)}</select></label>
              <label>Subject or specialty *<Input name="subject" defaultValue={editing?.subject} required placeholder="Example: Physics" /></label>
              <label>Years of experience *<Input name="experience" defaultValue={editing?.experience} type="number" min={0} max={50} required /></label>
              <label>Profile status *<select name="status" defaultValue={editing?.status ?? "Published"}><option>Published</option><option>Draft</option></select></label>
              <label className="image-drop faculty-image-drop full-field">
                <input
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) =>
                    selectImage(event.target.files?.[0] ?? null)
                  }
                />
                <span aria-hidden="true">＋</span>
                <strong>
                  {editing?.imageUrl
                    ? "Replace faculty photo"
                    : "Choose faculty photo"}
                </strong>
                <small>
                  JPG, PNG or WebP · Maximum 8 MB
                  {editing?.imageUrl ? " · Leave empty to keep current photo" : ""}
                </small>
                {(selectedImage || editing?.imageUrl) && (
                  <div
                    className="selected-image-preview"
                    role="img"
                    aria-label={
                      selectedImage
                        ? `Preview of ${selectedImage.fileName}`
                        : `Current faculty photo of ${editing?.name}`
                    }
                    style={{
                      backgroundImage: `url("${
                        selectedImage?.url ??
                        resolveStoredAssetUrl(
                          editing?.imageStorageFileId,
                          editing?.imageUrl ?? "",
                        )
                      }")`,
                    }}
                  >
                    <span>
                      {selectedImage
                        ? `${selectedImage.fileName} · Click to change`
                        : "Current photo · Click to replace"}
                    </span>
                  </div>
                )}
              </label>
              <label className="full-field">Short biography<textarea name="bio" defaultValue={editing?.bio} rows={4} maxLength={260} placeholder="A concise introduction for families" /></label>
            </div>
            <div className="dialog-actions"><DialogClose asChild><Button className="button button-secondary" type="button">Cancel</Button></DialogClose><Button className="button button-primary" type="submit" disabled={isUploadingImage}>{isUploadingImage ? "Uploading photo…" : "Save profile"}</Button></div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(pendingDelete)} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <DialogContent className="admin-dialog confirm-dialog !max-w-[440px] !gap-0 !rounded-[7px] !p-0" showCloseButton={false}>
          <div className="confirm-dialog-inner">
            <span className="warning-icon">!</span><DialogTitle>Remove this profile?</DialogTitle>
            <DialogDescription>{pendingDelete?.name} will no longer appear on the faculty page. This action cannot be undone.</DialogDescription>
            <div className="dialog-actions"><DialogClose asChild><Button className="button button-secondary" type="button">Cancel</Button></DialogClose><Button className="button button-danger" onClick={deleteProfile} type="button">Remove</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
