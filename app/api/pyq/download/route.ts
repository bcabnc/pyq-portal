import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { findPaperByPath } from '@/lib/pyq-service';
import { recordDownload } from '@/lib/crm-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const relPath = searchParams.get('path');

  if (!relPath) {
    return NextResponse.json({ error: 'Missing path query parameter' }, { status: 400 });
  }

  const paper = findPaperByPath(relPath);
  if (!paper) {
    return NextResponse.json({ error: 'Paper not found or unauthorized path' }, { status: 404 });
  }

  // Record download event in CRM analytics
  recordDownload(relPath, path.dirname(relPath));

  try {
    const stat = fs.statSync(paper.fullPath);
    const nodeStream = fs.createReadStream(paper.fullPath);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

    // Clean filename for download: remove characters that might cause issues
    const safeDownloadName = paper.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

    return new Response(webStream, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': stat.size.toString(),
        'Content-Disposition': `attachment; filename="${safeDownloadName}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error streaming PDF for download:', error);
    return NextResponse.json({ error: 'Internal server error reading PDF' }, { status: 500 });
  }
}
