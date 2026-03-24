import "./EditorialLooks.css";

const looks = [
  {
    id: 1,
    number: "01",
    title: "Structural Fluidity",
    description:
      "Embracing the contrast between rigid architectural forms and the soft drape of natural textiles.",
    image: "/editorial-structural.webp",
  },
  {
    id: 2,
    number: "02",
    title: "Muted Tones",
    description:
      "A study in restraint. Exploring the subtle variations of alabaster, charcoal, and sage.",
    image: "/editorial-muted.webp",
  },
];

export default function EditorialLooks() {
  return (
    <section className="editorial-looks">
      <div className="editorial-container">
        {looks.map((look, i) => (
          <div
            key={look.id}
            className={`editorial-block ${i % 2 === 1 ? "editorial-block--reversed" : ""}`}
          >
            <div className={`editorial-image-wrap ${i % 2 === 1 ? "editorial-image--offset" : ""}`}>
              <img
                className="editorial-image"
                src={look.image}
                alt={look.title}
                width={600}
                height={800}
                fetchPriority="high"
                loading="eager"
              />
            </div>
            <div className="editorial-info">
              <span className="editorial-number">Look {look.number}</span>
              <h2 className="editorial-title">{look.title}</h2>
              <p className="editorial-desc">{look.description}</p>
              <a className="editorial-btn" href="#">
                Discover
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
