import Reveal from './Reveal.jsx';
import { IconGear, IconChip, IconShield, IconPulse } from './Icons.jsx';
import './WhyChooseUs.css';

const features = [
  { icon: IconGear, title: 'Professional expertise', desc: 'Trained, experienced technicians on every job.' },
  { icon: IconShield, title: 'Level 3 & Level 4 specialist', desc: 'Repairs most shops can\u2019t take on.' },
  { icon: IconChip, title: 'Board-level repairs', desc: 'Component-level fixes, not just part swaps.' },
  { icon: IconShield, title: 'Quality parts', desc: 'Tested components, fitted properly.' },
  { icon: IconPulse, title: 'Advanced diagnostics', desc: 'We find the real fault before we quote.' },
  { icon: IconGear, title: 'Transparent pricing', desc: 'You approve the quote before any work starts.' },
  { icon: IconPulse, title: 'Fast turnaround', desc: 'Most repairs completed same day or next.' },
  { icon: IconShield, title: 'Repair warranty', desc: 'Every repair is backed by our workmanship warranty.' },
];

export default function WhyChooseUs() {
  return (
    <section className="section why-us">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <p className="mono-tag">Why choose us</p>
            <h2 className="section-title">Why choose Mtech n repairs?</h2>
          </div>
        </Reveal>

        <div className="why-us-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal delay={(i % 4) * 70} key={f.title}>
                <div className="why-us-card">
                  <Icon className="why-us-card__icon" />
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
