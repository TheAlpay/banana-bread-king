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

// Lazy proxies — only initialize when first property is accessed (client-side only)
export const auth: Auth = new Proxy({} as Auth, {
  get(_t, prop) {
    return (getAuth(getFirebaseApp()) as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const db: Firestore = new Proxy({} as Firestore, {
  get(_t, prop) {
    return (getFirestore(getFirebaseApp()) as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export const storage: FirebaseStorage = new Proxy({} as FirebaseStorage, {
  get(_t, prop) {
    return (getStorage(getFirebaseApp()) as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export default new Proxy({} as FirebaseApp, {
  get(_t, prop) {
    return (getFirebaseApp() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
