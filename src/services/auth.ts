import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AdminUser } from '../types';
import { ASSETS } from '../data/initialData';
import { auth, COLLECTIONS, db } from './firebase';

const ALLOWED_ADMIN_EMAILS = ['admin@ths.com', 'admin@ths.org'];

function mapAdminUser(user: User, profile?: Partial<AdminUser>): AdminUser {
  return {
    email: user.email || profile?.email || '',
    name: profile?.name || user.displayName || (user.email ? user.email.split('@')[0] : 'Administrator'),
    role: profile?.role || 'Head Administrator',
    avatarUrl: profile?.avatarUrl || ASSETS.adminAvatar,
    title: profile?.title || 'Center Administrator',
  };
}

async function loadAdminProfile(user: User): Promise<AdminUser> {
  const snapshot = await getDoc(doc(db, COLLECTIONS.ADMINS, user.uid));
  const profile = snapshot.exists() ? (snapshot.data() as Partial<AdminUser>) : undefined;
  const mapped = mapAdminUser(user, profile);
  if (!snapshot.exists()) {
    await setDoc(doc(db, COLLECTIONS.ADMINS, user.uid), mapped);
  }
  return mapped;
}

function authErrorMessage(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error ? String((error as { code: string }).code) : '';
  if (code === 'auth/invalid-email') return 'Invalid email or password.';
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') return 'Invalid email or password.';
  if (code === 'auth/user-not-found') return 'Invalid email or password.';
  if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait and try again.';
  if (code === 'auth/operation-not-allowed') {
    return 'Email/password sign-in is not enabled in Firebase Authentication.';
  }
  if (code === 'auth/network-request-failed') return 'Network error. Check your connection and try again.';
  return 'Could not sign in. Check Firebase Authentication and try again.';
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminUser> {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
    try {
      return await loadAdminProfile(credential.user);
    } catch {
      return mapAdminUser(credential.user);
    }
  } catch (error) {
    const code = typeof error === 'object' && error && 'code' in error ? String((error as { code: string }).code) : '';
    const canBootstrap =
      ALLOWED_ADMIN_EMAILS.includes(normalizedEmail) &&
      (code === 'auth/user-not-found' || code === 'auth/invalid-credential');

    if (canBootstrap) {
      try {
        const created = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        await updateProfile(created.user, { displayName: 'Administrator' });
        try {
          return await loadAdminProfile(created.user);
        } catch {
          return mapAdminUser(created.user);
        }
      } catch (createError) {
        const createCode =
          typeof createError === 'object' && createError && 'code' in createError
            ? String((createError as { code: string }).code)
            : '';
        if (createCode === 'auth/email-already-in-use') {
          throw new Error('Invalid email or password.');
        }
        throw new Error(authErrorMessage(createError));
      }
    }

    throw new Error(authErrorMessage(error));
  }
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuth(onUser: (user: AdminUser | null) => void): () => void {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      onUser(null);
      return;
    }
    try {
      onUser(await loadAdminProfile(firebaseUser));
    } catch {
      onUser(mapAdminUser(firebaseUser));
    }
  });
}

export function getAdminSession(): AdminUser | null {
  const current = auth.currentUser;
  return current ? mapAdminUser(current) : null;
}
