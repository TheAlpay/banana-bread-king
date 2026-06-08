# Banana Bread King — Yapılacaklar Listesi
> Bu listedeki her şey bittiğinde site %100 tamamdır.

---

## 🔴 P0 — BUNLAR OLMADAN SİTE ÇALIŞMAZ

### 1. Stripe API Anahtarlarını Doldur
`.env.local` dosyasında şu an boş olan şu 3 satırı doldur:
```
STRIPE_SECRET_KEY=sk_live_...         ← Stripe Dashboard → Developers → API keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...       ← Stripe Dashboard → Webhooks → add endpoint
```
Webhook endpoint URL: `https://senindomain.com/api/stripe/webhook`
Webhook olayları: `checkout.session.completed` + `payment_intent.payment_failed`

Sonra aynı 3 değeri Vercel'e de ekle:
→ Vercel Dashboard → Projen → Settings → Environment Variables

---

### 2. Resend API Anahtarını Doldur
`.env.local` dosyasında:
```
RESEND_API_KEY=re_...    ← resend.com'dan al
```
Sonra Vercel'e de ekle.

---

### 3. Firebase Auth Provider'larını Aç
Firebase Console'a git → Authentication → Sign-in method:
- **Email/Password** → Enable et
- **Google** → Enable et
- **Authorised Domains** bölümüne Vercel URL'ini ekle (örn: `bananabreadking.com.au`)

Bunlar kapalıysa hiç kimse kayıt olamaz / giriş yapamaz.

---

### 4. Firebase Güvenlik Kurallarını Deploy Et
Terminal'de şunu çalıştır:
```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```
Bu olmadan Firestore'a gerçek kullanıcılar erişemez (veya herkes erişir, güvensiz olur).

Önce `firebase.json` dosyasını oluşturman lazım (henüz yok):
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

---

### 5. Middleware Oluştur (Route Koruması)
Şu an `/account` ve `/admin` sayfalarına URL'i bilen herkes girebiliyor (sunucu tarafında hiçbir koruma yok).

Proje kök dizinine `middleware.ts` dosyası oluştur:
```ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('firebase-token')?.value
  const { pathname } = req.nextUrl

  if ((pathname.startsWith('/account') || pathname.startsWith('/admin')) && !token) {
    return NextResponse.redirect(new URL(`/auth/login?redirect=${pathname}`, req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
}
```

---

### 6. Ürünleri Firestore'a Yükle (Seed Script)
Şu an site veritabanında hiç ürün yok. Ürün sayfaları boş görünüyor.

`.env.local` dosyasına ekle:
```
ADMIN_UID=firebase_uid_buraya    ← Firebase Console → Authentication → Users'dan kendi UID'ni al
```
Sonra terminal'de:
```bash
npx ts-node --project tsconfig.seed.json scripts/seed.ts
```
Bu script 12 ürünü ve 3 indirim kodunu (WELCOME10, BULK5, KINGOFF) Firestore'a yükler.

`tsconfig.seed.json` dosyası da yoksa oluştur:
```json
{
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES2017",
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

---

## 🟠 P1 — KULLANICI GÖRECEK HATALAR

### 7. /about Sayfası 404 Veriyor
Header'daki "Story" linki `/about`'a gidiyor ama o sayfa yok.
`app/about/page.tsx` oluştur — içerik ne olursa olsun 404'ten kurtarır.

---

### 8. "Contact" Linki Çalışmıyor
Header'daki "Contact" linki `/#foot`'a gidiyor ama Footer'da `id="foot"` yok.
`components/layout/Footer.tsx` içindeki en dıştaki `<footer>` elementine `id="foot"` ekle.

---

### 9. Ürün ve Range Sayfaları Statik Veriden Okuyor
`/products/classic` ve `/products/gluten-free-vegan` ve `/product/[slug]` sayfaları şu an `data/products.ts` dosyasından (sabit TypeScript dizisi) okuyor.
Admin panelinde fiyat değiştirsen bile sitede görünmüyor.

