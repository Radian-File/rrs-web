"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { assertRequestRateLimit, RateLimitError } from "@/lib/security/rate-limit";

const schema = z.object({ name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(100), email: z.string().email("Masukkan email yang valid."), whatsappNumber: z.string().trim().max(20).optional(), subject: z.string().trim().min(3, "Subjek minimal 3 karakter.").max(160), message: z.string().trim().min(20, "Pesan minimal 20 karakter.").max(5000) });
export type ContactActionState = { message?: string; errors?: Record<string, string[]> };

export async function submitContactAction(_state: ContactActionState, formData: FormData): Promise<ContactActionState> {
  try {
    await assertRequestRateLimit("contact", 5, 15 * 60 * 1000, String(formData.get("email") ?? "anonymous"));
    const parsed = schema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
    await prisma.contactMessage.create({ data: { ...parsed.data, whatsappNumber: parsed.data.whatsappNumber || null } });
  } catch (error) {
    if (error instanceof RateLimitError) return { message: error.message };
    return { message: "Pesan belum dapat dikirim. Silakan coba lagi." };
  }
  redirect("/contact?sent=1");
}
