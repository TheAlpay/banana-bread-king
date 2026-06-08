import Header from './Header'
import Footer from './Footer'
import CartDrawer from '@/components/cart/CartDrawer'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  )
}
