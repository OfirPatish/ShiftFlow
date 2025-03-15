import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase, preloadModels } from '@/lib/api/databaseConnection';
import Shift from '@/schemas/Shift';
import { authOptions } from '@/lib/api/authConfig';
import mongoose from 'mongoose';
import { calculateShiftEarnings } from '@/lib/utils/shiftCalculator';
import Rate from '@/schemas/Rate';
import { errorResponse, withErrorHandling } from '@/lib/api/apiResponses';

// GET /api/shifts - Get all shifts for the current user
export const GET = withErrorHandling(async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return errorResponse('Unauthorized', 401, null, true);
  }

  try {
    await connectToDatabase();
    // Preload all models to ensure they're properly registered
    await preloadModels();
  } catch (dbError) {
    return errorResponse('Database connection failed. Please try again later.', 500, null, true);
  }

  // Parse query parameters for filtering
  const url = new URL(req.url);
  const startDate = url.searchParams.get('startDate');
  const endDate = url.searchParams.get('endDate');
  const employerId = url.searchParams.get('employerId');

  // Build the query
  const query: any = {
    userId: session.user.id,
  };

  // Add filters if provided
  if (startDate) {
    try {
      const parsedDate = new Date(startDate);
      if (!isNaN(parsedDate.getTime())) {
        query.startTime = { ...query.startTime, $gte: parsedDate };
      }
    } catch (dateError) {
      // Silently continue with invalid date
    }
  }

  if (endDate) {
    try {
      const parsedDate = new Date(endDate);
      if (!isNaN(parsedDate.getTime())) {
        query.endTime = { ...query.endTime, $lte: parsedDate };
      }
    } catch (dateError) {
      // Silently continue with invalid date
    }
  }

  if (employerId && mongoose.Types.ObjectId.isValid(employerId)) {
    query.employerId = employerId;
  }

  // Get shifts with populated references
  const shifts = await Shift.find(query)
    .sort({ startTime: -1 })
    .populate('employerId', 'name color')
    .populate('rateId', 'baseRate currency');

  return NextResponse.json(shifts);
});

// POST /api/shifts - Create a new shift
export const POST = withErrorHandling(async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return errorResponse('Unauthorized', 401, null, true);
  }

  const data = await req.json();

  // Form validation errors will be handled client-side, so we don't need toasts for these
  // We only include the validation as a safety measure
  if (!data.employerId || !data.rateId || !data.startTime || !data.endTime) {
    return errorResponse(
      'Missing required fields: employerId, rateId, startTime, and endTime are required',
      400
    );
  }

  // Validate ObjectId fields
  if (
    !mongoose.Types.ObjectId.isValid(data.employerId) ||
    !mongoose.Types.ObjectId.isValid(data.rateId)
  ) {
    return errorResponse('Invalid employerId or rateId', 400);
  }

  // Validate dates
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return errorResponse('Invalid date format for startTime or endTime', 400);
  }

  // Ensure that end time is after start time
  if (endTime <= startTime) {
    return errorResponse('End time must be after start time.', 400);
  }

  // Check if the shift is very short (less than 15 minutes)
  const diffMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  if (diffMinutes < 15) {
    return errorResponse('Shift duration must be at least 15 minutes', 400);
  }

  try {
    await connectToDatabase();
    // Preload all models to ensure they're properly registered
    await preloadModels();
  } catch (dbError) {
    return errorResponse('Database connection failed. Please try again later.', 500, null, true);
  }

  // Get the start date (without time) to check for shifts on the same day
  const startDate = new Date(startTime);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setHours(23, 59, 59, 999);

  // Check for any shifts on the same day - if editing, exclude the current shift
  const existingShiftQuery: any = {
    userId: session.user.id,
    startTime: { $gte: startDate, $lt: endDate },
  };

  // If we're updating (PATCH) and have a shift ID, exclude that shift from the check
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const isUpdating = pathSegments.length > 2;
  const shiftId = isUpdating ? pathSegments[pathSegments.length - 1] : null;

  if (isUpdating && shiftId) {
    existingShiftQuery._id = { $ne: shiftId };
  }

  const existingShift = await Shift.findOne(existingShiftQuery);

  if (existingShift) {
    return errorResponse(
      'You already have a shift on this day. Only one shift per day is allowed.',
      400
    );
  }

  // Fetch the rate to get the base rate details
  const rate = await Rate.findById(data.rateId);
  if (!rate) {
    return errorResponse('Invalid rate ID', 400);
  }

  // Calculate shift earnings with fixed multipliers
  const earnings = calculateShiftEarnings(
    startTime,
    endTime,
    data.breakDuration || 0,
    rate.baseRate
  );

  // Create new shift with basic fields and calculated values
  const newShift = await Shift.create({
    userId: session.user.id,
    employerId: data.employerId,
    rateId: data.rateId,
    startTime,
    endTime,
    breakDuration: data.breakDuration || 0,
    notes: data.notes || '',
    regularHours: earnings.regularHours,
    overtimeHours1: earnings.overtimeHours1,
    overtimeHours2: earnings.overtimeHours2,
    totalHours: earnings.totalHours,
    regularEarnings: earnings.regularEarnings,
    overtimeEarnings1: earnings.overtimeEarnings1,
    overtimeEarnings2: earnings.overtimeEarnings2,
    totalEarnings: earnings.totalEarnings,
  });

  // Populate references before returning
  await newShift.populate('employerId', 'name color');
  await newShift.populate('rateId', 'baseRate currency');

  return NextResponse.json(newShift, { status: 201 });
});
