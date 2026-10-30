import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, H2, UL } from "../components/LegalPage";
import { seo, SITE_NAME, CONTACT_EMAIL } from "../lib/site";

export const Route = createFileRoute("/kullanim-kosullari")({
  head: () =>
    seo({
      title: `Kullanım Koşulları – ${SITE_NAME}`,
      description: "PDF Dönüştürücü araçlarının kullanım koşulları ve sorumluluk sınırları.",
      path: "/kullanim-kosullari",
      type: "article",
    }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Kullanım Koşulları">
      <p>Bu siteyi kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.</p>

      <H2>1. Hizmetin Niteliği</H2>
      <p>
        {SITE_NAME}, PDF ve görsel dosyalarını tarayıcınızda işleyen ve IBAN numaralarını doğrulayan ücretsiz araçlar sunar. Dosyalar
        ve girilen bilgiler sunucuya gönderilmez; tüm işlem sizin cihazınızda, sizin tarayıcınız tarafından yapılır. Hizmet için üyelik gerekmez ve herhangi bir ücret alınmaz.
      </p>

      <H2>2. "Olduğu Gibi" Sunum</H2>
      <p>
        Araçlar "olduğu gibi" ve "mevcut hâliyle" sunulur. Araçların kesintisiz, hatasız çalışacağı, her dosyayla uyumlu olacağı veya
        belirli bir amaca uygun sonuç vereceği garanti edilmez. Sonuçlar; dosyanın yapısına, tarayıcınıza ve cihazınızın belleğine göre
        farklılık gösterebilir.
      </p>

      <H2>3. Kullanıcının Sorumluluğu</H2>
      <UL
        items={[
          "Orijinal dosyalarınızın yedeğini saklamak sizin sorumluluğunuzdadır. Araçlar orijinal dosyanızı değiştirmez; her zaman yeni bir dosya oluşturur.",
          "Oluşan dosyayı kullanmadan önce (özellikle resmi başvuru, sözleşme, fatura gibi önemli belgelerde) kontrol etmeniz gerekir.",
          "Yalnızca işleme hakkına sahip olduğunuz dosyaları kullanmalısınız. Başkalarına ait telif hakkıyla korunan, kişisel veri içeren veya hukuka aykırı içerikteki dosyaların işlenmesinden kullanıcı sorumludur.",
          "Şifreli veya korumalı belgelerin korumasını aşmaya yönelik kullanım amaçlanmamıştır ve desteklenmez.",
          "IBAN Doğrulama aracının 'geçerli' sonucu yalnızca IBAN'ın yazım kurallarına uygun olduğunu gösterir; hesabın var olduğunu, açık olduğunu veya kime ait olduğunu göstermez. Gösterilen banka adı, IBAN'daki banka koduna göre bilgilendirme amaçlıdır. Para transferi öncesinde alıcı bilgilerini bankanız üzerinden kontrol etmek ve transfer kararları kullanıcının sorumluluğundadır.",
        ]}
      />

      <H2>4. Sorumluluğun Sınırlandırılması</H2>
      <p>
        Yürürlükteki mevzuatın izin verdiği ölçüde; araçların kullanımından veya kullanılamamasından doğan veri kaybı, hatalı/eksik çıktı,
        iş kaybı ve benzeri doğrudan veya dolaylı zararlardan site sahibi sorumlu tutulamaz. Dosyalar sunucuya gelmediği için site sahibinin
        dosyalarınıza erişimi, bunları kurtarma veya geri getirme imkânı yoktur.
      </p>

      <H2>5. Reklamlar ve Üçüncü Taraf Bağlantıları</H2>
      <p>
        Sitede, onay vermeniz hâlinde Google AdSense tarafından reklamlar gösterilir. Reklamların içeriği ve reklamlardaki bağlantılarla
        gidilen sitelerden site sahibi sorumlu değildir. Ayrıntılar için{" "}
        <Link to="/gizlilik-politikasi" className="text-primary-600 dark:text-primary-400 underline">
          Gizlilik Politikası
        </Link>
        'na bakınız.
      </p>

      <H2>6. Değişiklik ve Hizmetin Sonlandırılması</H2>
      <p>Site sahibi, araçları ve bu koşulları önceden bildirimde bulunmaksızın değiştirebilir, askıya alabilir veya sonlandırabilir.</p>

      <H2>7. Uygulanacak Hukuk</H2>
      <p>Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Tüketici sıfatıyla sahip olduğunuz yasal haklar saklıdır.</p>

      <H2>8. İletişim</H2>
      <p>
        Sorularınız için: <a className="text-primary-600 dark:text-primary-400 underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </LegalPage>
  );
}
