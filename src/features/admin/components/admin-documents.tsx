"use client";

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
import type { DocumentType, SchoolContent, SchoolDocument } from "@/features/school/domain/types";
import {
  deleteAsset,
  uploadAsset,
} from "@/features/storage/lib/asset-client";
import { useFilePreview } from "@/features/storage/lib/use-file-preview";

interface AdminDocumentsProps {
  content: SchoolContent;
  updateContent: (content: SchoolContent) => Promise<void>;
  notify: (title: string, message: string) => void;
}

type DocumentFilter = "All" | DocumentType;

const categories = ["Examination", "General", "Event", "Parents", "Academic result"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export function AdminDocuments({ content, updateContent, notify }: AdminDocumentsProps) {
  const [filter, setFilter] = useState<DocumentFilter>("All");
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<SchoolDocument | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SchoolDocument | null>(null);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const {
    preview: selectedDocument,
    selectFile: selectDocument,
    clearPreview: clearDocumentPreview,
  } = useFilePreview();

  const documents = useMemo(() => content.documents.filter((document) => {
    const matchesType = filter === "All" || document.type === filter;
    const matchesQuery = `${document.title} ${document.category} ${document.fileName}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesType && matchesQuery;
  }), [content.documents, filter, query]);

  function openEditor(document: SchoolDocument | null = null) {
    clearDocumentPreview();
    setEditing(document);
    setDrawerOpen(true);
  }

  async function saveDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const file = data.get("file");
    let uploadedFileId: string | undefined;
    setIsUploadingDocument(true);

    try {
      const uploaded =
        file instanceof File && file.size
          ? await uploadAsset(file, "document")
          : null;
      uploadedFileId = uploaded?.fileId;
      const document: SchoolDocument = {
        id: editing?.id ?? Date.now(),
        type: String(data.get("type")) as DocumentType,
        title: String(data.get("title")),
        category: String(data.get("category")),
        date: String(data.get("date")),
        fileName: uploaded?.fileName ?? editing?.fileName ?? "published-document.pdf",
        status: "Published",
        academicYear: editing?.academicYear,
        publisher: editing?.publisher,
        fileSize: uploaded?.fileSize ?? editing?.fileSize,
        fileUrl: uploaded?.directUrl ?? editing?.fileUrl,
        previewUrl: uploaded?.previewUrl ?? editing?.previewUrl,
        storageFileId: uploaded?.fileId ?? editing?.storageFileId,
      };
      const nextDocuments = editing
        ? content.documents.map((item) => item.id === editing.id ? document : item)
        : [...content.documents, document];
      await updateContent({
        ...content,
        documents: nextDocuments,
      });

      setDrawerOpen(false);
      setEditing(null);
      clearDocumentPreview();
      notify(editing ? "Document updated" : "Document published", `${document.title} is now available on the public website.`);
    } catch (error) {
      if (uploadedFileId) {
        await deleteAsset(uploadedFileId).catch(() => undefined);
      }
      notify("Document publishing failed", error instanceof Error ? error.message : "The document could not be published.");
    } finally {
      setIsUploadingDocument(false);
    }
  }

  async function removeDocument() {
    if (!pendingDelete) return;

    try {
      await updateContent({
        ...content,
        documents: content.documents.filter((item) => item.id !== pendingDelete.id),
      });
      notify("Document removed", `${pendingDelete.title} is no longer publicly available.`);
      setPendingDelete(null);
    } catch (error) {
      notify("Document removal failed", error instanceof Error ? error.message : "The document could not be removed.");
    }
  }

  return (
    <>
      <div className="workspace-heading workspace-heading-actions">
        <div><p className="overline">Notices & results</p><h2 id="documents-title">Publish school documents</h2><p>Upload official PDFs and control what families can download from the public website.</p></div>
        <Button className="button button-primary" onClick={() => openEditor()} type="button">+ Upload PDF</Button>
      </div>
      <div className="document-manager">
        <div className="manager-toolbar">
          <div className="segmented" role="tablist">
            {(["All", "Notice", "Result"] as const).map((type) => <button className={filter === type ? "active" : undefined} onClick={() => setFilter(type)} type="button" key={type}>{type === "Notice" ? "Notices" : type === "Result" ? "Results" : type}</button>)}
          </div>
          <label className="manager-search"><span>⌕</span><Input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search documents" /></label>
        </div>
        <div className="data-panel">
          <div className="document-manager-head"><span>Document</span><span>Type</span><span>Published</span><span>Status</span><span>Actions</span></div>
          <div>
            {documents.map((document) => (
              <article className="document-manager-row" key={document.id}>
                <div className="manager-document"><i>PDF</i><div><strong>{document.title}</strong><small>{document.category} · {document.fileName}</small></div></div>
                <span><i className={`type-chip ${document.type.toLowerCase()}`}>{document.type}</i></span>
                <span>{formatDate(document.date)}</span><span><i className="status-chip published">{document.status}</i></span>
                <div className="row-actions"><button onClick={() => openEditor(document)} type="button">Edit</button><button className="danger-link" onClick={() => setPendingDelete(document)} type="button">Remove</button></div>
              </article>
            ))}
          </div>
        </div>
        {!documents.length && <div className="empty-state"><span>□</span><h3>No documents found</h3><p>Change the filter or upload a new PDF.</p></div>}
      </div>

      <Dialog
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) clearDocumentPreview();
        }}
      >
        <DialogContent
          className="admin-dialog document-dialog !max-w-[720px] !gap-0 !rounded-[7px] !p-0"
          showCloseButton={false}
        >
          <form onSubmit={saveDocument} key={editing?.id ?? "new"}>
            <div className="dialog-heading">
              <div>
                <p className="overline">{editing ? "Edit document" : "New document"}</p>
                <DialogTitle>{editing ? "Update school document" : "Upload school document"}</DialogTitle>
              </div>
              <DialogClose asChild>
                <button type="button" aria-label="Close dialog">×</button>
              </DialogClose>
            </div>
            <DialogDescription className="sr-only">
              Enter the publication details and choose the PDF that will appear on the public website.
            </DialogDescription>
            <div className="document-form-grid">
              <label>Document type *<select name="type" defaultValue={editing?.type ?? "Notice"} required><option value="Notice">Notice</option><option value="Result">Result</option></select></label>
              <label>Public title *<Input name="title" defaultValue={editing?.title} maxLength={120} placeholder="Example: Half-yearly exam schedule" required /></label>
              <label>Category *<select name="category" defaultValue={editing?.category ?? "Examination"} required>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label>Publish date *<Input name="date" defaultValue={editing?.date ?? new Date().toISOString().slice(0, 10)} type="date" required /></label>
              <label className="file-drop full-field"><input name="file" type="file" accept=".pdf,application/pdf" onChange={(event) => selectDocument(event.target.files?.[0] ?? null)} required={!editing} /><span>↑</span><strong>{editing ? "Replace the PDF file" : "Choose a PDF file"}</strong><small>{selectedDocument?.fileName || editing?.fileName || "PDF only · Maximum 10 MB"}</small></label>
              {selectedDocument && (
                <section className="pdf-upload-preview" aria-label="Selected PDF preview">
                  <header>
                    <strong>{selectedDocument.fileName}</strong>
                    <button
                      type="button"
                      onClick={(event) => {
                        const input = event.currentTarget
                          .closest("form")
                          ?.elements.namedItem("file");
                        if (input instanceof HTMLInputElement) input.value = "";
                        clearDocumentPreview();
                      }}
                    >
                      Remove selection
                    </button>
                  </header>
                  <iframe
                    src={`${selectedDocument.url}#toolbar=0&navpanes=0`}
                    title={`PDF preview: ${selectedDocument.fileName}`}
                  />
                </section>
              )}
              <label className="confirmation full-field"><input name="approved" type="checkbox" required /> <span>I checked this document and it is approved for publication.</span></label>
            </div>
            <div className="dialog-actions">
              <DialogClose asChild>
                <Button className="button button-secondary" type="button">Cancel</Button>
              </DialogClose>
              <Button className="button button-primary" type="submit" disabled={isUploadingDocument}>{isUploadingDocument ? "Uploading PDF…" : editing ? "Update document" : "Publish document"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <DialogContent
          className="admin-dialog confirm-dialog !max-w-[440px] !gap-0 !rounded-[7px] !p-0"
          showCloseButton={false}
        >
          <div className="confirm-dialog-inner">
            <span className="warning-icon" aria-hidden="true">!</span>
            <DialogTitle>Remove this document?</DialogTitle>
            <DialogDescription>
              {pendingDelete?.title} will no longer appear on the Notices &amp;
              results page, and its PDF will be deleted from Google Drive. This
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
                onClick={() => void removeDocument()}
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
