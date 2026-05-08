import { google } from 'googleapis';
import { db } from '@/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

export const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

/**
 * PRODUCTION-READY: Google Drive API Instance with Auto-Refresh
 */
export async function getDriveInstance(retries = 3) {
  try {
    // 1. Get tokens from Firestore (stored under system_config/google_drive)
    const configSnap = await getDoc(doc(db, 'system_config', 'google_drive'));
    
    if (!configSnap.exists()) {
      throw new Error('GOOGLE_DRIVE_CONFIG_MISSING: No refresh token found in Firestore.');
    }

    const { refresh_token } = configSnap.data();
    
    if (!refresh_token) {
      throw new Error('GOOGLE_DRIVE_TOKEN_MISSING: Refresh token is empty.');
    }

    oauth2Client.setCredentials({ refresh_token });

    // 2. Return Drive instance
    return google.drive({ version: 'v3', auth: oauth2Client });
  } catch (error: any) {
    console.error("[DRIVE_AUTH_ERROR_DETAIL]:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    
    if (retries > 0) {
      console.warn(`Drive auth failed, retrying... (${retries} left)`);
      return getDriveInstance(retries - 1);
    }
    
    throw new Error(`DRIVE_RESILIENCE_FAILURE: ${error.message}`);
  }
}

/**
 * Helper to get a fresh access token (used for resumable uploads)
 */
export async function getDriveAccessToken() {
  const drive = await getDriveInstance();
  const { token } = await oauth2Client.getAccessToken();
  return token;
}
