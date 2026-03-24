import { Link, useLocation } from "react-router-dom";
import "./MobileNav.css";

const navItems = [
  { path: "/", icon: "home_max", label: "Home" },
  { path: "/collection", icon: "auto_awesome_motion", label: "Collections" },
  { path: "/lookbook", icon: "collections", label: "Lookbook" },
  { path: "/cart", icon: "person_outline", label: "Profile" },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="mobile-nav hide-desktop">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${isActive ? "active" : ""}`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="mobile-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
