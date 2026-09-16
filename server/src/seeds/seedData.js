import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import VisitorTraffic from '../models/VisitorTraffic.js';

// STORE 1: Apex Retailers (Devicharan Prajapati)
const STORE_1_PRODUCTS = [
  {
    storeId: 'store-1',
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
    storeId: 'store-1',
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
    storeId: 'store-1',
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
    storeId: 'store-1',
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
    storeId: 'store-1',
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
    storeId: 'store-1',
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
    storeId: 'store-1',
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
    storeId: 'store-1',
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

// STORE 2: Urban Gadgets (Rohit Sharma)
const STORE_2_PRODUCTS = [
  {
    storeId: 'store-2',
    title: 'RGB Mechanical Gaming Keyboard',
    description: 'Hot-swappable tactile switches with per-key RGB backlighting.',
    price: 3499,
    costPrice: 1600,
    sku: 'URBAN-KEYBOARD-01',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    inventoryQuantity: 65,
  },
  {
    storeId: 'store-2',
    title: 'Ergonomic Precision Wireless Mouse',
    description: 'Dual Bluetooth & 2.4GHz with 4000 DPI sensor.',
    price: 1699,
    costPrice: 700,
    sku: 'URBAN-MOUSE-02',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
    inventoryQuantity: 90,
  },
  {
    storeId: 'store-2',
    title: 'Aluminum Multi-Port USB-C Hub 8-in-1',
    description: '4K HDMI, 100W Power Delivery, SD card reader, and Gigabit Ethernet.',
    price: 2499,
    costPrice: 1100,
    sku: 'URBAN-DOCK-03',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=500&q=80',
    inventoryQuantity: 40,
  },
  {
    storeId: 'store-2',
    title: 'Studio Condenser USB Microphone',
    description: 'Cardioid polar pattern with zero-latency headphone monitoring.',
    price: 4299,
    costPrice: 2100,
    sku: 'URBAN-MIC-04',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
    inventoryQuantity: 35,
  },
  {
    storeId: 'store-2',
    title: 'Vegan Leather Extended Desk Mat',
    description: 'Water-resistant 900x400mm surface with non-slip suede base.',
    price: 999,
    costPrice: 380,
    sku: 'URBAN-MAT-05',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&q=80',
    inventoryQuantity: 120,
  },
  {
    storeId: 'store-2',
    title: 'Smart LED Monitor Light Bar',
    description: 'Screen glare-free asymmetric lighting with wireless remote control.',
    price: 2799,
    costPrice: 1300,
    sku: 'URBAN-LIGHT-06',
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80',
    inventoryQuantity: 50,
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

const generateStoreHistory = (storeId, products, startOrderNum, orderMultiplier) => {
  const now = new Date();
  const orders = [];
  const trafficList = [];
  let orderCounter = startOrderNum;

  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const orderDate = new Date(now);
    orderDate.setDate(now.getDate() - dayOffset);

    const isWeekend = orderDate.getDay() === 0 || orderDate.getDay() === 6;
    const baseOrders = isWeekend ? 4 : 2;
    const dailyOrdersCount = Math.floor((baseOrders + Math.random() * 3) * orderMultiplier);

    const dailyVisitors = Math.floor(dailyOrdersCount * (26 + Math.random() * 12));
    const dailySessions = Math.floor(dailyVisitors * (1.2 + Math.random() * 0.3));

    trafficList.push({
      storeId,
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
        const product = products[Math.floor(Math.random() * products.length)];
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

      const randStatus = Math.random();
      const financialStatus = randStatus > 0.1 ? 'paid' : randStatus > 0.05 ? 'pending' : 'refunded';

      orders.push({
        storeId,
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

  return { orders, trafficList };
};

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

    console.log('Inserting Store 1 (Apex Retailers - Devicharan) products in INR (₹)...');
    const createdStore1Products = await Product.insertMany(STORE_1_PRODUCTS);
    console.log(`✅ ${createdStore1Products.length} Store 1 products inserted.`);

    console.log('Inserting Store 2 (Urban Gadgets - Rohit Sharma) products in INR (₹)...');
    const createdStore2Products = await Product.insertMany(STORE_2_PRODUCTS);
    console.log(`✅ ${createdStore2Products.length} Store 2 products inserted.`);

    console.log('Generating realistic 30-day orders & traffic for Store 1...');
    const store1Data = generateStoreHistory('store-1', createdStore1Products, 1001, 1.1);

    console.log('Generating realistic 30-day orders & traffic for Store 2...');
    const store2Data = generateStoreHistory('store-2', createdStore2Products, 5001, 0.9);

    const allOrders = [...store1Data.orders, ...store2Data.orders];
    const allTraffic = [...store1Data.trafficList, ...store2Data.trafficList];

    console.log(`Inserting ${allOrders.length} total orders across both stores...`);
    await Order.insertMany(allOrders);

    console.log(`Inserting ${allTraffic.length} total daily traffic records...`);
    await VisitorTraffic.insertMany(allTraffic);

    console.log('🎉 Multi-store database seeding in Rupees (₹) completed successfully!');
    console.log(`- Store 1 (Apex Retailers): ${store1Data.orders.length} orders`);
    console.log(`- Store 2 (Urban Gadgets): ${store2Data.orders.length} orders`);
    process.exit(0);
  } catch (error) {
    console.error('Error while seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
