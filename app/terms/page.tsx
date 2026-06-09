import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions & E-A-T Compliance — Banana Bread King',
  description: 'Our commitment to food safety standards, Brisbane local sourcing, refunds, privacy policies, and wholesale terms.',
}

export default function TermsPage() {
  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: 'clamp(100px,14vw,160px) clamp(20px,5vw,72px) clamp(60px,8vw,100px)',
      }}
    >
      <span className="eyebrow" style={{ marginBottom: '12px' }}>Corporate Policies</span>
      <h1
        style={{
          fontFamily: 'var(--font-anton)',
          fontSize: 'clamp(36px,6vw,72px)',
          textTransform: 'uppercase',
          letterSpacing: '.01em',
          color: 'var(--cream)',
          marginBottom: '48px',
          lineHeight: 0.9,
        }}
      >
        Terms &amp; <span style={{ color: 'var(--gold)' }}>Conditions</span>
      </h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          color: 'var(--cream-dim)',
          fontSize: '15px',
          lineHeight: 1.75,
        }}
      >
        {/* Section: E-A-T & Sourcing Statement */}
        <section style={{ borderBottom: '1px solid var(--hairline-2)', paddingBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair)', color: 'var(--cream)', fontSize: '24px', marginBottom: '12px' }}>
            1. Sourcing &amp; Culinary Standards (E-A-T Policy)
          </h2>
          <p style={{ marginBottom: '16px' }}>
            At Banana Bread King, we believe in complete transparency, expertise, and authoritativeness in artisan baking. Every single loaf produced in our Albion kitchen utilizes 100% genuine Queensland bananas sourced from certified local growers in North Queensland.
          </p>
          <p>
            We strictly avoid artificial food additives, preservatives, or chemical thickeners. Our traditional and gluten-free recipes have been designed by professional pastry chefs with years of experience, ensuring our baking processes represent the highest standard of local food craft in South East Queensland.
          </p>
        </section>

        {/* Section: Food Safety & Allergen Separation */}
        <section style={{ borderBottom: '1px solid var(--hairline-2)', paddingBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair)', color: 'var(--cream)', fontSize: '24px', marginBottom: '12px' }}>
            2. Food Safety &amp; Allergen Control
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Our Brisbane bakehouse operates under strict compliance with the <strong>Food Standards Australia New Zealand (FSANZ)</strong> guidelines and is certified by local Brisbane City Council health inspectors.
          </p>
          <p style={{ marginBottom: '16px' }}>
            <strong>Allergen Warning:</strong> While our Classic and Gluten-Free loaves are prepared under strict segregation protocols to prevent cross-contamination, all items are baked in a kitchen that handles tree nuts (walnuts, pecans), dairy, wheat, and gluten.
          </p>
          <p>
            Our Gluten-Free &amp; Vegan range is baked using dedicated equipment and storage, catering specifically to lifestyle preferences and gluten-sensitive customers.
          </p>
        </section>

        {/* Section: Shopify Redirection & Orders */}
        <section style={{ borderBottom: '1px solid var(--hairline-2)', paddingBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair)', color: 'var(--cream)', fontSize: '24px', marginBottom: '12px' }}>
            3. Order Fulfillment &amp; Redirection to Shopify
          </h2>
          <p style={{ marginBottom: '16px' }}>
            This website operates as an informational, branding, and local SEO presentation portal. All online ordering, transaction processing, billing, and home delivery coordination are handled securely via our official Shopify storefront.
          </p>
          <p>
            By clicking any purchase link on this site, you will be redirected to our Shopify environment, which is governed by Shopify’s secure checkout policies, PCI DSS Level 1 payment compliance, and standard refund policies.
          </p>
        </section>

        {/* Section: Returns, Refunds & Freshness Guarantee */}
        <section style={{ borderBottom: '1px solid var(--hairline-2)', paddingBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair)', color: 'var(--cream)', fontSize: '24px', marginBottom: '12px' }}>
            4. Freshness Guarantee &amp; Refund Policy
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Because our banana breads contain no artificial preservatives, they are baked fresh to order and shipped immediately. We guarantee that your bread will arrive moist, fresh, and ready to enjoy.
          </p>
          <p>
            If your order is damaged or delayed in transit, please contact us immediately within 24 hours of delivery at <a href="mailto:info@bananabreadking.com.au" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>info@bananabreadking.com.au</a> with order details and photos. We will coordinate with Shopify support to issue a full refund or dispatch a replacement loaf.
          </p>
        </section>

        {/* Section: Contact & Corporate Details */}
        <section style={{ paddingBottom: '16px' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair)', color: 'var(--cream)', fontSize: '24px', marginBottom: '12px' }}>
            5. Corporate Location &amp; Contact Details
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Banana Bread King is a locally owned and operated Queensland business. For inquiries regarding wholesale delivery, corporate catering, or allergen safety, please contact us directly:
          </p>
          <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>🏢 <strong>Address:</strong> 1/337 Sandgate Road, Albion, 4010, Brisbane, QLD</li>
            <li>📞 <strong>Phone:</strong> <a href="tel:+61413061411" style={{ color: 'var(--cream)', textDecoration: 'underline' }}>+61 413 061 411</a></li>
            <li>✉️ <strong>Email:</strong> <a href="mailto:info@bananabreadking.com.au" style={{ color: 'var(--cream)', textDecoration: 'underline' }}>info@bananabreadking.com.au</a></li>
            <li>📍 <strong>ABN:</strong> Registered in Queensland, Australia (ABN available on request)</li>
          </ul>
        </section>

        <div style={{ marginTop: '32px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--gold)',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
