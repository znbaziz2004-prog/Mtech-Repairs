// Populates the database with starter data matching the site's four service pillars:
// Repairs, Buy & Sell, Accessories, Diagnostics & Solutions.

require('dotenv').config();

const { pool, connectDB } = require('../config/db');

const devices = [
  {
    name: 'iPhone 15 Pro',
    category: 'Mobile Phone',
    brand: 'Apple',
    slug: 'iphone-15-pro',
  },
  {
    name: 'iPhone 14',
    category: 'Mobile Phone',
    brand: 'Apple',
    slug: 'iphone-14',
  },
  {
    name: 'Galaxy S24',
    category: 'Mobile Phone',
    brand: 'Samsung',
    slug: 'galaxy-s24',
  },
  {
    name: 'Galaxy A54',
    category: 'Mobile Phone',
    brand: 'Samsung',
    slug: 'galaxy-a54',
  },
  {
    name: 'iPad Pro 12.9"',
    category: 'iPad',
    brand: 'Apple',
    slug: 'ipad-pro-12-9',
  },
  {
    name: 'iPad Air',
    category: 'iPad',
    brand: 'Apple',
    slug: 'ipad-air',
  },
  {
    name: 'Galaxy Tab S9',
    category: 'Tablet',
    brand: 'Samsung',
    slug: 'galaxy-tab-s9',
  },
  {
    name: 'MacBook Pro 14"',
    category: 'Laptop',
    brand: 'Apple',
    slug: 'macbook-pro-14',
  },
  {
    name: 'MacBook Air M2',
    category: 'Laptop',
    brand: 'Apple',
    slug: 'macbook-air-m2',
  },
  {
    name: 'Apple Watch Series 9',
    category: 'Smartwatch',
    brand: 'Apple',
    slug: 'apple-watch-series-9',
  },
  {
    name: 'PS5',
    category: 'Console',
    brand: 'Sony',
    slug: 'ps5',
  },
];

const services = [
  {
    title: 'Screen Replacement',
    description:
      'Cracked or unresponsive screen replaced with quality parts.',
    category: 'Repair',
    level: 'Level 1',
    priceFrom: 40,
    estTime: '30-45 mins',
    icon: 'screen',
  },
  {
    title: 'Battery Replacement',
    description:
      'Restore battery health and charging performance.',
    category: 'Repair',
    level: 'Level 1',
    priceFrom: 30,
    estTime: '20-30 mins',
    icon: 'battery',
  },
  {
    title: 'Charging Port Repair',
    description:
      'Fix loose or non-charging ports.',
    category: 'Repair',
    level: 'Level 2',
    priceFrom: 35,
    estTime: '30-45 mins',
    icon: 'port',
  },
  {
    title: 'Board Level Repair',
    description:
      'Component-level diagnosis and repair on the logic board.',
    category: 'Board Level',
    level: 'Level 3',
    priceFrom: 60,
    estTime: '1-3 days',
    icon: 'board',
  },
  {
    title: 'Microsoldering',
    description:
      'Precision soldering for IC replacement, tristar, and CPU-level faults.',
    category: 'Microsoldering',
    level: 'Level 4',
    priceFrom: 90,
    estTime: '2-4 days',
    icon: 'solder',
  },
  {
    title: 'IC Chip Replacement',
    description:
      'Replacement of faulty power management, NAND, or audio ICs.',
    category: 'IC Work',
    level: 'Level 4',
    priceFrom: 80,
    estTime: '1-3 days',
    icon: 'chip',
  },
  {
    title: 'Water Damage Recovery',
    description:
      'Ultrasonic cleaning and corrosion treatment for liquid-damaged boards.',
    category: 'Board Level',
    level: 'Level 3',
    priceFrom: 50,
    estTime: '1-2 days',
    icon: 'water',
  },
  {
    title: 'Full Diagnostics Check',
    description:
      'Complete hardware and software diagnostic report.',
    category: 'Diagnostics',
    level: 'N/A',
    priceFrom: 15,
    estTime: '20 mins',
    icon: 'diagnostics',
  },
];

