import mongoose, { Schema, models, Document, model } from 'mongoose';

/**
 * Interface representing a pay rate configuration for a specific employer
 * Rates define how much the user earns per hour including overtime calculations
 */
export interface IRate extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user who created this rate
  employerId: mongoose.Types.ObjectId; // Reference to the associated employer
  name: string; // Name/description of this pay rate
  baseRate: number; // Standard hourly pay rate
  currency: string; // Currency code (ILS, USD, EUR)
  effectiveDate: Date; // Date when this rate becomes effective
  isDefault: boolean; // Whether this is the default rate for the employer
  createdAt: Date; // Timestamp when the record was created
  updatedAt: Date; // Timestamp when the record was last updated
}

const rateSchema = new Schema<IRate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    employerId: {
      type: Schema.Types.ObjectId,
      ref: 'Employer',
      required: [true, 'Employer ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Rate name is required'],
      trim: true,
    },
    baseRate: {
      type: Number,
      required: [true, 'Base hourly rate is required'],
      min: [0, 'Base rate cannot be negative'],
    },
    currency: {
      type: String,
      default: 'ILS',
      enum: ['ILS', 'USD', 'EUR'],
    },
    effectiveDate: {
      type: Date,
      default: Date.now,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create an index for faster lookups by user and employer
rateSchema.index({ userId: 1, employerId: 1, effectiveDate: -1 });

/**
 * Finds the applicable rate for a user and employer at a specific date
 * Returns the most recent rate that is effective on or before the provided date
 */
rateSchema.statics.findApplicableRate = async function (userId, employerId, date) {
  return this.findOne({
    userId,
    employerId,
    effectiveDate: { $lte: date },
  }).sort({ effectiveDate: -1 });
};

// More reliable model registration for serverless environments
// This approach helps prevent "Schema hasn't been registered for model" errors
const Rate = mongoose.models?.Rate || mongoose.model('Rate', rateSchema);

export default Rate;
