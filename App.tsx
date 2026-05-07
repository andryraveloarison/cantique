import { useState, useEffect, useRef } from "react";
import hymnsData from './src/data/hymns.json';
// import './App.css'; // Removed to avoid conflicts with styles.css

import { Hymn } from "./src/types";
import Preloader from "./src/components/Preloader";
import HymnCard from "./src/components/HymnCard";
import HymnModal from "./src/components/HymnModal";

const hymns: Hymn[] = (hymnsData as Hymn[]).filter(h => h?.title && h?.verses?.length);

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
    <div className={`app ${!loading ? "app--visible" : ""}`}>



      <main className="main">
        {/* ── GRID ── */}
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty__icon">♪</div>
            <p>Aucun cantique trouvé pour "{search}"</p>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((h, i) => (
              <div
                key={h.id}
                className="grid__item"
                style={{ animationDelay: `${Math.min(i, 20) * 40}ms` }}
              >
                <HymnCard hymn={h} onClick={() => setSelected(h)} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── BOTTOM SEARCH ── */}
      <div className="bottom-bar">
        <div className="search-wrap">
          <input
            ref={inputRef}
            className="search"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <img src="/logo2.png" alt="Search" className="search-icon-img" />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
      </div>

      {selected && <HymnModal hymn={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}