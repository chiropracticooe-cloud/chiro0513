import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, "app.db");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

declare global {
  // eslint-disable-next-line no-var
  var __chiroDb: Database.Database | undefined;
}

function createConnection(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      menu_id TEXT NOT NULL,
      menu_label TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      duration_min INTEGER NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);

    CREATE TABLE IF NOT EXISTS questionnaires (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      kana TEXT,
      birth_date TEXT,
      gender TEXT,
      phone TEXT,
      pain_areas TEXT,
      chief_complaint TEXT,
      symptom_since TEXT,
      medical_history TEXT,
      medications TEXT,
      allergies TEXT,
      past_treatment TEXT,
      first_visit INTEGER,
      agree_privacy INTEGER NOT NULL,
      reservation_id INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (reservation_id) REFERENCES reservations(id)
    );
  `);
  return db;
}

export function getDb(): Database.Database {
  if (!global.__chiroDb) {
    global.__chiroDb = createConnection();
  }
  return global.__chiroDb;
}

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type Reservation = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  menu_id: string;
  menu_label: string;
  date: string;
  start_time: string;
  duration_min: number;
  note: string | null;
  status: ReservationStatus;
  created_at: string;
};

export type Questionnaire = {
  id: number;
  name: string;
  kana: string | null;
  birth_date: string | null;
  gender: string | null;
  phone: string | null;
  pain_areas: string | null;
  chief_complaint: string | null;
  symptom_since: string | null;
  medical_history: string | null;
  medications: string | null;
  allergies: string | null;
  past_treatment: string | null;
  first_visit: number | null;
  agree_privacy: number;
  reservation_id: number | null;
  created_at: string;
};
