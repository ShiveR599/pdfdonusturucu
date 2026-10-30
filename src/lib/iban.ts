import { validateIBAN, ValidationErrorsIBAN, friendlyFormatIBAN, countrySpecs } from "./vendor/ibantools";
import { TR_BANKS, type TrBank } from "./trBanks";

export type IbanAnalysis = {
  input: string; // temizlenmiş hâli (boşluksuz, büyük harf)
  autoAddedTR: boolean; // kullanıcı "TR" yazmadıysa otomatik eklendi mi
  valid: boolean;
  errors: string[];
  formatted: string;
  countryCode: string;
  countryName: string;
  checkDigits: string;
  // Yalnızca Türk IBAN'ları için:
  tr?: {
    bankCode: string; // 5 hane, ör. 00064
    eftCode: string; // 4 hane, ör. 0064
    bank: TrBank | null;
    reserve: string; // 10. hane, normalde "0"
    account: string; // 16 haneli hesap bölümü
  };
};

/** Kopyala-yapıştırda gelen boşluk, tire, nokta ve görünmez karakterleri temizler. */
export function cleanIban(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(/[\s​-‍﻿.\-_/]/g, "")
    .replace(/^IBAN:?/i, "")
    .toLocaleUpperCase("en-US");
}

function countryName(code: string): string {
  if (code === "TR") return "Türkiye";
  try {
    const dn = new Intl.DisplayNames(["tr"], { type: "region" });
    return dn.of(code) ?? code;
  } catch {
    return code;
  }
}

const ERR: Record<number, string> = {
  [ValidationErrorsIBAN.NoIBANProvided]: "IBAN girilmedi.",
  [ValidationErrorsIBAN.NoIBANCountry]: "IBAN'ın ilk iki harfi geçerli bir ülke kodu değil (Türkiye için TR olmalı).",
  [ValidationErrorsIBAN.WrongBBANLength]: "IBAN'ın uzunluğu hatalı.",
  [ValidationErrorsIBAN.WrongBBANFormat]: "IBAN'da bu ülke için geçersiz karakter veya biçim var.",
  [ValidationErrorsIBAN.ChecksumNotNumber]: "Ülke kodundan sonraki iki hane (kontrol hanesi) rakam olmalı.",
  [ValidationErrorsIBAN.WrongIBANChecksum]:
    "Kontrol hanesi tutmuyor. Bir rakam yanlış yazılmış ya da iki rakamın yeri karışmış olabilir.",
  [ValidationErrorsIBAN.WrongAccountBankBranchChecksum]: "Hesap/banka bölümünün kendi kontrol hanesi hatalı.",
  [ValidationErrorsIBAN.QRIBANNotAllowed]: "QR-IBAN kabul edilmiyor.",
};

export function analyzeIban(raw: string): IbanAnalysis {
  let input = cleanIban(raw);
  let autoAddedTR = false;
  // Türkiye'de sık yapılan hata: "TR" yazmadan 24 rakam girmek.
  if (/^[0-9]{24}$/.test(input)) {
    input = "TR" + input;
    autoAddedTR = true;
  }

  const countryCode = input.slice(0, 2);
  const spec = (countrySpecs as Record<string, { chars?: number }>)[countryCode];
  const res = validateIBAN(input);
  const errors = Array.from(new Set(res.errorCodes)).map((c) => ERR[c] ?? "IBAN geçersiz.");

  // Uzunluk hatasına kaç karakter eksik/fazla olduğunu ekle.
  if (spec?.chars && input.length !== spec.chars && res.errorCodes.includes(ValidationErrorsIBAN.WrongBBANLength)) {
    const diff = input.length - spec.chars;
    const i = errors.indexOf(ERR[ValidationErrorsIBAN.WrongBBANLength]);
    errors[i] = `IBAN ${spec.chars} karakter olmalı; girdiğiniz ${input.length} karakter (${Math.abs(diff)} ${diff > 0 ? "fazla" : "eksik"}).`;
  }

  // Uzunluk hatası varsa biçim ve kontrol hanesi hataları doğal sonuçtur; kullanıcıyı yanıltmamak için gizle.
  if (res.errorCodes.includes(ValidationErrorsIBAN.WrongBBANLength)) {
    const hide = [ERR[ValidationErrorsIBAN.WrongIBANChecksum]];
    if (/^[A-Z0-9]*$/.test(input)) hide.push(ERR[ValidationErrorsIBAN.WrongBBANFormat]);
    for (const h of hide) {
      const i = errors.indexOf(h);
      if (i >= 0) errors.splice(i, 1);
    }
  }

  const out: IbanAnalysis = {
    input,
    autoAddedTR,
    valid: res.valid,
    errors,
    formatted: friendlyFormatIBAN(input) ?? input,
    countryCode,
    countryName: spec ? countryName(countryCode) : "",
    checkDigits: input.slice(2, 4),
  };

  if (countryCode === "TR" && input.length >= 9) {
    const bankCode = input.slice(4, 9);
    const eftCode = bankCode.slice(1);
    out.tr = {
      bankCode,
      eftCode,
      bank: /^[0-9]{5}$/.test(bankCode) ? (TR_BANKS[eftCode] ?? null) : null,
      reserve: input.slice(9, 10),
      account: input.slice(10),
    };
    // Türk IBAN'ında 10. hane (rezerv alan) her zaman 0'dır.
    if (out.valid && out.tr.reserve !== "0") {
      out.valid = false;
      out.errors.push("Türk IBAN'larında 10. hane her zaman 0 olmalıdır.");
    }
  }
  return out;
}
