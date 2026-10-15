import PageHeader from '../components/PageHeader.jsx';
import RepairTypeGrid from '../components/RepairTypeGrid.jsx';
import BoardLevel from '../components/BoardLevel.jsx';
import CtaBand from '../components/CtaBand.jsx';
import { IconGear, IconChip, IconShield } from '../components/Icons.jsx';
import useDocumentMeta from '../utils/useDocumentMeta.js';
import './InfoStrip.css';

const capabilities = [
  { icon: IconGear, title: 'Board-Level Repair', desc: 'Component-level diagnosis and replacement on the logic board — Level 3.' },
  { icon: IconChip, title: 'Microsoldering & IC Work', desc: 'Precision chip-level soldering for CPU, NAND, and power management faults — Level 4.' },
  { icon: IconShield, title: 'Warranty Included', desc: 'Every repair is backed by a warranty on parts and workmanship.' },
];

export default function Repairs() {
  useDocumentMeta(
    'Repairs | Mtech n repairs',
    'Screen, battery, charging port, board-level, microsoldering and IC repairs from Mtech n repairs — Level 3 & Level 4 specialists.'
  );

  return (
    <>
      <PageHeader
        eyebrow="Professional mobile repairs · Level 3 & Level 4"
        title="Expert repairs. Every device."
        subtitle="From everyday screen and battery jobs to board-level and microsoldering work most shops can't touch, our certified technicians handle it in-house."
      />

      <section className="section-tight">
        <div className="container info-strip">
          {capabilities.map((c) => {
            const Icon = c.icon;
            return (
              <div className="info-strip__item" key={c.title}>
                <Icon className="info-strip__icon" />
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <RepairTypeGrid />
      <BoardLevel />

      <CtaBand
        title="Not sure what's wrong?"
        sub="Bring it in for a full diagnostics check — 20 minutes, and you'll know exactly what's going on."
      />
    </>
  );
}
