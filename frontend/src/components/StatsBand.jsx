import Reveal from './Reveal.jsx';
import AnimatedCounter from './AnimatedCounter.jsx';
import './StatsBand.css';

// Sample placeholder figures only — replace with real business data before
// launch. See the note rendered at the bottom of this section.
const stats = [
  { value: 10000, suffix: '+', label: 'Devices repaired' },
  { value: 98, suffix: '%', label: 'Customer satisfaction' },
  { value: null, display: 'Same day', label: 'Turnaround on selected repairs' },
  { value: null, display: 'Level 3 & 4', label: 'Technical expertise' },
];

export default function StatsBand() {
  return (
    <section className="stats-band">
      <div className="container">
        <div className="stats-band__grid">
          {stats.map((s, i) => (
            <Reveal delay={i * 90} key={s.label}>
              <div className="stats-band__item">
                <span className="stats-band__num">
                  {s.value !== null ? <AnimatedCounter value={s.value} suffix={s.suffix} /> : s.display}
                </span>
                <span className="stats-band__label">{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="stats-band__note">
          Sample figures shown for illustration — replace with your actual business statistics.
        </p>
      </div>
    </section>
  );
}
