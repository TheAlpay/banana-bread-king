import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

function getFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApp()
  return initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  })
}

// auth — Proxy works here because Firebase auth methods use property access internally
export const auth: Auth = new Proxy({} as Auth, {
  get(_t, prop) {
    return (getAuth(getFirebaseApp()) as unknown as Record<string | symbol, unknown>)[prop]
  },
})

// db — must return the real Firestore instance; Firestore SDK uses instanceof checks
// internally (e.g. inside doc(), collection()) which Proxies fail.
export function getDb(): Firestore {
  return getFirestore(getFirebaseApp())
}

// storage — same reason as db
export function getStorageInstance(): FirebaseStorage {
  return getStorage(getFirebaseApp())
}

export default new Proxy({} as FirebaseApp, {
  get(_t, prop) {
    return (getFirebaseApp() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
