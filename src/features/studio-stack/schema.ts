import { z } from "zod";

export const studioStackCategories = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
  "MOBILE",
  "TOOLING",
  "OTHER",
] as const;

export type StudioStackCategoryValue = (typeof studioStackCategories)[number];

export const studioStackCategoryLabels: Record<StudioStackCategoryValue, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DATABASE: "Database",
  DEVOPS: "DevOps",
  MOBILE: "Mobile",
  TOOLING: "Tooling",
  OTHER: "Other",
};

export const studioStackSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().trim().min(1, "Nama technology wajib diisi.").max(60, "Nama maksimal 60 karakter."),
  category: z.enum(studioStackCategories, { message: "Pilih category yang valid." }),
  sortOrder: z.coerce.number().int().min(0, "Urutan tidak boleh negatif.").max(9999, "Urutan terlalu besar."),
});

export function normalizeStudioStackSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
