import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import AnimatedCounter from './AnimatedCounter.jsx';
import './Hero.css';

const floatingBadges = ['Board Level Repairs', 'Microsoldering', 'IC Work', 'Level 3 & Level 4'];

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero__panel">
          <div className="hero__backdrop" aria-hidden="true">
            <RepairAnimation />
          </div>
          <div className="hero__scrim" aria-hidden="true" />

          <div className="hero__content">
            <Reveal>
              <img src="/assets/logo-mark.png" alt="Mtech n repairs logo" className="hero__logo" />
            </Reveal>

            <Reveal delay={40}>
              <span className="hero__badge">Level 3 &amp; Level 4 Specialist</span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="hero__title">
                Professional mobile repairs.
                <br />
                Built on real expertise.
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="hero__sub">
                From everyday screen repairs to advanced board-level diagnostics,
                Mtech n repairs provides professional mobile technology solutions
                you can trust.
              </p>
            </Reveal>

            <Reveal delay={200} className="hero__actions">
              <Link to="/book" className="btn btn--gold">
                Book a repair
              </Link>
              <Link to="/repairs" className="btn btn--ghost-light">
                Explore our services
              </Link>
            </Reveal>

            <Reveal delay={260} className="hero__floaters">
              {floatingBadges.map((b, i) => (
                <span className="hero__floater" style={{ animationDelay: `${i * 0.6}s` }} key={b}>
                  {b}
                </span>
              ))}
            </Reveal>
          </div>
        </div>

        <Reveal delay={320}>
          <div className="hero__stats">
            <div>
              <span className="hero__stat-num">
                <AnimatedCounter value={4} />
              </span>
              <span className="hero__stat-label">Repair levels, 1–4</span>
            </div>
            <div>
              <span className="hero__stat-num">
                <AnimatedCounter value={20} suffix="+" />
              </span>
              <span className="hero__stat-label">Device types serviced</span>
            </div>
            <div>
              <span className="hero__stat-num">
                <AnimatedCounter value={24} suffix="h" />
              </span>
              <span className="hero__stat-label">Typical turnaround</span>
            </div>
            <div>
              <span className="hero__stat-num">
                <AnimatedCounter value={4.9} decimals={1} />
              </span>
              <span className="hero__stat-label">Average customer rating</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// Self-contained SVG animation: a soldering iron descends onto a circuit board,
// a solder joint sparks, and PCB traces draw themselves on in sequence.
function RepairAnimation() {
  return (
    <svg viewBox="0 0 420 420" className="repair-anim" role="img" preserveAspectRatio="xMidYMid slice">
      <title>Illustration of a soldering iron repairing a circuit board</title>

      <rect x="60" y="150" width="240" height="200" rx="10" className="board" />
      <rect x="60" y="150" width="240" height="200" rx="10" className="board-edge" />

      <g className="traces">
        <path className="trace trace-1" d="M80 190 H160 V230 H220" />
        <path className="trace trace-2" d="M80 230 H120 V280 H260" />
        <path className="trace trace-3" d="M280 190 V330 H140" />
        <path className="trace trace-4" d="M100 330 V300 H180 V260" />
      </g>

      <g className="nodes">
        <circle cx="80" cy="190" r="4" className="node" />
        <circle cx="220" cy="230" r="4" className="node" />
        <circle cx="260" cy="280" r="4" className="node" />
        <circle cx="140" cy="330" r="4" className="node" />
        <circle cx="180" cy="260" r="4" className="node" />
      </g>

      <rect x="165" y="215" width="50" height="50" rx="4" className="chip" />
      <g className="chip-pins">
        <line x1="165" y1="225" x2="155" y2="225" />
        <line x1="165" y1="240" x2="155" y2="240" />
        <line x1="165" y1="255" x2="155" y2="255" />
        <line x1="215" y1="225" x2="225" y2="225" />
        <line x1="215" y1="240" x2="225" y2="240" />
        <line x1="215" y1="255" x2="225" y2="255" />
      </g>

      <g className="iron">
        <rect x="230" y="20" width="14" height="80" rx="6" className="iron-body" transform="rotate(35 237 60)" />
        <rect x="222" y="90" width="10" height="46" rx="3" className="iron-tip" transform="rotate(35 227 113)" />
      </g>

      <g className="spark">
        <circle cx="192" cy="210" r="3" />
        <line x1="192" y1="210" x2="192" y2="198" />
        <line x1="192" y1="210" x2="202" y2="204" />
        <line x1="192" y1="210" x2="182" y2="204" />
        <line x1="192" y1="210" x2="200" y2="216" />
        <line x1="192" y1="210" x2="184" y2="216" />
      </g>
    </svg>
  );
}
