import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/databaseConnection';
import Shift from '@/models/Shift';
import { authOptions } from '@/lib/authConfig';
import mongoose from 'mongoose';
import { calculateShiftEarnings } from '@/lib/shiftCalculator';
import Rate from '@/models/Rate';
import { errorResponse, withErrorHandling } from '@/lib/apiResponses';

// Helper function to get a shift by ID and verify ownership
async function getAuthorizedShift(req: NextRequest, params: { id: string }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { error: 'Unauthorized', status: 401 };
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return { error: 'Invalid shift ID', status: 400 };
    }

    await connectToDatabase();

    const shift = await Shift.findById(params.id);

    if (!shift) {
      return { error: 'Shift not found', status: 404 };
    }

    // Verify that the user owns the shift
    if (shift.userId.toString() !== session.user.id) {
      return { error: 'You do not have permission to access this shift', status: 403 };
    }

    return { shift, user: session.user };
  } catch (error) {
    console.error('Error in getAuthorizedShift:', error);
    return { error: 'Server error', status: 500 };
  }
}

// GET /api/shifts/[id] - Get a specific shift
export const GET = withErrorHandling(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const result = await getAuthorizedShift(req, params);

    if ('error' in result) {
      return errorResponse(result.error as string, result.status);
    }

    await result.shift.populate('employerId', 'name color');
    await result.shift.populate('rateId', 'baseRate currency');

    return NextResponse.json(result.shift);
  }
);

// PATCH /api/shifts/[id] - Update a specific shift
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await getAuthorizedShift(req, params);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const data = await req.json();
    const { shift } = result;

    // Update allowed fields
    if (data.employerId && mongoose.Types.ObjectId.isValid(data.employerId))
      shift.employerId = data.employerId;
    if (data.rateId && mongoose.Types.ObjectId.isValid(data.rateId)) shift.rateId = data.rateId;

    // Update dates if provided and valid
    if (data.startTime) {
      const startTime = new Date(data.startTime);
      if (!isNaN(startTime.getTime())) shift.startTime = startTime;
    }

    if (data.endTime) {
      const endTime = new Date(data.endTime);
      if (!isNaN(endTime.getTime())) shift.endTime = endTime;
    }

    // Validate that start time is before end time
    if (shift.startTime >= shift.endTime) {
      return NextResponse.json({ error: 'Start time must be before end time' }, { status: 400 });
    }

    if (data.breakDuration !== undefined) shift.breakDuration = data.breakDuration;
    if (data.notes !== undefined) shift.notes = data.notes;

    // Fetch the rate to get the base rate
    const rate = await Rate.findById(shift.rateId);
    if (!rate) {
      return NextResponse.json({ error: 'Invalid rate ID' }, { status: 400 });
    }

    // Recalculate shift earnings with fixed multipliers
    const earnings = calculateShiftEarnings(
      shift.startTime,
      shift.endTime,
      shift.breakDuration,
      rate.baseRate
    );

    // Update calculated fields
    shift.regularHours = earnings.regularHours;
    shift.overtimeHours1 = earnings.overtimeHours1;
    shift.overtimeHours2 = earnings.overtimeHours2;
    shift.totalHours = earnings.totalHours;
    shift.regularEarnings = earnings.regularEarnings;
    shift.overtimeEarnings1 = earnings.overtimeEarnings1;
    shift.overtimeEarnings2 = earnings.overtimeEarnings2;
    shift.totalEarnings = earnings.totalEarnings;

    // Save the updated shift
    await shift.save();

    // Populate references before returning
    await shift.populate('employerId', 'name color');
    await shift.populate('rateId', 'baseRate currency');

    return NextResponse.json(shift);
  } catch (error) {
    console.error('Error updating shift:', error);
    return NextResponse.json({ error: 'Failed to update shift' }, { status: 500 });
  }
}

// DELETE /api/shifts/[id] - Delete a specific shift
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await getAuthorizedShift(req, params);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    await result.shift.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shift:', error);
    return NextResponse.json({ error: 'Failed to delete shift' }, { status: 500 });
  }
}
