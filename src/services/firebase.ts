import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAhlrztV889VwA41xPGCdtCghoNlVytt1Q',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ths-stitching-center.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ths-stitching-center',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ths-stitching-center.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '395800104196',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:395800104196:web:c306216f0eb1a6bbfb1451',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-C5FM5TW0K2',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

/** Console: /firestore/databases/-default-/data */
const FIRESTORE_DATABASE_ID = '(default)';

let firestoreDb;
try {
  firestoreDb = initializeFirestore(
    firebaseApp,
    { ignoreUndefinedProperties: true },
    FIRESTORE_DATABASE_ID
  );
} catch {
  firestoreDb = getFirestore(firebaseApp, FIRESTORE_DATABASE_ID);
}
export const db = firestoreDb;

export const COLLECTIONS = {
  STUDENTS: 'students',
  ORDERS: 'orders',
  ATTENDANCE: 'attendance',
  APPLICATIONS: 'applications',
  INQUIRIES: 'inquiries',
  ACTIVITY: 'activity',
  ADMINS: 'admins',
} as const;

export const FIRESTORE_RULES_CONSOLE_URL =
  'https://console.firebase.google.com/project/ths-stitching-center/firestore/databases/-default-/rules';

export const FIRESTORE_DATA_CONSOLE_URL =
  'https://console.firebase.google.com/project/ths-stitching-center/firestore/databases/-default-/data';

export function firebaseErrorMessage(error: unknown, fallback: string): string {
  const code =
    typeof error === 'object' && error && 'code' in error ? String((error as { code: unknown }).code) : '';
  const message =
    typeof error === 'object' && error && 'message' in error
      ? String((error as { message: unknown }).message)
      : error instanceof Error
        ? error.message
        : '';

  if (
    code === 'permission-denied' ||
    code === 'firestore/permission-denied' ||
    /PERMISSION_DENIED|insufficient permissions/i.test(message)
  ) {
    return 'Firebase blocked this save because live Firestore rules deny writes. Publish the rules from this project, then submit again.';
  }
  if (code === 'not-found' || /database \(default\) does not exist/i.test(message)) {
    return 'Firestore database is not created yet for this Firebase project.';
  }
  if (code === 'unavailable' || code === 'auth/network-request-failed') {
    return 'Could not reach Firebase. Check your internet connection and try again.';
  }
  return fallback;
}

isSupported()
  .then((supported) => {
    if (supported) getAnalytics(firebaseApp);
  })
  .catch(() => {
    // Analytics is optional in local/dev environments.
  });
