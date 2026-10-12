# Backend JavaScript

Sadece backend. Arayüz yok. Her gün bir uygulama, her cumartesi o haftanın tek API'si.

## Süre

Günde **3 saat**, haftada **6 gün**. Pazar yok.

| Blok | Süre | İş |
| --- | --- | --- |
| 1 | 50 dk | Günün kavramı. Not al, örnek çalıştır. |
| Mola | 10 dk | |
| 2 | 70 dk | Uygulama. Testler yeşil olana kadar. |
| Mola | 10 dk | |
| 3 | 40 dk | Kodu bilerek boz, hatayı oku, düzelt, birine anlatır gibi yaz. |

Kaçırılan gün ertesi güne eklenmez. Ertesi gün bir sonraki konudur.

Bu tempo 6 ay sürer. İlk 3 ay işe yarayan bir API yazılır. Son 3 ay aynı API büyütülür: test, veri, yetki, çalışan servis. Elit seviye bu tempoyu bırakmamaktır.

## Gün nasıl başlar

Bana `Gün 2` yaz. Ben o günün konusunu ve bitiş şartını veririm. Kodu sen yazarsın. Takılınca hatanın tamamını yapıştırırsın.

Bugün gün 1. Bitmiş sayılması için:

```bash
npm run day
```

komutu geçmeli. Fonksiyonlar `src/day-01/notes.js` içinde. Çözüm yok; testler sözleşmedir.

## İlk 12 hafta

Her satır bir gün. 6. gün cumartesi, haftanın parçalarını tek serviste birleştirir.

| Gün | Konu |
| --- | --- |
| 1 | Fonksiyon, dizi, nesne. Bellek içi not defteri. |
| 2 | Hata fırlatma ve yakalama. |
| 3 | Modül. Dosyalar arası sınır. |
| 4 | Promise. |
| 5 | async/await. |
| 6 | Haftalık: bellek içi not servisi, tek giriş dosyası. |
| 7 | HTTP mesajı, durum kodu, JSON. |
| 8 | `node:http` ile sunucu. |
| 9 | Express: yol ve metod. |
| 10 | Middleware. |
| 11 | Girdi doğrulama. |
| 12 | Haftalık: not REST API, veri hâlâ bellekte. |
| 13 | SQL ile seçmek. |
| 14 | PostgreSQL, tablo, bağlantı. |
| 15 | Eklemek, güncellemek, silmek. |
| 16 | Kullanıcı ve not ilişkisi. |
| 17 | Transaction. |
| 18 | Haftalık: notlar veritabanında. |
| 19 | Şifre özeti. |
| 20 | Oturum. |
| 21 | Yetki: kişi yalnız kendi kaydını siler. |
| 22 | Tek hata biçimi. |
| 23 | Sayfalama ve filtre. |
| 24 | Haftalık: çok kullanıcılı not API. |
| 25 | `node:test` ile birim test. |
| 26 | HTTP testi. |
| 27 | SQL injection. |
| 28 | Girdi sınırı ve zaman aşımı. |
| 29 | Log. |
| 30 | Haftalık: testli API. |
| 31 | Ortam değişkeni. |
| 32 | Docker ile PostgreSQL. |
| 33 | Migration. |
| 34 | Sağlık ucu ve düzgün kapanış. |
| 35 | Küçük yük altında davranış. |
| 36 | Haftalık: tek komutla kalkan servis. |

## Sonraki 12 hafta

Aynı not API'si kalır. Üstüne kuyruk, önbellek, katmanlar (yol / iş kuralı / veri), gözlem ve senin seçeceğin tek gerçek iş eklenir. Yeni çerçeve koleksiyonu yok.
