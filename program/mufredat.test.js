import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { BASLANGIC, BLOKLAR, program } from "./mufredat.js";

const seri = program();

describe("backend seri takvimi", () => {
  it("144 gün, 24 hafta, günde 3 saat", () => {
    assert.equal(seri.gunler.length, 144);
    assert.equal(seri.haftalar.length, 24);
    assert.equal(seri.meta.gunlukSaat, 3);
    assert.equal(seri.meta.toplamSaat, 432);
    assert.equal(BLOKLAR.reduce((toplam, blok) => toplam + blok.dk, 0), 180);
  });

  it("pazartesi başlar, cumartesi biter, pazar yok", () => {
    assert.equal(seri.meta.baslangic, "2026-10-19");
    assert.equal(BASLANGIC, "2026-10-19");
    assert.equal(new Date(`${seri.meta.baslangic}T00:00:00Z`).getUTCDay(), 1);
    assert.equal(seri.meta.bitis, "2027-04-03");
    assert.equal(new Date(`${seri.meta.bitis}T00:00:00Z`).getUTCDay(), 6);
    for (const gun of seri.gunler) {
      assert.notEqual(new Date(`${gun.tarih}T00:00:00Z`).getUTCDay(), 0);
    }
  });

  it("her altıncı gün cumartesi ve birleştirme", () => {
    for (const gun of seri.gunler) {
      const haftaSonu = gun.n % 6 === 0;
      assert.equal(gun.birlestirme, haftaSonu);
      if (haftaSonu) {
        assert.equal(new Date(`${gun.tarih}T00:00:00Z`).getUTCDay(), 6);
        assert.match(gun.konu, /^Haftalık:/);
      }
    }
  });

  it("gün numaraları ve haftalar eksiksiz", () => {
    assert.deepEqual(
      seri.gunler.map((gun) => gun.n),
      Array.from({ length: 144 }, (_, index) => index + 1),
    );
    for (const hafta of seri.haftalar) {
      assert.equal(hafta.gunler.length, 6);
      assert.equal(hafta.ad.length > 0, true);
      assert.equal(hafta.amac.length > 0, true);
    }
  });

  it("her günde tabletten okunacak metin var", () => {
    for (const gun of seri.gunler) {
      for (const alan of ["konu", "ozet", "ayrinti", "uygulama", "bitti", "tarihYazi"]) {
        assert.equal(gun[alan].trim().length > 0, true, `gün ${gun.n} ${alan}`);
      }
      assert.equal(gun.uygulama.length < 1200, true, `gün ${gun.n} uygulama çok uzun`);
      if (gun.ornek) {
        assert.equal(gun.ornek.split("\n").length <= 16, true, `gün ${gun.n} örnek`);
      }
    }
  });

  it("ilk gün mevcut not defterine bağlı", () => {
    assert.match(seri.gunler[0].uygulama, /src\/day-01\/notes\.js/);
    assert.match(seri.gunler[0].bitti, /npm run day/);
  });

  it("çalışma sayfası bu müfredatı gömülü taşır", async () => {
    const html = await readFile(new URL("../calisma/index.html", import.meta.url), "utf8");
    assert.match(html, /19 Ekim 2026 pazartesi/);
    assert.match(html, /3 Nisan 2027 cumartesi/);
    assert.match(html, /globalThis\.SERI/);
    for (const gun of seri.gunler) {
      assert.equal(html.includes(gun.konu), true, gun.konu);
    }
  });
});
