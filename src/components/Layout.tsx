import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { FileText, Sun, Moon, Menu, X, ShieldCheck, ChevronDown } from "lucide-react";
import { CookieBanner } from "./CookieBanner";
import { AdSlot } from "./AdSlot";
import { AD_SLOTS } from "../lib/adSlots";
import { TOOLS, EXTRA_TOOLS } from "../lib/tools";
import { useConsent, openConsentBanner } from "../lib/consent";
import { SITE_NAME } from "../lib/site";

const NAV_EXTRA = [
  { to: "/sss", label: "SSS" },
  { to: "/blog", label: "Blog" },
] as const;

const FOOTER_LINKS = [
  { to: "/nasil-kullanilir", label: "Nasıl Kullanılır" },
  { to: "/ozelliklerimiz", label: "Özellikler" },
  { to: "/guvenlik", label: "Güvenlik" },
  { to: "/hakkimizda", label: "Hakkımızda" },
  { to: "/iletisim", label: "İletişim" },
  { to: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { to: "/kullanim-kosullari", label: "Kullanım Koşulları" },
] as const;

const linkCls = "px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition";
const activeCls = { className: "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300" };

export function Layout({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const consent = useConsent();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const showAds = consent === "accepted";

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  // Sayfa değişince menüleri kapat.
  useEffect(() => {
    setOpen(false);
    setToolsOpen(false);
  }, [path]);

  // Araçlar menüsü dışına tıklanınca kapat.
  useEffect(() => {
    if (!toolsOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!toolsRef.current?.contains(e.target as Node)) setToolsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setToolsOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [toolsOpen]);

  // Bırakma alanı dışına yanlışlıkla dosya bırakılırsa tarayıcı dosyayı açıp sayfadan çıkmasın.
  useEffect(() => {
    const block = (e: DragEvent) => {
      if (e.defaultPrevented) return;
      if (e.dataTransfer?.types.includes("Files")) {
        e.preventDefault();
        if (e.type === "dragover") e.dataTransfer.dropEffect = "none";
      }
    };
    window.addEventListener("dragover", block);
    window.addEventListener("drop", block);
    return () => {
      window.removeEventListener("dragover", block);
      window.removeEventListener("drop", block);
    };
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  const toolActive = [...TOOLS, ...EXTRA_TOOLS].some((t) => t.to === path) || path === "/";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col">
      <a href="#icerik" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:px-3 focus:py-2 focus:bg-white focus:rounded">
        İçeriğe geç
      </a>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-base sm:text-lg">{SITE_NAME}</span>
              <span className="hidden lg:block text-xs text-slate-500 dark:text-slate-400">PDF & Görsel İşleme · Ücretsiz · Tarayıcıda</span>
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-1" aria-label="Ana menü">
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsOpen((o) => !o)}
                aria-expanded={toolsOpen}
                aria-haspopup="true"
                className={`${linkCls} inline-flex items-center gap-1 ${toolActive ? activeCls.className : ""}`}
              >
                Araçlar <ChevronDown className={`w-4 h-4 transition ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              {toolsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2">
                  {[...TOOLS, ...EXTRA_TOOLS].map((t) => (
                    <Link
                      key={t.to}
                      to={t.to}
                      activeProps={activeCls}
                      className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <span className="block text-sm font-semibold">{t.label}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400">{t.desc}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/pdf-birlestir" activeProps={activeCls} className={linkCls}>
              PDF Birleştir
            </Link>
            <Link to="/pdf-sikistir" activeProps={activeCls} className={linkCls}>
              PDF Sıkıştır
            </Link>
            {NAV_EXTRA.map((n) => (
              <Link key={n.to} to={n.to} activeProps={activeCls} className={linkCls}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <button onClick={toggleDark} aria-label="Tema değiştir" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menü"
              aria-expanded={open}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-h-[75vh] overflow-y-auto" aria-label="Mobil menü">
            <div className="px-4 py-2 flex flex-col">
              <span className="px-3 pt-2 pb-1 text-xs font-semibold uppercase text-slate-400">Araçlar</span>
              {TOOLS.map((t) => (
                <Link key={t.to} to={t.to} activeProps={activeCls} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                  {t.label}
                </Link>
              ))}
              {EXTRA_TOOLS.map((t) => (
                <Link key={t.to} to={t.to} activeProps={activeCls} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                  {t.label}
                </Link>
              ))}
              <span className="px-3 pt-3 pb-1 text-xs font-semibold uppercase text-slate-400">Bilgi</span>
              {NAV_EXTRA.map((n) => (
                <Link key={n.to} to={n.to} activeProps={activeCls} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
                  {n.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 flex gap-4">
        {showAds && (
          <aside className="hidden xl:block w-[160px] shrink-0">
            <AdSlot slot={AD_SLOTS.sidebarLeft} variant="sidebar" className="sticky top-24 w-[160px] min-h-[600px]" />
          </aside>
        )}

        <main id="icerik" className="flex-1 min-w-0">
          {showAds && <AdSlot slot={AD_SLOTS.mobileTop} variant="mobile" className="xl:hidden mb-4 min-h-[50px] overflow-hidden" />}
          {children}
          {showAds && <AdSlot slot={AD_SLOTS.mobileBottom} variant="mobile" className="xl:hidden mt-6 min-h-[50px] overflow-hidden" />}
        </main>

        {showAds && (
          <aside className="hidden xl:block w-[160px] shrink-0">
            <AdSlot slot={AD_SLOTS.sidebarRight} variant="sidebar" className="sticky top-24 w-[160px] min-h-[600px]" />
          </aside>
        )}
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-5">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base">{SITE_NAME}</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm" aria-label="Araçlar">
            {[...TOOLS, ...EXTRA_TOOLS].map((t) => (
              <Link key={t.to} to={t.to} className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:underline">
                {t.label}
              </Link>
            ))}
          </nav>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm" aria-label="Alt menü">
            {FOOTER_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:underline">
                {l.label}
              </Link>
            ))}
            <button
              onClick={openConsentBanner}
              className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:underline"
            >
              Çerez Tercihleri
            </button>
          </nav>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 text-center">
            <ShieldCheck className="w-4 h-4 shrink-0 text-accent-600 dark:text-accent-400" />
            <span>Dosyalarınız cihazınızda işlenir; sunucuya yüklenmez ve saklanmaz.</span>
          </div>
          <div className="text-center text-xs text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} {SITE_NAME}</div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}
