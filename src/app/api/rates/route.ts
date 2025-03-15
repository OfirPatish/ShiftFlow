import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/api/databaseConnection';
import Rate from '@/schemas/Rate';
import { authOptions } from '@/lib/api/authConfig';
import mongoose from 'mongoose';
import { withErrorHandling, errorResponse } from '@/lib/api/apiResponses';

// GET /api/rates - Get all rates for the current user, optionally filtered by employer
export const GET = withErrorHandling(async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return errorResponse('Unauthorized', 401);
  }

  await connectToDatabase();

  // Parse query parameters for filtering
  const url = new URL(req.url);
  const employerId = url.searchParams.get('employerId');

  // Build the query
  const query: any = {
    userId: session.user.id,
  };

  // Add employer filter if provided
  if (employerId && mongoose.Types.ObjectId.isValid(employerId)) {
    query.employerId = employerId;
  }

  // Get rates with optional filter, sorted by default status (default first) and then name
  const rates = await Rate.find(query).sort({ isDefault: -1, name: 1 });

  return NextResponse.json(rates);
});

// POST /api/rates - Create a new rate
export const POST = withErrorHandling(async (req: NextRequest) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return errorResponse('Unauthorized', 401);
  }

  let data;
  try {
    data = await req.json();
  } catch (error) {
    return errorResponse('Invalid JSON body', 400);
  }

  // Validate required fields
  if (!data.employerId || !data.name || data.baseRate === undefined) {
    return errorResponse(
      'Missing required fields: employerId, name, and baseRate are required',
      400
    );
  }

  // Validate employerId
  if (!mongoose.Types.ObjectId.isValid(data.employerId)) {
    return errorResponse('Invalid employerId', 400);
  }

  // Validate baseRate
  if (typeof data.baseRate !== 'number' || data.baseRate < 0) {
    return errorResponse('baseRate must be a non-negative number', 400);
  }

  await connectToDatabase();

  // Check if a rate with the same name already exists for this user and employer
  const escapedName = data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex chars
  const existingRate = await Rate.findOne({
    userId: session.user.id,
    employerId: data.employerId,
    name: { $regex: new RegExp(`^${escapedName}$`, 'i') }, // Case-insensitive match
  });

  if (existingRate) {
    return errorResponse('A rate with this name already exists for this employer', 400);
  }

  // Check if this is the first rate for this employer, and if so, make it default
  const existingRates = await Rate.countDocuments({
    userId: session.user.id,
    employerId: data.employerId,
  });

  const isDefault = data.isDefault === true || existingRates === 0;

  // If this rate is set as default, unset any other default rates for this employer
  if (isDefault) {
    await Rate.updateMany(
      {
        userId: session.user.id,
        employerId: data.employerId,
        isDefault: true,
      },
      { $set: { isDefault: false } }
    );
  }

  // Create the new rate using Rate.create instead of new Rate()
  const newRate = await Rate.create({
    userId: session.user.id,
    employerId: data.employerId,
    name: data.name,
    baseRate: data.baseRate,
    currency: data.currency || 'ILS',
    effectiveDate: data.effectiveDate ? new Date(data.effectiveDate) : new Date(),
    isDefault,
  });

  return NextResponse.json(newRate, { status: 201 });
});