Bu 2 dosyayı düzelt, Firestore'dan okusun:
- `app/(store)/products/[range]/page.tsx`
- `app/(store)/product/[slug]/page.tsx`

---

### 10. Sepet Çekmecesindeki İndirim Kodu Hardcode
`components/cart/CartDrawer.tsx` içinde indirim kodları (BRISBANE10, KING15, FRESH) direkt koda yazılmış durumda — üstelik hata mesajında "try BRISBANE10" yazıyor, yani kullanıcıya kodu söylüyorsun.

Bunu `/api/discount/validate` endpoint'ine bağla. Sepet sayfası (`/cart/page.tsx`) bunu doğru yapıyor, aynısını drawer'da da uygula.

---

### 11. İndirim Kodu Checkout'a Geçmiyor
Kullanıcı sepette indirim kodu uygulasa bile checkout sayfasına geçince kayboluyor çünkü kod sadece component'ın local state'inde tutuluyor.

Çözüm: Zustand `cartStore`'a `appliedDiscountCode` ve `discountAmount` ekle → checkout sayfası bunu okusun → `/api/stripe/create-checkout` isteğine `discountCode` olarak göndersin.

---

## 🟡 P2 — GÜVENLİK AÇIKLARI

### 12. Admin Panelinde Sunucu Taraflı Rol Kontrolü Yok
`/admin/*` sayfaları sadece client-side'da `onAuthStateChanged` ile kontrol ediyor (bazıları hiç kontrol etmiyor).
JavaScript yüklenmeden önce sayfa HTML'i açık.

Çözüm: `middleware.ts` içine admin kontrolü ekle — Firebase Admin SDK ile tokeni doğrula ve `role === 'admin'` değilse `/auth/login`'e yönlendir.

---

### 13. Admin Kullanıcılar Listesi Client-Side SDK Kullanıyor
`/admin/users/page.tsx` tüm kullanıcıları client-side Firestore SDK ile çekiyor.
Firestore kuralları deploy edilince bu sorgu başarısız olacak (admin olmayanlar tüm kullanıcı listesini okuyamaz).

Çözüm: Bu sorguyu Firebase Admin SDK kullanan bir API route'a taşı (`/api/admin/users`).

---

### 14. Firebase Token 1 Saatte Sürüyor
Login sırasında cookie'ye `max-age=3600` (1 saat) yazılıyor. 1 saat sonra kullanıcı hâlâ giriş yapmış görünse de token süresi dolduğu için middleware onu login'e atacak.

Çözüm: Firebase `onIdTokenChanged` listener'ı kullan → token yenilendiğinde cookie'yi güncelle.
`app/layout.tsx` veya bir `AuthProvider` component'ında:
```ts
auth.onIdTokenChanged(async (user) => {
  if (user) {
    const token = await user.getIdToken()
    document.cookie = `firebase-token=${token}; path=/; max-age=3600`
  }
})
```

---

## 🟢 P3 — EKSİK ÖZELLİKLER

### 15. Admin Dashboard İstatistikleri Boş
`/admin` sayfasındaki tüm kart değerleri `—` gösteriyor (placeholder).

Gerçek Firestore sorguları yaz:
- **Bugünkü siparişler**: `orders` → `createdAt >= bugün 00:00`
- **Bekleyen siparişler**: `orders` → `status == 'pending'`
- **Onay bekleyen toptan**: `users` → `role == 'wholesale' AND approved == false`
- **Bu ay gelir**: `orders` → bu ayki tamamlanan siparişlerin `total` toplamı
- **Stokta olmayan**: `products` → `inStock == false`

