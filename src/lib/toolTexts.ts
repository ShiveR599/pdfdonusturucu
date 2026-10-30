// Araç açıklamaları: hem araç sayfalarında hem ana sayfada kullanılır.

export const TEXT_PDF_TO_IMAGE = {
  title: "PDF'ten Görsele Dönüştürme Nasıl Çalışır?",
  items: [
    "Yüklediğiniz PDF'in her sayfası tarayıcınızda pdf.js kütüphanesiyle çizilir ve JPEG, PNG veya WebP görsel olarak dışa aktarılır.",
    "Dosyalarınız hiçbir sunucuya gönderilmez; tüm işlem cihazınızın belleğinde gerçekleşir.",
    "Aynı anda birden fazla PDF yükleyebilirsiniz. Tek PDF yüklendiğinde sayfa aralığı yazarak seçim yapabilirsiniz (örneğin: 1-5, 8, 11-13).",
    "4 çözünürlük seviyesi vardır: Standart (108 DPI) ekranda görüntüleme, HD (216 DPI) ise baskı için uygundur.",
    "Sayfaya dokunarak büyütebilir, tek tek indirebilir ya da seçtiğiniz sayfaları tek ZIP dosyası olarak indirebilirsiniz.",
    "Safari ve iPhone tarayıcıları WebP kaydetmeyi desteklemediği için bu tarayıcılarda WebP seçeneği kapalıdır.",
  ],
};

export const TEXT_IMAGE_TO_PDF = {
  title: "Görselden PDF Oluşturma Nasıl Çalışır?",
  items: [
    "JPEG, PNG ve WebP görsellerinizi tek bir PDF dosyasında toplar. Her görsel A4 boyutunda ayrı bir sayfaya yerleştirilir.",
    "Yatay görseller otomatik olarak yatay A4 sayfaya, dikey görseller dikey sayfaya yerleştirilir.",
    "Görselleri sürükleyerek ya da ok düğmeleriyle sıralayabilir, 90° döndürebilir ve listeden çıkarabilirsiniz.",
    "Saydam PNG görsellerin arka planı beyaz yapılır. Çok büyük fotoğraflar baskı kalitesini koruyacak şekilde küçültülür.",
    "Tüm işlem tarayıcınızda gerçekleşir; görselleriniz hiçbir sunucuya yüklenmez.",
  ],
};

export const TEXT_SPLIT = {
  title: "PDF Bölme Nasıl Çalışır?",
  items: [
    "PDF Böl aracı, tek bir PDF'i belirttiğiniz sayfa aralıklarına göre ayrı PDF dosyalarına böler.",
    "Sayfa aralığı modunda '1-3, 5, 8-10' gibi aralıklar yazarsınız; virgülle ayrılan her aralık ayrı bir PDF olur.",
    "'Seçili her sayfayı ayrı PDF yap' modunda istediğiniz sayfaları işaretlersiniz; her biri ayrı bir PDF olarak oluşturulur.",
    "Birden fazla dosya oluşursa tümü tek ZIP dosyası olarak indirilir.",
    "Sayfalar yeniden çizilmeden kopyalandığı için kalite kaybı olmaz; metinler seçilebilir kalır.",
    "Tüm işlem tarayıcınızda gerçekleşir; dosyanız sunucuya gönderilmez.",
  ],
};

export const TEXT_EDIT = {
  title: "PDF Sayfa Düzenleme Nasıl Çalışır?",
  items: [
    "PDF'inizdeki sayfaları yeniden sıralayabilir, 90° döndürebilir veya istemediğiniz sayfaları silebilirsiniz.",
    "Bilgisayarda sayfaları sürükleyerek, telefonda ve tablette ok düğmelerine dokunarak sıralama yapabilirsiniz.",
    "'Sıfırla' düğmesi tüm değişiklikleri geri alır ve silinen sayfaları geri getirir.",
    "Sayfalar yeniden çizilmeden kopyalandığı için kalite kaybı olmaz; metinler seçilebilir kalır.",
    "Tüm işlem tarayıcınızda gerçekleşir; dosyanız sunucuya gönderilmez.",
  ],
};

