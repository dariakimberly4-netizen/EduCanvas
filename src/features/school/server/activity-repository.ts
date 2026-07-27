import "server-only";

import {
  getSchoolContent,
  saveSchoolContent,
} from "@/features/school/server/site-content-repository";

function activityTimestamp() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

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
          time: activityTimestamp(),
        },
        ...content.activity,
      ].slice(0, 8),
    },
    email,
  );
}
