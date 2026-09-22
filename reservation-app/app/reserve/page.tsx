"use client";

import { useEffect, useMemo, useState } from "react";
import { MENU_ITEMS } from "@/lib/config";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function ReservePage() {
  const [menuId, setMenuId] = useState(MENU_ITEMS[0].id);
  const [date, setDate] = useState(todayStr());
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsReason, setSlotsReason] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const minDate = todayStr();

  useEffect(() => {
    setStartTime(null);
    setSlotsReason(null);
    if (!date) return;
    setSlotsLoading(true);
    fetch(`/api/reservations/available?date=${date}&menuId=${menuId}`)
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots ?? []);
        setSlotsReason(data.reason ?? null);
      })
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [date, menuId]);

  const menu = useMemo(() => MENU_ITEMS.find((m) => m.id === menuId), [menuId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!startTime) {
      setError("ご希望の時間を選択してください");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, menuId, date, startTime, note }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "予約に失敗しました");
        return;
      }
      setDone(true);
    } catch {
      setError("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-3">
        <h1 className="text-lg font-bold text-brand-800">ご予約を受け付けました</h1>
        <p className="text-sm text-gray-600">
          {date} {startTime} 〜 ／ {menu?.label}
          <br />
          担当より確認のご連絡をする場合がございます。
        </p>
        <a href="/questionnaire" className="inline-block mt-2 text-sm text-brand-600 underline">
          続けて問診票を入力する
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <h1 className="text-lg font-bold text-brand-800">ご予約</h1>

      <div>
        <label className="block text-sm font-medium mb-1">メニュー</label>
        <select
          value={menuId}
          onChange={(e) => setMenuId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {MENU_ITEMS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}（約{m.durationMin}分）
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">ご希望日</label>
        <input
          type="date"
          value={date}
          min={minDate}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">ご希望時間</label>
        {slotsLoading && <p className="text-sm text-gray-500">空き時間を確認しています…</p>}
        {!slotsLoading && slotsReason === "closed" && (
          <p className="text-sm text-red-600">その日は定休日です。別の日をお選びください。</p>
        )}
        {!slotsLoading && slotsReason !== "closed" && slots.length === 0 && (
          <p className="text-sm text-red-600">空き枠がありません。別の日をお選びください。</p>
        )}
        {!slotsLoading && slots.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {slots.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setStartTime(s)}
                className={`rounded-lg border px-2 py-2 text-sm ${
                  startTime === s
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-gray-300 hover:border-brand-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">お名前</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">お電話番号</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">メールアドレス（任意）</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">気になる症状・ご要望（任意）</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-brand-600 text-white py-3 font-bold hover:bg-brand-700 disabled:opacity-50"
      >
        {submitting ? "送信中…" : "この内容で予約する"}
      </button>
    </form>
  );
}
