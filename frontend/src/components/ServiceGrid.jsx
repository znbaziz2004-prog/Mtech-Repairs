import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../utils/api.js';
import { services as fallbackServices } from '../data/fallback.js';
import Reveal from './Reveal.jsx';
import './ServiceGrid.css';

export default function ServiceGrid({ category, title, eyebrow, subtitle }) {
  const [services, setServices] = useState(
    category ? fallbackServices.filter((s) => s.category === category) : fallbackServices
  );

  useEffect(() => {
    let active = true;
    getServices(category ? { category } : {})
      .then((res) => {
        if (active && res.data?.data?.length) setServices(res.data.data);
      })
      .catch(() => {
        /* keep fallback data — API may not be running in this environment */
      });
    return () => {
      active = false;
    };
  }, [category]);

  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            {eyebrow && <p className="mono-tag">{eyebrow}</p>}
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-sub">{subtitle}</p>}
          </div>
        </Reveal>

        <div className="svc-grid">
          {services.map((s, i) => (
            <Reveal delay={(i % 3) * 90} key={s.title || s._id}>
              <div className="svc-card">
                <div className="svc-card__top">
                  <h3 className="svc-card__title">{s.title}</h3>
                  {s.level && s.level !== 'N/A' && <span className="svc-card__level">{s.level}</span>}
                </div>
                <p className="svc-card__desc">{s.description}</p>
                <div className="svc-card__meta">
                  <span className="mono-tag">from £{s.priceFrom}</span>
                  <span className="svc-card__time">{s.estTime}</span>
                </div>
                <Link to="/book" state={{ service: s.title }} className="svc-card__link">
                  Book this repair →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
