import { google } from 'googleapis';
import { db } from '@/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

/**
 * SECURITY GUARD: Environment variable check
 */
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn("GOOGLE_DRIVE_INTEGRATION_DISABLED: Missing credentials in Environment Variables.");
}

export const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

/**
 * PRODUCTION-READY: Robust Drive Instance Getter
 */
export async function getDriveInstance(retries = 2) {
  try {
    const configDoc = await getDoc(doc(db, 'system_config', 'google_drive'));
    
    if (!configDoc.exists()) {
      throw new Error('G-DRIVE_NOT_CONFIGURED: Run /api/auth/google/login first.');
    }

    const { refresh_token } = configDoc.data();
    
    oauth2Client.setCredentials({
      refresh_token: refresh_token,
    });

    return google.drive({ version: 'v3', auth: oauth2Client });
  } catch (error: any) {
    if (retries > 0) {
      console.warn(`Drive auth failed, retrying... (${retries} left)`);
      return getDriveInstance(retries - 1);
    }
    throw new Error(`DRIVE_RESILIENCE_FAILURE: ${error.message}`);
  }
}

export async function saveRefreshToken(refreshToken: string) {
  try {
    await setDoc(doc(db, 'system_config', 'google_drive'), {
      refresh_token: refreshToken,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (e) {
    console.error("TOKEN_SAVE_FAILED:", e);
    throw e;
  }
}
