const DATE_LOCALE = "en-GB";

function fromIsoDate(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function formatShortDate(value: string | Date = new Date()) {
  const date = typeof value === "string" ? fromIsoDate(value) : value;
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatLongDate(
  value: string,
  day: "numeric" | "2-digit" = "2-digit",
) {
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    day,
    month: "long",
    year: "numeric",
  }).format(fromIsoDate(value));
}

export function formatDateTime(value: Date = new Date()) {
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

export function getIsoDateParts(value: string) {
  const date = fromIsoDate(value);
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleString(DATE_LOCALE, { month: "short" }),
    year: date.getFullYear(),
  };
}

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
