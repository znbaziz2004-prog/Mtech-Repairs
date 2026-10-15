import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/assets/logo-mark.png" alt="Mtech n repairs" className="footer__logo" />
          <p className="footer__tagline">Your trusted mobile technology partner.</p>
          <div className="footer__social" aria-label="Social media">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">ig</a>
            <a href="#" aria-label="X / Twitter">x</a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/reviews">Reviews</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        <div className="footer__col">
          <h4>Services</h4>
          <Link to="/repairs">Repairs</Link>
          <Link to="/diagnostics">Diagnostics</Link>
          <Link to="/repairs">Board-level repairs</Link>
          <Link to="/repairs">Microsoldering</Link>
        </div>

        <div className="footer__col">
          <h4>Shop</h4>
          <Link to="/buy-sell">Buy &amp; Sell</Link>
          <Link to="/accessories">Accessories</Link>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          <p>Phone: +44 000 000 0000</p>
          <p>Email: info@mtechnrepairs.co.uk</p>
          <p>Mon–Sat, 9am–6pm</p>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Mtech n repairs. All rights reserved.</span>
        <div className="footer__legal">
          <Link to="/contact">Privacy Policy</Link>
          <Link to="/contact">Terms &amp; Conditions</Link>
        </div>
        <span className="footer__specialist">LEVEL 3 &amp; LEVEL 4 SPECIALIST</span>
      </div>
    </footer>
  );
}
