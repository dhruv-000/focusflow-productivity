export function dateKeyFromDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateFromKey(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDaysToKey(dateKey, days) {
  const date = dateFromKey(dateKey);
  date.setDate(date.getDate() + days);
  return dateKeyFromDate(date);
}

export function getStartOfWeek(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + mondayOffset);
  return start;
}

export function getWeekKeys(anchorDate = new Date()) {
  const weekStart = getStartOfWeek(anchorDate);

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(weekStart);
    current.setDate(weekStart.getDate() + index);
    return dateKeyFromDate(current);
  });
}

export function getTrailingDateKeys(days, anchorDate = new Date()) {
  const anchorKey = dateKeyFromDate(anchorDate);

  return Array.from({ length: days }, (_, index) =>
    addDaysToKey(anchorKey, -(days - index - 1)),
  );
}

export function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const start = getStartOfWeek(firstDay);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export function formatFriendlyDate(dateKey) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dateFromKey(dateKey));
}

export function formatDayShort(dateKey) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    dateFromKey(dateKey),
  );
}
