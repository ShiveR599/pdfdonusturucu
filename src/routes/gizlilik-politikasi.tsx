import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, H2, UL } from "../components/LegalPage";
import { seo, SITE_NAME, SITE_URL, CONTACT_EMAIL, OWNER_NAME, HOSTING_PROVIDER } from "../lib/site";
import { openConsentBanner } from "../lib/consent";

export const Route = createFileRoute("/gizlilik-politikasi")({
  head: () =>
    seo({
      title: `Gizlilik Politikası ve Çerez Aydınlatma Metni – ${SITE_NAME}`,
      description: "Hangi verilerin işlendiği, çerezler, Google AdSense ve KVKK kapsamındaki haklarınız hakkında aydınlatma metni.",
      path: "/gizlilik-politikasi",
      type: "article",
    }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Gizlilik Politikası ve Çerez Aydınlatma Metni">
      <p>
        Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") madde 10 uyarınca, {SITE_URL.replace("https://", "")} adresindeki{" "}
        {SITE_NAME} sitesini ("Site") kullanırken hangi verilerin işlendiğini açıklamak için hazırlanmıştır.
      </p>

      <H2>1. Veri Sorumlusu</H2>
      <p>
        Veri sorumlusu: {OWNER_NAME}. İletişim: <a className="text-primary-600 dark:text-primary-400 underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>

      <H2>2. Yüklediğiniz Dosyalar ve Girdiğiniz Bilgiler</H2>
      <p>
        Sitedeki araçlara eklediğiniz PDF ve görsel dosyalar ile IBAN Doğrulama aracına yazdığınız IBAN numaraları <strong>yalnızca kendi cihazınızda, tarayıcınızın belleğinde</strong> işlenir.
        Bunlar bize veya başka bir sunucuya gönderilmez, kaydedilmez, görüntülenmez ve saklanmaz. Sayfayı kapattığınızda veya
        yenilediğinizde tarayıcı belleğinden silinir. Bu nedenle dosyalarınızın ve girdiğiniz bilgilerin içeriği bakımından tarafımızca herhangi bir kişisel veri
        işlenmemektedir.
      </p>

      <H2>3. Üyelik, Form ve Analiz</H2>
      <p>
        Sitede üyelik, giriş, iletişim formu, yorum alanı veya ziyaretçi analiz aracı (ör. Google Analytics) <strong>yoktur</strong>. Ziyaretçilere ait bir veritabanı tutulmamaktadır.
      </p>

      <H2>4. Barındırma Hizmeti Kayıtları</H2>
      <p>
        Site, {HOSTING_PROVIDER} tarafından barındırılmaktadır. Her web sitesinde olduğu gibi, sayfaları size iletebilmek ve hizmetin
        güvenliğini sağlamak için barındırma sağlayıcısı tarafından teknik erişim kayıtları (IP adresi, tarayıcı ve cihaz bilgisi, istenen
        sayfa, tarih ve saat) otomatik olarak işlenir. Bu kayıtlar bize ait bir sistemde tutulmaz; sağlayıcının kendi politikası
        doğrultusunda sınırlı süre saklanır. Bu işleme, KVKK m. 5/2-f (meşru menfaat: sitenin çalışması ve güvenliği) hukuki sebebine
        dayanır. Sağlayıcının sunucuları yurt dışında bulunabileceğinden bu veriler KVKK m. 9 kapsamında yurt dışına aktarılabilir.
      </p>

      <H2>5. Tarayıcınızda Saklanan Bilgiler</H2>
      <p>Site, tarayıcınızın yerel depolama alanında (localStorage) yalnızca şu iki bilgiyi saklar. Bunlar cihazınızdan dışarı gönderilmez:</p>
      <UL
        items={[
          <><code>theme</code>: Açık/koyu tema tercihiniz.</>,
          <><code>cookie_consent</code>: Reklam çerezlerini kabul veya reddettiğiniz bilgisi (tercihinizi her sayfada tekrar sormamak için).</>,
        ]}
      />

      <H2>6. Reklam Çerezleri (Yalnızca Onayınızla)</H2>
      <p>
        Sitenin ücretsiz kalabilmesi için Google AdSense reklamları gösterilmektedir. Reklam sistemi <strong>yalnızca çerez bildirimindeki
        "Kabul Et" düğmesine basmanız hâlinde</strong> yüklenir. Onay vermezseniz Google'a herhangi bir istek gönderilmez, reklam çerezi
        yerleştirilmez ve reklam gösterilmez; sitenin tüm araçları yine eksiksiz çalışır.
      </p>
      <p>Onay vermeniz hâlinde:</p>
      <UL
        items={[
          "Google; çerez tanımlayıcıları, IP adresi, tarayıcı/cihaz bilgisi ve ziyaret edilen sayfa bilgisini reklam gösterimi, reklam ölçümü, sahtekârlığın önlenmesi ve (kişiselleştirilmiş reklam için) ilgi alanı tahmini amaçlarıyla işler.",
          "Bu işlemenin hukuki sebebi açık rızanızdır (KVKK m. 5/1). Google'ın sunucuları yurt dışında bulunduğundan veriler açık rızanıza dayanılarak yurt dışına aktarılır (KVKK m. 9).",
          "Google bu verileri kendi gizlilik politikası çerçevesinde, bağımsız olarak işler. Ayrıntılar: policies.google.com/technologies/partner-sites",
          "Kişiselleştirilmiş reklamları ayrıca adssettings.google.com adresinden kapatabilirsiniz.",
        ]}
      />
      <p>
        Onayınızı istediğiniz zaman{" "}
        <button onClick={openConsentBanner} className="text-primary-600 dark:text-primary-400 underline">
          Çerez Tercihleri
        </button>{" "}
        bağlantısından (sayfanın en altında da bulunur) geri alabilirsiniz. Geri alma, geri alma anından sonrasını etkiler; daha önce Google
        tarafından yerleştirilmiş çerezleri tarayıcınızın ayarlarından silebilirsiniz.
      </p>

      <H2>7. KVKK Madde 11 Kapsamındaki Haklarınız</H2>
      <UL
        items={[
          "Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse bilgi talep etme,",
          "İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,",
          "Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,",
          "Eksik veya yanlış işlenmişse düzeltilmesini, KVKK m. 7 şartlarıyla silinmesini veya yok edilmesini isteme ve bu işlemlerin aktarılan üçüncü kişilere bildirilmesini isteme,",
          "Münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme,",
          "Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme.",
        ]}
      />
      <p>
        Taleplerinizi <a className="text-primary-600 dark:text-primary-400 underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{" "}
        adresine iletebilirsiniz. Talepler en geç 30 gün içinde ücretsiz olarak yanıtlanır. Sitede tarafımızca tutulan bir ziyaretçi kaydı
        bulunmadığından, Google tarafından işlenen verilere ilişkin taleplerinizi doğrudan Google'a da iletebilirsiniz.
      </p>

      <H2>8. Değişiklikler</H2>
      <p>Bu metin gerektiğinde güncellenebilir. Güncel sürüm her zaman bu sayfada yayımlanır.</p>
    </LegalPage>
  );
}
