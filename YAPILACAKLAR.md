# Banana Bread King — Yapılacaklar Listesi
> Bu listedeki her şey bittiğinde site %100 tamamdır.

---

## 🔴 P0 — BUNLAR OLMADAN SİTE ÇALIŞMAZ

### 1. Stripe API Anahtarlarını Doldur ⬅ SENİN YAPMAN LAZIM
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

### 2. Resend API Anahtarını Doldur ⬅ SENİN YAPMAN LAZIM
`.env.local` dosyasında:
```
RESEND_API_KEY=re_...    ← resend.com'dan al
```
Sonra Vercel'e de ekle.

---

### 3. Firebase Auth Provider'larını Aç ⬅ SENİN YAPMAN LAZIM
Firebase Console'a git → Authentication → Sign-in method:
- **Email/Password** → Enable et
- **Google** → Enable et
- **Authorised Domains** bölümüne Vercel URL'ini ekle (örn: `bananabreadking.com.au`)

Bunlar kapalıysa hiç kimse kayıt olamaz / giriş yapamaz.

---

### 4. Firebase Güvenlik Kurallarını Deploy Et ⬅ SENİN YAPMAN LAZIM
`firebase.json` dosyası artık var. Terminal'de şunu çalıştır:
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,firestore:indexes,storage
```

---

### 5. ~~Middleware Oluştur~~ ✅ TAMAMLANDI
`proxy.ts` oluşturuldu — `/account`, `/admin`, `/checkout` koruması aktif.
> **NOT**: `middleware.ts` (Next.js 16'da deprecate edildi) silindi. Artık sadece `proxy.ts` kullanılıyor.

---

### 6. ~~Ürünleri Firestore'a Yükle (Seed Script)~~ ✅ TAMAMLANDI (Antigravity tarafından)
> Veritabanı başarıyla tohumlandı. Tüm 12 ürün (Classic ve GF ranges) ve indirim kodları Firestore'a eklendi. Admin yetkisi atandı.

---

## 🟠 P1 — KULLANICI GÖRECEK HATALAR

### 7. ~~`/about` Sayfası 404 Veriyor~~ ✅ TAMAMLANDI
`app/about/page.tsx` oluşturuldu ve dark tema ile güncellendi.

---

### 8. ~~"Contact" Linki Çalışmıyor~~ ✅ ZATEN VARDI
Footer'da `id="foot"` zaten vardı, sorun yoktu.

---

### 9. ~~Ürün ve Range Sayfaları Statik Veriden Okuyor~~ ✅ TAMAMLANDI
`/products/[range]` ve `/product/[slug]` sayfaları artık Firebase Admin SDK üzerinden Firestore'dan okuyor.

---

### 10. ~~Sepet Çekmecesindeki İndirim Kodu Hardcode~~ ✅ TAMAMLANDI
CartDrawer artık `/api/discount/validate` endpoint'ini kullanıyor. Hardcode kodlar kaldırıldı.
İndirim kodu artık Zustand cartStore'da persist ediliyor ve checkout sayfasına geçiyor.

---

### 11. ~~Dark Tema Uyumsuzlukları~~ ✅ TAMAMLANDI (Antigravity tarafından)
Aşağıdaki sayfalar açık renkli Tailwind sınıfları kullanıyordu ve karanlık tema ile uyumsuzdu.
Hepsi dark tema ile yeniden yazıldı:
- `/products` — Range kartları
- `/products/[range]` — Ürün grid sayfası
- `/product/[slug]` — Ürün detay sayfası
- `/cart` — Sepet sayfası
- `/checkout` — Ödeme sayfası
- `/account` — Hesap sayfası
- `/about` — Hakkımızda sayfası

---

## 🟡 P2 — GÜVENLİK AÇIKLARI

### 12. Admin Panelinde Sunucu Taraflı Rol Kontrolü Yok
`/admin/*` sayfaları sadece client-side kontrol ediyor.

Çözüm: `proxy.ts` içine admin kontrolü ekle — Firebase Admin SDK ile tokeni doğrula ve `role === 'admin'` değilse `/auth/login`'e yönlendir. Bu tam implementasyon için Edge Runtime'da Firebase Admin token doğrulaması gerekir (firebase-admin paketini edge'de çalıştırmak karmaşık — önce diğer P0'ları bitir).

---

### 13. ~~Admin Kullanıcılar Listesi Client-Side SDK Kullanıyor~~ ✅ TAMAMLANDI
`/api/admin/users` route'u oluşturuldu (Admin SDK). Sayfa artık bu API'den okuyor.

---

### 14. ~~Firebase Token 1 Saatte Sürüyor~~ ✅ TAMAMLANDI
`AuthProvider` bileşeni eklendi — `onIdTokenChanged` ile token yenilendiğinde cookie otomatik güncelleniyor.

---

## 🟢 P3 — EKSİK ÖZELLİKLER

### 15. ~~Admin Dashboard İstatistikleri Boş~~ ✅ TAMAMLANDI

### 16. ~~Checkout Başarı Sayfası Sipariş Özeti Göstermiyor~~ ✅ TAMAMLANDI

### 17. ~~Ürün Detay Sayfasında Favori Butonu Çalışmıyor~~ ✅ TAMAMLANDI

### 18. ~~Toptan Onay E-postası Gönderilmiyor~~ ✅ TAMAMLANDI

### 19. Ürün Görselleri Yok
Tüm 12 ürün `/images/placeholder.svg` kullanıyor.
Gerçek ürün fotoğraflarını çek → Firebase Storage'a yükle → admin panelinden URL'leri güncelle.

Admin ürün formu şu an sadece URL text input alıyor. Spec'e göre dosya yükleme (upload) olmalı.

---

### 20. ~~Desktop Header'da Hesap Linki Yok~~ ✅ TAMAMLANDI

---

## 🔵 P4 — POLİSH / SON DOKUNUŞLAR

### 21. Sipariş Geçmişi Sayfalama Yok
`/account/orders` tüm siparişleri tek seferde yüklüyor.
Firestore `limit(20)` + `startAfter` ile sayfalama ekle.

### 22. Admin Siparişler — Eksik Filtreler
`/admin/orders` sayfasında olması gereken ama eksik olanlar:
- Tarih aralığı filtresi
- Toplu işlem: "Seçilenleri işleme al" / "Seçilenleri kargoya ver"
- Toptan / perakende filtresi

### 23. ~~README Yaz~~ ✅ ZATEN VARDI

### 24. Fatura PDF Testi
`/api/invoices/generate` route'unu gerçek bir sipariş üzerinde test et.
`@react-pdf/renderer` bazen Vercel'de font yükleme sorunları çıkarır — canlıda test etmeden bilemezsin.

---

## ÖNCELİK SIRASI (Güncel)

| Sıra | Ne Yaparsın | Sonuç |
|------|-------------|-------|
| 1 | Stripe + Resend env var'larını doldur | Ödeme + e-posta çalışır |
| 2 | Firebase auth provider'larını aç | Kayıt/giriş çalışır |
| 3 | Seed script çalıştır | Ürünler sayfada görünür |
| 4 | Firebase rules deploy et | Veritabanı güvenli |
| 5 | Ürün görselleri yükle | Gerçek fotoğraflar görünür |
| 6 | Admin server-side role kontrolü | Güvenlik güçlenir |
| 7 | Fatura PDF canlıda test et | Eksikleri önceden yakala |
