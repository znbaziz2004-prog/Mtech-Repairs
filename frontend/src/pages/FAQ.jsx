import PageHeader from '../components/PageHeader.jsx';
import FaqAccordion from '../components/FaqAccordion.jsx';
import CtaBand from '../components/CtaBand.jsx';
import useDocumentMeta from '../utils/useDocumentMeta.js';

export default function FAQ() {
  useDocumentMeta(
    'FAQ | Mtech n repairs',
    'Answers to common questions about repair times, board-level work, warranties, and buying or selling devices with Mtech n repairs.'
  );

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Questions, answered."
        subtitle="Can't find what you're looking for? Get in touch and we'll help directly."
      />
      <FaqAccordion />
      <CtaBand />
    </>
  );
}
