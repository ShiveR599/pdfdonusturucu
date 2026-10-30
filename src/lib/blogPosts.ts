import type { ToolPath } from "./tools";

export type Block = { h?: string; p?: string; list?: string[]; steps?: string[] };

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO (YYYY-MM-DD)
  tag: string;
  tool?: { to: ToolPath; label: string };
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "pdf-dosyasi-nasil-kucultulur",
    title: "PDF Dosyası Nasıl Küçültülür?",
    description: "PDF'ler neden büyür, hangi PDF'ler iyi küçülür ve sıkıştırırken nelere dikkat etmeniz gerekir? Pratik rehber.",
    date: "2026-04-01",
    tag: "Rehber",
    tool: { to: "/pdf-sikistir", label: "PDF Sıkıştır aracını aç" },
    body: [
      {
        p: "E-posta eklerinde, resmi başvuru sistemlerinde ve mesajlaşma uygulamalarında dosya boyutu sınırları sık karşılaşılan bir sorundur. Bir PDF'in neden büyük olduğunu anlamak, onu doğru yöntemle küçültmenin ilk adımıdır.",
      },
      { h: "PDF'ler neden büyük olur?" },
      {
        list: [
          "Taranmış belgeler: Tarayıcıdan çıkan her sayfa aslında yüksek çözünürlüklü bir fotoğraftır.",
          "Yüksek çözünürlüklü görseller: Telefon fotoğrafları çoğu zaman gereğinden çok daha büyük çözünürlüktedir.",
          "Gömülü yazı tipleri: Bazı programlar kullanılan yazı tiplerinin tamamını dosyanın içine ekler.",
          "Gereksiz sayfalar: Boş sayfalar veya kullanılmayan ekler boyutu artırır.",
        ],
      },
      { h: "Hangi PDF'ler iyi küçülür?" },
      {
        p: "Görsel ağırlıklı ve taranmış PDF'ler genellikle büyük oranda küçülür. Sadece yazıdan oluşan, bir kelime işlemciden doğrudan kaydedilmiş PDF'ler ise zaten verimlidir; bunları görsele çevirerek sıkıştırmak boyutu küçültmek yerine büyütebilir. Aracımız bu durumu algılar ve size daha büyük bir dosya vermek yerine orijinali korur.",
      },
      { h: "Sıkıştırmanın bedeli: metin seçilemez hâle gelir" },
      {
        p: "Tarayıcıda çalışan sıkıştırma yöntemi her sayfayı görüntüye çevirir. Bu yüzden sıkıştırılmış dosyadaki yazılar artık seçilemez, kopyalanamaz ve aranamaz; bağlantılar ve form alanları da kaybolur. Sözleşme, fatura gibi metni önemli belgelerde orijinal dosyayı mutlaka saklayın.",
      },
      { h: "Adım adım" },
      {
        steps: [
          "PDF Sıkıştır sayfasını açın ve dosyanızı sürükleyin.",
          "Seviye seçin: e-posta için Yüksek, genel kullanım için Orta, baskı için Düşük sıkıştırma.",
          "Sıkıştır düğmesine basın; önceki ve sonraki boyutu karşılaştırın.",
          "Sonuç yeterli değilse bir üst sıkıştırma seviyesini deneyin.",
        ],
      },
      {
        p: "Gereksiz sayfaları önceden silmek de etkili bir yöntemdir: Sayfa Düzenle aracıyla kullanmadığınız sayfaları kaldırıp ardından sıkıştırabilirsiniz.",
      },
    ],
  },
  {
    slug: "jpeg-png-webp-farki",
    title: "JPEG, PNG ve WebP Arasındaki Fark Nedir?",
    description: "Üç popüler görsel formatının güçlü ve zayıf yanları; fotoğraf, ekran görüntüsü ve web için hangisini seçmelisiniz?",
    date: "2026-05-01",
    tag: "Bilgi",
    tool: { to: "/pdf-jpg", label: "PDF'ten Görsele aracını aç" },
    body: [
      { p: "Doğru görsel formatını seçmek hem dosya boyutunu hem de görüntü kalitesini doğrudan etkiler. Kısaca: fotoğraf için JPEG, keskin çizgi ve yazı için PNG, web'de en küçük boyut için WebP." },
      { h: "JPEG" },
      {
        p: "Fotoğraflar için en yaygın formattır. Kayıplı sıkıştırma kullanır; insan gözünün fark etmekte zorlandığı ayrıntıları atarak dosyayı küçültür. Saydamlığı desteklemez ve aynı dosya defalarca kaydedildikçe kalite kaybı birikir. Yazı ve keskin kenarlarda bulanık lekeler oluşabilir.",
      },
      { h: "PNG" },
      {
        p: "Kayıpsız bir formattır: kaydettiğiniz her piksel aynen korunur. Ekran görüntüleri, logolar, çizimler ve saydam arka plan gereken görseller için idealdir. Bedeli dosya boyutudur; aynı fotoğraf PNG olarak JPEG'e göre birkaç kat büyük olabilir.",
      },
      { h: "WebP" },
      {
        p: "Google'ın geliştirdiği modern bir formattır. Hem kayıplı hem kayıpsız sıkıştırmayı ve saydamlığı destekler; benzer kalitede çoğu zaman JPEG'den belirgin şekilde küçüktür. Güncel tarayıcıların tamamı WebP görüntüleyebilir. Ancak Safari ve iPhone tarayıcıları WebP kaydedemez; bu nedenle bu tarayıcılarda araçlarımızın WebP seçeneği kapalıdır.",
      },
      { h: "Hangisini seçmeliyim?" },
      {
        list: [
          "PDF sayfasını paylaşacak veya e-postayla gönderecekseniz: JPEG.",
          "Sayfada küçük yazılar, tablolar veya çizimler varsa: PNG.",
          "Görseli bir web sitesine koyacaksanız: WebP (desteklenen tarayıcıda).",
        ],
      },
    ],
  },
  {
    slug: "gorselleri-tek-pdf-yapma",
    title: "Birden Fazla Görseli Tek PDF'e Nasıl Birleştiririm?",
    description: "Fotoğrafları, taranmış belge görüntülerini veya ekran görüntülerini tek bir PDF dosyasında toplamak için adım adım rehber.",
    date: "2026-06-01",
    tag: "Rehber",
    tool: { to: "/jpg-pdf", label: "Görselden PDF'e aracını aç" },
    body: [
      { p: "Kimlik fotokopisi, dekont görüntüleri veya telefonla çekilmiş belge fotoğrafları çoğu kurumda tek bir PDF olarak istenir. Bu işlemi programa ihtiyaç duymadan tarayıcınızda yapabilirsiniz." },
      { h: "Adımlar" },
      {
        steps: [
          "Görselden PDF'e sayfasını açın.",
          "JPEG, PNG veya WebP görsellerinizi sürükleyip bırakın ya da seçin.",
          "Sıralamayı ayarlayın: bilgisayarda sürükleyerek, telefonda ok düğmelerine dokunarak.",
          "Yan duran bir görsel varsa döndürme düğmesiyle düzeltin.",
          "'PDF Oluştur ve İndir' düğmesine basın.",
        ],
      },
      { h: "İpuçları" },
      {
        list: [
          "Belge fotoğraflarını düz bir zeminde, gün ışığında ve tam karşıdan çekin.",
          "Yatay görseller otomatik olarak yatay A4 sayfaya yerleştirilir.",
          "iPhone'daki HEIC fotoğraflar desteklenmez; telefonun kamera ayarlarından 'En Uyumlu' formatı seçebilir veya fotoğrafı JPEG olarak paylaşabilirsiniz.",
          "Oluşan PDF büyükse PDF Sıkıştır aracıyla küçültebilirsiniz.",
        ],
      },
    ],
  },
  {
    slug: "pdf-nasil-bolunur",
    title: "PDF Nasıl Bölünür? Sayfa Aralığıyla Ayırma Rehberi",
    description: "Büyük bir PDF'ten belirli sayfaları ayırmanın, her sayfayı ayrı dosya yapmanın ve sayfa aralığı yazmanın en kolay yolu.",
    date: "2026-07-01",
    tag: "Rehber",
    tool: { to: "/pdf-bol", label: "PDF Böl aracını aç" },
    body: [
      { p: "Bir raporun yalnızca ilgili bölümünü göndermek, tek dosyada taranmış belgeleri ayırmak ya da büyük bir dosyayı yükleme sınırına uygun parçalara bölmek için PDF bölme işlemine ihtiyaç duyarsınız." },
      { h: "Sayfa aralığı nasıl yazılır?" },
      {
        list: [
          "Tek sayfa: 5",
          "Ardışık sayfalar: 1-3",
          "Birden fazla parça: 1-3, 5, 8-10 → üç ayrı PDF oluşur (1-3, 5 ve 8-10).",
        ],
      },
      { h: "Her sayfayı ayrı dosya yapmak" },
      {
        p: "'Seçili her sayfayı ayrı PDF yap' modunu seçin. Varsayılan olarak tüm sayfalar seçilidir; istemediğiniz sayfaların işaretini kaldırın. Oluşan dosyalar tek bir ZIP içinde iner.",
      },
      { h: "Kalite kaybı olur mu?" },
      {
        p: "Hayır. Bölme işleminde sayfalar yeniden çizilmez, olduğu gibi kopyalanır. Metinler seçilebilir kalır ve görsellerin kalitesi değişmez.",
      },
    ],
  },
  {
    slug: "pdf-birlestirme-rehberi",
    title: "PDF Birleştirme: Dosyaları Doğru Sırayla Tek Belgede Toplama",
    description: "Birden fazla PDF'i tek belgede birleştirirken sıralama, şifreli dosyalar ve dosya boyutu hakkında bilmeniz gerekenler.",
    date: "2026-08-01",
    tag: "Rehber",
    tool: { to: "/pdf-birlestir", label: "PDF Birleştir aracını aç" },
    body: [
      { p: "Başvuru evrakları, faturalar veya bir projenin bölümleri genellikle tek bir dosya hâlinde istenir. PDF Birleştir aracıyla dosyaları istediğiniz sırayla tek bir belgede toplayabilirsiniz." },
      {
        steps: [
          "PDF Birleştir sayfasında dosyalarınızı seçin (en az iki PDF).",
          "Listedeki sırayı sürükleyerek veya yukarı/aşağı oklarıyla ayarlayın.",
          "'PDF'leri Birleştir ve İndir' düğmesine basın.",
        ],
      },
      { h: "Sık karşılaşılan sorunlar" },
      {
        list: [
          "Şifreli PDF: Açılış veya düzenleme şifresi olan PDF'ler birleştirilemez. Önce şifreyi kaldırmanız gerekir.",
          "Dosya çok büyük: Birleştirilen dosyanın boyutu, parçaların toplamı kadardır. Gerekirse sonrasında PDF Sıkıştır aracını kullanın.",
          "Sayfa yönü: Yan duran sayfaları birleştirmeden önce Sayfa Düzenle aracıyla döndürebilirsiniz.",
        ],
      },
    ],
  },
  {
    slug: "cevrimici-pdf-araclarinda-gizlilik",
    title: "Çevrimiçi PDF Araçlarında Gizlilik: Dosyanız Nereye Gidiyor?",
    description: "Sunucuya yükleyen araçlarla tarayıcıda çalışan araçlar arasındaki fark ve hassas belgelerde dikkat edilmesi gerekenler.",
    date: "2026-09-01",
    tag: "Güvenlik",
    body: [
      { p: "Kimlik, maaş bordrosu, sağlık raporu veya sözleşme gibi belgeleri çevrimiçi bir araçla işlerken dosyanın nereye gittiğini bilmek önemlidir." },
      { h: "Sunucuya yükleyen araçlar" },
      {
        p: "Pek çok çevrimiçi araç dosyanızı kendi sunucusuna yükler, orada işler ve sonucu size geri gönderir. Bu süreçte dosyanızın bir kopyası başkasının bilgisayarında, bir süreliğine de olsa bulunur. Ne kadar süre saklandığı ve kimlerin erişebildiği o hizmetin politikasına bağlıdır.",
      },
      { h: "Tarayıcıda çalışan araçlar" },
      {
        p: "Bu sitedeki araçlar dosyalarınızı yüklemez. İşlemi yapan kod sayfayla birlikte tarayıcınıza iner ve dosyanız yalnızca cihazınızın belleğinde işlenir. Bunu kendiniz de doğrulayabilirsiniz: bilgisayar tarayıcısında geliştirici araçlarını (F12) açıp 'Ağ' (Network) sekmesine bakarken bir dosya işlediğinizde, dosyanızın hiçbir adrese gönderilmediğini görürsünüz.",
      },
      { h: "Her durumda dikkat edin" },
      {
        list: [
          "Hassas belgeleri ortak veya başkasına ait bilgisayarlarda işlemeyin.",
          "İndirdiğiniz dosyaları işiniz bitince 'İndirilenler' klasöründen silin.",
          "Önemli belgelerin orijinallerini her zaman saklayın.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
