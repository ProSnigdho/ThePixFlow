import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * PRODUCTION-READY: Environment-Driven Firebase Config
 * All secrets must be prefixed with NEXT_PUBLIC_ for client-side access.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check for missing critical variables in development/production
const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
requiredKeys.forEach(key => {
  if (!firebaseConfig[key as keyof typeof firebaseConfig]) {
    const errorMsg = `CRITICAL_ERROR: Missing Firebase environment variable for ${key}. Check .env file.`;
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMsg);
    } else {
      console.error(errorMsg);
    }
  }
});

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);