import { NextResponse } from 'next/server';
import { getCRMAnalytics } from '@/lib/crm-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const analytics = getCRMAnalytics();
    return NextResponse.json(analytics, { status: 200 });
  } catch (error) {
    console.error('Error fetching CRM analytics:', error);
    return NextResponse.json({ error: 'Failed to retrieve analytics' }, { status: 500 });
  }
}
