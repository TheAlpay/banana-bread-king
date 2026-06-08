import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { adminDb, adminAuth } from '@/lib/firebase-admin'
import { CartItem, DiscountCodeDoc, UserDoc } from '@/types'

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!) }

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.slice(7)
    const decoded = await adminAuth.verifyIdToken(token)
    const userId = decoded.uid

    const { items, shippingAddress, discountCode, notes } = await req.json()

    if (!items?.length || !shippingAddress) {
      return NextResponse.json({ error: 'Missing items or shipping address' }, { status: 400 })
    }

    // Resolve user pricing
    const userSnap = await adminDb.doc(`users/${userId}`).get()
    const user = userSnap.data() as UserDoc | undefined
    const customPrice = user?.customPriceOverride

    // Validate discount
    let discountDoc: DiscountCodeDoc | null = null
    if (discountCode) {
      const discSnap = await adminDb
        .collection('discountCodes')
        .where('code', '==', discountCode.toUpperCase())
        .limit(1)
        .get()
      if (!discSnap.empty) {
        discountDoc = { id: discSnap.docs[0].id, ...discSnap.docs[0].data() } as DiscountCodeDoc
      }
    }

    // Build line items using custom price if set, otherwise product basePrice
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    let subtotal = 0

    for (const item of items as CartItem[]) {
      const productSnap = await adminDb.doc(`products/${item.productId}`).get()
      const product = productSnap.data()
      const unitPrice = customPrice ?? product?.basePrice ?? item.unitPrice
      subtotal += unitPrice * item.quantity

      lineItems.push({
        price_data: {
          currency: 'aud',
          product_data: {
            name: `${item.name} (${item.variety})`,
          },
          unit_amount: unitPrice,
        },
        quantity: item.quantity,
      })
    }

    // Calculate discount amount
    let discountAmount = 0
    if (discountDoc) {
      if (discountDoc.type === 'percentage') {
        discountAmount = Math.round(subtotal * (discountDoc.value / 100))
      } else {
        discountAmount = Math.min(discountDoc.value, subtotal)
      }
    }

    const afterDiscount = subtotal - discountAmount
    const gst = Math.round(afterDiscount * 0.1)
    const total = afterDiscount + gst

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      metadata: {
        userId,
        userEmail: decoded.email ?? '',
        userName: user?.name ?? '',
        userCompany: user?.company ?? '',
        discountCode: discountCode ?? '',
        discountId: discountDoc?.id ?? '',
        discountAmount: String(discountAmount),
        gst: String(gst),
        subtotal: String(subtotal),
        total: String(total),
        shippingAddress: JSON.stringify(shippingAddress),
        notes: notes ?? '',
        itemsJson: JSON.stringify(items),
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (err) {
    console.error('Create checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
