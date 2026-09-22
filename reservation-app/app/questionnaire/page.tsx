"use client";

import { useState } from "react";
import { PAIN_AREAS } from "@/lib/config";

export default function QuestionnairePage() {
  const [name, setName] = useState("");
  const [kana, setKana] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [painAreas, setPainAreas] = useState<string[]>([]);
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [symptomSince, setSymptomSince] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [pastTreatment, setPastTreatment] = useState("");
  const [firstVisit, setFirstVisit] = useState(true);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function togglePainArea(area: string) {
    setPainAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreePrivacy) {
      setError("個人情報の取り扱いへの同意にチェックをお願いします");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/questionnaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          kana,
          birthDate,
          gender,
          phone,
          painAreas,
          chiefComplaint,
          symptomSince,
          medicalHistory,
          medications,
          allergies,
          pastTreatment,
          firstVisit,
          agreePrivacy,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "送信に失敗しました");
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
        <h1 className="text-lg font-bold text-brand-800">問診票を受け付けました</h1>
        <p className="text-sm text-gray-600">ご来院時にスタッフより内容を確認させていただきます。</p>
        <a href="/reserve" className="inline-block mt-2 text-sm text-brand-600 underline">
          まだ予約がお済みでない方はこちら
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <h1 className="text-lg font-bold text-brand-800">問診票</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <label className="block text-sm font-medium mb-1">フリガナ</label>
          <input
            value={kana}
            onChange={(e) => setKana(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">生年月日</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">性別</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">選択してください</option>
            <option value="female">女性</option>
            <option value="male">男性</option>
            <option value="other">その他・回答しない</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">お電話番号</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">当院のご利用は初めてですか？</label>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={firstVisit}
              onChange={() => setFirstVisit(true)}
            />
            初めて
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              checked={!firstVisit}
              onChange={() => setFirstVisit(false)}
            />
            以前に来院したことがある
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">気になる部位（複数選択可）</label>
        <div className="flex flex-wrap gap-2">
          {PAIN_AREAS.map((area) => (
            <button
              type="button"
              key={area}
              onClick={() => togglePainArea(area)}
              className={`rounded-full border px-3 py-1 text-sm ${
                painAreas.includes(area)
                  ? "bg-brand-600 text-white border-brand-600"
                  : "border-gray-300 hover:border-brand-400"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">症状・お困りごと</label>
        <textarea
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="例：2週間前から腰が重だるい、朝起きた時に肩が痛む　など"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">いつ頃からの症状ですか</label>
        <input
          value={symptomSince}
          onChange={(e) => setSymptomSince(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          placeholder="例：3日前から、半年前から　など"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">既往歴（過去の病気・手術など）</label>
        <textarea
          value={medicalHistory}
          onChange={(e) => setMedicalHistory(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">現在服用中のお薬</label>
        <textarea
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">アレルギー</label>
        <input
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          過去に整体・整骨院・整形外科などを受けたことはありますか
        </label>
        <textarea
          value={pastTreatment}
          onChange={(e) => setPastTreatment(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={agreePrivacy}
          onChange={(e) => setAgreePrivacy(e.target.checked)}
          className="mt-1"
        />
        <span>
          ご入力いただいた個人情報は、施術・院内での連絡のためにのみ使用し、
          適切に管理いたします。上記に同意します。
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-brand-600 text-white py-3 font-bold hover:bg-brand-700 disabled:opacity-50"
      >
        {submitting ? "送信中…" : "この内容で送信する"}
      </button>
    </form>
  );
}
