import { NextRequest, NextResponse } from "next/server";
import { getDb, Questionnaire } from "@/lib/db";
import { isAdminRequest } from "@/lib/adminGuard";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "権限がありません" }, { status: 401 });
  }
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM questionnaires ORDER BY created_at DESC`)
    .all() as Questionnaire[];
  return NextResponse.json({ questionnaires: rows });
}

type CreateBody = {
  name?: string;
  kana?: string;
  birthDate?: string;
  gender?: string;
  phone?: string;
  painAreas?: string[];
  chiefComplaint?: string;
  symptomSince?: string;
  medicalHistory?: string;
  medications?: string;
  allergies?: string;
  pastTreatment?: string;
  firstVisit?: boolean;
  agreePrivacy?: boolean;
  reservationId?: number;
};

export async function POST(req: NextRequest) {
  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "お名前を入力してください" }, { status: 400 });
  }
  if (!body.agreePrivacy) {
    return NextResponse.json({ error: "個人情報の取り扱いへの同意が必要です" }, { status: 400 });
  }

  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO questionnaires
        (name, kana, birth_date, gender, phone, pain_areas, chief_complaint, symptom_since,
         medical_history, medications, allergies, past_treatment, first_visit, agree_privacy, reservation_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      name,
      body.kana?.trim() || null,
      body.birthDate || null,
      body.gender || null,
      body.phone?.trim() || null,
      body.painAreas ? JSON.stringify(body.painAreas) : null,
      body.chiefComplaint?.trim() || null,
      body.symptomSince?.trim() || null,
      body.medicalHistory?.trim() || null,
      body.medications?.trim() || null,
      body.allergies?.trim() || null,
      body.pastTreatment?.trim() || null,
      body.firstVisit ? 1 : 0,
      1,
      body.reservationId ?? null
    );

  const questionnaire = db
    .prepare(`SELECT * FROM questionnaires WHERE id = ?`)
    .get(result.lastInsertRowid) as Questionnaire;

  return NextResponse.json({ questionnaire }, { status: 201 });
}
