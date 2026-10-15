import Reveal from './Reveal.jsx';
import './HowItWorks.css';

const steps = [
  { num: '01', title: 'Choose your device', desc: 'Tell us the brand and model that needs fixing.' },
  { num: '02', title: 'Select your repair', desc: 'Pick the issue — from screens to board-level faults.' },
  { num: '03', title: 'Bring or send your device', desc: 'Drop it off in person or arrange a courier collection.' },
  { num: '04', title: 'Get it repaired', desc: 'We diagnose, quote, fix, and test before handing it back.' },
];

export default function HowItWorks() {
  return (
    <section className="section how-it-works">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <p className="mono-tag">How it works</p>
            <h2 className="section-title">Four steps to a fixed device</h2>
          </div>
        </Reveal>

        <div className="hiw-timeline">
          {steps.map((s, i) => (
            <Reveal delay={i * 100} className="hiw-step" key={s.num}>
              <span className="hiw-step__num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
