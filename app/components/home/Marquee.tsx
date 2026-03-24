import "./Marquee.css";

export default function Marquee() {
  const text = "AUTUMN / WINTER 2026  ·  NEW ARRIVALS  ·  FLUID MODERNITY  ·  ATELIER ALABASTER  ·  ";

  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        <span className="marquee-text">{text}</span>
        <span className="marquee-text">{text}</span>
        <span className="marquee-text">{text}</span>
      </div>
    </div>
  );
}
