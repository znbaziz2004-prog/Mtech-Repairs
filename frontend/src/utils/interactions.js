// Lightweight, dependency-free interaction layer used across the site:
// - Cursor-tracking spotlight on glass cards (sets --mx/--my CSS vars the
//   card's own ::before radial-gradient reads; CSS still owns show/hide).
// - Magnetic pull on primary buttons (small translate toward the cursor).
// - Subtle parallax on the hero's animated backdrop as the page scrolls.
// Call initInteractions() once; it returns a cleanup function.

const GLOW_SELECTOR = [
  '.svc-card',
  '.device-card',
  '.brand-card',
  '.why-us-card',
  '.rtg-card',
  '.wizard__choice',
  '.testi-card',
  '.faq-item',
].join(', ');

const MAGNETIC_SELECTOR = '.btn--gold, .btn--ghost-light, .navbar__cta';

export default function initInteractions() {
  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return () => {};

  const onMove = (e) => {
    const glowEl = e.target.closest?.(GLOW_SELECTOR);
    if (glowEl) {
      const rect = glowEl.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      glowEl.style.setProperty('--mx', `${x}%`);
      glowEl.style.setProperty('--my', `${y}%`);
    }

    const magEl = e.target.closest?.(MAGNETIC_SELECTOR);
    document.querySelectorAll(MAGNETIC_SELECTOR).forEach((btn) => {
      if (btn !== magEl) btn.style.transform = '';
    });
    if (magEl) {
      const rect = magEl.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      const strength = 0.18;
      magEl.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
    }
  };

  const resetMagnetic = (e) => {
    const magEl = e.target.closest?.(MAGNETIC_SELECTOR);
    if (magEl) magEl.style.transform = '';
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const backdrop = document.querySelector('.hero__backdrop');
      if (backdrop) {
        const offset = Math.min(window.scrollY * 0.15, 60);
        backdrop.style.transform = `translateY(${offset}px)`;
      }
      ticking = false;
    });
  };

  document.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseout', resetMagnetic, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseout', resetMagnetic);
    window.removeEventListener('scroll', onScroll);
  };
}
