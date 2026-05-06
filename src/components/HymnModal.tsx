import { useState, useEffect } from "react";
import { Hymn } from "../types";

export default function HymnModal({ hymn, onClose }: { hymn: Hymn; onClose: () => void }) {
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
        <button className="modal__close" onClick={onClose}>✕</button>
        
        <div className="modal__header">
          <div className="modal__number">{hymn.number}</div>
          <h2 className="modal__title">{hymn.title}</h2>
          <div className="modal__divider" />
        </div>
        
        <div className="modal__body">
          {hymn.verses.map(v => (
            <div key={v.num} className="verse">
              <div className="verse__num">{v.num}</div>
              <div className="verse__text">
                {v.text.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
              </div>
            </div>
          ))}
          
          {hymn.refrain && (
            <div className="refrain">
              <div className="refrain__label">Refrain</div>
              <div className="refrain__text">
                {hymn.refrain.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
