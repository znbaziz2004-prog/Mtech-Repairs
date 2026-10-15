import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from './CartContext';
import './Navbar.css';

const links = [
  { to: '/repairs', label: 'Repairs' },
  { to: '/buy-sell', label: 'Buy & Sell' },
  { to: '/accessories', label: 'Accessories' },
  { to: '/diagnostics', label: 'Diagnostics' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [links.length]);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__row">
        <Link to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <img src="/assets/logo-mark.png" alt="Mtech n repairs logo" className="navbar__logo-img" />
          <span className="navbar__brand-text">Mtech & repairs</span>
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
  <Link to="/cart" className="navbar__cart">
    Cart
    {cartCount > 0 && (
      <span className="navbar__cart-count">
        {cartCount}
      </span>
    )}
  </Link>

  <Link to="/book" className="btn navbar__cta">
    Book a Repair
  </Link>
</div>

        <button
          className={`navbar__burger ${open ? 'is-open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`navbar__mobile ${open ? 'is-open' : ''}`}>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className="navbar__mobile-link" onClick={() => setOpen(false)}>
            {l.label}
          </NavLink>
        ))}
        <Link to="/book" className="btn navbar__cta navbar__cta--mobile" onClick={() => setOpen(false)}>
          Book a Repair
        </Link>
      </div>
    </header>
  );
}
