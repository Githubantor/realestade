import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: 100,
    },
    price: {
      type: String,
      required: [true, 'Please add a price'],
      // e.g. "$139,000,000"
    },
    priceValue: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    city: {
      type: String,
      default: 'Beverly Hills',
    },
    neighborhood: {
      type: String,
      enum: ['Beverly Hills', 'Bel Air', 'Hollywood Hills', 'Malibu', 'Trousdale', 'Other'],
      default: 'Beverly Hills',
    },
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
    sqft: { type: String, required: true },
    sqftValue: { type: Number },
    tag: { type: String, required: true, uppercase: true },
    status: {
      type: String,
      enum: ['New Listing', 'Private Listing', 'Just Sold', 'Price Reduced', 'Iconic', 'Available'],
      default: 'Available',
    },
    description: {
      type: String,
      maxlength: 2000,
    },
    images: {
      type: [String],
      required: true,
      validate: [arr => arr.length > 0, 'At least one image required'],
    },
    image: {
      type: String, // primary image for backward compat
    },
    features: [String],
    type: {
      type: String,
      enum: ['Buy', 'Rent'],
      default: 'Buy',
    },
    featured: { type: Boolean, default: false },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Index for search
propertySchema.index({ address: 'text', title: 'text', tag: 'text', neighborhood: 'text' });
propertySchema.index({ priceValue: 1 });
propertySchema.index({ beds: 1 });
propertySchema.index({ neighborhood: 1 });
propertySchema.index({ status: 1 });

const Property = mongoose.model('Property', propertySchema);
export default Property;
