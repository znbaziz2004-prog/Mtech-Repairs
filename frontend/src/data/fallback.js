// Local fallback content — mirrors backend/src/utils/seed.js so the UI renders
// fully even before the API/database is wired up in a given environment.

export const devices = [
  { name: 'iPhone 15 Pro', category: 'Mobile Phone', brand: 'Apple' },
  { name: 'iPhone 14', category: 'Mobile Phone', brand: 'Apple' },
  { name: 'Galaxy S24', category: 'Mobile Phone', brand: 'Samsung' },
  { name: 'Galaxy A54', category: 'Mobile Phone', brand: 'Samsung' },
  { name: 'iPad Pro 12.9"', category: 'iPad', brand: 'Apple' },
  { name: 'iPad Air', category: 'iPad', brand: 'Apple' },
  { name: 'Galaxy Tab S9', category: 'Tablet', brand: 'Samsung' },
  { name: 'MacBook Pro 14"', category: 'Laptop', brand: 'Apple' },
  { name: 'MacBook Air M2', category: 'Laptop', brand: 'Apple' },
  { name: 'Apple Watch Series 9', category: 'Smartwatch', brand: 'Apple' },
  { name: 'PS5', category: 'Console', brand: 'Sony' },
];

export const services = [
  { title: 'Screen Replacement', description: 'Cracked or unresponsive screen replaced with quality parts.', category: 'Repair', level: 'Level 1', priceFrom: 40, estTime: '30-45 mins' },
  { title: 'Battery Replacement', description: 'Restore battery health and charging performance.', category: 'Repair', level: 'Level 1', priceFrom: 30, estTime: '20-30 mins' },
  { title: 'Charging Port Repair', description: 'Fix loose connections or ports that won\u2019t hold a charge.', category: 'Repair', level: 'Level 2', priceFrom: 35, estTime: '30-45 mins' },
  { title: 'Board Level Repair', description: 'Component-level diagnosis and repair on the logic board.', category: 'Board Level', level: 'Level 3', priceFrom: 60, estTime: '1-3 days' },
  { title: 'Microsoldering', description: 'Precision soldering for IC replacement, tristar, and CPU-level faults.', category: 'Microsoldering', level: 'Level 4', priceFrom: 90, estTime: '2-4 days' },
  { title: 'IC Chip Replacement', description: 'Replacement of faulty power management, NAND, or audio ICs.', category: 'IC Work', level: 'Level 4', priceFrom: 80, estTime: '1-3 days' },
  { title: 'Water Damage Recovery', description: 'Ultrasonic cleaning and corrosion treatment for liquid-damaged boards.', category: 'Board Level', level: 'Level 3', priceFrom: 50, estTime: '1-2 days' },
  { title: 'Full Diagnostics Check', description: 'Complete hardware and software diagnostic report.', category: 'Diagnostics', level: 'N/A', priceFrom: 15, estTime: '20 mins' },
];

export const products = [
  { name: 'iPhone 13', brand: 'Apple', condition: 'Refurbished', price: 320, storage: '128GB', color: 'Midnight' },
  { name: 'iPhone 12', brand: 'Apple', condition: 'Used', price: 240, storage: '64GB', color: 'Blue' },
  { name: 'Galaxy S22', brand: 'Samsung', condition: 'Refurbished', price: 280, storage: '128GB', color: 'Phantom Black' },
  { name: 'iPhone SE (2022)', brand: 'Apple', condition: 'New', price: 299, storage: '64GB', color: 'Starlight' },
];

export const accessories = [
  { name: '20W USB-C Fast Charger', category: 'Chargers', price: 15 },
  { name: 'Braided USB-C to Lightning Cable', category: 'Cables', price: 10 },
  { name: 'Clear Shockproof Case', category: 'Cases', price: 12 },
  { name: 'Tempered Glass Screen Protector', category: 'Screen Protectors', price: 8 },
  { name: 'Wireless Earbuds', category: 'Audio', price: 35 },
  { name: 'MagSafe Charging Pad', category: 'Chargers', price: 25 },
];

export const testimonials = [
  { name: 'Sarah Johnson', role: 'Small Business Owner', message: 'My phone was repaired in under an hour. Professional and honest service.', rating: 5 },
  { name: 'Michael Chen', role: 'IT Manager', message: 'We use them for all company devices \u2014 reliable, fast, and cost-effective.', rating: 5 },
  { name: 'Emily Rodriguez', role: 'Student', message: 'Fixed my water-damaged phone when other shops said it was unfixable.', rating: 5 },
  { name: 'David Wilson', role: 'Retired', message: 'Patient, clear explanations, no unnecessary upselling.', rating: 4 },
];

export const deviceCategories = [
  { label: 'Mobile Phone', icon: 'phone' },
  { label: 'iPad', icon: 'ipad' },
  { label: 'Tablet', icon: 'tablet' },
  { label: 'Laptop', icon: 'laptop' },
  { label: 'Smartwatch', icon: 'watch' },
  { label: 'PC/Computer', icon: 'computer' },
  { label: 'Macbook', icon: 'laptop' },
  { label: 'Gaming Console', icon: 'console' },
];
