import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { adminDb, adminStorage } from '@/lib/firebase-admin'
import { generateInvoicePdf } from '@/lib/invoice'
import { sendOrderConfirmation } from '@/lib/email'
import { OrderDoc, UserDoc, CartItem } from '@/types'

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!) }

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata!

    try {
      // Generate invoice number
      const year = new Date().getFullYear()
      const counterRef = adminDb.doc(`counters/invoices_${year}`)
      const counterSnap = await counterRef.get()
      const count = (counterSnap.data()?.count ?? 0) + 1
      await counterRef.set({ count }, { merge: true })
      const invoiceNumber = `BBK-${year}-${String(count).padStart(6, '0')}`

      const items: CartItem[] = JSON.parse(meta.itemsJson)
      const shippingAddress = JSON.parse(meta.shippingAddress)

      // Fetch user
      const userSnap = await adminDb.doc(`users/${meta.userId}`).get()
      const user = userSnap.data() as UserDoc | undefined

      const orderItems = items.map((item) => ({
        productId: item.productId,
        name: item.name,
        variety: item.variety,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.unitPrice * item.quantity,
      }))

      const order: Omit<OrderDoc, 'id'> = {
        userId: meta.userId,
        userEmail: meta.userEmail,
        userName: meta.userName,
        userCompany: meta.userCompany || undefined,
        items: orderItems,
        shippingAddress,
        notes: meta.notes || undefined,
        subtotal: Number(meta.subtotal),
        discountCode: meta.discountCode || undefined,
        discountAmount: Number(meta.discountAmount),
        gst: Number(meta.gst),
        total: Number(meta.total),
        status: 'paid',
        invoiceNumber,
        stripeSessionId: session.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const orderRef = await adminDb.collection('orders').add(order)
      const orderId = orderRef.id

      // Update discount usage
      if (meta.discountId) {
        await adminDb.doc(`discountCodes/${meta.discountId}`).update({
          usedCount: (await adminDb.doc(`discountCodes/${meta.discountId}`).get()).data()?.usedCount + 1,
          usedBy: [...((await adminDb.doc(`discountCodes/${meta.discountId}`).get()).data()?.usedBy ?? []), meta.userId],
        })
      }

      // Generate PDF invoice
      if (user) {
        const today = new Date()
        const invoiceDate = today.toLocaleDateString('en-AU')
        const dueDate = order.invoiceRequested
          ? new Date(today.setDate(today.getDate() + 30)).toLocaleDateString('en-AU')
          : invoiceDate

        const pdfBuffer = await generateInvoicePdf({
          invoiceNumber,
          invoiceDate,
          dueDate,
          order: { ...order, id: orderId } as OrderDoc,
          user: { ...user, uid: meta.userId },
        })

        // Upload to Firebase Storage
        const bucket = adminStorage.bucket()
        const file = bucket.file(`invoices/${orderId}/${invoiceNumber}.pdf`)
        await file.save(pdfBuffer, { contentType: 'application/pdf' })
        const [invoiceUrl] = await file.getSignedUrl({
          action: 'read',
          expires: '03-01-2500',
        })

        await adminDb.doc(`orders/${orderId}`).update({ invoiceUrl })

        await sendOrderConfirmation({ ...order, id: orderId, invoiceUrl } as OrderDoc, pdfBuffer)
      }
    } catch (err) {
      console.error('Webhook processing error:', err)
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const pi = event.data.object as Stripe.PaymentIntent
    const sessions = await getStripe().checkout.sessions.list({ payment_intent: pi.id })
    const sessionId = sessions.data[0]?.id
    if (sessionId) {
      const snap = await adminDb
        .collection('orders')
        .where('stripeSessionId', '==', sessionId)
        .limit(1)
        .get()
      if (!snap.empty) {
        await snap.docs[0].ref.update({ status: 'cancelled', updatedAt: new Date().toISOString() })
      }
    }
  }

  return NextResponse.json({ received: true })
}
