/**
 * Script to insert 30 test shifts into MongoDB
 * Run with: node scripts/insertTestShifts.js
 */

// Import mongoose
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// MongoDB connection string - use the same as in .env.local
const MONGODB_URI = 'mongodb://localhost:27017/shiftflow';

// Base template shift from the user (we'll randomize many of these values)
const shiftTemplate = {
  userId: '67ccba2d8bc699a5c49e03ce',
  employerId: '67d4153461c460f860149332',
  rateId: '67d4155961c460f860149350',
  breakDuration: 0,
  notes: '',
};

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

// Define a simplified Shift schema for this script
const shiftSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    rateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    breakDuration: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
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
    timestamps: true,
  }
);

// Create the Shift model
const Shift = mongoose.model('Shift', shiftSchema);

// Helper function to get a random number between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to set time for a date (day shift)
function setDayShiftTime(date, isStartTime) {
  // Set random hour between 6am and 11am for shift start
  // Or between 2pm and 6pm for shift end
  if (isStartTime) {
    date.setHours(getRandomInt(6, 11));
  } else {
    date.setHours(getRandomInt(14, 18)); // 2pm to 6pm
  }

  // Set random minutes (0, 15, 30, 45)
  date.setMinutes(getRandomInt(0, 3) * 15);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

// Helper function to set time for an overnight shift
function setNightShiftTime(date, isStartTime) {
  // Set random hour between 18 (6pm) and 23 (11pm) for shift start
  // Or between 5am and 9am for shift end (on the next day)
  if (isStartTime) {
    date.setHours(getRandomInt(18, 23));
  } else {
    date.setHours(getRandomInt(5, 9));
    // Note: We'll add a day to the end date later in the code
  }

  // Set random minutes (0, 15, 30, 45)
  date.setMinutes(getRandomInt(0, 3) * 15);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

// Get a date in March with the specified day
function getMarchDate(day) {
  const date = new Date();
  // Set month to March (2 is for March since months are 0-indexed)
  date.setMonth(2);
  // Set the day to the specified value
  date.setDate(day);
  return date;
}

// Helper function to calculate hours and earnings
function calculateHoursAndEarnings(startTime, endTime) {
  // Base hourly rate (from the original template's calculations)
  const baseRate = 54.5; // $54.50/hour regular rate
  const overtimeRate1 = 1.25 * baseRate; // 125% of base rate
  const overtimeRate2 = 1.5 * baseRate; // 150% of base rate

  // Calculate total hours (as decimal)
  const diffMs = endTime - startTime;
  const diffHours = diffMs / (1000 * 60 * 60);
  const totalHours = parseFloat(diffHours.toFixed(2));

  // Calculate regular, overtime1, and overtime2 hours
  let regularHours = Math.min(8, totalHours);
  let overtimeHours1 = 0;
  let overtimeHours2 = 0;

  if (totalHours > 8) {
    overtimeHours1 = Math.min(2, totalHours - 8);

    if (totalHours > 10) {
      overtimeHours2 = totalHours - 10;
    }
  }

  // Round to 2 decimal places
  regularHours = parseFloat(regularHours.toFixed(2));
  overtimeHours1 = parseFloat(overtimeHours1.toFixed(2));
  overtimeHours2 = parseFloat(overtimeHours2.toFixed(2));

  // Calculate earnings
  const regularEarnings = parseFloat((regularHours * baseRate).toFixed(2));
  const overtimeEarnings1 = parseFloat((overtimeHours1 * overtimeRate1).toFixed(2));
  const overtimeEarnings2 = parseFloat((overtimeHours2 * overtimeRate2).toFixed(2));
  const totalEarnings = parseFloat(
    (regularEarnings + overtimeEarnings1 + overtimeEarnings2).toFixed(2)
  );

  return {
    regularHours,
    overtimeHours1,
    overtimeHours2,
    totalHours,
    regularEarnings,
    overtimeEarnings1,
    overtimeEarnings2,
    totalEarnings,
  };
}

// Function to insert test shifts
async function insertTestShifts(count) {
  const shifts = [];

  // Create one shift per day, starting from March 1 and continuing sequentially
  for (let i = 0; i < count; i++) {
    // Day is just i+1 to ensure sequential days (March 1, March 2, etc.)
    const day = i + 1;

    // Ensure we don't go beyond March 31
    if (day > 31) break;

    // Randomly determine if this will be a day shift or night shift
    const isNightShift = Math.random() > 0.6; // 40% chance of night shift

    if (!isNightShift) {
      // Regular day shift
      const date = getMarchDate(day);

      // Generate start time (morning hours)
      const startDate = new Date(date);
      setDayShiftTime(startDate, true); // true = start time

      // Generate end time (afternoon/evening hours)
      const endDate = new Date(date);
      setDayShiftTime(endDate, false); // false = end time

      // Ensure end time is after start time
      if (endDate <= startDate) {
        // If we accidentally got an end time before start time, set it to 7 hours after start
        endDate.setHours(startDate.getHours() + 7);
      }

      // Calculate hours and earnings
      const calculations = calculateHoursAndEarnings(startDate, endDate);

      // Create shift object
      const shift = {
        ...shiftTemplate,
        userId: new ObjectId(shiftTemplate.userId),
        employerId: new ObjectId(shiftTemplate.employerId),
        rateId: new ObjectId(shiftTemplate.rateId),
        startTime: startDate,
        endTime: endDate,
        notes: `March ${day} - Day shift`,
        ...calculations,
      };

      shifts.push(shift);
    } else {
      // Overnight shift (spanning to next day)
      const date = getMarchDate(day);

      // Generate start time (evening hours)
      const startDate = new Date(date);
      setNightShiftTime(startDate, true); // true = start time

      // Generate end time (morning hours, next day)
      const endDate = new Date(date);
      setNightShiftTime(endDate, false); // false = end time

      // Add a day to end date since it's an overnight shift
      endDate.setDate(endDate.getDate() + 1);

      // Calculate hours and earnings
      const calculations = calculateHoursAndEarnings(startDate, endDate);

      // Create shift object
      const shift = {
        ...shiftTemplate,
        userId: new ObjectId(shiftTemplate.userId),
        employerId: new ObjectId(shiftTemplate.employerId),
        rateId: new ObjectId(shiftTemplate.rateId),
        startTime: startDate,
        endTime: endDate,
        notes: `March ${day} - Night shift (ends on March ${day + 1})`,
        ...calculations,
      };

      shifts.push(shift);
    }
  }

  try {
    // Insert all shifts
    const result = await Shift.insertMany(shifts);
    console.log(`Successfully inserted ${result.length} test shifts for sequential days in March`);

    // Log a sample of the shifts we created
    console.log('\nSample of shifts created:');
    for (let i = 0; i < Math.min(5, result.length); i++) {
      const shift = result[i];
      console.log(
        `Shift ${
          i + 1
        }: ${shift.startTime.toLocaleString()} to ${shift.endTime.toLocaleString()} (${
          shift.totalHours
        } hours, $${shift.totalEarnings})`
      );
    }

    return result;
  } catch (error) {
    console.error('Error inserting shifts:', error);
    return null;
  }
}

// Main function to run the script
async function main() {
  const connected = await connect();
  if (!connected) {
    console.error('Failed to connect to MongoDB. Exiting...');
    process.exit(1);
  }

  try {
    // Insert 30 test shifts (one per day from March 1 to March 30)
    await insertTestShifts(30);
  } catch (error) {
    console.error('Error in test shift insertion:', error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
main();
