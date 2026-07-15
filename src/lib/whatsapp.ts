export function normalizeWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}

export function formatWhatsAppNumber(value: string) {
  const digits = normalizeWhatsAppNumber(value);
  if (!digits.startsWith("62")) return `+${digits}`;
  const local = digits.slice(2);
  return `+62 ${local.slice(0, 3)} ${local.slice(3, 7)} ${local.slice(7)}`.trim();
}

export function createWhatsAppUrl(number: string, message?: string) {
  const url = new URL(`https://wa.me/${normalizeWhatsAppNumber(number)}`);
  if (message) url.searchParams.set("text", message);
  return url.toString();
}