export const TEXT_MERGE = {
  title: "PDF Birleştirme Nasıl Çalışır?",
  items: [
    "Birden fazla PDF dosyasını seçtiğiniz sırayla tek bir belgede birleştirir.",
    "Sıralamayı sürükleyerek ya da ok düğmeleriyle değiştirebilirsiniz; birleşik belgede sayfalar bu sırayla yer alır.",
    "Sayfalar yeniden çizilmeden kopyalandığı için kalite kaybı olmaz; metinler seçilebilir kalır.",
    "Şifreli veya korumalı PDF'ler birleştirilemez; önce şifrelerinin kaldırılması gerekir.",
    "Tüm işlem pdf-lib kütüphanesiyle tarayıcınızda gerçekleşir; dosyalarınız hiçbir sunucuya gönderilmez.",
  ],
};

export const TEXT_PDF_COMPRESS = {
  title: "PDF Sıkıştırma Nasıl Çalışır?",
  items: [
    "Her sayfa seçilen çözünürlükte görüntüye çevrilir ve JPEG olarak yeniden kaydedilir. Sayfa ölçüleri (A4 vb.) değişmez.",
    "Bu yöntem taranmış belgelerde ve fotoğraf ağırlıklı PDF'lerde büyük küçülme sağlar.",
    "Önemli: Sıkıştırılmış PDF'teki yazılar seçilemez, kopyalanamaz ve aranamaz; bağlantılar ve form alanları kaldırılır. Metin içeriği önemliyse orijinal dosyanızı saklayın.",
    "Yüksek sıkıştırma e-posta ve mesajlaşma için, orta sıkıştırma genel kullanım için, düşük sıkıştırma baskı için uygundur.",
    "Sonuç orijinalden büyük çıkarsa size daha büyük dosya verilmez; orijinal korunur.",
    "Tüm işlem tarayıcınızda gerçekleşir; dosyalarınız sunucuya gönderilmez.",
  ],
};

export const TEXT_IMAGE_COMPRESS = {
  title: "Resim Sıkıştırma Nasıl Çalışır?",
  items: [
    "Tarayıcınızın yerleşik Canvas özelliğiyle JPEG, PNG ve WebP görsellerin boyutu küçültülür. Hiçbir veri sunucuya gönderilmez.",
    "JPEG ve WebP görseller seçilen kalite ayarıyla yeniden kaydedilir; çok büyük görsellerin çözünürlüğü de düşürülür.",
    "PNG kayıpsız bir format olduğundan PNG'lerde yalnızca çözünürlük küçültülür.",
    "Sonuç orijinalden büyük çıkarsa orijinal dosyanız korunur; size asla daha büyük bir dosya verilmez.",
    "Her görsel için önceki ve sonraki boyut gösterilir; tümünü tek ZIP dosyası olarak indirebilirsiniz.",
  ],
};

export const TEXT_IBAN = {
  title: "IBAN Doğrulama Nasıl Çalışır?",
  items: [
    "IBAN'ı boşluklu veya boşluksuz yazın ya da yapıştırın; sonuç yazarken anında görünür.",
    "IBAN'daki kontrol haneleri uluslararası kurala (ISO 13616, mod 97) göre hesaplanır; eksik/fazla hane veya yanlış yazılmış rakam yakalanır.",
    "Türk IBAN'larında 5–9. hanelerdeki banka kodundan bankanın adı gösterilir.",
    "Şube ve hesap sahibi bilgisi IBAN'ın standart bir parçası değildir; bu nedenle gösterilmez.",
    "'Geçerli' sonucu hesabın var olduğunu veya kime ait olduğunu göstermez; para göndermeden önce alıcı adını bankanızda kontrol edin.",
    "IBAN hiçbir yere gönderilmez ve kaydedilmez; kontrol tarayıcınızda yapılır.",
  ],
};
