import type { SchoolContent } from "@/features/school/domain/types";

export interface AdminContentEditorProps {
  content: SchoolContent;
  updateContent: (content: SchoolContent) => Promise<void>;
  notify: (title: string, message: string) => void;
}
