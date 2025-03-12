import mongoose, { Schema, models } from 'mongoose';

/**
 * Interface representing a user account in the system
 * Contains authentication and basic profile information
 */
export interface IUser {
  name: string; // User's full name
  email: string; // User's email address (used for login)
  password: string; // Hashed password
  image?: string; // Profile image URL
  role: 'user' | 'admin'; // User role for permission control
  createdAt: Date; // Timestamp when the user account was created
  updatedAt: Date; // Timestamp when the user account was last updated
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password should be at least 6 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Prevent duplicate model compilation when hot reloading in development
const User = models.User || mongoose.model<IUser>('User', userSchema);

export default User;
