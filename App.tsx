import { useState, useEffect, useRef } from "react";
import hymnsData from './src/data/hymns.json';
import './App.css';

type Verse = { num: number; text: string };
type Hymn = { id: number; number: string; title: string; verses: Verse[]; refrain?: string; category: string };

const hymns: Hymn[] = (hymnsData as Hymn[]).filter(h => h?.title && h?.verses?.length);

/* ─── PRELOADER ─── */
function Preloader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"cross" | "text" | "out">("cross");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 700);
    const t2 = setTimeout(() => setPhase("out"), 2200);
    const t3 = setTimeout(onDone, 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className={`preloader ${phase === "out" ? "preloader--out" : ""}`}>
      <div className="pre-line pre-line-h" />
      <div className="pre-line pre-line-v" />
      <div className="pre-dot">+</div>
      <div className="cross-wrap">
        <svg viewBox="0 0 80 100" fill="none" width="80" height="100">
          <rect x="27" y="0" width="26" height="100" rx="4" fill="#4a8c3f" />
          <rect x="0" y="22" width="80" height="26" rx="4" fill="#3d7a34" />
          <rect x="32" y="22" width="5" height="78" rx="2" fill="#2d5e28" opacity="0.4" />
          <rect x="32" y="22" width="80" height="5" rx="2" fill="#2d5e28" opacity="0.4" />
        </svg>
        <div className="pixel pc-tl" /><div className="pixel pc-tr" />
        <div className="pixel pc-bl" /><div className="pixel pc-br" />
      </div>
      <div className={`pre-title ${phase !== "cross" ? "pre-title--show" : ""}`}>
        CANTIQUE FFPM
      </div>
    </div>
  );
}

/* ─── HYMN CARD ─── */
function HymnCard({ hymn, onClick }: { hymn: Hymn; onClick: () => void }) {
  const firstLine = hymn.verses[0]?.text?.split('\n')[0] ?? "";
  return (
    <button className="hymn-card" onClick={onClick}>
      <div className="card-num">{hymn.number}</div>
      <div className="card-title">{hymn.title}</div>
      {firstLine && <div className="card-preview">{firstLine}…</div>}
      <div className="card-meta">
        <span className="card-verses">{hymn.verses.length} strophe{hymn.verses.length > 1 ? 's' : ''}</span>
        <span className="card-arrow">→</span>
      </div>
    </button>
  );
}

/* ─── MODAL ─── */
function HymnModal({ hymn, onClose }: { hymn: Hymn; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 10);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      className={`modal-overlay ${open ? "modal-overlay--open" : ""}`}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="modal-num">{hymn.number}</div>
          <h2 className="modal-title">{hymn.title}</h2>
          <div className="modal-divider" />
        </div>
        <div className="modal-body">
          {hymn.verses.map(v => (
            <div key={v.num} className="verse">
              <div className="verse-num">{v.num}</div>
              <div className="verse-text">
                {v.text.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
              </div>
            </div>
          ))}
          {hymn.refrain && (
            <div className="refrain">
              <div className="refrain-label">Refrain</div>
              <div className="refrain-text">
                {hymn.refrain.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── APP ─── */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selected, setSelected] = useState<Hymn | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus l'input quand la barre s'ouvre
  useEffect(() => {
    if (showSearch) setTimeout(() => inputRef.current?.focus(), 80);
  }, [showSearch]);

  const toggleSearch = () => {
    if (showSearch) { setSearch(""); setShowSearch(false); }
    else setShowSearch(true);
  };

  const filtered = hymns.filter(h => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      h.number.toLowerCase().includes(q) ||
      h.title.toLowerCase().includes(q) ||
      h.verses.some(v => v.text.toLowerCase().includes(q))
    );
  });

  if (loading) return <Preloader onDone={() => setLoading(false)} />;

  return (
    <div className="app">

      {/* ── TOPBAR ── */}
      <header className="topbar">
        {/* Croix à gauche */}
        <div className="topbar-cross">
          <svg viewBox="0 0 40 50" fill="none" width="28" height="35">
            <rect x="13" y="0" width="14" height="50" rx="3" fill="rgba(255,255,255,0.95)" />
            <rect x="0" y="11" width="40" height="14" rx="3" fill="rgba(255,255,255,0.78)" />
          </svg>
        </div>

        {/* Titre centre */}
        <div className="topbar-center">
          <p className="topbar-sup">Recueil officiel</p>
          <h1 className="topbar-title">CANTIQUES FFPM</h1>
        </div>

        {/* Bouton recherche à droite */}
        <button
          className={`topbar-search-btn ${showSearch ? "topbar-search-btn--active" : ""}`}
          onClick={toggleSearch}
          aria-label="Rechercher"
        >
          {showSearch ? (
            /* X pour fermer */
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          ) : (
            /* Loupe */
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
              <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2.2" />
              <path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </header>

      {/* ── BARRE DE RECHERCHE (toggle) ── */}
      <div className={`search-wrap ${showSearch ? "search-wrap--open" : ""}`}>
        <div className="search-inner">
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16" className="search-ico">
            <circle cx="10.5" cy="10.5" r="6.5" stroke="#999" strokeWidth="2" />
            <path d="M15.5 15.5L20 20" stroke="#999" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Numéro ou titre du cantique…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        {search && (
          <p className="search-count">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</p>
        )}
      </div>

      {/* ── GRILLE ── */}
      <main className="main">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">♪</div>
            <p>Aucun cantique trouvé</p>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((h, i) => (
              <div
                key={h.id}
                className="grid-item"
                style={{ animationDelay: `${Math.min(i, 25) * 35}ms` }}
              >
                <HymnCard hymn={h} onClick={() => setSelected(h)} />
              </div>
            ))}
          </div>
        )}
      </main>

      {selected && <HymnModal hymn={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}