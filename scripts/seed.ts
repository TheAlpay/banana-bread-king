import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  }),
})

const db = getFirestore(app)

const products = [
  {
    name: 'Classic Banana Bread',
    slug: 'classic-banana-bread',
    range: 'classic',
    description: 'Our signature recipe — moist, golden, and made with fresh Queensland bananas.',
    features: ['Egg Free', 'No Added Sugar', 'Local QLD Bananas'],
    varieties: ['600g', '2.4kg'],
    basePrice: 1200,
    imageUrl: '/images/classic-banana-bread.jpg',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Choc Chip Banana Bread',
    slug: 'choc-chip-banana-bread',
    range: 'classic',
    description: 'Our classic loaf loaded with rich chocolate chips for an indulgent twist.',
    features: ['Egg Free', 'No Added Sugar', 'Chocolate Chips'],
    varieties: ['600g', '2.4kg'],
    basePrice: 1300,
    imageUrl: '/images/choc-chip-banana-bread.jpg',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Banana & Walnut Banana Bread',
    slug: 'banana-walnut-banana-bread',
    range: 'classic',
    description: 'Loaded with crunchy Queensland walnuts for a satisfying bite in every slice.',
    features: ['Egg Free', 'No Added Sugar', 'Crunchy Walnuts'],
    varieties: ['600g', '2.4kg'],
    basePrice: 1300,
    imageUrl: '/images/banana-walnut-banana-bread.jpg',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Banana & Date Banana Bread',
    slug: 'banana-date-banana-bread',
    range: 'classic',
    description: 'Naturally sweetened with Medjool dates — wholesome and delicious.',
    features: ['Egg Free', 'No Added Sugar', 'Naturally Sweetened'],
    varieties: ['600g', '2.4kg'],
    basePrice: 1300,
    imageUrl: '/images/banana-date-banana-bread.jpg',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Lemon & Poppy Seed Banana Bread',
    slug: 'lemon-poppy-seed-banana-bread',
    range: 'classic',
    description: 'Bright citrus zest with poppy seeds for a refreshing, light loaf.',
    features: ['Egg Free', 'No Added Sugar', 'Zesty Citrus'],
    varieties: ['600g', '2.4kg'],
    basePrice: 1300,
    imageUrl: '/images/lemon-poppy-seed-banana-bread.jpg',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Cinnamon & Raisin Banana Bread',
    slug: 'cinnamon-raisin-banana-bread',
    range: 'classic',
    description: 'Warming cinnamon spice with plump raisins — the perfect winter loaf.',
    features: ['Egg Free', 'No Added Sugar', 'Warming Spices'],
    varieties: ['600g', '2.4kg'],
    basePrice: 1300,
    imageUrl: '/images/cinnamon-raisin-banana-bread.jpg',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Raspberry & Pear Banana Bread',
    slug: 'raspberry-pear-banana-bread-gf',
    range: 'gluten-free-vegan',
    description: 'Sweet raspberries and tender pear in a light coconut and rice flour base.',
    features: ['Egg Free', 'No Added Sugar', 'Gluten Free', 'Vegan'],
    varieties: ['600g', '2.4kg'],
    basePrice: 1400,
    imageUrl: '/images/raspberry-pear-banana-bread.jpg',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Blueberry Banana Bread',
    slug: 'blueberry-banana-bread-gf',
    range: 'gluten-free-vegan',
    description: 'Bursting with fresh blueberries in our gluten-free coconut and rice flour recipe.',
    features: ['Egg Free', 'No Added Sugar', 'Gluten Free', 'Vegan'],
    varieties: ['600g', '2.4kg'],
    basePrice: 1400,
    imageUrl: '/images/blueberry-banana-bread.jpg',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Apple & Cinnamon Banana Bread',
    slug: 'apple-cinnamon-banana-bread-gf',
    range: 'gluten-free-vegan',
    description: 'Tender apple pieces and aromatic cinnamon in a gluten-free loaf.',
    features: ['Egg Free', 'No Added Sugar', 'Gluten Free', 'Vegan'],
    varieties: ['600g', '2.4kg'],
    basePrice: 1400,
    imageUrl: '/images/apple-cinnamon-banana-bread.jpg',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Mango & Coconut Banana Bread',
    slug: 'mango-coconut-banana-bread-gf',
    range: 'gluten-free-vegan',
    description: 'Tropical Queensland mango with toasted coconut in our signature GF recipe.',
    features: ['Egg Free', 'No Added Sugar', 'Gluten Free', 'Vegan', 'Tropical'],
    varieties: ['600g', '2.4kg'],
    basePrice: 1400,
    imageUrl: '/images/mango-coconut-banana-bread.jpg',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Walnut Banana Bread (GF)',
    slug: 'walnut-banana-bread-gf',
    range: 'gluten-free-vegan',
    description: 'Classic walnut goodness made entirely gluten-free and vegan.',
    features: ['Egg Free', 'No Added Sugar', 'Gluten Free', 'Vegan', 'Crunchy Walnuts'],
    varieties: ['600g'],
    basePrice: 1400,
    imageUrl: '/images/walnut-banana-bread-gf.jpg',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Classic Banana Bread (GF)',
    slug: 'classic-banana-bread-gf',
    range: 'gluten-free-vegan',
    description: 'All the comfort of our original recipe, completely gluten-free and vegan.',
    features: ['Egg Free', 'No Added Sugar', 'Gluten Free', 'Vegan'],
    varieties: ['600g', '2.4kg'],
    basePrice: 1400,
    imageUrl: '/images/classic-banana-bread-gf.jpg',
    inStock: true,
    createdAt: new Date().toISOString(),
  },
]

const discountCodes = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    usedCount: 0,
    usedBy: [],
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    code: 'BULK5',
    type: 'percentage',
    value: 5,
    minOrderAmount: 5000,
    usedCount: 0,
    usedBy: [],
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    code: 'KINGOFF',
    type: 'fixed',
    value: 500,
    maxUses: 100,
    usedCount: 0,
    usedBy: [],
    active: true,
    createdAt: new Date().toISOString(),
  },
]

async function seed() {
  console.log('🍌 Seeding Banana Bread King Firestore...')

  // Seed products
  console.log('📦 Seeding products...')
  for (const product of products) {
    await db.collection('products').doc(product.slug).set(product)
    console.log(`  ✓ ${product.name}`)
  }

  // Seed discount codes
  console.log('🏷️  Seeding discount codes...')
  for (const code of discountCodes) {
    await db.collection('discountCodes').doc(code.code).set(code)
    console.log(`  ✓ ${code.code}`)
  }

  // Optionally set admin role
  const adminUid = process.env.ADMIN_UID
  if (adminUid) {
    console.log(`👑 Setting admin role for UID: ${adminUid}`)
    await db.collection('users').doc(adminUid).set(
      {
        role: 'admin',
        approved: true,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    )
    console.log('  ✓ Admin role set')
  } else {
    console.log('  ℹ️  Set ADMIN_UID in .env.local to grant admin access')
  }

  console.log('\n✅ Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
