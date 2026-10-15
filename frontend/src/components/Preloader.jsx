import { useEffect, useState } from 'react';
import './Preloader.css';

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 650);
    const removeTimer = setTimeout(() => setVisible(false), 1000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`preloader ${fading ? 'is-fading' : ''}`} aria-hidden="true">
      <div className="preloader__mark">
        <img src="/assets/logo-mark.png" alt="" className="preloader__logo" />
        <svg className="preloader__ring" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" />
        </svg>
      </div>
    </div>
  );
}
