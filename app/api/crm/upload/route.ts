import { NextRequest, NextResponse } from 'next/server';
import { uploadQuestionPaper } from '@/lib/crm-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const semester = formData.get('semester') as string | null;
    const subject = formData.get('subject') as string | null;
    const file = formData.get('file') as File | null;

    if (!semester || !subject || !file) {
      return NextResponse.json(
        { error: 'Missing required parameters: semester, subject, and file are required.' },
        { status: 400 }
      );
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF documents (.pdf) can be uploaded to the question paper archive.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadQuestionPaper({
      semester,
      subjectFolderName: subject,
      fileName: file.name,
      buffer,
    });

    return NextResponse.json({
      success: true,
      message: `Paper "${file.name}" uploaded successfully to ${semester}/${subject}.`,
      filePath: result.filePath,
    });
  } catch (error) {
    console.error('Error handling paper upload:', error);
    return NextResponse.json({ error: 'Failed to upload paper to archive' }, { status: 500 });
  }
}
