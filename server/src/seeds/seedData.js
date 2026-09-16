import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import VisitorTraffic from '../models/VisitorTraffic.js';

const SAMPLE_PRODUCTS = [
  {
    title: 'Aura Wireless ANC Headphones',
    description: 'High-fidelity audio with active noise cancellation and 30-hour battery life.',
    price: 4999,
    costPrice: 2400,
    sku: 'APEX-HEADPHONE-01',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    inventoryQuantity: 85,
  },
  {
    title: 'Heritage Chrono Leather Watch',
    description: 'Japanese quartz movement with genuine leather strap.',
    price: 3499,
    costPrice: 1500,
    sku: 'APEX-WATCH-02',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    inventoryQuantity: 45,
  },
  {
    title: 'Waterproof Canvas Travel Backpack',
    description: 'Waxed canvas with 16-inch padded laptop compartment.',
    price: 2299,
    costPrice: 950,
    sku: 'APEX-BAG-03',
    category: 'Bags',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    inventoryQuantity: 60,
  },
  {
    title: 'Barista Touch Espresso Machine',
    description: 'Compact 15-bar Italian pump espresso and cappuccino maker.',
    price: 12999,
    costPrice: 6800,
    sku: 'APEX-COFFEE-04',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80',
    inventoryQuantity: 28,
  },
  {
    title: 'Eco-Knit Runner Sneakers',
    description: 'Ultralight running shoes crafted from recycled yarn.',
    price: 2799,
    costPrice: 1100,
    sku: 'APEX-SHOES-05',
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    inventoryQuantity: 110,
  },
  {
    title: 'Polarized Aviator Sunglasses',
    description: 'Classic lightweight titanium frames with UV400 lenses.',
    price: 1499,
    costPrice: 550,
    sku: 'APEX-GLASSES-06',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80',
    inventoryQuantity: 75,
  },
  {
    title: 'Organic Cotton Oversized Hoodie',
    description: 'Heavyweight 450 GSM French terry cotton.',
    price: 1899,
    costPrice: 750,
    sku: 'APEX-HOODIE-07',
    category: 'Apparel',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
    inventoryQuantity: 95,
  },
  {
    title: 'Smart Fitness & Health Band Pro',
    description: 'Continuous heart rate, SpO2, and sleep tracking.',
    price: 1999,
    costPrice: 850,
    sku: 'APEX-BAND-08',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80',
    inventoryQuantity: 130,
  },
];

const INDIAN_CUSTOMERS = [
  { name: 'Aarav Patel', email: 'aarav.patel@example.com', city: 'Mumbai', country: 'India' },
  { name: 'Priya Sharma', email: 'priya.sharma@example.com', city: 'Bengaluru', country: 'India' },
  { name: 'Rohan Verma', email: 'rohan.v@example.com', city: 'Delhi', country: 'India' },
  { name: 'Ananya Iyer', email: 'ananya.iyer@example.com', city: 'Chennai', country: 'India' },
  { name: 'Vikram Singh', email: 'vikram.singh@example.com', city: 'Jaipur', country: 'India' },
  { name: 'Sneha Kulkarni', email: 'sneha.k@example.com', city: 'Pune', country: 'India' },
  { name: 'Aditya Roy', email: 'aditya.roy@example.com', city: 'Kolkata', country: 'India' },
  { name: 'Neha Gupta', email: 'neha.gupta@example.com', city: 'Hyderabad', country: 'India' },
  { name: 'Karan Mehra', email: 'karan.m@example.com', city: 'Chandigarh', country: 'India' },
  { name: 'Ritu Deshmukh', email: 'ritu.d@example.com', city: 'Ahmedabad', country: 'India' },
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const conn = await connectDB();

    if (!conn) {
      console.error('Could not connect to database. Aborting seed.');
      process.exit(1);
    }

    console.log('Clearing existing collections...');
    await Product.deleteMany({});
    await Order.deleteMany({});
    await VisitorTraffic.deleteMany({});

    console.log('Inserting store products in INR (₹)...');
    const createdProducts = await Product.insertMany(SAMPLE_PRODUCTS);
    console.log(`✅ ${createdProducts.length} products inserted.`);

    const now = new Date();
    const orders = [];
    const trafficList = [];
    let orderCounter = 1001;

    console.log('Generating realistic 30-day orders & traffic...');

    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
      const orderDate = new Date(now);
      orderDate.setDate(now.getDate() - dayOffset);

      const isWeekend = orderDate.getDay() === 0 || orderDate.getDay() === 6;
      const baseOrders = isWeekend ? 5 : 3;
      const dailyOrdersCount = Math.floor(baseOrders + Math.random() * 3);

      const dailyVisitors = Math.floor(dailyOrdersCount * (26 + Math.random() * 12));
      const dailySessions = Math.floor(dailyVisitors * (1.2 + Math.random() * 0.3));

      trafficList.push({
        date: new Date(orderDate.setHours(0, 0, 0, 0)),
        visitorsCount: dailyVisitors,
        sessionsCount: dailySessions,
      });

      for (let o = 0; o < dailyOrdersCount; o++) {
        const orderTime = new Date(orderDate);
        orderTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

        const customer = INDIAN_CUSTOMERS[Math.floor(Math.random() * INDIAN_CUSTOMERS.length)];
        const numItems = Math.random() > 0.65 ? 2 : 1;
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

        const tax = Math.round(subtotal * 0.18); // 18% GST
        const shippingFee = subtotal > 2000 ? 0 : 150;
        const totalAmount = subtotal + tax + shippingFee;

        // ~90% paid, 5% pending, 5% refunded
        const randStatus = Math.random();
        const financialStatus = randStatus > 0.1 ? 'paid' : randStatus > 0.05 ? 'pending' : 'refunded';

        orders.push({
          orderNumber: `#SH-${orderCounter++}`,
          customer,
          items,
          subtotal,
          tax,
          shippingFee,
          totalAmount,
          financialStatus,
          fulfillmentStatus: financialStatus === 'paid' ? 'fulfilled' : 'unfulfilled',
          orderDate: orderTime,
        });
      }
    }

    console.log(`Inserting ${orders.length} orders across 30 days...`);
    await Order.insertMany(orders);

    console.log(`Inserting ${trafficList.length} daily traffic records...`);
    await VisitorTraffic.insertMany(trafficList);

    console.log('🎉 Single-user store seeding in Rupees (₹) completed successfully!');
    console.log(`- Total Orders: ${orders.length}`);
    console.log(`- Store: Apex Retailers (Devicharan Prajapati)`);
    process.exit(0);
  } catch (error) {
    console.error('Error while seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