const products = [
  {
    name: 'iPhone 13',
    brand: 'Apple',
    condition: 'Refurbished',
    price: 320,
    storage: '128GB',
    color: 'Midnight',
    image: '',
    listingType: 'buy',
  },
  {
    name: 'iPhone 12',
    brand: 'Apple',
    condition: 'Used',
    price: 240,
    storage: '64GB',
    color: 'Blue',
    image: '',
    listingType: 'buy',
  },
  {
    name: 'Galaxy S22',
    brand: 'Samsung',
    condition: 'Refurbished',
    price: 280,
    storage: '128GB',
    color: 'Phantom Black',
    image: '',
    listingType: 'buy',
  },
  {
    name: 'iPhone SE (2022)',
    brand: 'Apple',
    condition: 'New',
    price: 299,
    storage: '64GB',
    color: 'Starlight',
    image: '',
    listingType: 'buy',
  },
];

const accessories = [
  {
    name: '20W USB-C Fast Charger',
    category: 'Chargers',
    price: 15,
  },
  {
    name: 'Braided USB-C to Lightning Cable',
    category: 'Cables',
    price: 10,
  },
  {
    name: 'Clear Shockproof Case',
    category: 'Cases',
    price: 12,
  },
  {
    name: 'Tempered Glass Screen Protector',
    category: 'Screen Protectors',
    price: 8,
  },
  {
    name: 'Wireless Earbuds',
    category: 'Audio',
    price: 35,
  },
  {
    name: 'MagSafe Charging Pad',
    category: 'Chargers',
    price: 25,
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Small Business Owner',
    message:
      'My phone was repaired in under an hour. Professional and honest service.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'IT Manager',
    message:
      'We use them for all company devices — reliable, fast, and cost-effective.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Student',
    message:
      'Fixed my water-damaged phone when other shops said it was unfixable.',
    rating: 5,
  },
  {
    name: 'David Wilson',
    role: 'Retired',
    message:
      'Patient, clear explanations, no unnecessary upselling.',
    rating: 4,
  },
];

async function seed() {
  try {
    await connectDB();

    console.log('[seed] Clearing existing starter data...');

    await pool.query('DELETE FROM devices');
    await pool.query('DELETE FROM services');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM accessories');
    await pool.query('DELETE FROM testimonials');

    console.log('[seed] Inserting devices...');

    for (const device of devices) {
      await pool.query(
        `
        INSERT INTO devices
        (name, category, brand, slug)
        VALUES (?, ?, ?, ?)
        `,
        [
          device.name,
          device.category,
          device.brand,
          device.slug,
        ]
      );
    }

    console.log('[seed] Inserting services...');

    for (const service of services) {
      await pool.query(
        `
        INSERT INTO services
        (
          title,
          description,
          category,
          level,
          price_from,
          est_time,
          icon
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          service.title,
          service.description,
          service.category,
          service.level,
          service.priceFrom,
          service.estTime,
          service.icon,
        ]
      );
    }

    console.log('[seed] Inserting products...');

    for (const product of products) {
      await pool.query(
        `
        INSERT INTO products
        (
          name,
          brand,
          condition_type,
          price,
          storage,
          color,
          image,
          listing_type
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          product.name,
          product.brand,
          product.condition,
          product.price,
          product.storage,
          product.color,
          product.image,
          product.listingType,
        ]
      );
    }

    console.log('[seed] Inserting accessories...');

    for (const accessory of accessories) {
      await pool.query(
        `
        INSERT INTO accessories
        (
          name,
          category,
          price
        )
        VALUES (?, ?, ?)
        `,
        [
          accessory.name,
          accessory.category,
          accessory.price,
        ]
      );
    }

    console.log('[seed] Inserting testimonials...');

    for (const testimonial of testimonials) {
      await pool.query(
        `
        INSERT INTO testimonials
        (
          name,
          role,
          message,
          rating
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          testimonial.name,
          testimonial.role,
          testimonial.message,
          testimonial.rating,
        ]
      );
    }

    console.log('[seed] Database seeded successfully');

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('[seed] Failed:', err.message);

    await pool.end();
    process.exit(1);
  }
}

seed();