import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import { IconChip, IconGear, IconPulse, IconShield } from './Icons.jsx';
import './BoardLevel.css';

const highlights = [
  { icon: IconGear, label: 'Board level repairs' },
  { icon: IconChip, label: 'Microsoldering' },
  { icon: IconShield, label: 'IC work' },
  { icon: IconPulse, label: 'Component replacement' },
  { icon: IconGear, label: 'Circuit diagnostics' },
  { icon: IconPulse, label: 'Advanced fault finding' },
  { icon: IconChip, label: 'Motherboard repairs' },
];

export default function BoardLevel() {
  return (
    <section className="board-level">
      <div className="board-level__grid" aria-hidden="true" />
      <div className="container board-level__inner">
        <Reveal>
          <span className="board-level__badge">Level 3 &amp; Level 4 Specialist</span>
          <h2 className="board-level__title">Beyond basic repairs</h2>
          <p className="board-level__sub">
            Advanced board-level expertise for complex device faults — technical
            work at component level that goes further than a standard part swap.
          </p>
        </Reveal>

        <div className="board-level__highlights">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <Reveal delay={i * 60} key={h.label} className="board-level__chip">
                <Icon className="board-level__chip-icon" />
                <span>{h.label}</span>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={300}>
          <Link to="/contact" className="btn btn--gold board-level__cta">
            Talk to a specialist
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
