import { describe, expect, test } from "bun:test";
import { moveItem, fitWithin, formatBytes, imageMime, isPdf } from "../src/lib/format";

describe("format yardımcıları", () => {
  test("moveItem", () => {
    expect(moveItem([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
    expect(moveItem([1, 2, 3], 2, 0)).toEqual([3, 1, 2]);
    expect(moveItem([1, 2, 3], 0, 5)).toEqual([1, 2, 3]);
  });
  test("fitWithin büyük görseli küçültür, küçüğe dokunmaz", () => {
    expect(fitWithin(8000, 6000, 4000)).toEqual({ w: 4000, h: 3000 });
    expect(fitWithin(800, 600, 4000)).toEqual({ w: 800, h: 600 });
  });
  test("formatBytes", () => {
    expect(formatBytes(500)).toBe("500 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.00 MB");
  });
  test("dosya türü tanıma (tür bilgisi boş gelse bile)", () => {
    expect(imageMime(new File([], "foto.JPG", { type: "" }))).toBe("image/jpeg");
    expect(imageMime(new File([], "foto.heic", { type: "image/heic" }))).toBeNull();
    expect(isPdf(new File([], "Belge.PDF", { type: "" }))).toBe(true);
  });
});
