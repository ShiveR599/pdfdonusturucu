import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, Sun, Moon, Menu, X, ShieldCheck } from "lucide-react";
import { CookieBanner } from "./CookieBanner";

const NAV = [
  { to: "/", label: "PDF Dönüştürücü" },
  { to: "/pdf-sikistir", label: "PDF Sıkıştır" },
  { to: "/resim-sikistir", label: "Resim Sıkıştır" },
  { to: "/pdf-birlestir", label: "PDF Birleştir" },
  { to: "/sss", label: "SSS" },
  { to: "/blog", label: "Blog" },
] as const;

const FOOTER_LINKS = [
  { to: "/nasil-kullanilir", label: "Nasıl Kullanılır" },
  { to: "/guvenlik", label: "Güvenlik & Gizlilik" },
  { to: "/hakkimizda", label: "Hakkımızda" },
  { to: "/iletisim", label: "İletişim" },
  { to: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
] as const;

export function Layout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-[Inter,system-ui,sans-serif] flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-base sm:text-lg">PDF Dönüştürücü</span>
              <span className="hidden lg:block text-xs text-slate-500 dark:text-slate-400">PDF & Görsel İşleme · Ücretsiz · Güvenli · Sınırsız</span>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-1 flex-wrap">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                activeProps={{ className: "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300" }}
                className="px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <button onClick={toggleDark} aria-label="Tema değiştir" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setOpen((o) => !o)} aria-label="Menü" className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="px-4 py-2 flex flex-col">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: true }}
                  activeProps={{ className: "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300" }}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {n.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 flex gap-4">
        <aside className="hidden lg:block w-[160px] shrink-0">
          <div className="sticky top-24 w-[160px] min-h-[600px] bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-xs text-slate-400 overflow-hidden">
            <ins className="adsbygoogle block w-full" style={{ display: "block", width: 160, height: 600 }} data-ad-client="ca-pub-8147032819898233" data-ad-slot="auto" data-ad-format="auto" />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="block lg:hidden mb-4 h-[90px] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden">
            <ins className="adsbygoogle block w-full h-full" style={{ display: "block" }} data-ad-client="ca-pub-8147032819898233" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true" />
          </div>
          {children}
          <div className="block lg:hidden mt-6 h-[90px] bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden">
            <ins className="adsbygoogle block w-full h-full" style={{ display: "block" }} data-ad-client="ca-pub-8147032819898233" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true" />
          </div>
        </main>

        <aside className="hidden lg:block w-[160px] shrink-0">
          <div className="sticky top-24 w-[160px] min-h-[600px] bg-slate-100 dark:bg-slate-900 rounded-xl flex items-center justify-center text-xs text-slate-400 overflow-hidden">
            <ins className="adsbygoogle block w-full" style={{ display: "block", width: 160, height: 600 }} data-ad-client="ca-pub-8147032819898233" data-ad-slot="auto" data-ad-format="auto" />
          </div>
        </aside>
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-5">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base">PDF Dönüştürücü</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            {FOOTER_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:underline"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-accent-600 dark:text-accent-400" />
            <span>KVKK uyumlu gizlilik politikası ile korunan bir hizmettir.</span>
          </div>
          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            © 2026 PDF Dönüştürücü
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}
