# Backend JavaScript

Sadece backend. Yeni çerçeve koleksiyonu yok. Aynı not servisi 24 hafta büyür.

Çalışma sayfası tablet içindir. Tek dosya: `calisma/index.html`. Tarayıcıda aç. İlerleme o tarayıcıda kalır.

## Süre

Günde **2 saat**, haftada **6 gün**. Pazar yok.

| | |
| --- | --- |
| Başlangıç | 19 Ekim 2026 pazartesi |
| Bitiş | 3 Nisan 2027 cumartesi |
| Gün | 144 |
| Saat | 288 |

| Blok | Süre | İş |
| --- | --- | --- |
| 1 | 40 dk | Günün kavramı. Not al, örnek çalıştır. |
| Mola | 5 dk | |
| 2 | 55 dk | Uygulama. Bitiş şartı sağlanana kadar. |
| Mola | 5 dk | |
| 3 | 15 dk | Kodu bilerek boz, hatayı oku, düzelt, birine anlatır gibi yaz. |

Kaçırılan gün ertesi güne eklenmez. Ertesi gün bir sonraki konudur.

Kod için Bluetooth klavye kullan. Cam klavye 70 dakika taşımaz. Node 20 bu depoda çalışır. Tablet Node çalıştırmıyorsa tabletin tarayıcısından bir bulut ortam aç; test orada koşar. Docker 32. günde, Node'un çalıştığı yerdedir.

## Gün nasıl başlar

Sayfa ders içindir. Kodu sayfaya yazma.

Gün 1 dosyası `src/day-01/notes.js`. Üç fonksiyonun içindeki `throw` satırını sil, kendi kodunu yaz. `src/day-01/notes.test.js` dosyasına dokunma. Sonraki günlerin dosyası, o günün uygulama bölümünde yazar.

Dosyayı sen açma. Kodu sohbete yaz. Ben dosyaya koyup testi çalıştırırım. Takılınca gün numarasını ve hatanın tamamını yapıştırırsın.

Bugün gün 1. Bitmiş sayılması için:

```bash
npm run day
```

komutu geçmeli. Fonksiyonlar `src/day-01/notes.js` içinde. Çözüm yok; testler sözleşmedir.

## Haftalar

Her hafta pazartesi başlar, cumartesi o haftanın parçalarını tek serviste birleştirir. Gün gün konu `calisma/index.html` içindedir.

| Hafta | Konu |
| --- | --- |
| 1 | Dil. Fonksiyon, hata, modül, promise. Bellek içi not. |
| 2 | HTTP. Durum kodu, `node:http`, Express, doğrulama. |
| 3 | PostgreSQL. Tablo, ilişki, transaction. |
| 4 | Şifre, oturum, yetki, hata biçimi, sayfalama. |
| 5 | Test, SQL injection, limit, log. |
| 6 | Ortam, Docker, migration, sağlık, kapanış, kısa yük. |
| 7 | Yol, iş kuralı, veri. |
| 8 | Olay döngüsü. |
| 9 | Referans, kapanış, this, Map. |
| 10 | Buffer, stream, geri basınç. |
| 11 | Havuz, indeks, N+1, kilit. |
| 12 | Migration ileri ve geri, yedek. |
| 13 | Çerez, CSRF, oturum iptali. |
| 14 | Enjeksiyon, hız sınırı, zaman aşımı. |
| 15 | Önbellek. Ayrı ürün yok, süreç içi. |
| 16 | Kuyruk. Postgres tablosu. Redis yok. |
| 17 | JSON log, istek kimliği, sağlık ve hazır. |
| 18 | SIGTERM, açık istek, havuz, işçi. |
| 19 | Süre sınırı, tekrar, aynı iş anahtarı. |
| 20 | Ölçüm, havuz boyutu, alan seçimi. |
| 21 | Uyumlu değişiklik, `/v1`, sözleşme testi. |
| 22 | Arama, yumuşak silme, denetim izi. |
| 23 | Ortam, sır, imaj, tek komut. |
| 24 | Aynı servisi baştan sona anlat. |
