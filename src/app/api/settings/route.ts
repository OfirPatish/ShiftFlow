import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authConfig';
import { connectToDatabase } from '@/lib/databaseConnection';
import UserSettings from '@/models/UserSettings';

// GET /api/settings - Get user settings
export async function GET() {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Find user settings or create default
    let settings = await UserSettings.findOne({ userId: session.user.id });

    if (!settings) {
      settings = new UserSettings({
        userId: session.user.id,
        defaultEmployerId: null,
        defaultRateId: null,
      });
      await settings.save();
    }

    return NextResponse.json(settings);
  } catch (error) {
    // Handle error without using console.error
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PATCH /api/settings - Update user settings
export async function PATCH(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    await connectToDatabase();

    // Find and update user settings or create new
    const settings = await UserSettings.findOneAndUpdate(
      { userId: session.user.id },
      { ...data },
      { new: true, upsert: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    // Handle error without using console.error
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
