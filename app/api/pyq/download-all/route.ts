import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { PassThrough, Readable } from 'stream';
import { getPYQRootDir } from '@/lib/pyq-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const semDir = searchParams.get('semester');
  const subFolder = searchParams.get('subject');

  if (!semDir || !subFolder) {
    return NextResponse.json(
      { error: 'Both semester and subject parameters are required' },
      { status: 400 }
    );
  }

  const rootDir = getPYQRootDir();
  // Sanitize path components
  const safeSem = path.basename(semDir);
  const safeSub = path.basename(subFolder);
  const targetDir = path.join(rootDir, safeSem, safeSub);

  if (!targetDir.startsWith(rootDir) || !fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
    return NextResponse.json({ error: 'Subject folder not found' }, { status: 404 });
  }

  try {
    const files = fs.readdirSync(targetDir)
      .filter(f => f.toLowerCase().endsWith('.pdf'))
      .map(f => ({
        fullPath: path.join(targetDir, f),
        name: f,
      }));

    if (files.length === 0) {
      return NextResponse.json({ error: 'No PDF papers found in this subject folder' }, { status: 404 });
    }

    const archive = archiver('zip', {
      zlib: { level: 6 },
    });

    const passThrough = new PassThrough();
    archive.pipe(passThrough);

    for (const f of files) {
      archive.file(f.fullPath, { name: f.name });
    }

    // Finalize the archive asynchronously
    archive.finalize().catch((err) => {
      console.error('Archiver finalize error:', err);
    });

    const webStream = Readable.toWeb(passThrough) as ReadableStream<Uint8Array>;
    const zipFileName = `${safeSem}_${safeSub}_All_PYQs.zip`.replace(/[^a-zA-Z0-9._-]/g, '_');

    return new Response(webStream, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipFileName}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error generating subject zip:', error);
    return NextResponse.json({ error: 'Failed to generate zip file' }, { status: 500 });
  }
}
