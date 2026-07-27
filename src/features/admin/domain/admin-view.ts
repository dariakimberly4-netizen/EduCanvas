export type AdminView = "overview" | "landing" | "faculty" | "documents";

export const adminViewTitles: Record<AdminView, [string, string]> = {
  overview: ["School website", "Manage your school website"],
  landing: ["Landing page", "Edit school information"],
  faculty: ["Faculty profiles", "Manage the teaching team"],
  documents: ["Notices & results", "Publish school documents"],
};
