import { NextRequest, NextResponse } from "next/server";
import { getDb, Reservation, ReservationStatus } from "@/lib/db";
import { isAdminRequest } from "@/lib/adminGuard";

const VALID_STATUSES: ReservationStatus[] = ["pending", "confirmed", "cancelled"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "権限がありません" }, { status: 401 });
  }
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "不正なIDです" }, { status: 400 });
  }
  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }
  if (!body.status || !VALID_STATUSES.includes(body.status as ReservationStatus)) {
    return NextResponse.json({ error: "不正なステータスです" }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(`UPDATE reservations SET status = ? WHERE id = ?`).run(body.status, id);
  if (result.changes === 0) {
    return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });
  }
  const reservation = db.prepare(`SELECT * FROM reservations WHERE id = ?`).get(id) as Reservation;
  return NextResponse.json({ reservation });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "権限がありません" }, { status: 401 });
  }
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "不正なIDです" }, { status: 400 });
  }
  const db = getDb();
  const result = db.prepare(`DELETE FROM reservations WHERE id = ?`).run(id);
  if (result.changes === 0) {
    return NextResponse.json({ error: "予約が見つかりません" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
