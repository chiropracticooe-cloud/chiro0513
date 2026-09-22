import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifySessionValue } from "./auth";

export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  const val = store.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionValue(val);
}
