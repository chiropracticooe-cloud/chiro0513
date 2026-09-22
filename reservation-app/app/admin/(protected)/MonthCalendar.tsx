import { BUSINESS_HOURS } from "@/lib/config";
import { getMonthGrid, monthParamStr, toDateStr } from "@/lib/calendar";

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

export default function MonthCalendar({
  year,
  month,
  countsByDate,
}: {
  year: number;
  month: number;
  countsByDate: Record<string, number>;
}) {
  const weeks = getMonthGrid(year, month);
  const todayStr = toDateStr(new Date());
  const prevMonth = monthParamStr(year, month - 1);
  const nextMonth = monthParamStr(year, month + 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <a
          href={`/admin?month=${prevMonth}`}
          className="px-3 py-2 text-sm rounded-lg text-brand-700 hover:bg-brand-50"
        >
          ← 前月
        </a>
        <p className="font-bold text-brand-800">
          {year}年{month + 1}月
        </p>
        <a
          href={`/admin?month=${nextMonth}`}
          className="px-3 py-2 text-sm rounded-lg text-brand-700 hover:bg-brand-50"
        >
          翌月 →
        </a>
      </div>

      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.flatMap((week) =>
          week.map((date) => {
            const dateStr = toDateStr(date);
            const inMonth = date.getMonth() === month;
            const isToday = dateStr === todayStr;
            const isClosed = BUSINESS_HOURS[date.getDay()] === null;
            const count = countsByDate[dateStr] || 0;

            return (
              <a
                key={dateStr}
                href={`/admin?date=${dateStr}`}
                className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-sm
                  ${inMonth ? "text-gray-800" : "text-gray-300"}
                  ${isToday ? "ring-2 ring-brand-500" : ""}
                  ${isClosed && inMonth ? "bg-gray-50 text-gray-400" : "hover:bg-brand-50"}
                `}
              >
                <span>{date.getDate()}</span>
                {count > 0 && (
                  <span className="mt-0.5 text-[10px] leading-none bg-brand-600 text-white rounded-full px-1.5 py-0.5">
                    {count}
                  </span>
                )}
              </a>
            );
          })
        )}
      </div>

      <a
        href={`/admin?date=${todayStr}`}
        className="mt-3 block text-center text-sm text-brand-600 hover:underline"
      >
        今日（{todayStr}）を見る
      </a>
    </div>
  );
}
