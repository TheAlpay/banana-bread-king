import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer'
import { InvoiceData } from '@/types'

const BROWN = '#8B4513'
const CREAM = '#fdf8f0'
const LIGHT = '#f5e6d3'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
    backgroundColor: '#fff',
    padding: 0,
  },
  header: {
    backgroundColor: BROWN,
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, color: CREAM, fontFamily: 'Helvetica-Bold' },
  headerSubtitle: { fontSize: 10, color: LIGHT, marginTop: 2 },
  invoiceLabel: {
    fontSize: 18,
    color: LIGHT,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  invoiceNumber: { fontSize: 11, color: LIGHT, textAlign: 'right', marginTop: 4 },
  body: { padding: 30 },
  row: { flexDirection: 'row', marginBottom: 20 },
  col: { flex: 1 },
  sectionTitle: {
    fontSize: 9,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  text: { fontSize: 10, marginBottom: 2, color: '#333' },
  textBold: {
    fontSize: 10,
    marginBottom: 2,
    color: '#333',
    fontFamily: 'Helvetica-Bold',
  },
  divider: { borderBottom: 1, borderColor: LIGHT, marginVertical: 16 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: BROWN,
    padding: '8 10',
    borderRadius: 2,
  },
  tableRow: {
    flexDirection: 'row',
    padding: '8 10',
    borderBottom: 1,
    borderColor: LIGHT,
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: '8 10',
    borderBottom: 1,
    borderColor: LIGHT,
    backgroundColor: '#fafafa',
  },
  thProduct: { flex: 4, fontSize: 9, color: CREAM, fontFamily: 'Helvetica-Bold' },
  thCenter: {
    flex: 1,
    fontSize: 9,
    color: CREAM,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  thRight: {
    flex: 1.5,
    fontSize: 9,
    color: CREAM,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  tdProduct: { flex: 4, fontSize: 10 },
  tdCenter: { flex: 1, fontSize: 10, textAlign: 'center' },
  tdRight: { flex: 1.5, fontSize: 10, textAlign: 'right' },
  totalsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4 },
  totalsLabel: { width: 120, fontSize: 10, color: '#555', textAlign: 'right', paddingRight: 10 },
  totalsValue: { width: 80, fontSize: 10, textAlign: 'right' },
  grandTotal: {
    backgroundColor: BROWN,
    padding: '10 12',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  grandTotalText: { color: CREAM, fontSize: 13, fontFamily: 'Helvetica-Bold' },
  statusBadge: {
    padding: '4 10',
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: 1,
    borderColor: LIGHT,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 8, color: '#999' },
})

function fmt(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function InvoiceDocument({ data }: { data: InvoiceData }) {
  const { invoiceNumber, invoiceDate, dueDate, order, user } = data
  const isPaid = ['paid', 'processing', 'shipped', 'delivered'].includes(order.status)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Banana Bread King</Text>
            <Text style={styles.headerSubtitle}>{"Brisbane's Favourite Banana Bread"}</Text>
          </View>
          <View>
            <Text style={styles.invoiceLabel}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>From</Text>
              <Text style={styles.textBold}>Banana Bread King</Text>
              <Text style={styles.text}>Brisbane, QLD, Australia</Text>
              <Text style={styles.text}>info@bananabreadking.com.au</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>Bill To</Text>
              <Text style={styles.textBold}>{user.name}</Text>
              {user.company ? <Text style={styles.text}>{user.company}</Text> : null}
              {user.abn ? <Text style={styles.text}>ABN: {user.abn}</Text> : null}
              <Text style={styles.text}>{order.shippingAddress.line1}</Text>
              {order.shippingAddress.line2 ? (
                <Text style={styles.text}>{order.shippingAddress.line2}</Text>
              ) : null}
              <Text style={styles.text}>
                {order.shippingAddress.city} {order.shippingAddress.state}{' '}
                {order.shippingAddress.postcode}
              </Text>
              <Text style={styles.text}>{user.email}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.sectionTitle}>Invoice Details</Text>
              <Text style={styles.text}>Date: {invoiceDate}</Text>
              <Text style={styles.text}>Due: {dueDate}</Text>
              {order.invoiceRequested ? (
                <Text style={styles.text}>Terms: Net 30</Text>
              ) : null}
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: isPaid ? '#dcfce7' : '#fef9c3' },
                ]}
              >
                <Text
                  style={{
                    fontSize: 9,
                    color: isPaid ? '#166534' : '#854d0e',
                    fontFamily: 'Helvetica-Bold',
                  }}
                >
                  {isPaid ? 'PAID' : 'PENDING'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.tableHeader}>
            <Text style={styles.thProduct}>Product</Text>
            <Text style={styles.thCenter}>Qty</Text>
            <Text style={styles.thRight}>Unit Price</Text>
            <Text style={styles.thRight}>Total</Text>
          </View>
          {order.items.map((item, i) => (
            <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={styles.tdProduct}>
                {item.name} ({item.variety})
              </Text>
              <Text style={styles.tdCenter}>{item.quantity}</Text>
              <Text style={styles.tdRight}>{fmt(item.unitPrice)}</Text>
              <Text style={styles.tdRight}>{fmt(item.total)}</Text>
            </View>
          ))}

          <View style={{ marginTop: 16 }}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{fmt(order.subtotal)}</Text>
            </View>
            {order.discountAmount > 0 ? (
              <View style={styles.totalsRow}>
                <Text style={[styles.totalsLabel, { color: '#16a34a' }]}>
                  Discount{order.discountCode ? ` (${order.discountCode})` : ''}
                </Text>
                <Text style={[styles.totalsValue, { color: '#16a34a' }]}>
                  -{fmt(order.discountAmount)}
                </Text>
              </View>
            ) : null}
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>GST (10%)</Text>
              <Text style={styles.totalsValue}>{fmt(order.gst)}</Text>
            </View>
            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalText}>Total (AUD)</Text>
              <Text style={styles.grandTotalText}>{fmt(order.total)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your order.</Text>
          <Text style={styles.footerText}>Questions? order@bananabreadking.com.au</Text>
          <Text style={styles.footerText}>{invoiceNumber}</Text>
        </View>
      </Page>
    </Document>
  )
}

export async function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
  const instance = pdf(<InvoiceDocument data={data} />)
  const blob = await instance.toBlob()
  const arrayBuffer = await blob.arrayBuffer()
  return Buffer.from(arrayBuffer)
}
