// 院の基本情報・営業時間・メニューはここでまとめて管理しています。
// 実際の営業時間・定休日・メニューに合わせて書き換えてください。

export const CLINIC_NAME = "氣功整体カイロプラクティック大江";
export const CLINIC_URL = "https://chiropractic-ooe.com/";

export type MenuItem = {
  id: string;
  label: string;
  durationMin: number;
  description?: string;
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "first-visit",
    label: "初回：カウンセリング＋施術",
    durationMin: 90,
    description: "初めての方はカウンセリングのお時間を含みます",
  },
  {
    id: "regular",
    label: "再診：気功整体",
    durationMin: 60,
  },
  {
    id: "chiro",
    label: "カイロプラクティック（骨格矯正）",
    durationMin: 60,
  },
  {
    id: "short",
    label: "ショートコース（部分整体）",
    durationMin: 30,
  },
];

// 0=日曜, 1=月曜, ... 6=土曜。null の曜日は定休日。
export const BUSINESS_HOURS: Record<number, { open: string; close: string } | null> = {
  0: null,
  1: { open: "10:00", close: "19:00" },
  2: { open: "10:00", close: "19:00" },
  3: null,
  4: { open: "10:00", close: "19:00" },
  5: { open: "10:00", close: "19:00" },
  6: { open: "10:00", close: "17:00" },
};

// 予約枠を区切る単位（分）
export const SLOT_INTERVAL_MIN = 30;

// この日数より先の予約は受け付けない
export const MAX_BOOKING_DAYS_AHEAD = 60;

export const PAIN_AREAS = [
  "首",
  "肩",
  "背中",
  "腰",
  "股関節",
  "膝",
  "頭",
  "その他",
];
