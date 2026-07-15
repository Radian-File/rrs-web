import { createHash, randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { getServerEnv } from "@/lib/env";

const allowedTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
};

export type StoredFile = {
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  checksum: string;
};

export async function storePrivateFile(file: File, prefix: string): Promise<StoredFile> {
  const env = getServerEnv();
  const extension = allowedTypes[file.type];
  if (!extension) throw new Error("Unsupported file type. Use JPG, PNG, WebP, or PDF.");
  if (file.size > env.MAX_UPLOAD_SIZE_MB * 1024 * 1024) throw new Error(`File exceeds ${env.MAX_UPLOAD_SIZE_MB} MB.`);

  const bytes = Buffer.from(await file.arrayBuffer());
  const storageKey = `${prefix}/${randomUUID()}${extension}`;
  const destination = path.resolve(env.LOCAL_UPLOAD_DIR, storageKey);
  const root = path.resolve(env.LOCAL_UPLOAD_DIR);
  if (!destination.startsWith(root + path.sep)) throw new Error("Invalid storage path.");

  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, bytes, { flag: "wx" });

  return {
    storageKey,
    originalName: path.basename(file.name).slice(0, 255),
    mimeType: file.type,
    size: file.size,
    checksum: createHash("sha256").update(bytes).digest("hex"),
  };
}

export async function removePrivateFile(storageKey: string) {
  const root = path.resolve(getServerEnv().LOCAL_UPLOAD_DIR);
  const destination = path.resolve(root, storageKey);
  if (!destination.startsWith(root + path.sep)) return;
  await unlink(destination).catch(() => undefined);
}
