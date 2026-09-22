import Link from "next/link";
import { CLINIC_NAME, CLINIC_URL } from "@/lib/config";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
        <h1 className="text-xl font-bold text-brand-800">{CLINIC_NAME}</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          ご来院前に、下記からご予約と問診票のご入力をお願いいたします。
          問診票は初めての方だけでなく、症状に変化があった方もご記入いただくとスムーズです。
        </p>
        <a
          href={CLINIC_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sm text-brand-600 underline"
        >
          院の公式サイトはこちら
        </a>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/reserve"
          className="block rounded-2xl bg-brand-600 text-white p-6 shadow-sm hover:bg-brand-700 transition"
        >
          <p className="text-lg font-bold">ご予約はこちら</p>
          <p className="text-sm mt-1 text-brand-50">日時とメニューを選んで予約できます</p>
        </Link>
        <Link
          href="/questionnaire"
          className="block rounded-2xl bg-white border border-brand-200 p-6 shadow-sm hover:bg-brand-50 transition"
        >
          <p className="text-lg font-bold text-brand-800">問診票の入力</p>
          <p className="text-sm mt-1 text-gray-600">症状などを事前にお伺いします</p>
        </Link>
      </div>
    </div>
  );
}
