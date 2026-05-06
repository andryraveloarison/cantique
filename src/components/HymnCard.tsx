import { Hymn } from "../types";

export default function HymnCard({ hymn, onClick }: { hymn: Hymn; onClick: () => void }) {
  const firstLine = hymn.verses[0]?.text?.split('\n')[0] ?? "";

  return (
    <button className="hymn-card" onClick={onClick}>
      <div className="hymn-card__left">
        <span className="hymn-card__num-big">{hymn.number.split(' ').pop()}</span>
      </div>
      <div className="hymn-card__right">
        <div className="hymn-card__category">{hymn.category || "Cantique"}</div>
        <h3 className="hymn-card__title">{hymn.title}</h3>
        <p className="hymn-card__preview">{firstLine}…</p>
        <div className="hymn-card__count">{hymn.verses.length} str.</div>
      </div>
    </button>
  );
}
