import { describe, expect, test } from "bun:test";
import { analyzeIban, cleanIban } from "../src/lib/iban";
import { composeIBAN } from "../src/lib/vendor/ibantools";

// Gerçek hesaplar yerine kontrol hanesi doğru hesaplanmış yapay IBAN'lar kullanılır.
const make = (bank: string, account = "0000000000000001") => composeIBAN({ countryCode: "TR", bban: `${bank}0${account}` })!;

describe("analyzeIban", () => {
  test("geçerli Türk IBAN'ı ve banka adı", () => {
    const r = analyzeIban(make("00064"));
    expect(r.valid).toBe(true);
    expect(r.tr?.bank?.name).toBe("İş Bankası");
    expect(r.tr?.eftCode).toBe("0064");
  });
  test("boşluklu, tireli, küçük harfli ve 'IBAN:' önekli giriş", () => {
    const iban = make("00010");
    const messy = "IBAN: " + iban.toLowerCase().replace(/(.{4})/g, "$1-");
    const r = analyzeIban(messy);
    expect(r.valid).toBe(true);
    expect(r.input).toBe(iban);
    expect(r.tr?.bank?.name).toBe("Ziraat Bankası");
  });
  test("bölünmez boşluk ve tam genişlik karakterler", () => {
    const iban = make("00062");
    expect(analyzeIban(iban.replace(/(.{4})/g, "$1 ")).valid).toBe(true);
    expect(analyzeIban(iban.replace(/[A-Z0-9]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0xfee0))).valid).toBe(true);
  });
  test("TR yazılmadan girilen 24 rakam", () => {
    const iban = make("00012");
    const r = analyzeIban(iban.slice(2));
    expect(r.valid).toBe(true);
    expect(r.autoAddedTR).toBe(true);
  });
  test("tek rakam hatası yakalanır", () => {
    const iban = make("00046");
    const last = iban.at(-1)!;
    const broken = iban.slice(0, -1) + (last === "9" ? "8" : String(Number(last) + 1));
    const r = analyzeIban(broken);
    expect(r.valid).toBe(false);
    expect(r.errors.join(" ")).toContain("Kontrol hanesi");
  });
  test("eksik ve fazla hane mesajı", () => {
    const iban = make("00046");
    expect(analyzeIban(iban.slice(0, -1)).errors[0]).toContain("1 eksik");
    expect(analyzeIban(iban + "1").errors[0]).toContain("1 fazla");
  });
  test("rezerv alan (10. hane) 0 değilse geçersiz", () => {
    const withReserve = composeIBAN({ countryCode: "TR", bban: "0006410000000000000001" })!;
    expect(analyzeIban(withReserve).valid).toBe(false);
  });
  test("listede olmayan banka kodu", () => {
    const r = analyzeIban(make("09999"));
    expect(r.valid).toBe(true);
    expect(r.tr?.bank).toBeNull();
  });
  test("yabancı IBAN ve geçersiz ülke", () => {
    expect(analyzeIban("DE89370400440532013000").valid).toBe(true);
    expect(analyzeIban("XX123").valid).toBe(false);
    expect(analyzeIban("").valid).toBe(false);
  });
  test("cleanIban", () => {
    expect(cleanIban(" tr12 3456\n")).toBe("TR123456");
  });
});
