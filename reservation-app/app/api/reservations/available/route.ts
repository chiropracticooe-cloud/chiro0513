import { NextRequest, NextResponse } from "next/server";
import { MENU_ITEMS } from "@/lib/config";
import { getAvailableSlots, isDateBookable } from "@/lib/slots";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const menuId = req.nextUrl.searchParams.get("menuId");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date は YYYY-MM-DD 形式で指定してください" }, { status: 400 });
  }
  const menu = MENU_ITEMS.find((m) => m.id === menuId);
  if (!menu) {
    return NextResponse.json({ error: "メニューが不正です" }, { status: 400 });
  }
  if (!isDateBookable(date)) {
    return NextResponse.json({ slots: [], reason: "closed" });
  }

  const slots = getAvailableSlots(date, menu.durationMin);
  return NextResponse.json({ slots });
}
