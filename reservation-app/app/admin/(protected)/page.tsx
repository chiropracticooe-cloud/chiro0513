import { getDb, Reservation } from "@/lib/db";
import { parseMonthParam, monthParamStr, toDateStr, getMonthGrid } from "@/lib/calendar";
import ReservationTable from "./ReservationTable";
import MonthCalendar from "./MonthCalendar";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; month?: string }>;
}) {
  const { date, month: monthParam } = await searchParams;
  const db = getDb();

  if (date) {
    const reservations = db
      .prepare(`SELECT * FROM reservations WHERE date = ? ORDER BY start_time ASC`)
      .all(date) as Reservation[];
    const backMonth = monthParamStr(
      Number(date.slice(0, 4)),
      Number(date.slice(5, 7)) - 1
    );

    return (
      <div className="space-y-4">
        <a
          href={`/admin?month=${backMonth}`}
          className="inline-block text-sm text-brand-600 hover:underline"
        >
          ← カレンダーに戻る
        </a>
        <h1 className="text-lg font-bold text-brand-800">{date} の予約</h1>
        <ReservationTable reservations={reservations} />
      </div>
    );
  }

  const { year, month } = parseMonthParam(monthParam);
  const weeks = getMonthGrid(year, month);
  const rangeStart = toDateStr(weeks[0][0]);
  const rangeEnd = toDateStr(weeks[weeks.length - 1][6]);

  const rows = db
    .prepare(
      `SELECT date, COUNT(*) as cnt FROM reservations
       WHERE date >= ? AND date <= ? AND status != 'cancelled'
       GROUP BY date`
    )
    .all(rangeStart, rangeEnd) as { date: string; cnt: number }[];

  const countsByDate: Record<string, number> = {};
  for (const r of rows) countsByDate[r.date] = r.cnt;

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-brand-800">予約カレンダー</h1>
      <MonthCalendar year={year} month={month} countsByDate={countsByDate} />
    </div>
  );
}
