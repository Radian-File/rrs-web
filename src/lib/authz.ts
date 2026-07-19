import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { loginUrl } from "@/lib/auth-redirect";

const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user || user.role !== session.user.role) redirect("/auth/session-expired");
  return user;
});

export async function requireUser() {
  return getCurrentUser();
}

export async function requireOwner() {
  const user = await requireUser();
  if (user.role !== "OWNER") redirect("/client");
  return user;
}

export async function requireClient(callbackUrl?: string) {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) redirect(callbackUrl ? loginUrl(callbackUrl) : "/login");
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, whatsappNumber: true, companyName: true },
  });
  if (!user || user.role !== session.user.role) redirect("/auth/session-expired");
  if (user.role !== "CLIENT") redirect("/owner");
  return user;
}
