import { NextRequest, NextResponse } from 'next/server';
import { updateCRMRequest, deleteCRMRequest, getCRMRequestById } from '@/lib/crm-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = getCRMRequestById(id);

  if (!item) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  return NextResponse.json({ request: item }, { status: 200 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = updateCRMRequest(id, {
      status: body.status,
      priority: body.priority,
      adminNotes: body.adminNotes,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, request: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating CRM request:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteCRMRequest(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Request deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting CRM request:', error);
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
  }
}
