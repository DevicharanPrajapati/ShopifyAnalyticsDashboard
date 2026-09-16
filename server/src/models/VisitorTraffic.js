import mongoose from 'mongoose';

const visitorTrafficSchema = new mongoose.Schema(
  {
    storeId: {
      type: String,
      default: 'store-1',
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    visitorsCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    sessionsCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

visitorTrafficSchema.index({ storeId: 1, date: 1 }, { unique: true });

const VisitorTraffic = mongoose.model('VisitorTraffic', visitorTrafficSchema);

export default VisitorTraffic;
