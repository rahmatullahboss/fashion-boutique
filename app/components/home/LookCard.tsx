import { Link } from "react-router-dom";
import "./LookCard.css";

interface LookCardProps {
  title: string;
  category: string;
  price: string;
  image: string;
  slug: string;
}

export default function LookCard({ title, category, price, image, slug }: LookCardProps) {
  return (
    <Link to={`/product/${slug}`} className="look-card card">
      <div className="card-image">
        <img src={image} alt={title} loading="lazy" />
        <div className="look-card-overlay">
          <span className="btn btn-accent">Quick View</span>
        </div>
      </div>
      <div className="card-body">
        <span className="text-label">{category}</span>
        <h3 className="look-card-title">{title}</h3>
        <span className="look-card-price text-mono">{price}</span>
      </div>
    </Link>
  );
}
