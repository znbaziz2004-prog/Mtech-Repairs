import PageHeader from '../components/PageHeader.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { IconGear, IconChip, IconShield, IconSwap } from '../components/Icons.jsx';
import useDocumentMeta from '../utils/useDocumentMeta.js';
import './InfoStrip.css';
import './About.css';

const values = [
  { icon: IconGear, title: 'Certified technicians', desc: 'Our team is trained to Level 3 & Level 4 standard — board level, microsoldering, IC work.' },
  { icon: IconShield, title: 'Honest quotes', desc: 'You approve every quote before any paid work starts. No surprise add-ons.' },
  { icon: IconSwap, title: 'Fair trade-ins', desc: 'Selling or upgrading? We price devices fairly and pay out quickly.' },
  { icon: IconChip, title: 'Real parts, real testing', desc: 'Every repair is tested before the device goes back to you.' },
];

export default function About() {
  useDocumentMeta(
    'About | Mtech n repairs',
    'Mtech n repairs is a professional mobile technology partner offering repairs, board-level diagnostics, buy & sell, and accessories.'
  );

  return (
    <>
      <PageHeader
        eyebrow="About Mtech n repairs"
        title="Your trusted mobile technology partner."
        subtitle="We repair, buy, sell, and support the devices people depend on every day — with the technical depth to fix what other shops send away."
      />

      <section className="section">
        <div className="container about-body">
          <p>
            Mtech n repairs was built around a simple idea: most repair
            shops can swap a screen, but very few can actually fix a circuit
            board. We specialise in the harder jobs — board-level diagnostics,
            microsoldering, and IC-level repair — alongside the everyday work
            of screens, batteries, ports, and accessories.
          </p>
          <p>
            Whether you're bringing in a cracked phone, trading in an old
            laptop, or trying to figure out why a device won't charge, our
            process stays the same: diagnose properly, quote honestly, and fix
            it right the first time.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container info-strip about-values">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div className="info-strip__item" key={v.title}>
                <Icon className="info-strip__icon" />
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
