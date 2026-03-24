import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "product" | "article";
  canonicalPath?: string;
  jsonLd?: object | object[];
}

const BASE_URL = "https://atelier-alabaster.rahmatullahzisan.workers.dev";

export function useSEO({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  canonicalPath,
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Helper to set a meta tag
    const setMeta = (selector: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        const parts = selector.replace(/\[|\]/g, " ").trim().split(" = ");
        const attr = parts[0];
        const val = parts[1];
        if (attr) el.setAttribute(attr.trim(), val?.trim().replace(/"/g, "") || "");
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta('meta[name="description"]', description);
    if (keywords) setMeta('meta[name="keywords"]', keywords);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:type"]', ogType);
    if (ogImage) {
      setMeta('meta[property="og:image"]', ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`);
    }
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    if (ogImage) {
      setMeta('meta[name="twitter:image"]', ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`);
    }

    // Canonical
    if (canonicalPath !== undefined) {
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = `${BASE_URL}${canonicalPath}`;
    }

    // JSON-LD
    if (jsonLd) {
      const existing = document.getElementById("dynamic-json-ld");
      if (existing) existing.remove();
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema, i) => {
        const script = document.createElement("script");
        script.id = i === 0 ? "dynamic-json-ld" : `dynamic-json-ld-${i}`;
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      document.getElementById("dynamic-json-ld")?.remove();
    };
  }, [title, description, keywords, ogImage, ogType, canonicalPath, jsonLd]);
}

export default useSEO;
