import { useState, useEffect } from "react";
import "../styles/LookbookPage.css";

interface LookbookEntry {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string;
  sortOrder: number | null;
}

export default function LookbookPage() {
  const [entries, setEntries] = useState<LookbookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lookbook")
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="lookbook-page lookbook-loading">
        <span className="material-symbols-outlined loading-spinner">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="lookbook-page">
      <div className="lookbook-hero">
        <span className="lookbook-hero-label">The Lookbook</span>
        <h1 className="lookbook-hero-title">
          Visual <em>Narratives</em>
        </h1>
        <p className="lookbook-hero-desc">
          Each look tells a story of form meeting function — architectural lines
          softened by the drape of natural fibers.
        </p>
      </div>

      <div className="lookbook-entries">
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            className={`lookbook-entry ${i % 2 === 1 ? "lookbook-entry--reversed" : ""}`}
          >
            <div className="lookbook-entry-image">
              <img src={entry.imageUrl} alt={entry.title} />
            </div>
            <div className="lookbook-entry-info">
              <span className="lookbook-entry-subtitle">
                {entry.subtitle}
              </span>
              <h2 className="lookbook-entry-title">{entry.title}</h2>
              <p className="lookbook-entry-desc">{entry.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
