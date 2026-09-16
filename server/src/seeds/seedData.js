import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import VisitorTraffic from '../models/VisitorTraffic.js';

const SAMPLE_PRODUCTS = [
  {
    title: 'Aura Wireless Noise-Cancelling Headphones',
    description: 'High-fidelity audio with active noise cancellation and 30-hour battery life.',
    price: 249.99,
    costPrice: 120.0,
    sku: 'AURA-HEADPHONE-01',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    inventoryQuantity: 85,
  },
  {
    title: 'Minimalist Chrono Watch',
    description: 'Japanese quartz movement with genuine Italian leather strap.',
    price: 189.0,
    costPrice: 75.0,
    sku: 'WATCH-CHRONO-02',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    inventoryQuantity: 42,
  },
  {
    title: 'Heritage Canvas Travel Backpack',
    description: 'Water-resistant waxed canvas with 16-inch padded laptop compartment.',
    price: 119.5,
    costPrice: 48.0,
    sku: 'BAG-HERITAGE-03',
    category: 'Bags & Luggage',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    inventoryQuantity: 60,
  },
  {
    title: 'Barista Touch Espresso Machine',
    description: 'Compact 15-bar Italian pump espresso and cappuccino maker.',
    price: 349.0,
    costPrice: 180.0,
    sku: 'KITCHEN-ESPRESSO-04',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80',
    inventoryQuantity: 28,
  },
  {
    title: 'Eco-Knit Runner Sneakers',
    description: 'Ultralight sneakers crafted from 100% recycled ocean plastic yarn.',
    price: 135.0,
    costPrice: 55.0,
    sku: 'SHOES-RUNNER-05',
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    inventoryQuantity: 110,
  },
  {
    title: 'Polarized Aviator Sunglasses',
    description: 'Classic lightweight titanium frames with UV400 polarized lenses.',
    price: 89.0,
    costPrice: 30.0,
    sku: 'SUNGLASSES-AV-06',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
    inventoryQuantity: 75,
  },
  {
    title: 'Organic Cotton Oversized Hoodie',
    description: 'Heavyweight 450 GSM French terry cotton with relaxed streetwear fit.',
    price: 79.99,
    costPrice: 32.0,
    sku: 'APPAREL-HOODIE-07',
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
    inventoryQuantity: 95,
  },
  {
    title: 'Smart Fitness & Health Band Pro',
    description: 'Continuous heart rate, SpO2, and sleep tracking with 14-day battery.',
    price: 99.0,
    costPrice: 42.0,
    sku: 'SMART-BAND-08',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80',
    inventoryQuantity: 130,
  },
];

const CUSTOMERS = [
  { name: 'Alex Johnson', email: 'alex.j@example.com', city: 'New York', country: 'United States' },
  { name: 'Sophia Miller', email: 'sophia.m@example.com', city: 'Los Angeles', country: 'United States' },
  { name: 'Liam Davis', email: 'liam.davis@example.com', city: 'Chicago', country: 'United States' },
  { name: 'Emma Wilson', email: 'emma.wilson@example.com', city: 'Austin', country: 'United States' },
  { name: 'Noah Taylor', email: 'noah.taylor@example.com', city: 'Seattle', country: 'United States' },
  { name: 'Olivia Brown', email: 'olivia.b@example.com', city: 'Toronto', country: 'Canada' },
  { name: 'Lucas Martin', email: 'lucas.m@example.com', city: 'London', country: 'United Kingdom' },
  { name: 'Ava Anderson', email: 'ava.anderson@example.com', city: 'Miami', country: 'United States' },
  { name: 'Ethan Thomas', email: 'ethan.t@example.com', city: 'Denver', country: 'United States' },
  { name: 'Mia Jackson', email: 'mia.jackson@example.com', city: 'San Francisco', country: 'United States' },
];

const seedDatabase = async () => {
  try {
    const DAYS_TO_SEED = process.env.DAYS ? parseInt(process.env.DAYS, 10) : 30;

    console.log('Connecting to database...');
    const conn = await connectDB();

    if (!conn) {
      console.error('Could not connect to database. Aborting seed.');
      process.exit(1);
    }

    console.log('Clearing existing collections...');
    await Product.deleteMany({});
    await Order.deleteMany({});
    await VisitorTraffic.deleteMany({});

    console.log('Inserting products...');
    const createdProducts = await Product.insertMany(SAMPLE_PRODUCTS);
    console.log(`✅ ${createdProducts.length} products inserted.`);

    const now = new Date();
    const orders = [];
    const trafficList = [];
    let orderCounter = 1001;

    console.log(`Generating realistic ${DAYS_TO_SEED}-day order & traffic history...`);

    for (let dayOffset = DAYS_TO_SEED - 1; dayOffset >= 0; dayOffset--) {
      const orderDate = new Date(now);
      orderDate.setDate(now.getDate() - dayOffset);

      // Daily orders count (between 2 and 7 orders daily, with weekend boosts)
      const isWeekend = orderDate.getDay() === 0 || orderDate.getDay() === 6;
      const baseOrders = isWeekend ? 4 : 2;
      const dailyOrdersCount = Math.floor(baseOrders + Math.random() * 4);

      // Realistic Shopify conversion rate between 2.5% and 4.2%
      const dailyVisitors = Math.floor(dailyOrdersCount * (25 + Math.random() * 15));
      const dailySessions = Math.floor(dailyVisitors * (1.2 + Math.random() * 0.3));

      trafficList.push({
        date: new Date(orderDate.setHours(0, 0, 0, 0)),
        visitorsCount: dailyVisitors,
        sessionsCount: dailySessions,
      });

      for (let o = 0; o < dailyOrdersCount; o++) {
        const orderTime = new Date(orderDate);
        orderTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
        const numItems = Math.random() > 0.7 ? 2 : 1;
        const items = [];
        let subtotal = 0;

        for (let i = 0; i < numItems; i++) {
          const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
          const quantity = Math.random() > 0.85 ? 2 : 1;
          items.push({
            product: product._id,
            title: product.title,
            price: product.price,
            quantity,
            sku: product.sku,
            image: product.image,
          });
          subtotal += product.price * quantity;
        }

        const tax = Number((subtotal * 0.08).toFixed(2));
        const shippingFee = subtotal > 150 ? 0 : 12;
        const totalAmount = Number((subtotal + tax + shippingFee).toFixed(2));

        // ~90% paid, 5% pending, 5% refunded
        const randStatus = Math.random();
        const financialStatus = randStatus > 0.1 ? 'paid' : randStatus > 0.05 ? 'pending' : 'refunded';

        orders.push({
          orderNumber: `#SH-${orderCounter++}`,
          customer,
          items,
          subtotal: Number(subtotal.toFixed(2)),
          tax,
          shippingFee,
          totalAmount,
          financialStatus,
          fulfillmentStatus: financialStatus === 'paid' ? 'fulfilled' : 'unfulfilled',
          orderDate: orderTime,
        });
      }
    }

    console.log(`Inserting ${orders.length} orders across ${DAYS_TO_SEED} days...`);
    await Order.insertMany(orders);

    console.log(`Inserting ${trafficList.length} traffic entries across ${DAYS_TO_SEED} days...`);
    await VisitorTraffic.insertMany(trafficList);

    console.log(`🎉 Database seeding of ${DAYS_TO_SEED} days completed successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Error while seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
