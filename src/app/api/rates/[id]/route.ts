import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/databaseConnection';
import Rate from '@/models/Rate';
import Shift from '@/models/Shift';
import { authOptions } from '@/lib/authConfig';
import mongoose from 'mongoose';

// Helper for authentication and rate retrieval
async function getAuthorizedRate(req: NextRequest, params: { id: string }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: 'Unauthorized', status: 401 };
  }

  // Validate rate ID format
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return { error: 'Invalid rate ID', status: 400 };
  }

  await connectToDatabase();

  // Find rate by ID and ensure it belongs to the current user
  const rate = await Rate.findOne({
    _id: params.id,
    userId: session.user.id,
  });

  if (!rate) {
    return { error: 'Rate not found', status: 404 };
  }

  return { session, rate };
}

// GET /api/rates/[id] - Get a specific rate
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await getAuthorizedRate(req, params);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.rate);
  } catch (error) {
    console.error('Error fetching rate:', error);
    return NextResponse.json({ error: 'Failed to fetch rate' }, { status: 500 });
  }
}

// PATCH /api/rates/[id] - Update a specific rate
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await getAuthorizedRate(req, params);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const data = await req.json();
    const { rate } = result;

    // Update allowed fields
    if (data.name) rate.name = data.name;

    if (data.baseRate !== undefined) {
      if (typeof data.baseRate !== 'number' || data.baseRate < 0) {
        return NextResponse.json(
          { error: 'baseRate must be a non-negative number' },
          { status: 400 }
        );
      }
      rate.baseRate = data.baseRate;
    }

    if (data.currency) {
      if (!['ILS', 'USD', 'EUR'].includes(data.currency)) {
        return NextResponse.json(
          { error: 'currency must be one of: ILS, USD, EUR' },
          { status: 400 }
        );
      }
      rate.currency = data.currency;
    }

    if (data.effectiveDate) {
      const date = new Date(data.effectiveDate);
      if (isNaN(date.getTime())) {
        return NextResponse.json({ error: 'Invalid effectiveDate' }, { status: 400 });
      }
      rate.effectiveDate = date;
    }

    if (data.isDefault !== undefined) {
      // If setting as default, unset any other defaults for this employer
      if (data.isDefault === true) {
        await Rate.updateMany(
          {
            userId: rate.userId,
            employerId: rate.employerId,
            _id: { $ne: rate._id },
            isDefault: true,
          },
          { $set: { isDefault: false } }
        );
      }
      // If trying to unset default status, ensure it's not the only default rate
      else if (data.isDefault === false && rate.isDefault === true) {
        // Count how many default rates exist for this employer
        const defaultRatesCount = await Rate.countDocuments({
          userId: rate.userId,
          employerId: rate.employerId,
          isDefault: true,
        });

        // If this is the only default rate, prevent unsetting
        if (defaultRatesCount <= 1) {
          return NextResponse.json(
            { error: 'Cannot unset the only default rate. Set another rate as default first.' },
            { status: 400 }
          );
        }
      }
      rate.isDefault = data.isDefault;
    }

    await rate.save();

    return NextResponse.json(rate);
  } catch (error) {
    console.error('Error updating rate:', error);
    return NextResponse.json({ error: 'Failed to update rate' }, { status: 500 });
  }
}

// DELETE /api/rates/[id] - Delete a specific rate
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await getAuthorizedRate(req, params);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const { rate } = result;

    // Check if this rate is used in any shifts
    const shiftsWithRate = await Shift.countDocuments({
      userId: result.session.user.id,
      rateId: rate._id,
    });

    if (shiftsWithRate > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete rate used in shifts',
        },
        { status: 400 }
      );
    }

    // Check if this is a default rate and if there are other rates for this employer
    if (rate.isDefault) {
      const otherRates = await Rate.find({
        userId: result.session.user.id,
        employerId: rate.employerId,
        _id: { $ne: rate._id },
      });

      if (otherRates.length > 0) {
        // Set another rate as default
        const newDefault = otherRates[0];
        newDefault.isDefault = true;
        await newDefault.save();
      } else {
        // If this is the only rate for the employer, prevent deletion
        return NextResponse.json(
          {
            error: 'Cannot delete the only rate for an employer',
          },
          { status: 400 }
        );
      }
    }

    // Delete the rate
    await rate.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rate:', error);
    return NextResponse.json({ error: 'Failed to delete rate' }, { status: 500 });
  }
}
