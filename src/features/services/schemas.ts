import { z } from "zod";

const optionalText = z.string().trim().transform((value) => value || undefined).optional();
const linesToList = z.string().trim().min(2, "Tambahkan setidaknya satu item.").max(3000).transform((value) => value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean));
const aliasesToList = z.string().trim().transform((value) => [...new Map(value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean).slice(0, 20).map((item) => [item.toLowerCase(), item])).values()]);

export const serviceSchema = z.object({
  title: z.string().trim().min(2, "Judul minimal 2 karakter.").max(160),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Gunakan slug huruf kecil, angka, dan tanda hubung.").max(160),
  summary: z.string().trim().min(10, "Ringkasan minimal 10 karakter.").max(500),
  description: z.string().trim().min(20, "Deskripsi minimal 20 karakter.").max(10000),
  serviceTypeId: z.string().cuid("Pilih jenis layanan yang valid."),
  startingPrice: z.preprocess((value) => value === "" ? undefined : value, z.coerce.number().finite().min(0, "Harga tidak boleh negatif.").optional()),
  deliveryEstimate: optionalText,
  revisionGuidance: optionalText,
  deliverables: linesToList,
  technologies: linesToList,
  searchAliases: aliasesToList,
  coverImageUrl: z.preprocess((value) => value === "" ? undefined : value, z.string().url("Gunakan URL gambar yang valid.").optional()),
  isFeatured: z.preprocess((value) => value === "on", z.boolean()),
  isPublished: z.preprocess((value) => value === "on", z.boolean()),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
