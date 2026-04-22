import { NextRequest, NextResponse } from 'next/server';
import { getDriveInstance, oauth2Client } from '@/lib/googleDrive';

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType, folderId: customFolderId } = await req.json();
    
    // Ensure we have an active drive instance and tokens are set
    await getDriveInstance();
    
    const folderId = customFolderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!folderId) {
      return NextResponse.json({ error: 'SERVER_CONFIG_ERROR: GOOGLE_DRIVE_FOLDER_ID is undefined.' }, { status: 500 });
    }

    // Get a fresh access token from the oauth2Client
    const { token } = await oauth2Client.getAccessToken();

    if (!token) {
      throw new Error('DRIVE_AUTH_FAILURE: Could not retrieve access token.');
    }

    // Initiate Resumable Upload with Google Drive API
    // Documentation: https://developers.google.com/drive/api/v3/manage-uploads#resumable
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': fileType,
      },
      body: JSON.stringify({
        name: fileName,
        parents: [folderId],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DRIVE_RESUMABLE_INIT_ERROR]:', errorText);
      return NextResponse.json({ error: 'Failed to initiate Drive upload session', details: errorText }, { status: response.status });
    }

    // The upload URL is returned in the Location header
    const uploadUrl = response.headers.get('location');

    if (!uploadUrl) {
      throw new Error('DRIVE_RESPONSE_ERROR: No upload URL (Location header) found.');
    }

    return NextResponse.json({ uploadUrl });
  } catch (error: any) {
    console.error('[API_UPLOAD_RESUMABLE_ERROR]:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
