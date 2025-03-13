import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/databaseConnection';
import Employer from '@/models/Employer';
import { authOptions } from '@/lib/authConfig';

// GET /api/employers - Get all employers for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Use the mongoose find method directly since the static method may not be typed correctly
    const employers = await Employer.find({
      userId: session.user.id,
      isActive: true,
    }).sort({ name: 1 });

    return NextResponse.json(employers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employers' }, { status: 500 });
  }
}

// POST /api/employers - Create a new employer
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: 'Employer name is required' }, { status: 400 });
    }

    await connectToDatabase();

    const newEmployer = new Employer({
      userId: session.user.id,
      name: data.name,
      location: data.location || '',
      color: data.color || '#3B82F6', // Default blue color
    });

    await newEmployer.save();

    return NextResponse.json(newEmployer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create employer' }, { status: 500 });
  }
}
