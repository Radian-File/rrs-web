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

function hasExpectedSignature(bytes: Buffer, mimeType: string) {
  if (mimeType === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") return bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mimeType === "image/webp") return bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  if (mimeType === "application/pdf") return bytes.subarray(0, 5).toString("ascii") === "%PDF-";
  return false;
}

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
  if (!hasExpectedSignature(bytes, file.type)) throw new Error("File content does not match its declared type.");
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
