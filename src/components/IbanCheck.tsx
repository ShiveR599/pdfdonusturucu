import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, Copy, Check, Trash2 } from "lucide-react";
import { analyzeIban } from "../lib/iban";
import { TR_BANKS_UPDATED } from "../lib/trBanks";
import { InfoBox } from "./ToolUi";

function Row({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <dt className="sm:w-44 shrink-0 text-xs sm:text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className={`text-sm font-medium break-all ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}

export function IbanCheck() {
  const [value, setValue] = useState("");
  const [copied, setCopied] = useState<"" | "spaced" | "plain">("");
  const result = useMemo(() => (value.trim() ? analyzeIban(value) : null), [value]);

  async function copy(text: string, which: "spaced" | "plain") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* pano izni yoksa sessizce geç */
    }
  }

  const CopyBtn = ({ text, which }: { text: string; which: "spaced" | "plain" }) => (
    <button
      onClick={() => copy(text, which)}
      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-sans"
    >
      {copied === which ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied === which ? "Kopyalandı" : "Kopyala"}
    </button>
  );

  const tr = result?.tr;

  return (
    <div className="max-w-2xl mx-auto">
      <label htmlFor="iban" className="block text-sm font-semibold mb-2">
        IBAN numarası
      </label>
      <div className="flex gap-2">
        <input
          id="iban"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="TR00 0000 0000 0000 0000 0000 00"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          inputMode="text"
          maxLength={60}
          className="flex-1 min-w-0 px-4 py-3 text-base font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {value && (
          <button
            onClick={() => setValue("")}
            className="px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Temizle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Boşluklu veya boşluksuz yazabilir, doğrudan yapıştırabilirsiniz. IBAN'ınız hiçbir yere gönderilmez ve kaydedilmez; kontrol
        tarayıcınızda yapılır.
      </p>

      {result && (
        <div
          className={`mt-5 rounded-2xl border p-5 ${
            result.valid
              ? "border-accent-300 dark:border-accent-800 bg-accent-50 dark:bg-accent-900/20"
              : "border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
          }`}
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            {result.valid ? (
              <CheckCircle2 className="w-7 h-7 text-accent-600 dark:text-accent-400 shrink-0" />
            ) : (
              <XCircle className="w-7 h-7 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className={`text-lg font-bold ${result.valid ? "text-accent-800 dark:text-accent-200" : "text-red-700 dark:text-red-300"}`}>
                {result.valid ? "IBAN geçerli" : "IBAN geçersiz"}
              </p>
              {result.valid && tr?.bank && <p className="text-sm text-accent-800 dark:text-accent-200">{tr.bank.official}</p>}
              {!result.valid && (
                <ul className="mt-1 text-sm text-red-700 dark:text-red-300 list-disc pl-5 space-y-0.5">
                  {result.errors.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              )}
              {result.autoAddedTR && (
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Başına "TR" yazılmadığı için otomatik eklendi.</p>
              )}
            </div>
          </div>

          <dl className="mt-4 bg-white/70 dark:bg-slate-900/60 rounded-xl px-4">
            <Row
              label="Boşluklu IBAN"
              mono
              value={
                <span className="inline-flex items-center gap-2 flex-wrap">
                  {result.formatted}
                  {result.valid && <CopyBtn text={result.formatted} which="spaced" />}
                </span>
              }
            />
            <Row
              label="Boşluksuz IBAN"
              mono
              value={
                <span className="inline-flex items-center gap-2 flex-wrap">
                  {result.input}
                  {result.valid && <CopyBtn text={result.input} which="plain" />}
                </span>
              }
            />
            {result.countryName && <Row label="Ülke" value={`${result.countryName} (${result.countryCode})`} />}
            {tr && (
              <>
                <Row
                  label="Banka"
                  value={
                    tr.bank ? (
                      <>
                        {tr.bank.name}
                        {!result.valid && <span className="block text-xs font-normal text-amber-700 dark:text-amber-400">IBAN geçersiz olduğu için bu bilgi yanlış olabilir.</span>}
                      </>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-400">Bu banka kodu listemizde bulunamadı</span>
                    )
                  }
                />
                <Row label="Banka (EFT) kodu" mono value={tr.eftCode || "—"} />
                {result.valid && <Row label="Hesap bölümü" mono value={tr.account} />}
              </>
            )}
            {result.valid && <Row label="Kontrol hanesi" mono value={`${result.checkDigits} — doğru`} />}
          </dl>
        </div>
      )}

      <InfoBox>
        "Geçerli" sonucu, IBAN'ın doğru yazıldığını ve kurallara uygun olduğunu gösterir. Hesabın açık olduğunu veya kime ait olduğunu
        göstermez. Para göndermeden önce alıcının adını mutlaka bankanızın ekranında kontrol edin. Banka listesi: {TR_BANKS_UPDATED}.
      </InfoBox>
    </div>
  );
}
