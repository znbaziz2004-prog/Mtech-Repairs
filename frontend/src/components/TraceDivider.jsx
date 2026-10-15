// Decorative circuit-trace rule used between sections instead of a plain <hr>,
// echoing the connector nodes in the brand mark's "LEVEL 3 & LEVEL 4" strip.
export default function TraceDivider() {
  return (
    <svg className="trace-divider" viewBox="0 0 1180 18" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="9" x2="1180" y2="9" stroke="var(--line)" strokeWidth="1" />
      <circle cx="14" cy="9" r="3.5" fill="none" stroke="var(--gold)" strokeWidth="1.4" />
      <circle cx="1166" cy="9" r="3.5" fill="none" stroke="var(--gold)" strokeWidth="1.4" />
    </svg>
  );
}
