// Tüm araçların listesi: menü, ana sayfa ve site haritası buradan beslenir.
export const TOOLS = [
  { to: "/pdf-jpg", label: "PDF'ten Görsele", short: "PDF → JPG", desc: "PDF sayfalarını JPEG, PNG veya WebP görsele çevirin." },
  { to: "/jpg-pdf", label: "Görselden PDF'e", short: "JPG → PDF", desc: "Fotoğraf ve görselleri tek bir PDF'te toplayın." },
  { to: "/pdf-birlestir", label: "PDF Birleştir", short: "Birleştir", desc: "Birden fazla PDF'i istediğiniz sırayla tek belgede birleştirin." },
  { to: "/pdf-bol", label: "PDF Böl", short: "Böl", desc: "PDF'i sayfa aralıklarına veya tek tek sayfalara ayırın." },
  { to: "/pdf-sikistir", label: "PDF Sıkıştır", short: "PDF Sıkıştır", desc: "Taranmış ve görsel ağırlıklı PDF'lerin boyutunu küçültün." },
  { to: "/pdf-sayfa-duzenle", label: "PDF Sayfa Düzenle", short: "Sayfa Düzenle", desc: "Sayfaları sıralayın, döndürün veya silin." },
  { to: "/resim-sikistir", label: "Resim Sıkıştır", short: "Resim Sıkıştır", desc: "JPEG, PNG ve WebP görsellerin boyutunu küçültün." },
] as const;

// PDF dışındaki yardımcı araçlar (menüde ayrı başlık altında gösterilir).
export const EXTRA_TOOLS = [
  { to: "/iban-dogrulama", label: "IBAN Doğrulama", short: "IBAN", desc: "IBAN'ın doğru yazıldığını kontrol edin, bankasını görün." },
] as const;

export type ToolPath = (typeof TOOLS)[number]["to"];
