import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import repairTypes from '../data/repairTypes.js';
import { IconGear } from './Icons.jsx';
import './RepairTypeGrid.css';

export default function RepairTypeGrid() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <p className="mono-tag">Repair catalog</p>
            <h2 className="section-title">Expert repairs. Every device.</h2>
            <p className="section-sub">
              Sample pricing shown for illustration — your exact quote is confirmed after inspection.
            </p>
          </div>
        </Reveal>

        <div className="rtg-grid">
          {repairTypes.map((r, i) => (
            <Reveal delay={(i % 3) * 80} key={r.key}>
              <div className="rtg-card">
                <IconGear className="rtg-card__icon" />
                <h3 className="rtg-card__title">{r.label}</h3>
                <p className="rtg-card__desc">{r.desc}</p>
                <div className="rtg-card__meta">
                  <span className="mono-tag">£{r.priceFrom}–£{r.priceTo}</span>
                  <span className="rtg-card__time">{r.time}</span>
                </div>
                <Link
                  to="/book"
                  state={{ service: r.label }}
                  className="rtg-card__link"
                >
                  Book repair →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
