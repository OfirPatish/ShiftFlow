import mongoose, { Schema, models, Document, model } from 'mongoose';

/**
 * Interface representing an employer entity in the system
 * An employer is an organization or individual that the user works for
 */
export interface IEmployer extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user who created this employer
  name: string; // Name of the employer/company
  location?: string; // Optional physical location of the employer
  color: string; // Color code used for UI display and identification
  isActive: boolean; // Flag to indicate if this employer is currently active
  createdAt: Date; // Timestamp when the record was created
  updatedAt: Date; // Timestamp when the record was last updated
}

const employerSchema = new Schema<IEmployer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Employer name is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: '#3B82F6', // Default color (primary blue)
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create an index for faster lookups
employerSchema.index({ userId: 1 });

/**
 * Custom static method to find all active employers for a user
 * Returns employers sorted alphabetically by name
 */
employerSchema.statics.findActiveForUser = async function (userId) {
  return this.find({ userId, isActive: true }).sort({ name: 1 });
};

// More reliable model registration for serverless environments
// This approach helps prevent "Schema hasn't been registered for model" errors
const Employer =
  (models.Employer as mongoose.Model<IEmployer>) || model<IEmployer>('Employer', employerSchema);

export default Employer;
