import Hero from '../components/Hero.jsx';
import Marquee from '../components/Marquee.jsx';
import Pillars from '../components/Pillars.jsx';
import WhatWeDo from '../components/WhatWeDo.jsx';
import DeviceSelector from '../components/DeviceSelector.jsx';
import BoardLevel from '../components/BoardLevel.jsx';
import WhyChooseUs from '../components/WhyChooseUs.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import StatsBand from '../components/StatsBand.jsx';
import Testimonials from '../components/Testimonials.jsx';
import CtaBand from '../components/CtaBand.jsx';
import useDocumentMeta from '../utils/useDocumentMeta.js';

export default function Home() {
  useDocumentMeta(
    'Mtech n repairs | Professional Mobile Repairs & Technology Solutions',
    'Professional mobile repairs, diagnostics, board-level repairs, microsoldering, mobile sales and accessories from Mtech n repairs.'
  );

  return (
    <>
      <Hero />
      <Marquee />
      <Pillars />
      <WhatWeDo />
      <DeviceSelector />
      <BoardLevel />
      <WhyChooseUs />
      <HowItWorks />
      <StatsBand />
      <Testimonials />
      <CtaBand />
    </>
  );
}
