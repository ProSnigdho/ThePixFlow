import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';

/**
 * Syncs the uploaded file details to Firestore.
 * This is called after the client successfully uploads the file to Google Drive.
 */
export async function POST(req: NextRequest) {
  try {
    const { fileId, fileName, webViewLink, projectId, mode } = await req.json();

    if (!fileId || !projectId) {
      return NextResponse.json({ error: 'MISSING_DATA: fileId and projectId are required.' }, { status: 400 });
    }

    if (mode === 'NEW_PROJECT') {
      // For new projects, we might just return success and let the client handle project creation
      // or we can update a specific field if needed.
      // In this app, NewProjectPage.tsx handles the 'tasks' collection creation.
      return NextResponse.json({ success: true });
    }

    // Default mode: DELIVERY (for editors)
    // Atomic Firestore Sync
    await addDoc(collection(db, 'projects', projectId, 'deliveries'), {
      fileId,
      webViewLink: webViewLink || `https://drive.google.com/uc?id=${fileId}`,
      fileName,
      status: 'READY_FOR_REVIEW',
      uploadedAt: serverTimestamp(),
    });

    await updateDoc(doc(db, 'tasks', projectId), {
      status: 'IN_REVIEW',
      lastDeliveryId: fileId,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Firestore synchronized successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[API_UPLOAD_SYNC_ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
