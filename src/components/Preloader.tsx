import { useState, useEffect } from "react";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"cross" | "text" | "out">("cross");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 700);
    const t2 = setTimeout(() => setPhase("out"), 2200);
    const t3 = setTimeout(onDone, 2900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className={`preloader ${phase === "out" ? "preloader--out" : ""}`}>
      <div className="preloader__bg" />
      <div className="preloader__line preloader__line--top" />
      <div className="preloader__line preloader__line--bottom" />
      <div className="preloader__vline" />

      <div className="preloader__content">
        <div className="cross-wrap">
          <svg viewBox="0 0 80 100" className="cross-svg" fill="none">
            <rect className="cross-v" x="27" y="0" width="26" height="100" rx="4" fill="var(--green)" />
            <rect className="cross-h" x="0" y="22" width="80" height="26" rx="4" fill="var(--green2)" />
          </svg>

        </div>

        <div className={`preloader__title ${phase !== "cross" ? "preloader__title--show" : ""}`}>
          CANTIQUE FFPM
        </div>
      </div>
    </div>
  );
}
