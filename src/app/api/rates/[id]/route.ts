import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/databaseConnection';
import Rate from '@/models/Rate';
import Shift from '@/models/Shift';
import { authOptions } from '@/lib/authConfig';
import mongoose from 'mongoose';
import { withErrorHandling, errorResponse } from '@/lib/apiResponses';

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
export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const result = await getAuthorizedRate(req, params);

    if ('error' in result) {
      return errorResponse(result.error as string, result.status);
    }

    return NextResponse.json(result.rate);
  }
);

// PATCH /api/rates/[id] - Update a specific rate
export const PATCH = withErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const result = await getAuthorizedRate(req, params);

    if ('error' in result) {
      return errorResponse(result.error as string, result.status);
    }

    let data;
    try {
      data = await req.json();
    } catch (error) {
      return errorResponse('Invalid JSON body', 400);
    }

    const { rate } = result;

    // Check for duplicate name if name is being updated
    if (data.name && data.name !== rate.name) {
      const escapedName = data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex chars
      const duplicateRate = await Rate.findOne({
        userId: result.session.user.id,
        employerId: rate.employerId,
        name: { $regex: new RegExp(`^${escapedName}$`, 'i') }, // Case-insensitive match
        _id: { $ne: rate._id }, // Exclude current rate
      });

      if (duplicateRate) {
        return errorResponse('A rate with this name already exists for this employer', 400);
      }
    }

    // Update allowed fields
    if (data.name) rate.name = data.name;

    if (data.baseRate !== undefined) {
      if (typeof data.baseRate !== 'number' || data.baseRate < 0) {
        return errorResponse('baseRate must be a non-negative number', 400);
      }
      rate.baseRate = data.baseRate;
    }

    if (data.currency) {
      if (!['ILS', 'USD', 'EUR'].includes(data.currency)) {
        return errorResponse('currency must be one of: ILS, USD, EUR', 400);
      }
      rate.currency = data.currency;
    }

    if (data.effectiveDate) {
      const date = new Date(data.effectiveDate);
      if (isNaN(date.getTime())) {
        return errorResponse('Invalid effectiveDate', 400);
      }
      rate.effectiveDate = date;
    }

    // Handle isDefault status changes
    if (data.isDefault !== undefined) {
      // Can't unset the only default rate
      if (data.isDefault === false && rate.isDefault) {
        // Check if this is the only default rate for this employer
        const defaultRatesCount = await Rate.countDocuments({
          userId: result.session.user.id,
          employerId: rate.employerId,
          isDefault: true,
        });

        if (defaultRatesCount <= 1) {
          return errorResponse(
            'Cannot unset the only default rate. Set another rate as default first.',
            400
          );
        }
      }

      rate.isDefault = !!data.isDefault;

      // If setting to default, unset all other default rates for this employer
      if (rate.isDefault) {
        await Rate.updateMany(
          {
            _id: { $ne: rate._id },
            userId: result.session.user.id,
            employerId: rate.employerId,
            isDefault: true,
          },
          { $set: { isDefault: false } }
        );
      }
    }

    // Save the updated rate
    await rate.save();

    return NextResponse.json(rate);
  }
);

// DELETE /api/rates/[id] - Delete a specific rate
export const DELETE = withErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const result = await getAuthorizedRate(req, params);

    if ('error' in result) {
      return errorResponse(result.error as string, result.status);
    }

    const { rate } = result;

    // Check if the rate is default
    if (rate.isDefault) {
      // Check if there are other rates we can make default
      const otherRates = await Rate.find({
        _id: { $ne: rate._id },
        userId: result.session.user.id,
        employerId: rate.employerId,
      }).sort({ createdAt: -1 });

      if (otherRates.length > 0) {
        // Make the most recently created rate the new default
        const newDefault = otherRates[0];
        newDefault.isDefault = true;
        await newDefault.save();
      } else {
        // If this is the only rate, allow deletion (since there will be no rates left)
        // But warn clients that they should create new rates
      }
    }

    // Check if the rate is used in any shifts
    const shiftsCount = await Shift.countDocuments({ rateId: rate._id });
    if (shiftsCount > 0) {
      return errorResponse(
        `Cannot delete rate because it is used in ${shiftsCount} shifts. 
        Please change the rate on those shifts before deleting.`,
        400
      );
    }

    // Delete the rate
    await Rate.deleteOne({ _id: rate._id });

    return NextResponse.json({ success: true, message: 'Rate deleted successfully' });
  }
);
