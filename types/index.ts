export type UserRole = 'customer' | 'wholesale' | 'admin'

export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postcode: string
  country: string
}

export interface UserDoc {
  uid: string
  email: string
  name: string
  role: UserRole
  company?: string
  abn?: string
  approved: boolean
  customPriceOverride?: number // cents
  shippingAddress?: Address
  createdAt: string
}

export type Range = 'classic' | 'gluten-free-vegan'
export type Variety = '600g' | '2.4kg'

export interface ProductDoc {
  id: string
  name: string
  slug: string
  range: Range
  description: string
  features: string[]
  varieties: Variety[]
  basePrice: number // cents
  stripePriceId?: string
  imageUrl: string
  inStock: boolean
  createdAt: string
}

export interface CartItem {
  productId: string
  name: string
  slug: string
  variety: Variety
  quantity: number
  unitPrice: number // cents
  imageUrl: string
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string
  name: string
  variety: Variety
  quantity: number
  unitPrice: number // cents
  total: number // cents
}

export interface OrderDoc {
  id: string
  userId: string
  userEmail: string
  userName: string
  userCompany?: string
  items: OrderItem[]
  shippingAddress: Address
  notes?: string
  subtotal: number // cents
  discountCode?: string
  discountAmount: number // cents
  gst: number // cents — 10% of (subtotal - discount)
  total: number // cents
  status: OrderStatus
  invoiceUrl?: string
  invoiceNumber?: string
  invoiceRequested?: boolean
  stripeSessionId?: string
  createdAt: string
  updatedAt: string
}

export type DiscountType = 'percentage' | 'fixed'

export interface DiscountCodeDoc {
  id: string
  code: string
  type: DiscountType
  value: number // percentage (0-100) or cents
  minOrderAmount?: number // cents
  maxUses?: number
  usedCount: number
  usedBy: string[]
  active: boolean
  expiresAt?: string
  createdAt: string
}

export interface InvoiceData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  order: OrderDoc
  user: UserDoc
}

export interface FavoriteDoc {
  userId: string
  productIds: string[]
}

export interface RevenueDataPoint {
  date: string
  revenue: number
}

export interface ProductRevenue {
  productId: string
  name: string
  revenue: number
}
