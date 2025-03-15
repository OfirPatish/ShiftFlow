import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/api/databaseConnection';
import Employer from '@/schemas/Employer';
import Shift from '@/schemas/Shift';
import Rate from '@/schemas/Rate';
import mongoose from 'mongoose';
import { authOptions } from '@/lib/api/authConfig';
import { getServerSession } from 'next-auth';
import { errorResponse } from '@/lib/api/apiResponses';

// Helper for authentication and employer retrieval
async function getAuthorizedEmployer(req: NextRequest, params: { id: string }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: 'Unauthorized', status: 401 };
  }

  // Validate employer ID format
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return { error: 'Invalid employer ID', status: 400 };
  }

  await connectToDatabase();

  // Find employer by ID and ensure it belongs to the current user
  const employer = await Employer.findOne({
    _id: params.id,
    userId: session.user.id,
  });

  if (!employer) {
    return { error: 'Employer not found', status: 404 };
  }

  return { session, employer };
}

// GET /api/employers/[id] - Get a specific employer
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await getAuthorizedEmployer(req, params);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.employer);
  } catch (error) {
    return errorResponse('Failed to fetch employer', 500, error);
  }
}

// PATCH /api/employers/[id] - Update a specific employer
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await getAuthorizedEmployer(req, params);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const data = await req.json();
    const { employer } = result;

    // Check for duplicate name if name is being updated
    if (data.name && data.name !== employer.name) {
      const escapedName = data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex chars
      const duplicateEmployer = await Employer.findOne({
        userId: employer.userId,
        name: { $regex: new RegExp(`^${escapedName}$`, 'i') }, // Case-insensitive match
        isActive: true,
        _id: { $ne: employer._id }, // Exclude current employer
      });

      if (duplicateEmployer) {
        return NextResponse.json(
          { error: 'An employer with this name already exists' },
          { status: 400 }
        );
      }
    }

    // Update allowed fields
    if (data.name) employer.name = data.name;
    if (data.location !== undefined) employer.location = data.location;
    if (data.color) employer.color = data.color;

    // Save the updated employer
    await employer.save();

    return NextResponse.json(employer);
  } catch (error) {
    return errorResponse('Failed to update employer', 500, error);
  }
}

// DELETE /api/employers/[id] - Delete a specific employer
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await getAuthorizedEmployer(req, params);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const { employer } = result;

    // Check if employer has any shifts
    const shiftsCount = await Shift.countDocuments({
      userId: employer.userId,
      employerId: employer._id,
    });

    if (shiftsCount > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete employer with active shifts. Please delete the shifts first.',
        },
        { status: 400 }
      );
    }

    // Check if employer has any rates
    const ratesCount = await Rate.countDocuments({
      userId: employer.userId,
      employerId: employer._id,
    });

    if (ratesCount > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete employer with active pay rates. Please delete the rates first.',
        },
        { status: 400 }
      );
    }

    // Perform hard delete
    await Employer.deleteOne({ _id: employer._id });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse('Failed to delete employer', 500, error);
  }
}
