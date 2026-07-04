import db from './db';

async function main() {
  console.log('Seeding started...');

  // Clear existing data
  await db.orderItem.deleteMany({});
  await db.order.deleteMany({});
  await db.review.deleteMany({});
  await db.productVariant.deleteMany({});
  await db.product.deleteMany({});
  await db.user.deleteMany({});
  await db.coupon.deleteMany({});

  // Seed Admin & Test Users
  const admin = await db.user.create({
    data: {
      name: 'Avenoir Admin',
      email: 'admin@avenoir.com',
      password: 'adminpassword123', // Simple for dev testing
      role: 'ADMIN',
    },
  });

  const customer = await db.user.create({
    data: {
      name: 'John Doe',
      email: 'user@avenoir.com',
      password: 'userpassword123',
      role: 'USER',
    },
  });

  // Seed Coupons
  await db.coupon.createMany({
    data: [
      {
        code: 'AVENOIR10',
        discountType: 'PERCENT',
        discountValue: 10.0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: true,
      },
      {
        code: 'SECURE20',
        discountType: 'PERCENT',
        discountValue: 20.0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'MILL50',
        discountType: 'FIXED',
        discountValue: 50.0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ],
  });

  // Seed Products
  const productsData = [
    {
      name: 'Avenoir Carbon Monolith Case',
      slug: 'carbon-monolith-case',
      description: 'Milled from high-grade aerospace carbon fiber and bulletproof aramid. Designed to exceed military drop test certifications while retaining a ultra-thin 1.2mm profile.',
      details: 'Featuring self-healing polymer coatings, integrated neodymium magnet rings, and a milled aluminum camera bezel. The Monolith represents the pinnacle of digital armor.',
      price: 65.00,
      discountPrice: 55.00,
      category: 'cases',
      image: '/images/carbon-monolith-1.webp',
      hoverImage: '/images/carbon-monolith-hover.webp',
      images: JSON.stringify([
        '/images/carbon-monolith-1.webp',
        '/images/carbon-monolith-2.webp',
        '/images/carbon-monolith-3.webp'
      ]),
      rating: 4.9,
      reviewsCount: 124,
      isFeatured: true,
      stock: 120,
      specs: JSON.stringify({
        'Material': 'Aerospace Carbon Fiber / Aramid',
        'Drop Certification': '10m (33ft) Mil-Spec',
        'Profile Thickness': '1.2mm',
        'MagSafe Array': '36x N52 Neodymium Magnets',
        'Weight': '26g'
      }),
      compatibility: 'iPhone 16 Pro, iPhone 16 Pro Max, Galaxy S25 Ultra',
    },
    {
      name: 'Avenoir Glitch Case',
      slug: 'glitch-case',
      description: 'Semi-translucent polymer case showcasing architectural internal ribs and an electric-cyan MagSafe array. Made for creators.',
      details: 'Equipped with shock-absorbent corner bumpers, tactile anodized aluminum buttons, and elevated lip protectors for both screen and camera lens.',
      price: 49.00,
      category: 'cases',
      image: '/images/glitch-case-1.webp',
      hoverImage: '/images/glitch-case-hover.webp',
      images: JSON.stringify([
        '/images/glitch-case-1.webp',
        '/images/glitch-case-2.webp'
      ]),
      rating: 4.7,
      reviewsCount: 88,
      isFeatured: true,
      stock: 75,
      specs: JSON.stringify({
        'Material': 'Shockproof Polycarbonate & TPU',
        'Drop Certification': '6m (20ft)',
        'MagSafe Array': 'Yes (Electric Cyan colorway)',
        'Weight': '32g'
      }),
      compatibility: 'iPhone 16 Pro, iPhone 16 Pro Max, Galaxy S25 Ultra, iPhone 15 Pro',
    },
    {
      name: 'Avenoir Proton 65W GaN Charger',
      slug: 'proton-65w-gan-charger',
      description: 'Ultra-compact Gallium Nitride charging brick with dual USB-C ports. Intelligently splits power to fast charge phone and laptop.',
      details: 'Built with advanced thermal monitors and automated power management protocols. Small enough to fit in a pocket, powerful enough to charge a MacBook Air.',
      price: 45.00,
      category: 'chargers',
      image: '/images/proton-65w-1.webp',
      images: JSON.stringify(['/images/proton-65w-1.webp']),
      rating: 4.8,
      reviewsCount: 56,
      isFeatured: true,
      stock: 150,
      specs: JSON.stringify({
        'Ports': '2x USB-C',
        'Technology': 'GaN Fast / Power Delivery 3.0',
        'Max Output': '65W (Single port) / 45W+20W (Dual port)',
        'Dimensions': '36 x 36 x 40mm'
      }),
      compatibility: 'All USB-C Devices, iPhone 16, Galaxy S25, MacBook Air, iPad Pro',
    },
    {
      name: 'Avenoir Quantum Cyan Cable (1.8m)',
      slug: 'quantum-cyan-cable-18m',
      description: 'Heavy-duty ballistic nylon charging cable in signature electric cyan. Features CNC-milled aluminum shell connectors and strain-relief boots.',
      details: 'Built for 100W Power Delivery and rated for over 30,000 bends. Includes a premium tactile silicone cable organizer.',
      price: 29.00,
      category: 'cables',
      image: '/images/quantum-cable-1.webp',
      hoverImage: '/images/quantum-cable-hover.webp',
      images: JSON.stringify(['/images/quantum-cable-1.webp']),
      rating: 4.9,
      reviewsCount: 142,
      isFeatured: false,
      stock: 300,
      specs: JSON.stringify({
        'Connector Type': 'USB-C to USB-C',
        'Length': '1.8m (6ft)',
        'Power Delivery': 'Up to 100W (5A)',
        'Data Rate': 'USB 2.0 (480 Mbps)',
        'Bending Lifetime': '30,000+ bends'
      }),
      compatibility: 'All USB-C Devices',
    },
    {
      name: 'Avenoir Pod Armor for AirPods Pro',
      slug: 'pod-armor-airpods-pro',
      description: 'Minimalist aramid fiber protective casing for AirPods Pro charging case. Complete with an anodized titanium alloy security clip.',
      details: 'Allows seamless wireless charging and includes precise cutouts for speakers and status indicators. Ultra-light, dustproof, and fingerprint resistant.',
      price: 35.00,
      category: 'audio',
      image: '/images/pod-armor-1.webp',
      images: JSON.stringify(['/images/pod-armor-1.webp']),
      rating: 4.6,
      reviewsCount: 32,
      isFeatured: false,
      stock: 90,
      specs: JSON.stringify({
        'Material': 'Aramid Fiber & Polycarbonate',
        'Carabiner': 'Titanium Alloy Loop Included',
        'Charging Compatibility': 'Wireless & MagSafe Compatible',
        'Weight': '12g'
      }),
      compatibility: 'AirPods Pro 2, AirPods Pro 1',
    },
    {
      name: 'Avenoir Ion-Shield Screen Protector',
      slug: 'ion-shield-screen-protector',
      description: '9H hardness tempered glass with double-ion exchange technology. Provides pristine optical clarity and edge-to-edge impact protection.',
      details: 'Comes with a precise self-installation alignment tray. Treated with a long-lasting oleophobic layer that resists sweat, fingerprints, and smudge build-up.',
      price: 25.00,
      category: 'protectors',
      image: '/images/ion-shield-1.webp',
      images: JSON.stringify(['/images/ion-shield-1.webp']),
      rating: 4.8,
      reviewsCount: 215,
      isFeatured: false,
      stock: 400,
      specs: JSON.stringify({
        'Glass Grade': 'Double-tempered Aluminosilicate',
        'Hardness': '9H Mohs Scale',
        'Thickness': '0.33mm',
        'Installation': 'Alignment Tray Included'
      }),
      compatibility: 'iPhone 16 Pro, iPhone 16 Pro Max, Galaxy S25 Ultra',
    },
    {
      name: 'Avenoir MagSafe Snap-Stand Wallet',
      slug: 'magsafe-snap-stand-wallet',
      description: 'Anodized aluminum card sleeve and multi-angle stand. Snaps securely to any MagSafe case for modern, keyless utility.',
      details: 'Holds up to 3 cards securely with a quick-release slide mechanism. Folds flat to a 5mm profile and supports both portrait and landscape viewing angles.',
      price: 39.00,
      category: 'accessories',
      image: '/images/snap-stand-1.webp',
      images: JSON.stringify(['/images/snap-stand-1.webp']),
      rating: 4.5,
      reviewsCount: 47,
      isFeatured: true,
      stock: 110,
      specs: JSON.stringify({
        'Material': 'Anodized 6000-series Aluminum',
        'Card Storage': '1-3 Cards with elastic tension',
        'Profile Thickness': '5mm flat',
        'Magnetic Grip Force': '1200g (Extra strong)'
      }),
      compatibility: 'iPhone 16 / 15 / 14 Series with MagSafe, MagSafe Cases',
    },
    {
      name: 'Aeris Clear-Armor Glass Shell',
      slug: 'clear-armor-glass-shell',
      description: 'Ultra-clear hybrid case with dual-layer shock dispersion bumpers and crystal clarity.',
      details: 'Featuring scratch-resistant tempered glass back plate and soft TPU border panels. Fully compatible with MagSafe wireless pads.',
      price: 39.00,
      category: 'cases',
      image: '/images/glitch-case-2.webp',
      images: JSON.stringify(['/images/glitch-case-2.webp']),
      rating: 4.6,
      reviewsCount: 39,
      isFeatured: true,
      stock: 80,
      specs: JSON.stringify({
        'Material': 'Tempered Glass & TPU bumpers',
        'Clarity Index': '99.9% Optical Clarity',
        'Drop Certification': '4m (13ft)'
      }),
      compatibility: 'iPhone 16 Pro, iPhone 16 Pro Max, Galaxy S25 Ultra',
    },
    {
      name: 'Aeris Neo GaN 100W Charging Hub',
      slug: 'neo-gan-100w-charging-hub',
      description: 'High-performance desktop charging station with 3x USB-C and 1x USB-A ports to charge your full work loadout.',
      details: 'Exposes smart power sharing protocols, delivering up to 100W single-port outputs. Encased in a flame-retardant stone-finish shell.',
      price: 85.00,
      category: 'chargers',
      image: '/images/proton-65w-1.webp',
      images: JSON.stringify(['/images/proton-65w-1.webp']),
      rating: 4.9,
      reviewsCount: 73,
      isFeatured: true,
      stock: 60,
      specs: JSON.stringify({
        'Ports': '3x USB-C / 1x USB-A',
        'Max Output': '100W Single Port',
        'Technology': 'GaN Fast v2'
      }),
      compatibility: 'MacBook Pro, iPhone 16, iPad, USB-C Laptops',
    },
    {
      name: 'Aeris Helix Braided L-Cable (1.2m)',
      slug: 'helix-braided-l-cable',
      description: 'Right-angle USB-C connector with ballistic double-braided nylon sleeve. Ideal for handheld gaming and tight desk spaces.',
      details: 'Built with reinforced copper core wires supporting up to 60W power transmission. Right-angle plug reduces strain on USB ports.',
      price: 24.00,
      category: 'cables',
      image: '/images/quantum-cable-1.webp',
      images: JSON.stringify(['/images/quantum-cable-1.webp']),
      rating: 4.7,
      reviewsCount: 29,
      isFeatured: false,
      stock: 120,
      specs: JSON.stringify({
        'Connector': '90-degree USB-C to USB-C',
        'Length': '1.2m (4ft)',
        'Power limit': '60W'
      }),
      compatibility: 'All USB-C Devices, iPad, Nintendo Switch',
    },
    {
      name: 'Aeris Pod Aramid Loop for AirPods 4',
      slug: 'pod-aramid-loop-airpods-4',
      description: 'Featherlight aramid fiber cover tailored for AirPods 4. Built-in lanyard anchor and charging indicator cutouts.',
      details: 'Exposes a slim 0.6mm aramid weave with tactile anti-slip surface coatings. Compatible with MagSafe wireless pads.',
      price: 32.00,
      category: 'audio',
      image: '/images/pod-armor-1.webp',
      images: JSON.stringify(['/images/pod-armor-1.webp']),
      rating: 4.8,
      reviewsCount: 19,
      isFeatured: false,
      stock: 95,
      specs: JSON.stringify({
        'Material': 'Synthetic Aramid fiber',
        'Thickness': '0.6mm',
        'Weight': '8g'
      }),
      compatibility: 'AirPods 4, AirPods 4 Active Noise Cancellation',
    },
    {
      name: 'Aeris Screen Glass Protectors (2-Pack)',
      slug: 'screen-glass-protectors-2pack',
      description: 'Premium double-strength glass protectors with anti-shatter matrices. Micro-bevel borders for smooth swipes.',
      details: 'Aluminosilicate glass exchange formula delivers impact resistance. Features bubble-free adhesive maps for clean static installations.',
      price: 19.00,
      category: 'protectors',
      image: '/images/ion-shield-1.webp',
      images: JSON.stringify(['/images/ion-shield-1.webp']),
      rating: 4.5,
      reviewsCount: 147,
      isFeatured: false,
      stock: 220,
      specs: JSON.stringify({
        'Hardness': '9H Mohs Scale',
        'Package': '2x Glass Sheets + Trays'
      }),
      compatibility: 'iPhone 16 Pro, Galaxy S25 Ultra, Pixel 9 Pro',
    },
    {
      name: 'Aeris Magnetic Desk Orb Stand',
      slug: 'magnetic-desk-orb-stand',
      description: 'Sculpted alloy phone stand with a 360-degree articulating ball-head. Heavy base for steady one-handed taps.',
      details: 'Solid zinc alloy casing with non-slip silicone pads. Double magnetic ring core guarantees solid grip locks.',
      price: 45.00,
      category: 'accessories',
      image: '/images/snap-stand-1.webp',
      images: JSON.stringify(['/images/snap-stand-1.webp']),
      rating: 4.8,
      reviewsCount: 31,
      isFeatured: true,
      stock: 70,
      specs: JSON.stringify({
        'Material': 'Zinc Alloy / Silicone base',
        'Articulation': '360 degree ball joint',
        'Weight base': '280g'
      }),
      compatibility: 'MagSafe Compatible Devices',
    }
  ];

  for (const p of productsData) {
    const product = await db.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        details: p.details,
        price: p.price,
        discountPrice: p.discountPrice,
        category: p.category,
        image: p.image,
        hoverImage: p.hoverImage,
        images: p.images,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        isFeatured: p.isFeatured,
        stock: p.stock,
        specs: p.specs,
        compatibility: p.compatibility,
      },
    });

    // Create a couple of variants for cases and wallets
    if (p.category === 'cases') {
      await db.productVariant.createMany({
        data: [
          {
            productId: product.id,
            color: 'Obsidian Black',
            colorHex: '#0D0D0D',
            priceModifier: 0.0,
            stock: Math.floor(p.stock / 2),
          },
          {
            productId: product.id,
            color: 'Electric Cyan',
            colorHex: '#22D3EE',
            priceModifier: 5.0,
            stock: Math.floor(p.stock / 2),
          },
        ],
      });
    }

    // Seed mock reviews
    await db.review.createMany({
      data: [
        {
          productId: product.id,
          userName: 'Sarah K.',
          rating: 5,
          comment: 'Absolutely spectacular quality. The aramid weave feels so secure and thin at the same time. Fits my iPhone 16 Pro Max perfectly!',
          verifiedPurchase: true,
        },
        {
          productId: product.id,
          userName: 'Alex M.',
          rating: 4,
          comment: 'Very premium feel. The electric cyan details look striking in person. Dropped it once on concrete already, not a single scratch on the device.',
          verifiedPurchase: true,
        }
      ],
    });
  }

  // Create a mock order to showcase in admin panel
  const caseProduct = await db.product.findFirst({ where: { slug: 'carbon-monolith-case' } });
  const cableProduct = await db.product.findFirst({ where: { slug: 'quantum-cyan-cable-18m' } });

  if (caseProduct && cableProduct) {
    const order = await db.order.create({
      data: {
        userId: customer.id,
        customerName: 'John Doe',
        customerEmail: 'user@avenoir.com',
        shippingAddress: JSON.stringify({
          line1: '123 Cyberpunk St',
          city: 'Neon City',
          state: 'CA',
          postalCode: '90210',
          country: 'USA'
        }),
        total: 84.00,
        status: 'PROCESSING',
        paymentIntentId: 'pi_test_avenoir_12345',
      },
    });

    await db.orderItem.create({
      data: {
        orderId: order.id,
        productId: caseProduct.id,
        quantity: 1,
        price: 55.00,
      },
    });

    await db.orderItem.create({
      data: {
        orderId: order.id,
        productId: cableProduct.id,
        quantity: 1,
        price: 29.00,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
