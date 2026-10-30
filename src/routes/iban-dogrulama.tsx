import { createFileRoute } from "@tanstack/react-router";
import { IbanCheck } from "../components/IbanCheck";
import { ToolDescription } from "../components/ToolDescription";
import { OtherTools } from "../components/ToolPage";
import { seo, SITE_NAME } from "../lib/site";

const FAQ = [
  {
    q: "IBAN doğrulama ne işe yarar?",
    a: "Para göndermeden önce IBAN'ın eksik, fazla veya yanlış yazılıp yazılmadığını kontrol eder. IBAN'daki iki kontrol hanesi sayesinde tek bir rakam hatası veya iki rakamın yer değiştirmesi büyük olasılıkla yakalanır.",
  },
  {
    q: "IBAN'dan banka adı nasıl bulunur?",
    a: "Türk IBAN'larında TR ve iki kontrol hanesinden sonraki 5 hane banka kodudur. Örneğin 00064 İş Bankası'nı, 00010 Ziraat Bankası'nı gösterir. Araç bu kodu güncel banka listesiyle eşleştirir.",
  },
  {
    q: "IBAN'dan şube veya hesap sahibi öğrenilebilir mi?",
    a: "Hayır. Türk IBAN'ında şube bilgisi standart bir yerde bulunmaz; her banka hesap bölümünü kendi sistemine göre düzenler. Hesap sahibinin adı ise IBAN'da hiç yer almaz ve yalnızca bankalar tarafından görülebilir.",
  },
  {
    q: "IBAN geçerli çıktı, para kesin doğru kişiye gider mi?",
    a: "Hayır. Geçerli sonucu yalnızca IBAN'ın doğru yazıldığını gösterir. Hesabın açık olduğunu ve alıcının kim olduğunu bu araç bilemez. Para göndermeden önce bankanızın ekranında görünen alıcı adını mutlaka kontrol edin.",
  },
  {
    q: "Girdiğim IBAN kaydediliyor mu?",
    a: "Hayır. Kontrol tamamen tarayıcınızda yapılır; IBAN hiçbir sunucuya gönderilmez ve kaydedilmez.",
  },
];

export const Route = createFileRoute("/iban-dogrulama")({
  head: () => ({
    ...seo({
      title: `IBAN Doğrulama ve Banka Sorgulama – ${SITE_NAME}`,
      description:
        "IBAN numarasının doğru yazılıp yazılmadığını anında kontrol edin ve hangi bankaya ait olduğunu öğrenin. Ücretsiz; IBAN tarayıcınızda kontrol edilir, hiçbir yere gönderilmez.",
      path: "/iban-dogrulama",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">IBAN Doğrulama</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          IBAN'ın doğru yazıldığını kontrol edin ve hangi bankaya ait olduğunu görün — IBAN'ınız cihazınızdan çıkmaz.
        </p>
      </div>
      <IbanCheck />
      <ToolDescription
        title="Türk IBAN'ı Nasıl Okunur?"
        items={[
          "Türk IBAN'ı 26 karakterdir: TR + 2 haneli kontrol numarası + 5 haneli banka kodu + 1 haneli rezerv alan (her zaman 0) + 16 haneli hesap bölümü.",
          "Örneğin IBAN'ı TR'den sonra iki kontrol hanesi ve ardından 00064 ile devam eden bir hesap İş Bankası'na, 00010 ile devam eden bir hesap Ziraat Bankası'na aittir.",
          "Kontrol haneleri, IBAN'daki diğer tüm karakterlerden matematiksel olarak hesaplanır (ISO 13616, mod 97). Bu sayede yazım hataları büyük olasılıkla yakalanır.",
          "Şube kodu ve hesap sahibinin adı IBAN'ın standart bir parçası değildir; bu nedenle araç bu bilgileri göstermez.",
          "Araç Türkiye dışındaki IBAN'ları da (ör. DE, GB, NL) uluslararası kurallara göre doğrular; banka adı yalnızca Türk IBAN'larında gösterilir.",
        ]}
      />
      <section className="mt-8 max-w-3xl">
        <h2 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300">Sık Sorulan Sorular</h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <div key={f.q} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
              <h3 className="font-semibold text-sm">{f.q}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
      <OtherTools current="/iban-dogrulama" />
    </div>
  );
}
