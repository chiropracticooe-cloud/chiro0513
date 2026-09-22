"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Reservation, ReservationStatus } from "@/lib/db";

const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: "未確定",
  confirmed: "確定",
  cancelled: "キャンセル",
};

const STATUS_STYLE: Record<ReservationStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-brand-100 text-brand-800",
  cancelled: "bg-gray-200 text-gray-500",
};

export default function ReservationTable({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<number | null>(null);

  async function updateStatus(id: number, status: ReservationStatus) {
    setPendingId(id);
    try {
      await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  async function removeReservation(id: number) {
    if (!confirm("この予約を削除しますか？")) return;
    setPendingId(id);
    try {
      await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setPendingId(null);
    }
  }

  if (reservations.length === 0) {
    return <p className="text-sm text-gray-500">予約はありません。</p>;
  }

  return (
    <div className="space-y-3">
      {reservations.map((r) => (
        <div
          key={r.id}
          className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div>
            <p className="font-bold text-brand-800">
              {r.date} {r.start_time}〜（{r.duration_min}分）
            </p>
            <p className="text-sm text-gray-700">
              {r.name} 様 / {r.menu_label}
            </p>
            <p className="text-xs text-gray-500">
              {r.phone}
              {r.email ? ` / ${r.email}` : ""}
            </p>
            {r.note && <p className="text-xs text-gray-500 mt-1">メモ: {r.note}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLE[r.status]}`}>
              {STATUS_LABEL[r.status]}
            </span>
            <select
              value={r.status}
              disabled={pendingId === r.id}
              onChange={(e) => updateStatus(r.id, e.target.value as ReservationStatus)}
              className="text-xs rounded border border-gray-300 px-2 py-1"
            >
              <option value="pending">未確定</option>
              <option value="confirmed">確定</option>
              <option value="cancelled">キャンセル</option>
            </select>
            <button
              disabled={pendingId === r.id}
              onClick={() => removeReservation(r.id)}
              className="text-xs text-red-600 hover:underline disabled:opacity-50"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
