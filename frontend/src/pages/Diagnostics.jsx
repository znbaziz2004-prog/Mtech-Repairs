import PageHeader from '../components/PageHeader.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { useEffect, useState } from 'react';
import { getServices } from '../utils/api.js';
import { IconPulse, IconChip, IconShield } from '../components/Icons.jsx';
import useDocumentMeta from '../utils/useDocumentMeta.js';
import './InfoStrip.css';
import './Diagnostics.css';

const steps = [
  { title: 'Intake check', desc: 'We log the device, note visible damage, and confirm the reported fault with you.' },
  { title: 'Full diagnostic scan', desc: 'Hardware and software tests across battery, board, ports, sensors, and display.' },
  { title: 'Written report & quote', desc: 'You get a clear breakdown of what\u2019s wrong and a fixed quote before any repair starts.' },
  { title: 'Fix or advise', desc: 'If it\u2019s repairable, we fix it. If it\u2019s not worth repairing, we\u2019ll tell you honestly.' },
];

export default function Diagnostics() {
  const [services, setServices] = useState([]);
  useEffect(() => {
  getServices()
    .then((res) => {
      const data = res?.data || [];
      setServices(Array.isArray(data) ? data : []);
    })
    .catch(() => {
      setServices([]);
    });
}, []);
const diagnosticServices = services.filter(
  (service) =>
    String(service.category || '').toLowerCase() === 'diagnostics'
);
  useDocumentMeta(
    'Diagnostics & Solutions | Mtech n repairs',
    'Professional hardware and software diagnostics — fast, accurate fault-finding before any repair begins.'
  );

  return (
    <>
      <PageHeader
        eyebrow="Diagnostics & solutions"
        title="Fast, accurate, reliable — before we touch anything."
        subtitle="Not sure what's actually wrong? Our diagnostic check finds the real fault so you're never paying to guess."
      />

      <section className="section-tight">
        <div className="container info-strip">
          <div className="info-strip__item">
            <IconPulse className="info-strip__icon" />
            <h3>Full Hardware Scan</h3>
            <p>Battery health, port continuity, sensors, camera, speakers, and display all tested.</p>
          </div>
          <div className="info-strip__item">
            <IconChip className="info-strip__icon" />
            <h3>Board-Level Analysis</h3>
            <p>Where needed, we trace faults down to individual components on the logic board.</p>
          </div>
          <div className="info-strip__item">
            <IconShield className="info-strip__icon" />
            <h3>No Surprise Costs</h3>
            <p>You approve a quote before we do any paid repair work — always.</p>
          </div>
        </div>
      </section>

      {diagnosticServices.length > 0 && (
  <section className="section">
    <div className="container">
      <div className="section-head">
        <p className="mono-tag">Our services</p>
        <h2 className="section-title">Diagnostic Services</h2>
      </div>

      <div className="services-grid">
        {diagnosticServices.map((service) => (
          <div className="service-card" key={service.id}>
            <h3>{service.title}</h3>

            {service.description && (
              <p>{service.description}</p>
            )}

            <div className="service-card__details">
              {service.priceFrom !== undefined && (
                <span>
                  From £{Number(service.priceFrom).toFixed(2)}
                </span>
              )}

              {service.estTime && (
                <span>{service.estTime}</span>
              )}

              {service.level && (
                <span>{service.level}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}

      <section className="section">
        <div className="container">
          <div className="section-head">
            <p className="mono-tag">How it works</p>
            <h2 className="section-title">The diagnostic process</h2>
          </div>

          <ol className="diag-steps">
            {steps.map((s, i) => (
              <li className="diag-step" key={s.title}>
                <span className="diag-step__num mono-tag">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand title="Start with a diagnostic check" sub="From £15, 20 minutes, no commitment to repair." />
    </>
  );
}
