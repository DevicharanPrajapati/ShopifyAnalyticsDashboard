import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  sku: {
    type: String,
  },
  image: {
    type: String,
  },
});

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  city: String,
  country: {
    type: String,
    default: 'United States',
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customer: customerSchema,
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    financialStatus: {
      type: String,
      enum: ['paid', 'pending', 'refunded', 'voided'],
      default: 'paid',
      index: true,
    },
    fulfillmentStatus: {
      type: String,
      enum: ['unfulfilled', 'fulfilled', 'partial', 'shipped'],
      default: 'fulfilled',
    },
    orderDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast date-range queries
orderSchema.index({ orderDate: 1, financialStatus: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
