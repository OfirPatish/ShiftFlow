/**
 * Script to clear all shifts from the database
 * Run with: node scripts/clearShifts.js
 */

// Import mongoose
const mongoose = require('mongoose');

// MongoDB connection string - use the same as in .env.local
const MONGODB_URI = 'mongodb://localhost:27017/shiftflow';

// Connect to MongoDB
async function connect() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

// Define a simplified Shift schema just for deletion
const shiftSchema = new mongoose.Schema({}, { strict: false });
const Shift = mongoose.model('Shift', shiftSchema);

// Main function
async function main() {
  const connected = await connect();
  if (!connected) {
    console.error('Failed to connect to database. Exiting...');
    process.exit(1);
  }

  try {
    // Count shifts before deletion
    const beforeCount = await Shift.countDocuments();
    console.log(`Found ${beforeCount} shifts in the database`);

    // Delete all shifts
    const result = await Shift.deleteMany({});
    console.log(`Deleted ${result.deletedCount} shifts from the database`);
  } catch (error) {
    console.error('Error clearing shifts:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
main();
