require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const pexels = (photoId) =>
  `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop`;

const products = [
  // ---------- Smartphones ----------
  {
    title: 'Nova X200 Smartphone (128GB, Midnight Blue)',
    description:
      '6.5" FHD+ display, 5000mAh battery with 33W fast charging, 50MP triple camera setup, and 128GB storage with expandable memory.',
    price: 16999,
    category: 'Smartphones',
    brand: 'Nova',
    rating: 4.3,
    ratingCount: 18234,
    discount: 23,
    stock: 45,
    image: pexels(163023),
  },
  {
    title: 'Zenith Pro 5G (256GB, Graphite Grey)',
    description:
      '6.7" AMOLED 120Hz display, Snapdragon flagship chipset, 108MP quad camera, and 5G connectivity with 65W hyper charging.',
    price: 34999,
    category: 'Smartphones',
    brand: 'Zenith',
    rating: 4.5,
    ratingCount: 9021,
    discount: 15,
    stock: 30,
    image: pexels(1440727),
  },
  {
    title: 'Orbit Lite (64GB, Coral Red)',
    description:
      'Budget-friendly smartphone with a 6.1" HD+ display, 4000mAh battery, dual camera setup, and reliable all-day performance.',
    price: 8999,
    category: 'Smartphones',
    brand: 'Orbit',
    rating: 4.0,
    ratingCount: 12043,
    discount: 18,
    stock: 60,
    image: pexels(699122),
  },
  {
    title: 'Nova Fold Z (512GB, Obsidian Black)',
    description:
      'Foldable 7.6" main display with 6.2" cover screen, triple 50MP camera array, and a titanium hinge rated for 200,000 folds.',
    price: 89999,
    category: 'Smartphones',
    brand: 'Nova',
    rating: 4.6,
    ratingCount: 2310,
    discount: 10,
    stock: 12,
    image: pexels(404280),
  },

  // ---------- Laptops ----------
  {
    title: 'AeroBook 14 Laptop (i5, 16GB RAM, 512GB SSD)',
    description:
      '14-inch FHD anti-glare display, 12th Gen Intel Core i5 processor, 16GB RAM and 512GB SSD for fast boot and app switching.',
    price: 52990,
    category: 'Laptops',
    brand: 'AeroBook',
    rating: 4.5,
    ratingCount: 5421,
    discount: 18,
    stock: 25,
    image: pexels(18105),
  },
  {
    title: 'TitanBook Pro 16 (i7, 32GB RAM, 1TB SSD, RTX)',
    description:
      '16-inch QHD 165Hz display, 13th Gen Intel Core i7, dedicated RTX graphics, 32GB RAM and 1TB NVMe SSD for gaming and creative work.',
    price: 129990,
    category: 'Laptops',
    brand: 'TitanBook',
    rating: 4.7,
    ratingCount: 1876,
    discount: 12,
    stock: 10,
    image: pexels(7974),
  },
  {
    title: 'FeatherAir 13 Ultrabook (i5, 8GB RAM, 256GB SSD)',
    description:
      'Ultra-thin 2.8lb chassis, 13.3-inch FHD display, all-day 18-hour battery life, and a backlit keyboard for productivity on the go.',
    price: 44990,
    category: 'Laptops',
    brand: 'FeatherAir',
    rating: 4.2,
    ratingCount: 3320,
    discount: 20,
    stock: 22,
    image: pexels(205421),
  },
  {
    title: 'WorkStation X15 (Ryzen 7, 16GB RAM, 512GB SSD)',
    description:
      'AMD Ryzen 7 octa-core processor, 15.6-inch FHD IPS display, 16GB RAM, 512GB SSD, and a spacious numeric keypad for office work.',
    price: 58990,
    category: 'Laptops',
    brand: 'WorkStation',
    rating: 4.3,
    ratingCount: 2765,
    discount: 16,
    stock: 18,
    image: pexels(1181244),
  },

  // ---------- Headphones ----------
  {
    title: 'EchoWave ANC Wireless Headphones',
    description:
      'Over-ear headphones with active noise cancellation, 40-hour battery life, and plush memory-foam ear cushions.',
    price: 4999,
    category: 'Headphones',
    brand: 'EchoWave',
    rating: 4.4,
    ratingCount: 15332,
    discount: 29,
    stock: 70,
    image: pexels(3394650),
  },
  {
    title: 'PulseBuds Pro True Wireless Earbuds',
    description:
      'In-ear buds with hybrid ANC, IPX5 water resistance, and a compact charging case delivering up to 30 hours combined playback.',
    price: 2499,
    category: 'Headphones',
    brand: 'Pulse',
    rating: 4.2,
    ratingCount: 22190,
    discount: 37,
    stock: 90,
    image: pexels(3945667),
  },
  {
    title: 'BassLine Studio Wired Headphones',
    description:
      'Studio-tuned drivers for balanced sound, foldable design for portability, and a detachable braided cable.',
    price: 1799,
    category: 'Headphones',
    brand: 'BassLine',
    rating: 4.1,
    ratingCount: 7654,
    discount: 25,
    stock: 55,
    image: pexels(1649771),
  },

  // ---------- Watches ----------
  {
    title: 'PulseFit Smart Watch (AMOLED, SpO2, GPS)',
    description:
      '1.4" AMOLED display, built-in GPS, SpO2 and heart-rate monitoring, and up to 10 days of battery life.',
    price: 3499,
    category: 'Watches',
    brand: 'PulseFit',
    rating: 4.1,
    ratingCount: 30122,
    discount: 50,
    stock: 80,
    image: pexels(437037),
  },
  {
    title: 'ChronoClassic Analog Watch (Leather Strap)',
    description:
      'Stainless steel case with a genuine leather strap, sapphire-coated crystal, and water resistance up to 50 meters.',
    price: 5999,
    category: 'Watches',
    brand: 'Chrono',
    rating: 4.5,
    ratingCount: 4210,
    discount: 20,
    stock: 33,
    image: pexels(190819),
  },
  {
    title: 'ActiveGear Fitness Band',
    description:
      'Slim fitness band with step tracking, sleep monitoring, and a 1-week battery life on a single charge.',
    price: 1499,
    category: 'Watches',
    brand: 'ActiveGear',
    rating: 3.9,
    ratingCount: 11023,
    discount: 40,
    stock: 65,
    image: pexels(267394),
  },

  // ---------- Cameras ----------
  {
    title: 'CaptureX Mirrorless Camera (24MP, 4K)',
    description:
      '24.2MP APS-C sensor, 4K video recording, in-body image stabilization, and a fast hybrid autofocus system.',
    price: 54999,
    category: 'Cameras',
    brand: 'CaptureX',
    rating: 4.6,
    ratingCount: 1543,
    discount: 14,
    stock: 15,
    image: pexels(90946),
  },
  {
    title: 'ActionPro 4K Waterproof Action Camera',
    description:
      'Waterproof up to 10m, 4K60fps recording, built-in image stabilization, and a rugged design for adventure sports.',
    price: 12999,
    category: 'Cameras',
    brand: 'ActionPro',
    rating: 4.3,
    ratingCount: 6210,
    discount: 24,
    stock: 28,
    image: pexels(51383),
  },
  {
    title: 'SnapShot Instant Camera',
    description:
      'Classic instant-print camera with automatic exposure, built-in flash, and vibrant color reproduction on credit-card sized prints.',
    price: 5499,
    category: 'Cameras',
    brand: 'SnapShot',
    rating: 4.2,
    ratingCount: 3345,
    discount: 8,
    stock: 40,
    image: pexels(1787220),
  },

  // ---------- Tablets ----------
  {
    title: 'TabPro 11 (128GB, WiFi + Cellular)',
    description:
      '11-inch Liquid Retina-style display, octa-core processor, 128GB storage, and stylus support for note-taking and sketching.',
    price: 27999,
    category: 'Tablets',
    brand: 'TabPro',
    rating: 4.4,
    ratingCount: 4123,
    discount: 19,
    stock: 24,
    image: pexels(1334597),
  },
  {
    title: 'KidsPad Mini 8 (64GB, Kid-Safe Case)',
    description:
      'Compact 8-inch tablet bundled with a shock-proof case, parental controls, and a curated library of educational apps.',
    price: 8999,
    category: 'Tablets',
    brand: 'KidsPad',
    rating: 4.0,
    ratingCount: 2894,
    discount: 22,
    stock: 38,
    image: pexels(1334598),
  },
  {
    title: 'DrawPad Ultra 12.9 (256GB, Stylus Included)',
    description:
      'Large 12.9-inch high-refresh display, pressure-sensitive stylus in the box, and a keyboard-folio accessory port.',
    price: 64999,
    category: 'Tablets',
    brand: 'DrawPad',
    rating: 4.7,
    ratingCount: 987,
    discount: 11,
    stock: 9,
    image: pexels(38568),
  },

  // ---------- TVs ----------
  {
    title: 'VisionMax 55" 4K QLED Smart TV',
    description:
      '55-inch 4K QLED panel with HDR10+, built-in voice assistant, and a smart hub for all your favorite streaming apps.',
    price: 42999,
    category: 'TVs',
    brand: 'VisionMax',
    rating: 4.4,
    ratingCount: 5678,
    discount: 28,
    stock: 20,
    image: pexels(6976094),
  },
  {
    title: 'CrystalView 43" Full HD Smart TV',
    description:
      '43-inch Full HD display with slim bezels, Dolby Audio support, and quick access to popular streaming apps.',
    price: 21999,
    category: 'TVs',
    brand: 'CrystalView',
    rating: 4.2,
    ratingCount: 9021,
    discount: 31,
    stock: 26,
    image: pexels(6976101),
  },
  {
    title: 'UltraFrame 65" 4K OLED TV',
    description:
      '65-inch self-lit OLED panel for perfect blacks, 120Hz refresh rate for gaming, and a premium slim-profile design.',
    price: 129999,
    category: 'TVs',
    brand: 'UltraFrame',
    rating: 4.8,
    ratingCount: 764,
    discount: 9,
    stock: 6,
    image: pexels(6976103),
  },

  // ---------- Speakers ----------
  {
    title: 'BoomBox Portable Bluetooth Speaker',
    description:
      '360-degree sound, IPX7 waterproof rating, 20-hour battery life, and a rugged design built for outdoor use.',
    price: 3999,
    category: 'Speakers',
    brand: 'BoomBox',
    rating: 4.3,
    ratingCount: 13456,
    discount: 33,
    stock: 55,
    image: pexels(1279107),
  },
  {
    title: 'HomeTone Smart Speaker with Voice Assistant',
    description:
      'Rich 360-degree audio paired with a built-in voice assistant for music, smart-home control, and daily reminders.',
    price: 5499,
    category: 'Speakers',
    brand: 'HomeTone',
    rating: 4.1,
    ratingCount: 8765,
    discount: 21,
    stock: 34,
    image: pexels(1706694),
  },
  {
    title: 'PartyBeat 100W Party Speaker with Lights',
    description:
      'Powerful 100W output, dynamic LED light show, karaoke mic input, and a wheeled trolley design for easy transport.',
    price: 8999,
    category: 'Speakers',
    brand: 'PartyBeat',
    rating: 4.0,
    ratingCount: 3210,
    discount: 25,
    stock: 17,
    image: pexels(1493004),
  },

  // ---------- Shoes ----------
  {
    title: "StrideFlex Men's Running Shoes",
    description:
      'Lightweight breathable mesh upper, responsive cushioned midsole, and a durable rubber outsole for daily runs.',
    price: 2499,
    category: 'Shoes',
    brand: 'StrideFlex',
    rating: 4.3,
    ratingCount: 10234,
    discount: 38,
    stock: 88,
    image: pexels(2529148),
  },
  {
    title: "UrbanStep Women's Casual Sneakers",
    description:
      'Everyday sneakers with a soft knit upper, cushioned footbed, and a versatile design that pairs with any outfit.',
    price: 1999,
    category: 'Shoes',
    brand: 'UrbanStep',
    rating: 4.2,
    ratingCount: 8901,
    discount: 42,
    stock: 76,
    image: pexels(1478442),
  },
  {
    title: "TrailBlaze Men's Hiking Boots",
    description:
      'Water-resistant leather upper, reinforced ankle support, and an aggressive lug outsole for confident grip on trails.',
    price: 3799,
    category: 'Shoes',
    brand: 'TrailBlaze',
    rating: 4.4,
    ratingCount: 3456,
    discount: 27,
    stock: 41,
    image: pexels(1032110),
  },
  {
    title: "GlideStep Women's Sports Sandals",
    description:
      'Adjustable straps, contoured cushioned sole, and quick-dry materials ideal for both outdoor and beach wear.',
    price: 1299,
    category: 'Shoes',
    brand: 'GlideStep',
    rating: 4.0,
    ratingCount: 5432,
    discount: 35,
    stock: 64,
    image: pexels(292999),
  },

  // ---------- Fashion ----------
  {
    title: "Men's Slim Fit Casual Shirt",
    description:
      'Breathable cotton-blend fabric, slim tailored fit, and a versatile design suitable for both office and weekend wear.',
    price: 899,
    category: 'Fashion',
    brand: 'Urbane',
    rating: 4.1,
    ratingCount: 6721,
    discount: 40,
    stock: 120,
    image: pexels(297933),
  },
  {
    title: "Women's Floral A-Line Dress",
    description:
      'Flowy A-line silhouette in a lightweight floral-print fabric, perfect for summer outings and casual events.',
    price: 1299,
    category: 'Fashion',
    brand: 'Belara',
    rating: 4.3,
    ratingCount: 9432,
    discount: 45,
    stock: 95,
    image: pexels(985635),
  },
  {
    title: "Men's Denim Jacket",
    description:
      'Classic washed-denim jacket with button closures and chest pockets, a timeless layering piece for any season.',
    price: 2199,
    category: 'Fashion',
    brand: 'Urbane',
    rating: 4.4,
    ratingCount: 3210,
    discount: 30,
    stock: 58,
    image: pexels(1183266),
  },
  {
    title: 'Unisex Aviator Sunglasses',
    description:
      'UV400-protected polarized lenses in a classic aviator frame, with a lightweight metal build for all-day comfort.',
    price: 799,
    category: 'Fashion',
    brand: 'ShadeCo',
    rating: 4.2,
    ratingCount: 12043,
    discount: 50,
    stock: 140,
    image: pexels(46710),
  },
  {
    title: "Women's Quilted Handbag",
    description:
      'Structured quilted handbag with a detachable chain strap, spacious main compartment, and premium faux-leather finish.',
    price: 1899,
    category: 'Fashion',
    brand: 'Belara',
    rating: 4.3,
    ratingCount: 5432,
    discount: 33,
    stock: 47,
    image: pexels(1152077),
  },
];

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log(`Seed complete: ${products.length} products inserted.`);
    process.exit(0);
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    console.log('All products removed.');
    process.exit(0);
  } catch (error) {
    console.error(`Destroy error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv.includes('--destroy')) {
  destroyData();
} else {
  importData();
}
