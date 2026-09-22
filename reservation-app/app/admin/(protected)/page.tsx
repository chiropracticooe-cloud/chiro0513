import { getDb, Reservation } from "@/lib/db";
import ReservationTable from "./ReservationTable";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const date = dateParam || "";
  const db = getDb();
  const reservations = date
    ? (db
        .prepare(`SELECT * FROM reservations WHERE date = ? ORDER BY start_time ASC`)
        .all(date) as Reservation[])
    : (db
        .prepare(`SELECT * FROM reservations WHERE date >= ? ORDER BY date ASC, start_time ASC`)
        .all(todayStr()) as Reservation[]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-end gap-3">
        <form className="flex items-end gap-2" method="get">
          <div>
            <label className="block text-xs text-gray-500 mb-1">日付で絞り込み</label>
            <input
              type="date"
              name="date"
              defaultValue={date}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button className="rounded-lg bg-brand-600 text-white px-4 py-2 text-sm font-bold hover:bg-brand-700">
            絞り込む
          </button>
          {date && (
            <a href="/admin" className="text-sm text-gray-500 hover:underline">
              クリア
            </a>
          )}
        </form>
      </div>

      <h1 className="text-lg font-bold text-brand-800">
        {date ? `${date} の予約` : "今後の予約"}
      </h1>
      <ReservationTable reservations={reservations} />
    </div>
  );
}
