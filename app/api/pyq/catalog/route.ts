import { NextResponse } from 'next/server';
import { getCatalog } from '@/lib/pyq-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const catalog = getCatalog();
    return NextResponse.json(catalog, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching PYQ catalog:', error);
    return NextResponse.json(
      { error: 'Failed to read PYQ directory' },
      { status: 500 }
    );
  }
}
