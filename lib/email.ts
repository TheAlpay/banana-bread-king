import { Resend } from 'resend'
import { OrderDoc } from '@/types'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!)
}

function fmt(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function orderConfirmationHtml(order: OrderDoc): string {
  const itemRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #f0e8da;">${item.name} (${item.variety})</td>
      <td style="padding:8px;border-bottom:1px solid #f0e8da;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #f0e8da;text-align:right;">${fmt(item.unitPrice)}</td>
      <td style="padding:8px;border-bottom:1px solid #f0e8da;text-align:right;">${fmt(item.total)}</td>
    </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Georgia,serif;background:#fdf8f0;margin:0;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <div style="background:#8B4513;padding:32px;text-align:center;">
      <h1 style="color:#fdf8f0;margin:0;font-size:28px;">Banana Bread King</h1>
      <p style="color:#f5d9b3;margin:8px 0 0;">Brisbane's Favourite Banana Bread</p>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#8B4513;margin-top:0;">Order Confirmed!</h2>
      <p style="color:#555;">Hi ${order.userName}, thank you for your order.</p>
      <p style="color:#555;background:#fdf8f0;padding:12px;border-radius:8px;border-left:4px solid #8B4513;">
        <strong>Order #${order.invoiceNumber}</strong>
      </p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <thead>
          <tr style="background:#fdf8f0;">
            <th style="padding:10px 8px;text-align:left;color:#8B4513;">Product</th>
            <th style="padding:10px 8px;text-align:center;color:#8B4513;">Qty</th>
            <th style="padding:10px 8px;text-align:right;color:#8B4513;">Price</th>
            <th style="padding:10px 8px;text-align:right;color:#8B4513;">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
      <div style="text-align:right;border-top:2px solid #8B4513;padding-top:16px;">
        <p style="margin:4px 0;color:#555;">Subtotal: ${fmt(order.subtotal)}</p>
        ${order.discountAmount > 0 ? `<p style="margin:4px 0;color:#22c55e;">Discount: -${fmt(order.discountAmount)}</p>` : ''}
        <p style="margin:4px 0;color:#555;">GST (10%): ${fmt(order.gst)}</p>
        <p style="margin:8px 0;color:#8B4513;font-size:18px;font-weight:bold;">Total: ${fmt(order.total)}</p>
      </div>
      <div style="margin-top:24px;text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order.id}"
           style="background:#8B4513;color:#fdf8f0;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">
          View Your Order
        </a>
      </div>
    </div>
    <div style="background:#fdf8f0;padding:20px;text-align:center;border-top:1px solid #f0e8da;">
      <p style="margin:0;color:#888;font-size:13px;">Questions? <a href="mailto:order@bananabreadking.com.au" style="color:#8B4513;">order@bananabreadking.com.au</a></p>
    </div>
  </div>
</body>
</html>`
}

export async function sendOrderConfirmation(order: OrderDoc, invoicePdfBuffer?: Buffer): Promise<void> {
  await getResend().emails.send({
    from: 'Banana Bread King <orders@bananabreadking.com.au>',
    to: order.userEmail,
    subject: `Order Confirmed — Banana Bread King #${order.invoiceNumber}`,
    html: orderConfirmationHtml(order),
    attachments: invoicePdfBuffer
      ? [{ filename: `${order.invoiceNumber}.pdf`, content: invoicePdfBuffer }]
      : [],
  })
}

export async function sendInvoiceEmail(order: OrderDoc, invoicePdfBuffer: Buffer): Promise<void> {
  await getResend().emails.send({
    from: 'Banana Bread King <orders@bananabreadking.com.au>',
    to: order.userEmail,
    subject: `Invoice #${order.invoiceNumber} — Banana Bread King`,
    html: `<div style="font-family:Georgia,serif;padding:20px;">
      <h2 style="color:#8B4513;">Invoice #${order.invoiceNumber}</h2>
      <p>Hi ${order.userName}, please find your invoice attached.</p>
      <p>Total: <strong>${fmt(order.total)}</strong></p>
      ${order.invoiceRequested ? '<p><strong>Payment terms: Net 30 days</strong></p>' : ''}
      <p style="color:#888;font-size:13px;">Questions? <a href="mailto:order@bananabreadking.com.au" style="color:#8B4513;">order@bananabreadking.com.au</a></p>
    </div>`,
    attachments: [{ filename: `${order.invoiceNumber}.pdf`, content: invoicePdfBuffer }],
  })
}

export async function sendWholesaleApproval(userEmail: string, userName: string): Promise<void> {
  await getResend().emails.send({
    from: 'Banana Bread King <info@bananabreadking.com.au>',
    to: userEmail,
    subject: 'Your Wholesale Account Has Been Approved — Banana Bread King',
    html: `<div style="font-family:Georgia,serif;padding:20px;max-width:500px;">
      <h2 style="color:#8B4513;">Welcome to Banana Bread King Wholesale!</h2>
      <p>Hi ${userName},</p>
      <p>Your wholesale account has been approved! You now have access to wholesale pricing and can order full cartons.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/login"
         style="display:inline-block;background:#8B4513;color:#fdf8f0;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
        Log In Now
      </a>
    </div>`,
  })
}
