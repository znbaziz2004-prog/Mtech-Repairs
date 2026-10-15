import { Link } from 'react-router-dom';
import { IconGear, IconSwap, IconCharger, IconPulse } from './Icons.jsx';
import TraceDivider from './TraceDivider.jsx';
import Reveal from './Reveal.jsx';
import './Pillars.css';

const pillars = [
  {
    to: '/repairs',
    icon: IconGear,
    title: 'Repair',
    tag: 'Level 3 & Level 4',
    desc: 'Professional mobile repairs.',
  },
  {
    to: '/buy-sell',
    icon: IconSwap,
    title: 'Buy & sell',
    tag: null,
    desc: 'New | Used | Refurbished.',
  },
  {
    to: '/accessories',
    icon: IconCharger,
    title: 'Accessories',
    tag: null,
    desc: 'Chargers | Cables | Cases.',
  },
  {
    to: '/diagnostics',
    icon: IconPulse,
    title: 'Diagnostics & solutions',
    tag: null,
    desc: 'Fast, accurate, reliable.',
  },
];

export default function Pillars() {
  return (
    <section className="pillars section-tight">
      <div className="container">
        <div className="pillars__grid">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal delay={i * 90} key={p.title}>
                <Link to={p.to} className="pillar">
                  {i > 0 && <span className="pillar__rule" aria-hidden="true" />}
                  <Icon className="pillar__icon" />
                  <h3 className="pillar__title">{p.title}</h3>
                  {p.tag && <span className="pillar__tag">{p.tag}</span>}
                  <p className="pillar__desc">{p.desc}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
      <div className="container">
        <TraceDivider />
      </div>
    </section>
  );
}
