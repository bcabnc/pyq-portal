import { NextRequest, NextResponse } from 'next/server';
import { getAllCRMRequests, createCRMRequest, CRMRequest } from '@/lib/crm-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search')?.toLowerCase();

    let requests = getAllCRMRequests();

    if (status && status !== 'ALL') {
      requests = requests.filter((r) => r.status === status);
    }

    if (priority && priority !== 'ALL') {
      requests = requests.filter((r) => r.priority === priority);
    }

    if (search) {
      requests = requests.filter(
        (r) =>
          r.studentName.toLowerCase().includes(search) ||
          r.studentEmail.toLowerCase().includes(search) ||
          r.subject.toLowerCase().includes(search) ||
          r.id.toLowerCase().includes(search) ||
          (r.studentRoll && r.studentRoll.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error('Error fetching CRM requests:', error);
    return NextResponse.json({ error: 'Failed to retrieve requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.studentName || !body.studentEmail || !body.semester || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: studentName, studentEmail, semester, subject, and message are mandatory.' },
        { status: 400 }
      );
    }

    const newRequest = createCRMRequest({
      studentName: body.studentName,
      studentEmail: body.studentEmail,
      studentPhone: body.studentPhone,
      studentRoll: body.studentRoll,
      semester: body.semester,
      subject: body.subject,
      examYear: body.examYear || 'Any Year',
      requestType: (body.requestType as CRMRequest['requestType']) || 'MISSING_PAPER',
      message: body.message,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry/request has been registered with the departmental examination desk.',
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating CRM request:', error);
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 });
  }
}
