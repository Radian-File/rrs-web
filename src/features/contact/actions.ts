"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { assertRequestRateLimit } from "@/lib/security/rate-limit";
const schema=z.object({name:z.string().trim().min(2).max(100),email:z.string().email(),whatsappNumber:z.string().trim().max(20).optional(),subject:z.string().trim().min(3).max(160),message:z.string().trim().min(20).max(5000)});
export async function submitContactAction(formData:FormData){await assertRequestRateLimit("contact",5,15*60*1000,String(formData.get("email")??"anonymous"));const data=schema.parse(Object.fromEntries(formData));await prisma.contactMessage.create({data:{...data,whatsappNumber:data.whatsappNumber||null}});redirect("/contact?sent=1")}
