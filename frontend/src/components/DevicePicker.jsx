import { Link } from 'react-router-dom';
import { IconPhone, IconTablet, IconLaptop, IconWatch, IconConsole } from './Icons.jsx';
import Reveal from './Reveal.jsx';
import './DevicePicker.css';

const categories = [
  { label: 'Mobile Phone', icon: IconPhone },
  { label: 'iPad', icon: IconTablet },
  { label: 'Tablet', icon: IconTablet },
  { label: 'Laptop', icon: IconLaptop },
  { label: 'Smartwatch', icon: IconWatch },
  { label: 'Console', icon: IconConsole },
];

export default function DevicePicker() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <p className="mono-tag">01 · Choose your device</p>
            <h2 className="section-title">What needs fixing today?</h2>
            <p className="section-sub">
              Select a device type, then tell us what's wrong. We'll quote you before any work begins.
            </p>
          </div>
        </Reveal>

        <div className="device-grid">
          {categories.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal delay={i * 60} key={c.label}>
                <Link to="/book" state={{ deviceCategory: c.label }} className="device-card">
                  <Icon className="device-card__icon" />
                  <span className="device-card__label">{c.label}</span>
                  <span className="device-card__cta">Book now</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
