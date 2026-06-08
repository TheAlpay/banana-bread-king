import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminStorage, adminAuth } from '@/lib/firebase-admin'
import { generateInvoicePdf } from '@/lib/invoice'
import { OrderDoc, UserDoc } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const decoded = await adminAuth.verifyIdToken(authHeader.slice(7))
    const userSnap = await adminDb.doc(`users/${decoded.uid}`).get()
    const callerRole = userSnap.data()?.role
    if (callerRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { orderId } = await req.json()
    const orderSnap = await adminDb.doc(`orders/${orderId}`).get()
    if (!orderSnap.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    const order = { id: orderId, ...orderSnap.data() } as OrderDoc

    const ownerSnap = await adminDb.doc(`users/${order.userId}`).get()
    const user = ownerSnap.data() as UserDoc

    const today = new Date()
    const invoiceDate = today.toLocaleDateString('en-AU')
    const dueDate = order.invoiceRequested
      ? new Date(today.setDate(today.getDate() + 30)).toLocaleDateString('en-AU')
      : invoiceDate

    const pdfBuffer = await generateInvoicePdf({
      invoiceNumber: order.invoiceNumber!,
      invoiceDate,
      dueDate,
      order,
      user: { ...user, uid: order.userId },
    })

    const bucket = adminStorage.bucket()
    const file = bucket.file(`invoices/${orderId}/${order.invoiceNumber}.pdf`)
    await file.save(pdfBuffer, { contentType: 'application/pdf' })
    const [invoiceUrl] = await file.getSignedUrl({ action: 'read', expires: '03-01-2500' })

    await adminDb.doc(`orders/${orderId}`).update({ invoiceUrl })

    return NextResponse.json({ invoiceUrl })
  } catch (err) {
    console.error('Generate invoice error:', err)
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 })
  }
}
