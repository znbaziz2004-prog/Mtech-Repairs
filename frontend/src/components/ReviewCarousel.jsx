import { useEffect, useState } from 'react';
import { getTestimonials } from '../utils/api.js';
import { testimonials as fallback } from '../data/fallback.js';
import './ReviewCarousel.css';

export default function ReviewCarousel() {
  const [items, setItems] = useState(fallback);
  const [index, setIndex] = useState(0);

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

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 5000);
    return () => clearInterval(id);
  }, [items.length]);

  if (!items.length) return null;
  const t = items[index];

  const go = (dir) => {
    setIndex((i) => (i + dir + items.length) % items.length);
  };

  return (
    <div className="carousel">
      <div className="carousel__card" key={index}>
        <div className="carousel__stars">
          {'★'.repeat(t.rating)}
          {'☆'.repeat(5 - t.rating)}
        </div>
        <p className="carousel__msg">&ldquo;{t.message}&rdquo;</p>
        <div className="carousel__who">
          <span className="carousel__name">{t.name}</span>
          {t.role && <span className="carousel__role">{t.role}</span>}
        </div>
      </div>

      <div className="carousel__controls">
        <button type="button" className="carousel__btn" onClick={() => go(-1)} aria-label="Previous review">
          ←
        </button>
        <div className="carousel__dots">
          {items.map((_, i) => (
            <button
              type="button"
              key={i}
              className={`carousel__dot ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
        <button type="button" className="carousel__btn" onClick={() => go(1)} aria-label="Next review">
          →
        </button>
      </div>
    </div>
  );
}
