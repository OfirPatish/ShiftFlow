import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/databaseConnection';
import Rate from '@/models/Rate';
import { authOptions } from '@/lib/authConfig';
import mongoose from 'mongoose';

// GET /api/rates - Get all rates for the current user, optionally filtered by employer
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
  } catch (error) {
    console.error('Error fetching rates:', error);
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
  }
}

// POST /api/rates - Create a new rate
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Validate required fields
    if (!data.employerId || !data.name || data.baseRate === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: employerId, name, and baseRate are required' },
        { status: 400 }
      );
    }

    // Validate employerId
    if (!mongoose.Types.ObjectId.isValid(data.employerId)) {
      return NextResponse.json({ error: 'Invalid employerId' }, { status: 400 });
    }

    // Validate baseRate
    if (typeof data.baseRate !== 'number' || data.baseRate < 0) {
      return NextResponse.json(
        { error: 'baseRate must be a non-negative number' },
        { status: 400 }
      );
    }

    await connectToDatabase();

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
  } catch (error) {
    console.error('Error creating rate:', error);
    return NextResponse.json({ error: 'Failed to create rate' }, { status: 500 });
  }
}
