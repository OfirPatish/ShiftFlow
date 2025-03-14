/**
 * Script to count and list all shifts in the database
 * Run with: node scripts/countShifts.js
 */

// Import mongoose
const mongoose = require('mongoose');

// MongoDB connection string
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

// Define a simplified Shift schema just for querying
const shiftSchema = new mongoose.Schema({}, { strict: false });
const Shift = mongoose.model('Shift', shiftSchema);

// Function to count and list shifts
async function countAndListShifts() {
  try {
    // Count all shifts
    const count = await Shift.countDocuments();
    console.log(`Total shifts in database: ${count}`);

    // Find all shifts sorted by start time
    const shifts = await Shift.find().sort({ startTime: 1 });

    // List all shifts
    console.log('\nAll shifts:');
    shifts.forEach((shift, index) => {
      console.log(
        `Shift ${
          index + 1
        }: ${shift.startTime.toLocaleString()} to ${shift.endTime.toLocaleString()} (${
          shift.totalHours
        } hours, $${shift.totalEarnings})`
      );
    });

    return { count, shifts };
  } catch (error) {
    console.error('Error querying shifts:', error);
    return { count: 0, shifts: [] };
  }
}

// Main function
async function main() {
  const connected = await connect();
  if (!connected) {
    console.error('Failed to connect to database. Exiting...');
    process.exit(1);
  }

  try {
    await countAndListShifts();
  } catch (error) {
    console.error('Error during shift counting:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
main();
