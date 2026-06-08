import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminAuth } from '@/lib/firebase-admin'
import { sendInvoiceEmail } from '@/lib/email'
import { OrderDoc, UserDoc } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const decoded = await adminAuth.verifyIdToken(authHeader.slice(7))
    const callerSnap = await adminDb.doc(`users/${decoded.uid}`).get()
    if (callerSnap.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { orderId } = await req.json()
    const orderSnap = await adminDb.doc(`orders/${orderId}`).get()
    if (!orderSnap.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    const order = { id: orderId, ...orderSnap.data() } as OrderDoc

    if (!order.invoiceUrl) {
      return NextResponse.json({ error: 'No invoice generated for this order' }, { status: 400 })
    }

    // Fetch PDF from Storage
    const { adminStorage } = await import('@/lib/firebase-admin')
    const bucket = adminStorage.bucket()
    const file = bucket.file(`invoices/${orderId}/${order.invoiceNumber}.pdf`)
    const [pdfBuffer] = await file.download()

    await sendInvoiceEmail(order, pdfBuffer)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Send invoice error:', err)
    return NextResponse.json({ error: 'Failed to send invoice' }, { status: 500 })
  }
}
