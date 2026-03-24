import "./FloatingLookbook.css";

const lookbookItems = [
  {
    id: 1,
    title: "SILK STRUCTURE",
    label: "Available Now",
    image: "/lookbook-autumn.webp",
  },
  {
    id: 2,
    title: "MUTED SAGE",
    label: "Limited Edition",
    image: "/lookbook-monochrome.webp",
  },
];

export default function FloatingLookbook() {
  return (
    <section className="floating-lookbook hide-desktop">
      <div className="lookbook-scroll no-scrollbar">
        {lookbookItems.map((item) => (
          <div key={item.id} className="lookbook-item">
            <div className="lookbook-card">
              <img
                className="lookbook-image"
                src={item.image}
                alt={item.title}
              />
              <div className="lookbook-overlay glass-card">
                <h3 className="lookbook-title">{item.title}</h3>
                <p className="lookbook-label">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
