// Placeholder repair-type data for the booking wizard's instant estimate step.
// Figures are illustrative examples only — replace priceFrom/priceTo/time/warranty
// with real business data before launch. Not real prices.
const repairTypes = [
  { key: 'screen', label: 'Screen Replacement', desc: 'Cracked or unresponsive screens replaced with quality parts.', priceFrom: 40, priceTo: 220, time: 'Same day', warranty: '3 months' },
  { key: 'battery', label: 'Battery Replacement', desc: 'Restore battery health and charging performance.', priceFrom: 30, priceTo: 90, time: 'Same day', warranty: '6 months' },
  { key: 'charging-port', label: 'Charging Port', desc: 'Fix loose connections or ports that won\u2019t hold a charge.', priceFrom: 35, priceTo: 80, time: 'Same day', warranty: '3 months' },
  { key: 'back-glass', label: 'Back Glass', desc: 'Rear panel replacement for cracked or shattered glass backs.', priceFrom: 40, priceTo: 130, time: '1-2 days', warranty: '3 months' },
  { key: 'camera', label: 'Camera', desc: 'Front or rear camera module replacement and calibration.', priceFrom: 40, priceTo: 150, time: 'Same day', warranty: '3 months' },
  { key: 'speaker', label: 'Speaker', desc: 'Fix distorted, quiet, or non-functioning speakers.', priceFrom: 25, priceTo: 70, time: 'Same day', warranty: '3 months' },
  { key: 'microphone', label: 'Microphone', desc: 'Resolve call and voice recording audio issues.', priceFrom: 25, priceTo: 70, time: 'Same day', warranty: '3 months' },
  { key: 'water-damage', label: 'Water Damage', desc: 'Ultrasonic cleaning and corrosion treatment for liquid damage.', priceFrom: 50, priceTo: 180, time: '1-2 days', warranty: 'Diagnostic only' },
  { key: 'software', label: 'Software Issue', desc: 'Boot loops, freezing, update failures, and OS-level faults.', priceFrom: 20, priceTo: 60, time: 'Same day', warranty: '1 month' },
  { key: 'face-id', label: 'Face ID / Biometric', desc: 'Diagnosis and repair of Face ID, fingerprint, or biometric faults.', priceFrom: 60, priceTo: 180, time: '1-2 days', warranty: '3 months' },
  { key: 'motherboard', label: 'Motherboard / Board Repair', desc: 'Component-level diagnosis and repair on the logic board.', priceFrom: 60, priceTo: 250, time: '1-3 days', warranty: '3 months' },
  { key: 'ic-repair', label: 'IC Repair', desc: 'Replacement of faulty power management, NAND, or audio ICs.', priceFrom: 80, priceTo: 250, time: '1-3 days', warranty: '3 months' },
  { key: 'microsoldering', label: 'Microsoldering', desc: 'Precision soldering for CPU-level and component-level faults.', priceFrom: 90, priceTo: 280, time: '2-4 days', warranty: '3 months' },
  { key: 'other', label: 'Other', desc: 'Something else? We\u2019ll diagnose and quote before any work starts.', priceFrom: 20, priceTo: 250, time: 'Varies', warranty: 'Confirmed on inspection' },
];

export default repairTypes;
