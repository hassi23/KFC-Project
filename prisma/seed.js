const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding default user...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const testUser = await prisma.user.create({
    data: {
      name: 'Test Customer',
      email: 'test@test.com',
      password: hashedPassword,
      role: 'USER',
    },
  });
  console.log(`Created user: ${testUser.email}`);

  console.log('Seeding menu items...');
  const menuItems = [
    // Burgers
    {
      name: 'Crispy Deluxe Burger',
      description: 'Crispy chicken breast fillet with fresh lettuce and mayo on a toasted sesame seed bun.',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80',
      category: 'Burgers',
      isFeatured: true,
    },
    {
      name: 'Spicy Royal Burger',
      description: 'Fierce spicy chicken fillet, pepper jack cheese, jalapeños, and our signature hot sauce.',
      price: 6.49,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      category: 'Burgers',
      isFeatured: true,
    },
    {
      name: 'Double Crunch Cheese',
      description: 'Two crispy chicken patties, double cheddar cheese, pickles, mustard, and secret burger sauce.',
      price: 7.99,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=80',
      category: 'Burgers',
      isFeatured: false,
    },
    {
      name: 'Bacon King Burger',
      description: 'Golden chicken fillet, crispy smoked bacon, cheddar cheese, and smoky BBQ ranch dressing.',
      price: 6.99,
      image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=600&q=80',
      category: 'Burgers',
      isFeatured: false,
    },

    // Buckets
    {
      name: 'Classic 8-Piece Bucket',
      description: '8 pieces of our signature crispy fried chicken, hand-breaded and cooked to golden perfection.',
      price: 16.99,
      image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
      category: 'Buckets',
      isFeatured: true,
    },
    {
      name: 'Spicy 12-Piece Bucket',
      description: '12 pieces of fiery, hand-breaded hot & spicy crispy fried chicken for the ultimate group feast.',
      price: 22.99,
      image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80',
      category: 'Buckets',
      isFeatured: false,
    },
    {
      name: 'Family Feast Box',
      description: '6 pieces of crispy fried chicken, 4 crispy chicken tenders, large golden fries, and a pot of hot gravy.',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=600&q=80',
      category: 'Buckets',
      isFeatured: true,
    },
    {
      name: 'Tender Bucket (10 pcs)',
      description: '10 all-white meat crispy chicken tenders served with 3 dipping sauces of your choice.',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
      category: 'Buckets',
      isFeatured: false,
    },

    // Rolls
    {
      name: 'Crispy Ranch Twister',
      description: 'A warm flour tortilla wrapped around crispy chicken tenders, fresh lettuce, tomatoes, and creamy ranch.',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1760888548893-bc2f7e09e972?auto=format&fit=crop&w=600&q=80',
      category: 'Rolls',
      isFeatured: true,
    },
    {
      name: 'Spicy Sweet Chili Wrap',
      description: 'Crispy chicken tenders, lettuce, shredded cucumbers, and sweet chili sauce inside a toasted tortilla.',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
      category: 'Rolls',
      isFeatured: false,
    },
    {
      name: 'Cheesy BBQ Wrap',
      description: 'Crispy chicken tenders, melted cheddar cheese, crispy onions, and sweet hickory BBQ sauce.',
      price: 5.49,
      image: 'https://images.unsplash.com/photo-1760888548893-bc2f7e09e972?auto=format&fit=crop&w=600&q=80',
      category: 'Rolls',
      isFeatured: false,
    },

    // Sides
    {
      name: 'Golden Fries (Large)',
      description: 'Thick cut, skin-on potatoes fried to a crisp exterior and fluffy interior, seasoned with sea salt.',
      price: 2.99,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
      category: 'Sides',
      isFeatured: false,
    },
    {
      name: 'Creamy Coleslaw',
      description: 'Freshly shredded cabbage and carrots in a rich, sweet, and tangy dressing.',
      price: 2.49,
      image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80',
      category: 'Sides',
      isFeatured: false,
    },
    {
      name: 'Hot Gravy Pot',
      description: 'Our signature rich, savory chicken gravy, perfect for dipping fries or chicken.',
      price: 1.99,
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
      category: 'Sides',
      isFeatured: false,
    },
    {
      name: 'Crispy Onion Rings',
      description: 'Thick-cut onion rings beer-battered and fried until highly crispy and golden.',
      price: 3.49,
      image: 'https://images.unsplash.com/photo-1630825533949-74f62f54553a?auto=format&fit=crop&w=600&q=80',
      category: 'Sides',
      isFeatured: false,
    },

    // Beverages
    {
      name: 'Classic Cola (Medium)',
      description: 'A classic, refreshing carbonated beverage served cold over ice.',
      price: 1.99,
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
      category: 'Beverages',
      isFeatured: false,
    },
    {
      name: 'Fresh Strawberry Lemonade',
      description: 'Real strawberry purée blended with freshly squeezed lemons, served iced.',
      price: 2.79,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
      category: 'Beverages',
      isFeatured: false,
    },

    // Deals
    {
      name: 'Kings Solo Meal',
      description: '1 Crispy Deluxe Burger, 1 portion of regular golden fries, and 1 medium classic cola.',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
      category: 'Deals',
      isFeatured: true,
    },
    {
      name: 'Mega Bucket Deal',
      description: '10 pieces of signature crispy chicken, 2 large fries, 1 large creamy coleslaw, and a 1.5L soft drink.',
      price: 27.99,
      image: 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=600&q=80',
      category: 'Deals',
      isFeatured: true,
    },
  ];

  for (const item of menuItems) {
    const createdItem = await prisma.menuItem.create({ data: item });
    console.log(`Created menu item: ${createdItem.name} (${createdItem.category})`);
  }

  console.log('Seeding store locations...');
  const stores = [
    {
      name: 'Downtown KFC',
      city: 'New York',
      address: '123 Main St, New York, NY 10001',
      hours: '10:00 AM - 11:00 PM',
      latitude: 40.7128,
      longitude: -74.0060,
    },
    {
      name: 'Brooklyn Junction',
      city: 'New York',
      address: '456 Flatbush Ave, Brooklyn, NY 11225',
      hours: '10:00 AM - Midnight',
      latitude: 40.6582,
      longitude: -73.9612,
    },
    {
      name: 'Queens Boulevard',
      city: 'New York',
      address: '789 Queens Blvd, Forest Hills, NY 11375',
      hours: '10:00 AM - 10:00 PM',
      latitude: 40.7208,
      longitude: -73.8458,
    },
    {
      name: 'Boston Common Store',
      city: 'Boston',
      address: '101 Tremont St, Boston, MA 02108',
      hours: '11:00 AM - 10:00 PM',
      latitude: 42.3562,
      longitude: -71.0623,
    },
    {
      name: 'Philly Central',
      city: 'Philadelphia',
      address: '202 Chestnut St, Philadelphia, PA 19106',
      hours: '10:00 AM - 11:00 PM',
      latitude: 39.9485,
      longitude: -75.1444,
    },
    {
      name: 'Washington Capitol',
      city: 'Washington DC',
      address: '303 Pennsylvania Ave SE, Washington, DC 20003',
      hours: '11:00 AM - 11:00 PM',
      latitude: 38.8876,
      longitude: -77.0003,
    },
  ];

  for (const store of stores) {
    const createdStore = await prisma.store.create({ data: store });
    console.log(`Created store: ${createdStore.name} in ${createdStore.city}`);
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
