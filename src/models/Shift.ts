import mongoose, { Schema, Document } from 'mongoose';
import { getModel } from '@/lib/databaseConnection';

/**
 * Interface representing a completed work shift
 * A shift tracks working time and earnings for a specific employer using a specific rate
 */
export interface IShift extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user who created this shift
  employerId: mongoose.Types.ObjectId; // Reference to the employer for this shift
  rateId: mongoose.Types.ObjectId; // Reference to the pay rate used for this shift
  startTime: Date; // When the shift started
  endTime: Date; // When the shift ended
  breakDuration: number; // Unpaid break time in minutes
  notes?: string; // Optional notes/comments about this shift
  // Calculated fields
  regularHours: number; // Standard hours worked (typically first 8 hours)
  overtimeHours1: number; // Hours at 125% rate (typically hours 8-10)
  overtimeHours2: number; // Hours at 150% rate (typically hours beyond 10)
  totalHours: number; // Total hours worked (excluding breaks)
  regularEarnings: number; // Earnings for regular hours
  overtimeEarnings1: number; // Earnings for overtime tier 1
  overtimeEarnings2: number; // Earnings for overtime tier 2
  totalEarnings: number; // Total earnings for the shift
  createdAt: Date; // Timestamp when the record was created
  updatedAt: Date; // Timestamp when the record was last updated
}

const shiftSchema = new Schema<IShift>(
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
    rateId: {
      type: Schema.Types.ObjectId,
      ref: 'Rate',
      required: [true, 'Rate ID is required'],
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    breakDuration: {
      type: Number,
      default: 0,
      min: [0, 'Break duration cannot be negative'],
    },
    notes: {
      type: String,
      trim: true,
    },
    // Calculated fields that are stored for performance and reporting
    regularHours: {
      type: Number,
      default: 0,
    },
    overtimeHours1: {
      type: Number,
      default: 0,
    },
    overtimeHours2: {
      type: Number,
      default: 0,
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    regularEarnings: {
      type: Number,
      default: 0,
    },
    overtimeEarnings1: {
      type: Number,
      default: 0,
    },
    overtimeEarnings2: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create indexes for faster lookups and filtering
shiftSchema.index({ userId: 1, startTime: -1 });
shiftSchema.index({ userId: 1, employerId: 1, startTime: -1 });

/**
 * Find shifts for a user within a specific date range
 * Returns shifts sorted by start time and populated with employer and rate data
 */
shiftSchema.statics.findInDateRange = async function (userId, startDate, endDate) {
  const query: any = {
    userId,
    startTime: { $gte: startDate },
    endTime: { $lte: endDate },
  };

  return this.find(query)
    .sort({ startTime: 1 })
    .populate('employerId', 'name color')
    .populate('rateId', 'baseRate currency');
};

/**
 * Find upcoming shifts for a user
 * Returns a specified number of future shifts sorted by start time
 */
shiftSchema.statics.findUpcoming = async function (userId, limit = 5) {
  const now = new Date();

  return this.find({
    userId,
    startTime: { $gte: now },
  })
    .sort({ startTime: 1 })
    .limit(limit)
    .populate('employerId', 'name color')
    .populate('rateId', 'baseRate currency');
};

// The most reliable way to register models in a serverless environment
// Using our centralized getModel helper to prevent registration errors
const Shift = getModel<IShift>('Shift', shiftSchema);

export default Shift;
