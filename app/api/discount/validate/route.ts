import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { DiscountCodeDoc } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { code, orderAmount, userId } = await req.json()

    if (!code || !orderAmount || !userId) {
      return NextResponse.json({ valid: false, error: 'Missing required fields' }, { status: 400 })
    }

    const snap = await adminDb
      .collection('discountCodes')
      .where('code', '==', code.toUpperCase())
      .limit(1)
      .get()

    if (snap.empty) {
      return NextResponse.json({ valid: false, error: 'Invalid discount code' })
    }

    const docSnap = snap.docs[0]
    const discount = { id: docSnap.id, ...docSnap.data() } as DiscountCodeDoc

    if (!discount.active) {
      return NextResponse.json({ valid: false, error: 'This code is no longer active' })
    }

    if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, error: 'This code has expired' })
    }

    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return NextResponse.json({ valid: false, error: 'This code has reached its usage limit' })
    }

    if (discount.usedBy?.includes(userId)) {
      return NextResponse.json({ valid: false, error: 'You have already used this code' })
    }

    if (discount.minOrderAmount && orderAmount < discount.minOrderAmount) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order of $${(discount.minOrderAmount / 100).toFixed(2)} required`,
      })
    }

    return NextResponse.json({ valid: true, discount })
  } catch (err) {
    console.error('Discount validate error:', err)
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 })
  }
}
