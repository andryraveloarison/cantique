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
          <img src="/logo2.png" alt="Logo" className="preloader__logo" />
        </div>

        <div className={`preloader__title ${phase !== "cross" ? "preloader__title--show" : ""}`}>
          CANTIQUE FFPM
        </div>
      </div>
    </div>
  );
}
