import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  increment,
  arrayUnion,
} from 'firebase/firestore'
import { getDb } from './firebase'
import { UserDoc, OrderDoc, ProductDoc, DiscountCodeDoc, FavoriteDoc } from '@/types'

// Users
export async function getUser(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(getDb(), 'users', uid))
  return snap.exists() ? (snap.data() as UserDoc) : null
}

export async function setUser(uid: string, data: Partial<UserDoc>): Promise<void> {
  await setDoc(doc(getDb(), 'users', uid), data, { merge: true })
}

export async function updateUser(uid: string, data: Partial<UserDoc>): Promise<void> {
  await updateDoc(doc(getDb(), 'users', uid), data as Record<string, unknown>)
}

// Products
export async function getProducts(): Promise<ProductDoc[]> {
  const snap = await getDocs(collection(getDb(), 'products'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProductDoc))
}

export async function getProductBySlug(slug: string): Promise<ProductDoc | null> {
  const q = query(collection(getDb(), 'products'), where('slug', '==', slug))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as ProductDoc
}

export async function getProductsByRange(range: string): Promise<ProductDoc[]> {
  const q = query(collection(getDb(), 'products'), where('range', '==', range))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProductDoc))
}

// Orders
export async function getUserOrders(userId: string): Promise<OrderDoc[]> {
  const q = query(
    collection(getDb(), 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as OrderDoc))
}

export async function getOrder(orderId: string): Promise<OrderDoc | null> {
  const snap = await getDoc(doc(getDb(), 'orders', orderId))
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as OrderDoc) : null
}

// Discounts
export async function getDiscountCode(code: string): Promise<DiscountCodeDoc | null> {
  const q = query(collection(getDb(), 'discountCodes'), where('code', '==', code))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as DiscountCodeDoc
}

export async function incrementDiscountUsage(codeId: string, userId: string): Promise<void> {
  await updateDoc(doc(getDb(), 'discountCodes', codeId), {
    usedCount: increment(1),
    usedBy: arrayUnion(userId),
  })
}

// Favorites
export async function getFavorites(userId: string): Promise<FavoriteDoc | null> {
  const snap = await getDoc(doc(getDb(), 'favorites', userId))
  return snap.exists() ? (snap.data() as FavoriteDoc) : null
}

export async function toggleFavorite(userId: string, productId: string, add: boolean): Promise<void> {
  const ref = doc(getDb(), 'favorites', userId)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, { userId, productIds: add ? [productId] : [] })
    return
  }
  const current = (snap.data() as FavoriteDoc).productIds
  const updated = add
    ? [...new Set([...current, productId])]
    : current.filter((id) => id !== productId)
  await updateDoc(ref, { productIds: updated })
}

// Invoice counter — uses a Firestore counter doc keyed by year string passed in
export async function getNextInvoiceNumber(year: number): Promise<string> {
  const counterRef = doc(getDb(), 'counters', `invoices_${year}`)
  const snap = await getDoc(counterRef)
  const current = snap.exists() ? ((snap.data()?.count as number) ?? 0) : 0
  const next = current + 1
  await setDoc(counterRef, { count: next }, { merge: true })
  return `BBK-${year}-${String(next).padStart(6, '0')}`
}
