import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/databaseConnection';
import { logError } from '@/lib/errorHandlers';
import { errorResponse, withErrorHandling } from '@/lib/apiResponses';

// User registration schema validation
const userSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Implement the handler logic separately so we can wrap it with error handling
async function registerHandler(req: Request) {
  let body: any;

  try {
    // Parse request body - wrap this in its own try/catch to handle JSON parsing errors
    body = await req.json();
  } catch (jsonError) {
    // Handle JSON parsing errors separately
    logError('API:Register', jsonError);
    return errorResponse('Invalid request body format', 400);
  }

  // Validate input data
  const validationResult = userSchema.safeParse(body);
  if (!validationResult.success) {
    return NextResponse.json(
      { message: 'Validation failed', errors: validationResult.error.errors },
      { status: 400 }
    );
  }

  const { name, email, password } = validationResult.data;

  // Connect to the database
  await connectToDatabase();

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists with this email' }, { status: 409 });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  // Return success response (excluding password)
  return NextResponse.json(
    {
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    },
    { status: 201 }
  );
}

// Export the wrapped handler as the POST method
export const POST = withErrorHandling(registerHandler);
