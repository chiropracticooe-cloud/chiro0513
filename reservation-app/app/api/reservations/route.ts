import { NextRequest, NextResponse } from "next/server";
import { getDb, Reservation } from "@/lib/db";
import { MENU_ITEMS } from "@/lib/config";
import { getAvailableSlots, isDateBookable } from "@/lib/slots";
import { isAdminRequest } from "@/lib/adminGuard";

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "権限がありません" }, { status: 401 });
  }
  const dateFilter = req.nextUrl.searchParams.get("date");
  const db = getDb();
  const rows = dateFilter
    ? (db
        .prepare(`SELECT * FROM reservations WHERE date = ? ORDER BY start_time ASC`)
        .all(dateFilter) as Reservation[])
    : (db
        .prepare(`SELECT * FROM reservations ORDER BY date ASC, start_time ASC`)
        .all() as Reservation[]);
  return NextResponse.json({ reservations: rows });
}

type CreateBody = {
  name?: string;
  phone?: string;
  email?: string;
  menuId?: string;
  date?: string;
  startTime?: string;
  note?: string;
};

export async function POST(req: NextRequest) {
  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const name = body.name?.trim();
  const phone = body.phone?.trim();
  const email = body.email?.trim() || null;
  const note = body.note?.trim() || null;
  const menu = MENU_ITEMS.find((m) => m.id === body.menuId);
  const date = body.date;
  const startTime = body.startTime;

  if (!name || !phone || !menu || !date || !startTime) {
    return NextResponse.json({ error: "必須項目が入力されていません" }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(startTime)) {
    return NextResponse.json({ error: "日時の形式が不正です" }, { status: 400 });
  }
  if (!isDateBookable(date)) {
    return NextResponse.json({ error: "その日は予約を受け付けていません" }, { status: 400 });
  }

  const available = getAvailableSlots(date, menu.durationMin);
  if (!available.includes(startTime)) {
    return NextResponse.json(
      { error: "選択した時間はすでに埋まっています。もう一度お選びください。" },
      { status: 409 }
    );
  }

  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO reservations (name, phone, email, menu_id, menu_label, date, start_time, duration_min, note, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
    )
    .run(name, phone, email, menu.id, menu.label, date, startTime, menu.durationMin, note);

  const reservation = db
    .prepare(`SELECT * FROM reservations WHERE id = ?`)
    .get(result.lastInsertRowid) as Reservation;

  return NextResponse.json({ reservation }, { status: 201 });
}
