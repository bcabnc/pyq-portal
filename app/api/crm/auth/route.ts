import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Department administrator credentials
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'admin123';

export async function POST(request: NextRequest) {
  try {
    const { passcode } = await request.json();

    if (!passcode) {
      return NextResponse.json({ error: 'Passcode is required.' }, { status: 400 });
    }

    if (passcode === ADMIN_PASSCODE) {
      return NextResponse.json(
        {
          success: true,
          message: 'Authenticated as Department Examination Administrator.',
          token: 'auth-session-dept-admin-verified',
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: 'Invalid administrator passcode.' }, { status: 401 });
  } catch (error) {
    console.error('Error during CRM admin auth:', error);
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
