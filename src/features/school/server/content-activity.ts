import "server-only";

import type {
  ActivityItem,
  FacultyMember,
  HeroSlide,
  SchoolContent,
  SchoolDocument,
} from "@/features/school/domain/types";

function activityDate() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

function differs(first: unknown, second: unknown) {
  return JSON.stringify(first) !== JSON.stringify(second);
}

function indexById<T extends { id: number }>(items: T[]) {
  return new Map(items.map((item) => [item.id, item]));
}

function collectionActivities<T extends { id: number }>(
  previousItems: T[],
  nextItems: T[],
  labels: {
    created: (item: T) => ActivityItem;
    edited: (item: T) => ActivityItem;
    deleted: (item: T) => ActivityItem;
  },
) {
  const activities: ActivityItem[] = [];
  const previousById = indexById(previousItems);
  const nextById = indexById(nextItems);

  nextItems.forEach((item) => {
    const previous = previousById.get(item.id);
    if (!previous) activities.push(labels.created(item));
    else if (differs(previous, item)) activities.push(labels.edited(item));
  });

  previousItems.forEach((item) => {
    if (!nextById.has(item.id)) activities.push(labels.deleted(item));
  });

  return activities;
}

function heroActivities(previous: HeroSlide[], next: HeroSlide[]) {
  const date = activityDate();
  const activities = collectionActivities(previous, next, {
    created: (slide) => ({ action: "Created carousel image", item: slide.heading, time: date }),
    edited: (slide) => ({ action: "Edited carousel image", item: slide.heading, time: date }),
    deleted: (slide) => ({ action: "Deleted carousel image", item: slide.heading, time: date }),
  });
  const previousOrder = previous.map((slide) => slide.id);
  const nextOrder = next.map((slide) => slide.id);
  const sameSlides =
    previousOrder.length === nextOrder.length &&
    previousOrder.every((id) => nextOrder.includes(id));

  if (sameSlides && differs(previousOrder, nextOrder)) {
    activities.unshift({
      action: "Edited carousel order",
      item: "Homepage hero carousel",
      time: date,
    });
  }

  return activities;
}

function facultyActivities(previous: FacultyMember[], next: FacultyMember[]) {
  const date = activityDate();
  return collectionActivities(previous, next, {
    created: (member) => ({ action: "Created faculty profile", item: member.name, time: date }),
    edited: (member) => ({ action: "Edited faculty profile", item: member.name, time: date }),
    deleted: (member) => ({ action: "Deleted faculty profile", item: member.name, time: date }),
  });
}

function documentActivities(
  previous: SchoolDocument[],
  next: SchoolDocument[],
) {
  const date = activityDate();
  return collectionActivities(previous, next, {
    created: (document) => ({ action: `Created ${document.type.toLowerCase()}`, item: document.title, time: date }),
    edited: (document) => ({ action: `Edited ${document.type.toLowerCase()}`, item: document.title, time: date }),
    deleted: (document) => ({ action: `Deleted ${document.type.toLowerCase()}`, item: document.title, time: date }),
  });
}

export function withDerivedActivity(
  previous: SchoolContent,
  next: SchoolContent,
): SchoolContent {
  const activities: ActivityItem[] = [];

  if (differs(previous.landing, next.landing)) {
    activities.push({
      action: "Edited landing page",
      item: "Homepage content",
      time: activityDate(),
    });
  }

  activities.push(
    ...heroActivities(previous.heroSlides, next.heroSlides),
    ...facultyActivities(previous.faculty, next.faculty),
    ...documentActivities(previous.documents, next.documents),
  );

  return {
    ...next,
    activity: [...activities, ...previous.activity].slice(0, 8),
  };
}
