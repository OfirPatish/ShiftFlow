import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase, preloadModels } from '@/lib/api/databaseConnection';
import Employer from '@/schemas/Employer';
import { authOptions } from '@/lib/api/authConfig';

// GET /api/employers - Get all employers for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    // Preload all models to ensure they're properly registered
    await preloadModels();

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
    // Preload all models to ensure they're properly registered
    await preloadModels();

    // Check if an employer with the same name already exists for this user
    const escapedName = data.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex chars
    const existingEmployer = await Employer.findOne({
      userId: session.user.id,
      name: { $regex: new RegExp(`^${escapedName}$`, 'i') }, // Case-insensitive match
      isActive: true,
    });

    if (existingEmployer) {
      return NextResponse.json(
        { error: 'An employer with this name already exists' },
        { status: 400 }
      );
    }

    // Create a new employer using the create method instead of direct instantiation
    // This avoids potential issues with model registration in serverless environments
    const newEmployer = await Employer.create({
      userId: session.user.id,
      name: data.name,
      location: data.location || '',
      color: data.color || '#3B82F6', // Default blue color
    });

    return NextResponse.json(newEmployer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create employer' }, { status: 500 });
  }
}
