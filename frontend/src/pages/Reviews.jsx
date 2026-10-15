import PageHeader from '../components/PageHeader.jsx';
import ReviewCarousel from '../components/ReviewCarousel.jsx';
import Testimonials from '../components/Testimonials.jsx';
import CtaBand from '../components/CtaBand.jsx';
import useDocumentMeta from '../utils/useDocumentMeta.js';

export default function Reviews() {
  useDocumentMeta(
    'Reviews | Mtech n repairs',
    'See what customers say about their repair experience with Mtech n repairs.'
  );

  return (
    <>
      <PageHeader
        eyebrow="Reviews"
        title="What our customers say."
        subtitle="Placeholder reviews shown below — replace with real customer feedback once available."
      />
      <section className="section">
        <div className="container">
          <ReviewCarousel />
        </div>
      </section>
      <Testimonials />
      <CtaBand />
    </>
  );
}
