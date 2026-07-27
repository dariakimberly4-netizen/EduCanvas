"use client";

import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DocumentType, SchoolContent, SchoolDocument } from "@/features/school/domain/types";

interface AdminDocumentsProps {
  content: SchoolContent;
  updateContent: (content: SchoolContent) => void;
  notify: (title: string, message: string) => void;
}

type DocumentFilter = "All" | DocumentType;

const categories = ["Examination", "General", "Event", "Parents", "Academic result"];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

function today() {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());
}

export function AdminDocuments({ content, updateContent, notify }: AdminDocumentsProps) {
  const [filter, setFilter] = useState<DocumentFilter>("All");
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<SchoolDocument | null>(null);

  const documents = useMemo(() => content.documents.filter((document) => {
    const matchesType = filter === "All" || document.type === filter;
    const matchesQuery = `${document.title} ${document.category} ${document.fileName}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesType && matchesQuery;
  }), [content.documents, filter, query]);

  function openEditor(document: SchoolDocument | null = null) {
    setEditing(document);
    setDrawerOpen(true);
  }

  function saveDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const file = data.get("file");
    const document: SchoolDocument = {
      id: editing?.id ?? Date.now(),
      type: String(data.get("type")) as DocumentType,
      title: String(data.get("title")),
      category: String(data.get("category")),
      date: String(data.get("date")),
      fileName: file instanceof File && file.size ? file.name : editing?.fileName ?? "published-document.pdf",
      status: "Published",
      academicYear: editing?.academicYear,
      publisher: editing?.publisher,
      fileSize: editing?.fileSize,
    };
    const nextDocuments = editing
      ? content.documents.map((item) => item.id === editing.id ? document : item)
      : [...content.documents, document];
    updateContent({
      ...content,
      documents: nextDocuments,
      activity: [{ action: editing ? `Updated ${document.type.toLowerCase()}` : `Published ${document.type.toLowerCase()}`, item: document.title, time: today() }, ...content.activity].slice(0, 8),
    });
    setDrawerOpen(false);
    setEditing(null);
    notify(editing ? "Document updated" : "Document published", `${document.title} is now available on the public website.`);
  }

  function removeDocument(document: SchoolDocument) {
    updateContent({
      ...content,
      documents: content.documents.filter((item) => item.id !== document.id),
      activity: [{ action: "Removed document", item: document.title, time: today() }, ...content.activity].slice(0, 8),
    });
    notify("Document removed", `${document.title} is no longer publicly available.`);
  }

  return (
    <>
      <div className="workspace-heading workspace-heading-actions">
        <div><p className="overline">Notices & results</p><h2 id="documents-title">Publish school documents</h2><p>Upload official PDFs and control what families can download from the public website.</p></div>
        <Button className="button button-primary" onClick={() => openEditor()} type="button">+ Upload PDF</Button>
      </div>
      <div className="document-workflow">
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
                  <div className="row-actions"><button onClick={() => openEditor(document)} type="button">Edit</button><button className="danger-link" onClick={() => removeDocument(document)} type="button">Remove</button></div>
                </article>
              ))}
            </div>
          </div>
          {!documents.length && <div className="empty-state"><span>□</span><h3>No documents found</h3><p>Change the filter or upload a new PDF.</p></div>}
        </div>

        <aside className={`upload-drawer${drawerOpen ? " open" : ""}`} aria-labelledby="upload-title">
          <div className="drawer-heading"><div><p className="overline">{editing ? "Edit document" : "New document"}</p><h2 id="upload-title">{editing ? "Update publication" : "Upload and publish"}</h2></div><button onClick={() => setDrawerOpen(false)} type="button" aria-label="Close uploader">×</button></div>
          <ol className="upload-progress"><li className="active">Details</li><li>File</li><li>Confirm</li></ol>
          <form onSubmit={saveDocument} key={editing?.id ?? "new"}>
            <label>Document type *<select name="type" defaultValue={editing?.type ?? "Notice"} required><option value="Notice">Notice</option><option value="Result">Result</option></select></label>
            <label>Public title *<Input name="title" defaultValue={editing?.title} maxLength={120} placeholder="Example: Half-yearly exam schedule" required /></label>
            <label>Category *<select name="category" defaultValue={editing?.category ?? "Examination"} required>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label>Publish date *<Input name="date" defaultValue={editing?.date ?? new Date().toISOString().slice(0, 10)} type="date" required /></label>
            <label className="file-drop"><input name="file" type="file" accept=".pdf" required={!editing} /><span>↑</span><strong>{editing ? "Replace the PDF file" : "Choose a PDF file"}</strong><small>{editing?.fileName ?? "PDF only · Maximum 10 MB"}</small></label>
            <label className="confirmation"><input name="approved" type="checkbox" required /> I checked this document and it is approved for publication.</label>
            <div className="drawer-actions"><Button className="button button-secondary" onClick={() => setDrawerOpen(false)} type="button">Cancel</Button><Button className="button button-primary" type="submit">{editing ? "Update document" : "Publish document"}</Button></div>
          </form>
        </aside>
      </div>
    </>
  );
}
