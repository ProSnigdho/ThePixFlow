import { NextRequest } from 'next/server';
import { getDriveInstance } from '@/lib/googleDrive';

/**
 * PRODUCTION-READY: Async Stream Handler for Next.js 15/16
 * In Next.js 15+, 'params' is a Promise and must be awaited.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
): Promise<Response> {
  try {
    const drive = await getDriveInstance();
    const { fileId } = await params;

    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    // Get file metadata for content-type
    const metadata = await drive.files.get({
      fileId,
      fields: 'mimeType, size',
    });

    const stream = response.data as any;

    return new Response(stream, {
      headers: {
        'Content-Type': metadata.data.mimeType || 'video/mp4',
        'Content-Length': metadata.data.size || '',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Video stream error:', error);
    return new Response('Error streaming video', { status: 500 });
  }
}
