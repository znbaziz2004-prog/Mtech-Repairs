import { useState } from 'react';
import Reveal from './Reveal.jsx';
import './FaqAccordion.css';

const faqs = [
  { q: 'How long does a repair take?', a: 'Most common repairs — screens, batteries, ports — are completed same day. Board-level and microsoldering work can take 1-3 days depending on the fault and parts needed.' },
  { q: 'Do you offer same-day repairs?', a: 'Yes, for most standard repairs booked before early afternoon. We\u2019ll always confirm an estimated time when you book.' },
  { q: 'What devices do you repair?', a: 'Phones, tablets, laptops, smartwatches, and consoles across all major brands — see our device selector for the full list.' },
  { q: 'Do you repair water-damaged phones?', a: 'Yes. We offer ultrasonic cleaning and corrosion treatment, though outcomes depend on the extent of the damage — we\u2019ll always diagnose first and be upfront about the chances of a full recovery.' },
  { q: 'Do you offer board-level repairs?', a: 'Yes — board-level repair, microsoldering, and IC work are a core part of what we do, handled by our Level 3 & Level 4 certified technicians.' },
  { q: 'What is microsoldering?', a: 'Microsoldering is precision soldering work done directly on a device\u2019s circuit board to replace individual components — used for faults a standard repair can\u2019t fix.' },
  { q: 'Do you buy used phones?', a: 'Yes, we buy used and unwanted devices. Get in touch or use our sell request form for a valuation.' },
  { q: 'Do you sell refurbished phones?', a: 'Yes — new, used, and refurbished devices are available. Check our Buy & Sell page for current stock.' },
  { q: 'Do repairs come with a warranty?', a: 'Yes, every repair is backed by a warranty on parts and workmanship. Exact terms are confirmed at the time of booking.' },
  { q: 'How can I book a repair?', a: 'Use the Book a Repair page to select your device, choose the repair type, and submit your details — we\u2019ll confirm your slot shortly after.' },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section faq">
      <div className="container">
        <Reveal>
          <div className="section-head">
            <p className="mono-tag">FAQ</p>
            <h2 className="section-title">Frequently asked questions</h2>
          </div>
        </Reveal>

        <div className="faq-list">
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            return (
              <Reveal delay={i * 40} key={f.q}>
                <div className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="faq-item__q"
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{f.q}</span>
                    <span className="faq-item__icon" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div className="faq-item__a-wrap" style={{ maxHeight: isOpen ? '240px' : '0px' }}>
                    <p className="faq-item__a">{f.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
