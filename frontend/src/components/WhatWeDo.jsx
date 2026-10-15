import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import { IconGear, IconSwap, IconCharger, IconPulse } from './Icons.jsx';
import './WhatWeDo.css';

const items = [
  {
    icon: IconGear,
    title: 'Professional mobile repairs',
    points: [
      'Screen replacements',
      'Battery replacements',
      'Charging issues',
      'Camera repairs',
      'Speaker / microphone repairs',
      'Water damage',
      'Software issues',
    ],
    cta: 'Explore repairs',
    to: '/repairs',
  },
  {
    icon: IconSwap,
    title: 'Buy & sell mobiles',
    points: ['New devices', 'Used devices', 'Refurbished devices', 'Device upgrades', 'Trade-in options'],
    cta: 'View devices',
    to: '/buy-sell',
  },
  {
    icon: IconCharger,
    title: 'Accessories',
    points: ['Chargers', 'Cables', 'Cases', 'Screen protectors', 'Wireless accessories', 'More'],
    cta: 'Shop accessories',
    to: '/accessories',
  },
  {
    icon: IconPulse,
    title: 'Diagnostics & solutions',
    points: [
      'Advanced diagnostics',
      'Fault finding',
      'Software troubleshooting',
      'Hardware diagnostics',
      'Board-level solutions',
    ],
    cta: 'Explore diagnostics',
    to: '/diagnostics',
  },
];

export default function WhatWeDo() {
  return (
    <section className="section wwd">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <p className="mono-tag">What we do</p>
            <h2 className="section-title">Complete mobile technology solutions</h2>
            <p className="section-sub">
              From everyday repairs to advanced board-level diagnostics, we've got your device covered.
            </p>
          </div>
        </Reveal>

        <div className="wwd-grid">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <Reveal delay={i * 90} key={it.title}>
                <div className="wwd-card">
                  <Icon className="wwd-card__icon" />
                  <h3 className="wwd-card__title">{it.title}</h3>
                  <ul className="wwd-card__list">
                    {it.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <Link to={it.to} className="wwd-card__cta">
                    {it.cta} →
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
