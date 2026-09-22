import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb, Questionnaire } from "@/lib/db";

const GENDER_LABEL: Record<string, string> = {
  female: "女性",
  male: "男性",
  other: "その他・回答しない",
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm text-gray-800 whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export default async function QuestionnaireDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) notFound();

  const db = getDb();
  const q = db.prepare(`SELECT * FROM questionnaires WHERE id = ?`).get(id) as
    | Questionnaire
    | undefined;
  if (!q) notFound();

  const painAreas: string[] = q.pain_areas ? JSON.parse(q.pain_areas) : [];

  return (
    <div className="space-y-4">
      <Link href="/admin/questionnaires" className="text-sm text-brand-600 hover:underline">
        ← 一覧に戻る
      </Link>
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-brand-800">{q.name} 様</h1>
          <p className="text-xs text-gray-400">提出日時: {q.created_at}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="フリガナ" value={q.kana} />
          <Field label="生年月日" value={q.birth_date} />
          <Field label="性別" value={q.gender ? GENDER_LABEL[q.gender] ?? q.gender : null} />
          <Field label="お電話番号" value={q.phone} />
          <Field label="初めての来院か" value={q.first_visit ? "初めて" : "来院したことがある"} />
          <Field label="気になる部位" value={painAreas.length ? painAreas.join("、") : null} />
        </div>
        <Field label="症状・お困りごと" value={q.chief_complaint} />
        <Field label="いつ頃からの症状か" value={q.symptom_since} />
        <Field label="既往歴" value={q.medical_history} />
        <Field label="現在服用中のお薬" value={q.medications} />
        <Field label="アレルギー" value={q.allergies} />
        <Field label="過去の治療歴" value={q.past_treatment} />
      </div>
    </div>
  );
}
