export const TIMEZONE = "Africa/Douala";

export type DayHours = { closed: true } | { closed?: false; open: string; close: string };

export const DEFAULT_WEEK_HOURS: Record<number, DayHours> = {
  0: { open: "12:00", close: "22:00" },
  1: { closed: true },
  2: { open: "17:00", close: "00:00" },
  3: { open: "17:00", close: "00:00" },
  4: { open: "17:00", close: "00:00" },
  5: { open: "17:00", close: "02:00" },
  6: { open: "17:00", close: "02:00" },
};

export const HOURS_LABELS = [
  { days: "Mardi – Jeudi", hours: "17h – 00h" },
  { days: "Vendredi – Samedi", hours: "17h – 02h" },
  { days: "Dimanche (Brunch & Chill)", hours: "12h – 22h" },
  { days: "Lundi", hours: "Fermé" },
];

export function ymdInYaounde(date = new Date()): string {
  return date.toLocaleDateString("en-CA", { timeZone: TIMEZONE });
}

export function weekdayFromYmd(ymd: string): number {
  return new Date(`${ymd}T12:00:00+01:00`).getUTCDay();
}

export function nowMinutesInYaounde(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  return hour * 60 + minute;
}

export function clockToMinutes(time: string, asEnd = false): number {
  const [h, m] = time.split(":").map(Number);
  if (asEnd && h === 0 && m === 0) return 24 * 60;
  let mins = h * 60 + m;
  if (asEnd && mins > 0 && mins <= 6 * 60) mins += 24 * 60;
  return mins;
}

export function minutesToClock(mins: number): string {
  const normalized = ((mins % (24 * 60)) + 24 * 60) % (24 * 60);
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function getDayHours(ymd: string, week: Record<number, DayHours> = DEFAULT_WEEK_HOURS): DayHours {
  return week[weekdayFromYmd(ymd)] ?? { closed: true };
}

export function isClosedDate(ymd: string, week?: Record<number, DayHours>): boolean {
  const hours = getDayHours(ymd, week);
  return "closed" in hours && hours.closed === true;
}

export function generateWindowSlots(open: string, close: string, interval = 30): string[] {
  const start = clockToMinutes(open, false);
  const end = clockToMinutes(close, true);
  const lastStart = Math.max(start, end - 30);
  const slots: string[] = [];
  for (let m = start; m <= lastStart; m += interval) {
    slots.push(minutesToClock(m));
  }
  return slots;
}

export function slotsForDateAndSpace(
  ymd: string,
  space: string,
  week?: Record<number, DayHours>,
): string[] {
  const hours = getDayHours(ymd, week);
  if ("closed" in hours && hours.closed) return [];

  const { open, close } = hours;
  const all = generateWindowSlots(open, close, 30);
  const isVip = space === "vip" || space === "privatisation-vip" || space === "privatisation_vip";
  if (!isVip) return all;

  return all.filter((time) => {
    const mins = clockToMinutes(time, false);
    const late = mins < 6 * 60 ? mins + 24 * 60 : mins;
    return late >= 18 * 60;
  });
}
