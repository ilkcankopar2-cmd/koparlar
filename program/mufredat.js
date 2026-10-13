import { HAFTALAR } from "./haftalar.js";
import { GUNLER_A } from "./gunler-a.js";
import { GUNLER_B } from "./gunler-b.js";

export const BASLANGIC = "2026-10-19";
export const TOPLAM_GUN = 144;

export const BLOKLAR = [
  {
    ad: "Kavram",
    dk: 50,
    mola: false,
    yazi: "Günün metnini oku. Varsa kısa örneği çalıştır. İki cümleyle kendi ağzından yaz.",
  },
  {
    ad: "Mola",
    dk: 10,
    mola: true,
    yazi: "Ekranı bırak.",
  },
  {
    ad: "Uygulama",
    dk: 70,
    mola: false,
    yazi: "Günün işini yaz. Bitiş şartı sağlanana kadar devam et.",
  },
  {
    ad: "Mola",
    dk: 10,
    mola: true,
    yazi: "Ekranı bırak.",
  },
  {
    ad: "Boz",
    dk: 40,
    mola: false,
    yazi: "Kodu bilerek boz. Hatanın tamamını oku. Düzelt. Birine anlatır gibi beş cümle yaz.",
  },
];

const GUN_ADLARI = [
  "pazar",
  "pazartesi",
  "salı",
  "çarşamba",
  "perşembe",
  "cuma",
  "cumartesi",
];

const AY_ADLARI = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

export function calismaGunleri(baslangic, adet) {
  const tarih = new Date(`${baslangic}T00:00:00Z`);
  const gunler = [];
  while (gunler.length < adet) {
    if (tarih.getUTCDay() !== 0) {
      gunler.push(tarih.toISOString().slice(0, 10));
    }
    tarih.setUTCDate(tarih.getUTCDate() + 1);
  }
  return gunler;
}

export function tarihYazi(iso) {
  const tarih = new Date(`${iso}T00:00:00Z`);
  const gun = GUN_ADLARI[tarih.getUTCDay()];
  const ay = AY_ADLARI[tarih.getUTCMonth()];
  return `${tarih.getUTCDate()} ${ay} ${tarih.getUTCFullYear()} ${gun}`;
}

export function program() {
  const ham = [...GUNLER_A, ...GUNLER_B];
  const tarihler = calismaGunleri(BASLANGIC, TOPLAM_GUN);
  const gunlukDakika = BLOKLAR.reduce((toplam, blok) => toplam + blok.dk, 0);
  const gunler = ham.map((gun, index) => {
    const tarih = tarihler[index];
    const hafta = Math.ceil(gun.n / 6);
    return {
      ...gun,
      hafta,
      tarih,
      tarihYazi: tarihYazi(tarih),
      haftaninGunu: ((gun.n - 1) % 6) + 1,
      birlestirme: gun.n % 6 === 0,
    };
  });

  const haftalar = HAFTALAR.map((hafta, index) => {
    const icerik = gunler.filter((gun) => gun.hafta === index + 1);
    return {
      n: index + 1,
      ad: hafta.ad,
      amac: hafta.amac,
      baslangic: icerik[0].tarih,
      bitis: icerik[icerik.length - 1].tarih,
      baslangicYazi: tarihYazi(icerik[0].tarih),
      bitisYazi: tarihYazi(icerik[icerik.length - 1].tarih),
      gunler: icerik.map((gun) => gun.n),
    };
  });

  const bitis = gunler[gunler.length - 1].tarih;

  return {
    meta: {
      baslangic: BASLANGIC,
      bitis,
      baslangicYazi: tarihYazi(BASLANGIC),
      bitisYazi: tarihYazi(bitis),
      toplamGun: TOPLAM_GUN,
      toplamHafta: HAFTALAR.length,
      gunlukSaat: gunlukDakika / 60,
      gunlukDakika,
      toplamSaat: (TOPLAM_GUN * gunlukDakika) / 60,
      haftalikGun: 6,
      dinlenme: "pazar",
    },
    bloklar: BLOKLAR,
    haftalar,
    gunler,
  };
}
