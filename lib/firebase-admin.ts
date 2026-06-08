import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { getStorage, type Storage } from 'firebase-admin/storage'
import { getAuth, type Auth } from 'firebase-admin/auth'

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0]
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  })
}

// Lazy getters — only initialized when first called (not at module load / build time)
export function getAdminDb(): Firestore {
  return getFirestore(getAdminApp())
}

export function getAdminStorage(): Storage {
  return getStorage(getAdminApp())
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp())
}

// Convenience aliases kept for compatibility — evaluated lazily via getters
export const adminDb = new Proxy({} as Firestore, {
  get(_target, prop) {
    return (getAdminDb() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const adminStorage = new Proxy({} as Storage, {
  get(_target, prop) {
    return (getAdminStorage() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const adminAuth = new Proxy({} as Auth, {
  get(_target, prop) {
    return (getAdminAuth() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
