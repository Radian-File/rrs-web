import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, companyName: true, role: true },
  });

  if (!user || user.role !== session.user.role) redirect("/auth/session-expired");
  return user;
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
