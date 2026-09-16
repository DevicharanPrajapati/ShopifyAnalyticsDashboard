import mongoose from 'mongoose';

const visitorTrafficSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
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

const VisitorTraffic = mongoose.model('VisitorTraffic', visitorTrafficSchema);

export default VisitorTraffic;
