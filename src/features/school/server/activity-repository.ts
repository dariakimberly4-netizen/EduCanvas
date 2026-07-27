import "server-only";

import {
  getSchoolContent,
  saveSchoolContent,
} from "@/features/school/server/site-content-repository";
import { formatDateTime } from "@/lib/format";

export async function recordAuthenticationActivity({
  action,
  email,
  name,
}: {
  action: "Administrator signed in" | "Administrator signed out";
  email: string;
  name: string;
}) {
  const content = await getSchoolContent();

  await saveSchoolContent(
    {
      ...content,
      activity: [
        {
          action,
          item: `${name} · ${email}`,
          time: formatDateTime(),
        },
        ...content.activity,
      ].slice(0, 8),
    },
    email,
  );
}
