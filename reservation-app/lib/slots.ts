import { getDb, Reservation } from "./db";
import { BUSINESS_HOURS, MAX_BOOKING_DAYS_AHEAD, SLOT_INTERVAL_MIN } from "./config";

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(min: number): string {
  const h = Math.floor(min / 60)
    .toString()
    .padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function isDateBookable(dateStr: string): boolean {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const max = new Date(today);
  max.setDate(max.getDate() + MAX_BOOKING_DAYS_AHEAD);
  if (date < today || date > max) return false;
  return BUSINESS_HOURS[date.getDay()] !== null;
}

export function getAvailableSlots(dateStr: string, durationMin: number): string[] {
  if (!isDateBookable(dateStr)) return [];
  const date = new Date(`${dateStr}T00:00:00`);
  const hours = BUSINESS_HOURS[date.getDay()];
  if (!hours) return [];

  const openMin = timeToMinutes(hours.open);
  const closeMin = timeToMinutes(hours.close);

  const db = getDb();
  const existing = db
    .prepare(
      `SELECT start_time, duration_min FROM reservations WHERE date = ? AND status != 'cancelled'`
    )
    .all(dateStr) as Pick<Reservation, "start_time" | "duration_min">[];

  const busyRanges = existing.map((r) => {
    const start = timeToMinutes(r.start_time);
    return { start, end: start + r.duration_min };
  });

  const now = new Date();
  const isToday = dateStr === now.toISOString().slice(0, 10);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const slots: string[] = [];
  for (
    let start = openMin;
    start + durationMin <= closeMin;
    start += SLOT_INTERVAL_MIN
  ) {
    const end = start + durationMin;
    if (isToday && start <= nowMin) continue;
    const overlaps = busyRanges.some((b) => start < b.end && end > b.start);
    if (!overlaps) slots.push(minutesToTime(start));
  }
  return slots;
}
