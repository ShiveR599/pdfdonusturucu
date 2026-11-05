/**
 * Hataları YALNIZCA ziyaretçinin kendi tarayıcı konsoluna yazar (F12 → Konsol).
 * Hiçbir sunucuya gönderilmez, hiçbir yerde saklanmaz. Dosya içeriği veya IBAN gibi
 * kullanıcı verisi buraya yazılmamalıdır; yalnızca hatanın nerede oluştuğu ve hata nesnesi.
 */
export function logError(where: string, error: unknown): void {
  if (typeof console === "undefined") return;
  console.error(`[PDF Dönüştürücü] ${where}:`, error);
}
