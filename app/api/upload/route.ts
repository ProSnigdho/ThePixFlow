import { NextRequest, NextResponse } from 'next/server';
import { getDriveInstance } from '@/lib/googleDrive';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import Busboy from 'busboy';
import { Readable } from 'stream';

// Next.js App Router-এ এখন 'bodyParser: false' লাগে না, 
// কারণ আমরা সরাসরি 'req.body' (ReadableStream) ব্যবহার করছি।
// পুরানো 'export const config' ডিলিট করে দেওয়া হয়েছে।

/**
 * PRODUCTION-READY: Robust Upload Pipeline
 * Handles multipart/form-data, uploads to Drive, and syncs Firestore project status.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const drive = await getDriveInstance();
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
      throw new Error('SERVER_CONFIG_ERROR: GOOGLE_DRIVE_FOLDER_ID is undefined.');
    }

    const headers = Object.fromEntries(req.headers.entries());
    const busboy = Busboy({ headers });

    // TypeScript-এর জন্য Promise-এর টাইপ NextResponse হিসেবে ডিফাইন করা হয়েছে
    return new Promise<NextResponse>((resolve) => {
      let fileBuffer: Buffer[] = [];
      let fileName = '';
      let fileType = '';
      let projectId = '';

      busboy.on('file', (name, file, info) => {
        fileName = info.filename;
        fileType = info.mimeType;
        file.on('data', (data) => fileBuffer.push(data));
      });

      busboy.on('field', (name, value) => {
        if (name === 'projectId') projectId = value;
      });

      busboy.on('finish', async () => {
        try {
          const buffer = Buffer.concat(fileBuffer);
          const stream = Readable.from(buffer);

          // Upload to Google Drive
          const response = await drive.files.create({
            requestBody: {
              name: fileName,
              parents: [folderId],
            },
            media: {
              mimeType: fileType,
              body: stream,
            },
            fields: 'id, webViewLink',
          });

          const fileId = response.data.id;
          const webViewLink = response.data.webViewLink;

          if (!fileId) throw new Error('DRIVE_UPLOAD_FAILED: No file ID returned.');

          // Atomic Firestore Sync
          if (projectId) {
            await addDoc(collection(db, 'projects', projectId, 'deliveries'), {
              fileId,
              webViewLink,
              fileName,
              status: 'READY_FOR_REVIEW',
              uploadedAt: serverTimestamp(),
            });

            await updateDoc(doc(db, 'tasks', projectId), {
              status: 'IN_REVIEW',
              lastDeliveryId: fileId,
              updatedAt: serverTimestamp()
            });
          }

          resolve(NextResponse.json({ 
            success: true, 
            fileId, 
            webViewLink,
            timestamp: new Date().toISOString()
          }));
        } catch (uploadError: any) {
          console.error('[API_UPLOAD_BUSBOY_FINISH_ERROR]:', uploadError);
          resolve(NextResponse.json({ error: uploadError.message }, { status: 500 }));
        }
      });

      busboy.on('error', (err) => {
        console.error('[API_UPLOAD_BUSBOY_ERROR]:', err);
        resolve(NextResponse.json({ error: 'Stream parsing failed' }, { status: 500 }));
      });

      // Stream handling for Next.js Request Body
      const reader = req.body?.getReader();
      if (reader) {
        (async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              busboy.write(value);
            }
            busboy.end();
          } catch (e) {
            busboy.emit('error', e);
          }
        })();
      } else {
        busboy.end();
      }
    });

  } catch (error: any) {
    console.error('[API_UPLOAD_GLOBAL_ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}