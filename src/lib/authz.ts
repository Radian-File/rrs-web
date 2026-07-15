import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

export async function requireOwner() {
  const user = await requireUser();
  if (user.role !== "OWNER") redirect("/client");
  return user;
}

export async function requireClient() {
  const user = await requireUser();
  if (user.role !== "CLIENT") redirect("/owner");
  return user;
}
