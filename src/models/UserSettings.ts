import mongoose, { Schema, models } from 'mongoose';
import { ObjectId } from 'mongodb';

/**
 * Interface representing user preferences and default settings
 * Allows the system to remember user choices and provide a personalized experience
 */
export interface IUserSettings {
  _id?: ObjectId; // MongoDB document ID
  userId: ObjectId; // Reference to the user these settings belong to
  defaultEmployerId?: ObjectId | null; // User's preferred/default employer
  defaultRateId?: ObjectId | null; // User's preferred/default rate
  createdAt?: Date; // Timestamp when the record was created
  updatedAt?: Date; // Timestamp when the record was last updated
}

const userSettingsSchema = new Schema<IUserSettings>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    defaultEmployerId: {
      type: Schema.Types.ObjectId,
      ref: 'Employer',
      default: null,
    },
    defaultRateId: {
      type: Schema.Types.ObjectId,
      ref: 'Rate',
      default: null,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Create an index for faster lookups by user ID
userSettingsSchema.index({ userId: 1 });

// Prevent duplicate model compilation when hot reloading in development
const UserSettings =
  models.UserSettings || mongoose.model<IUserSettings>('UserSettings', userSettingsSchema);

export default UserSettings;
