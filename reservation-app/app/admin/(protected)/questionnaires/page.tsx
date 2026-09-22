import Link from "next/link";
import { getDb, Questionnaire } from "@/lib/db";

export default function QuestionnaireListPage() {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM questionnaires ORDER BY created_at DESC`)
    .all() as Questionnaire[];

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-brand-800">問診票一覧</h1>
      {rows.length === 0 && <p className="text-sm text-gray-500">まだ問診票の提出はありません。</p>}
      <div className="space-y-3">
        {rows.map((q) => (
          <Link
            key={q.id}
            href={`/admin/questionnaires/${q.id}`}
            className="block bg-white rounded-xl shadow-sm p-4 hover:bg-brand-50 transition"
          >
            <div className="flex items-center justify-between">
              <p className="font-bold text-brand-800">{q.name} 様</p>
              <p className="text-xs text-gray-400">{q.created_at}</p>
            </div>
            {q.chief_complaint && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{q.chief_complaint}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
