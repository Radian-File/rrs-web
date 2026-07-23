import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { getServerEnv } from "@/lib/env";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id || !session.user.role) return new NextResponse("Unauthorized", { status: 401 });

  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, role: true } });
  if (!currentUser || currentUser.role !== session.user.role) return new NextResponse("Session expired", { status: 401 });

  const { id } = await params;
  const file = await prisma.fileAsset.findUnique({
    where: { id },
    include: {
      project: { select: { clientId: true } },
      paymentAttempt: { select: { clientId: true } },
    },
  });
  if (!file) return new NextResponse("Not found", { status: 404 });

  const authorized = currentUser.role === "OWNER" || file.project?.clientId === currentUser.id || file.paymentAttempt?.clientId === currentUser.id;
  if (!authorized) return new NextResponse("Forbidden", { status: 403 });

  const root = path.resolve(getServerEnv().LOCAL_UPLOAD_DIR);
  const location = path.resolve(root, file.storageKey);
  if (!location.startsWith(`${root}${path.sep}`)) return new NextResponse("Invalid file", { status: 400 });

  try {
    const data = await readFile(location);
    return new NextResponse(data, {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("File unavailable", { status: 404 });
  }
}
