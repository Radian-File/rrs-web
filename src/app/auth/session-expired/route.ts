import { NextResponse } from "next/server";
import { signOut } from "@/auth";

export async function GET(request: Request) {
  await signOut({ redirect: false, redirectTo: "/login?reason=session-expired" });
  return NextResponse.redirect(new URL("/login?reason=session-expired", request.url));
}
