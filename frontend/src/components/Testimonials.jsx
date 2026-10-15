import { useEffect, useState } from 'react';
import { getTestimonials } from '../utils/api.js';
import { testimonials as fallback } from '../data/fallback.js';
import Reveal from './Reveal.jsx';
import './Testimonials.css';

export default function Testimonials() {
  const [items, setItems] = useState(fallback);

  useEffect(() => {
    let active = true;
    getTestimonials()
      .then((res) => {
        if (active && res.data?.data?.length) setItems(res.data.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section testimonials">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <p className="mono-tag">What customers say</p>
            <h2 className="section-title">Trusted by people who need it fixed right.</h2>
          </div>
        </Reveal>

        <div className="testi-grid">
          {items.map((t, i) => (
            <Reveal delay={i * 80} key={t.name}>
              <div className="testi-card">
                <div className="testi-card__stars" aria-label={`${t.rating} out of 5 stars`}>
                  {'★'.repeat(t.rating)}
                  {'☆'.repeat(5 - t.rating)}
                </div>
                <p className="testi-card__msg">&ldquo;{t.message}&rdquo;</p>
                <div className="testi-card__who">
                  <span className="testi-card__name">{t.name}</span>
                  {t.role && <span className="testi-card__role">{t.role}</span>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