Son 10 sipariş tablosunu da ekle (hızlı durum güncelleme dropdown'ı ile).

---

### 16. Checkout Başarı Sayfası Sipariş Özeti Göstermiyor
`/checkout/success` sadece "Teşekkürler" yazıp sepeti temizliyor. Spec'e göre şunlar olmalı:
- Sipariş özeti (ürünler, toplam)
- Fatura PDF indirme butonu
- `/account/orders` linki

`session_id` query param'ı ile Firestore'dan siparişi bul (`stripeSessionId` alanıyla eşleştir) ve göster.

---

### 17. Ürün Detay Sayfasında Favori Butonu Çalışmıyor
`/product/[slug]` sayfasındaki kalp ikonu var ama `onClick` handler'ı yok.
`toggleFavorite(uid, product.id, !isFav)` fonksiyonunu bağla. Kullanıcı giriş yapmamışsa `/auth/login`'e yönlendir.

---

### 18. Toptan Onay E-postası Gönderilmiyor
`lib/email.ts` içinde `sendWholesaleApproval()` fonksiyonu var ama hiçbir yerde çağrılmıyor.
`/admin/users/[userId]/page.tsx` içinde "Approve" butonuna basılınca bu fonksiyon çağrılmalı.

---

### 19. Ürün Görselleri Yok
Tüm 12 ürün `imageUrl: '/images/placeholder.svg'` kullanıyor.
Gerçek ürün fotoğraflarını çek → Firebase Storage'a yükle → admin panelinden URL'leri güncelle.

Admin ürün formu şu an sadece URL text input alıyor. Spec'e göre dosya yükleme (upload) olmalı.

---

### 20. Desktop Header'da Hesap Linki Yok
Header'ın desktop versiyonunda "Menu, Story, Local, Contact" var ama "Hesabım" veya "Giriş Yap" linki yok.
Sağ tarafa ekle (cart butonu yanına).

---

## 🔵 P4 — POLİSH / SON DOKUNUŞLAR

### 21. Sipariş Geçmişi Sayfalama Yok
`/account/orders` tüm siparişleri tek seferde yüklüyor. Toptan müşterilerde yüzlerce sipariş olabilir.
Firestore `limit(20)` + `startAfter` ile sayfalama ekle.

### 22. Admin Siparişler — Eksik Filtreler
`/admin/orders` sayfasında olması gereken ama eksik olanlar:
- Tarih aralığı filtresi
- Toplu işlem: "Seçilenleri işleme al" / "Seçilenleri kargoya ver"
- Toptan / perakende filtresi

### 23. README Yaz
`README.md` dosyası yok. Şunları içermeli:
- Firebase proje kurulum adımları
- Stripe webhook yapılandırması
- Tüm environment variable'ların listesi ve ne işe yaradıkları
- Seed script nasıl çalıştırılır

### 24. Fatura PDF Testi
`/api/invoices/generate` route'unu gerçek bir sipariş üzerinde test et.
`@react-pdf/renderer` bazen Vercel'de font yükleme sorunları çıkarır — canlıda test etmeden bilemezsin.

---

## ÖNCELİK SIRASI (Kısaca)

| Sıra | Ne Yaparsın | Sonuç |
|------|-------------|-------|
| 1 | Stripe + Resend env var'larını doldur | Ödeme + e-posta çalışır |
| 2 | Firebase auth provider'larını aç | Kayıt/giriş çalışır |
| 3 | Seed script çalıştır | Ürünler sayfada görünür |
| 4 | `middleware.ts` oluştur | Güvenli route koruması |
| 5 | Firebase rules deploy et | Veritabanı güvenli |
| 6 | `/about` sayfası + `#foot` anchor | 404'ler düzelir |
| 7 | Ürün/range sayfaları Firestore'a bağla | Fiyat yönetimi çalışır |
| 8 | Cart drawer indirim kodu API'ye bağla | Güvenli indirim sistemi |
| 9 | İndirim kodunu checkout'a taşı | İndirim kaybolmaz |
| 10 | Admin dashboard istatistikleri | Admin kullanılabilir hale gelir |
