// Small, consistent line-icon set in the circuit/schematic style of the brand mark.
// All icons use currentColor so they inherit gold/paper from their context.

export function IconPhone(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="9" y="3" width="14" height="26" rx="2.5" />
      <line x1="13" y1="6" x2="19" y2="6" />
      <circle cx="16" cy="24.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTablet(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="5" y="4" width="22" height="24" rx="2.5" />
      <line x1="16" y1="24" x2="16" y2="24.2" strokeLinecap="round" />
    </svg>
  );
}

export function IconLaptop(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="6" y="7" width="20" height="13" rx="1.5" />
      <path d="M3 25h26l-2.5-4h-21z" />
    </svg>
  );
}

export function IconWatch(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="10" y="10" width="12" height="12" rx="3" />
      <path d="M13 10V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4M13 22v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

export function IconConsole(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M8 12h16l3 10a3 3 0 0 1-5.5 2l-1.5-3h-8l-1.5 3A3 3 0 0 1 5 22z" />
      <line x1="11" y1="16" x2="11" y2="19" />
      <line x1="9.5" y1="17.5" x2="12.5" y2="17.5" />
      <circle cx="22" cy="16" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="24.5" cy="18.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconGear(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="16" cy="16" r="5" />
      <path d="M16 3v4M16 25v4M29 16h-4M7 16H3M25.1 6.9l-2.8 2.8M9.7 22.3l-2.8 2.8M25.1 25.1l-2.8-2.8M9.7 9.7 6.9 6.9" />
    </svg>
  );
}

export function IconSwap(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M6 12h16l-3.5-3.5M26 20H10l3.5 3.5" />
    </svg>
  );
}

export function IconCharger(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="9" y="4" width="14" height="17" rx="2" />
      <path d="M17 9l-4 6h4l-4 6" strokeLinejoin="round" />
      <line x1="16" y1="22" x2="16" y2="28" />
    </svg>
  );
}

export function IconPulse(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="8" y="3" width="16" height="26" rx="2.5" />
      <path d="M10 17h3l2-5 3 9 2-6 1.5 2h3.5" />
    </svg>
  );
}

export function IconChip(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <rect x="11" y="11" width="10" height="10" rx="1.2" />
      <path d="M14 11V7M18 11V7M14 25v-4M18 25v-4M11 14H7M11 18H7M25 14h-4M25 18h-4" />
    </svg>
  );
}

export function IconShield(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <path d="M16 3l10 4v8c0 7-4.5 11.5-10 14C10.5 26.5 6 22 6 15V7z" />
      <path d="M11.5 16l3 3 6-6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
