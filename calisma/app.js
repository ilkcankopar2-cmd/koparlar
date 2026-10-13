(function () {
  const seri = globalThis.SERI;
  if (!seri) {
    document.body.textContent = "Müfredat yüklenmedi.";
    return;
  }

  const BITTI = "js-seri-bitti";
  const TEMA = "js-seri-tema";
  const SAAT = "js-seri-saat";
  const ekran = document.querySelector("#ekran");
  const baslik = document.querySelector("#baslik");
  const nav = document.querySelector(".alt");

  const tema = localStorage.getItem(TEMA) || "sistem";
  document.documentElement.dataset.tema = tema;

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[ch]);
  }

  function yerelIso(date = new Date()) {
    const kaydir = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return kaydir.toISOString().slice(0, 10);
  }

  function bittiOku() {
    try {
      return JSON.parse(localStorage.getItem(BITTI) || "{}");
    } catch {
      return {};
    }
  }

  function bittiYaz(map) {
    localStorage.setItem(BITTI, JSON.stringify(map));
  }

  function saatBaslangic() {
    return {
      faz: 0,
      kalanMs: seri.bloklar[0].dk * 60000,
      calisiyor: false,
      bitis: null,
      bitti: false,
    };
  }

  function saatOku() {
    try {
      const ham = JSON.parse(sessionStorage.getItem(SAAT) || "null");
      if (!ham || !Number.isFinite(ham.faz)) return saatBaslangic();
      return ham;
    } catch {
      return saatBaslangic();
    }
  }

  function saatYaz(saat) {
    sessionStorage.setItem(SAAT, JSON.stringify(saat));
  }

  function tick() {
    const saat = saatOku();
    if (!saat.calisiyor || saat.bitti) return saat;
    let kalan = saat.bitis - Date.now();
    let faz = saat.faz;
    let titret = false;
    while (kalan <= 0 && faz < seri.bloklar.length - 1) {
      faz += 1;
      kalan += seri.bloklar[faz].dk * 60000;
      titret = true;
    }
    if (titret && navigator.vibrate) navigator.vibrate(40);
    if (kalan <= 0) {
      const bitti = { faz: seri.bloklar.length - 1, kalanMs: 0, calisiyor: false, bitis: null, bitti: true };
      saatYaz(bitti);
      return bitti;
    }
    const sonraki = { faz, kalanMs: kalan, calisiyor: true, bitis: Date.now() + kalan, bitti: false };
    saatYaz(sonraki);
    return sonraki;
  }

  function sureYazi(ms) {
    const toplam = Math.max(0, Math.ceil(ms / 1000));
    const dakika = String(Math.floor(toplam / 60)).padStart(2, "0");
    const saniye = String(toplam % 60).padStart(2, "0");
    return `${dakika}:${saniye}`;
  }

  function bugun() {
    return yerelIso();
  }

  function gunBul(n) {
    return seri.gunler.find((gun) => gun.n === Number(n));
  }

  function takvimGunu() {
    return seri.gunler.find((gun) => gun.tarih === bugun()) || null;
  }

  function seciliNo() {
    const hash = location.hash;
    const ders = hash.match(/^#\/ders\/(\d+)$/);
    if (ders) return Number(ders[1]);
    const takvim = takvimGunu();
    if (takvim) return takvim.n;
    if (bugun() > seri.meta.bitis) return 144;
    return 1;
  }

  function durum(gun) {
    if (bittiOku()[gun.n]) return "bitti";
    if (gun.tarih === bugun()) return "bugun";
    if (gun.tarih < bugun()) return "kacti";
    return "gelecek";
  }

  function durumYazi(kod) {
    if (kod === "bitti") return "bitti";
    if (kod === "bugun") return "bugün";
    if (kod === "kacti") return "kaçtı";
    return "";
  }

  function paragraflar(metin) {
    return metin
      .split(/\n+/)
      .filter((satir) => satir.trim())
      .map((satir) => `<p>${esc(satir)}</p>`)
      .join("");
  }

  function saatKutusu() {
    const saat = tick();
    const blok = seri.bloklar[saat.faz];
    const etiket = saat.bitti ? "3 saat doldu" : blok.ad;
    const yazi = saat.bitti ? "Günün süresi bitti. Bitiş şartına bak." : blok.yazi;
    const dugme = saat.calisiyor ? "Duraklat" : "Başlat";
    return `<section class="saat" aria-label="Günün süresi">
      <div class="saat-ust">
        <p class="faz" data-faz>${esc(etiket)}</p>
        <p class="sure" data-sure>${sureYazi(saat.kalanMs)}</p>
      </div>
      <p class="faz-yazi" data-faz-yazi>${esc(yazi)}</p>
      <div class="saat-dugmeler">
        <button type="button" data-eylem="baslat" data-baslat>${dugme}</button>
        <button type="button" data-eylem="sifirla" class="ikincil">Sıfırla</button>
      </div>
    </section>`;
  }

  function sayilar() {
    const meta = seri.meta;
    return `<dl class="sayilar">
      <div><dt>Günde</dt><dd>3 saat</dd></div>
      <div><dt>Bitiş</dt><dd>3 Nisan 2027</dd></div>
      <div><dt>Toplam</dt><dd>432 saat</dd></div>
    </dl>
    <p class="genis">${esc(meta.baslangicYazi)} başlar. ${esc(meta.bitisYazi)} biter. 24 hafta, 144 gün. Pazartesi–cumartesi, pazar yok.</p>`;
  }

  function ekranBugun() {
    const iso = bugun();
    const meta = seri.meta;
    baslik.textContent = "Bugün";
    if (iso < meta.baslangic) {
      ekran.innerHTML = `${sayilar()}
        <p>Takvim ${esc(meta.baslangicYazi)} işler. İstersen gün 1'i bugünden oku. Kaçırılan gün, başlayınca üst üste binmez.</p>
        <button type="button" class="tam" data-eylem="gun" data-n="1">Gün 1'i aç</button>
        <h2>İlk hafta</h2>
        ${haftaListesi(1)}`;
      return;
    }
    if (iso > meta.bitis) {
      const sayi = Object.keys(bittiOku()).length;
      ekran.innerHTML = `${sayilar()}
        <p>Seri bitti. İşaretlediğin gün: ${sayi} / 144.</p>
        <button type="button" class="tam" data-eylem="gun" data-n="144">Son günü aç</button>`;
      return;
    }
    const gun = takvimGunu();
    if (!gun) {
      const yarin = seri.gunler.find((aday) => aday.tarih > iso);
      baslik.textContent = "Pazar";
      ekran.innerHTML = `<p>Bugün pazar. Seri durur.</p>
        <p>Yarın gün ${yarin.n}: ${esc(yarin.konu)}</p>
        <button type="button" class="tam" data-eylem="gun" data-n="${yarin.n}">Yarının dersini aç</button>`;
      return;
    }
    const kac = seri.gunler.filter((aday) => durum(aday) === "kacti").length;
    const kacYazi = kac ? `<p class="kacak">${kac} gün kaçtı. Ekleme. Bugünün konusu aşağıda.</p>` : "";
    ekran.innerHTML = `${saatKutusu()}
      <p class="kicker">Gün ${gun.n} · Hafta ${gun.hafta} · ${esc(gun.tarihYazi)}</p>
      <h2>${esc(gun.konu)}</h2>
      ${kacYazi}
      ${paragraflar(gun.ozet)}
      <button type="button" class="tam" data-eylem="gun" data-n="${gun.n}">Dersin tamamı</button>`;
  }

  function ekranDers(n) {
    const gun = gunBul(n) || gunBul(1);
    const hafta = seri.haftalar[gun.hafta - 1];
    const kod = durum(gun);
    baslik.textContent = `Gün ${gun.n}`;
    const ornek = gun.ornek ? `<h2>Kısa örnek</h2><pre>${esc(gun.ornek)}</pre>` : "";
    const onceki = gun.n > 1 ? `<button type="button" data-eylem="gun" data-n="${gun.n - 1}">Önceki</button>` : "";
    const sonraki = gun.n < 144 ? `<button type="button" data-eylem="gun" data-n="${gun.n + 1}">Sonraki</button>` : "";
    const bitti = kod === "bitti";
    ekran.innerHTML = `${saatKutusu()}
      <p class="kicker">Hafta ${hafta.n} · ${esc(hafta.ad)} · ${esc(gun.tarihYazi)}</p>
      <h2>${esc(gun.konu)}</h2>
      <p class="durum ${kod}">${durumYazi(kod)}</p>
      <h2>Kavram</h2>
      ${paragraflar(gun.ozet)}
      ${paragraflar(gun.ayrinti)}
      ${ornek}
      <h2>Uygulama</h2>
      ${paragraflar(gun.uygulama)}
      <h2>Bitti sayılır</h2>
      <p>${esc(gun.bitti)}</p>
      <button type="button" class="tam" data-eylem="bitti" data-n="${gun.n}">${bitti ? "İşareti kaldır" : "Bugün bitti"}</button>
      <div class="yan">${onceki}${sonraki}</div>`;
  }

  function haftaListesi(haftaNo) {
    const hafta = seri.haftalar[haftaNo - 1];
    const maddeler = hafta.gunler
      .map((n) => {
        const gun = gunBul(n);
        const kod = durum(gun);
        return `<li>
          <button type="button" data-eylem="gun" data-n="${gun.n}">
            <span class="gun-no">${gun.haftaninGunu}</span>
            <span class="gun-konu">${esc(gun.konu)}</span>
            <span class="durum ${kod}">${durumYazi(kod)}</span>
          </button>
        </li>`;
      })
      .join("");
    return `<p>${esc(hafta.amac)}</p><ol class="gunler">${maddeler}</ol>`;
  }

  function ekranMufredat() {
    baslik.textContent = "Müfredat";
    const sayi = Object.keys(bittiOku()).length;
    const acik = takvimGunu()?.hafta || 1;
    const bloklar = seri.haftalar
      .map((hafta) => {
        const ac = hafta.n === acik ? " open" : "";
        return `<details${ac}>
          <summary>
            <span>Hafta ${hafta.n}</span>
            <strong>${esc(hafta.ad)}</strong>
            <span class="ozet-tarih">${esc(hafta.baslangicYazi)}</span>
          </summary>
          ${haftaListesi(hafta.n)}
        </details>`;
      })
      .join("");
    ekran.innerHTML = `<p>${sayi} / 144 işaretli. ${esc(seri.meta.baslangicYazi)} – ${esc(seri.meta.bitisYazi)}.</p>
      <div class="cubuk" aria-hidden="true"><span style="width:${(sayi / 144) * 100}%"></span></div>
      <div class="haftalar">${bloklar}</div>`;
  }

  function ekranDuzen() {
    baslik.textContent = "Düzen";
    const temaSimdi = document.documentElement.dataset.tema;
    ekran.innerHTML = `${sayilar()}
      <h2>Üç saat nasıl bölünür</h2>
      <ol class="bloklar">
        ${seri.bloklar
          .map((blok) => `<li><strong>${blok.dk} dk</strong> ${esc(blok.ad)}. ${esc(blok.yazi)}</li>`)
          .join("")}
      </ol>
      <h2>Tablet</h2>
      <p>Sayfayı dikey tut. Satır kısa kalsın.</p>
      <p>Kod bloğu 70 dakikadır. Cam klavye yetmez. Bluetooth klavye bağla.</p>
      <p>Node 20 bu depoda çalışır. Tablet Node çalıştırmıyorsa tabletin tarayıcısında bir bulut ortam aç; test orada koşar. Gün 1 komutu npm run day.</p>
      <p>Docker 32. günde, Node'un çalıştığı yerdedir. Tablete Docker kurma.</p>
      <h2>Kaçırılan gün</h2>
      <p>Ertelenmez. Ertesi gün bir sonraki konudur. Aynı günü iki kez yapmak serbest; sıradaki günü biriktirmek değil.</p>
      <h2>İşaret</h2>
      <p>Bitti işareti bu tarayıcıda durur. Başka cihaza geçmez. Çözüm depoda yok. Bitiş şartı sözleşmedir.</p>
      <h2>Görünüm</h2>
      <div class="yan">
        <button type="button" data-eylem="tema" data-tema="acik" ${temaSimdi === "acik" ? "aria-pressed=\"true\"" : ""}>Açık</button>
        <button type="button" data-eylem="tema" data-tema="koyu" ${temaSimdi === "koyu" ? "aria-pressed=\"true\"" : ""}>Koyu</button>
        <button type="button" data-eylem="tema" data-tema="sistem" ${temaSimdi === "sistem" ? "aria-pressed=\"true\"" : ""}>Sistem</button>
      </div>`;
  }

  function ciz() {
    const hash = location.hash || "#/bugun";
    const ders = hash.match(/^#\/ders\/(\d+)$/);
    let bolum = "bugun";
    if (ders) {
      bolum = "ders";
      ekranDers(ders[1]);
    } else if (hash.startsWith("#/mufredat")) {
      bolum = "mufredat";
      ekranMufredat();
    } else if (hash.startsWith("#/duzen")) {
      bolum = "duzen";
      ekranDuzen();
    } else if (hash.startsWith("#/ders")) {
      bolum = "ders";
      ekranDers(seciliNo());
    } else {
      ekranBugun();
    }
    for (const dugme of nav.querySelectorAll("button")) {
      dugme.setAttribute("aria-current", dugme.dataset.git === bolum ? "page" : "false");
    }
    saatCiz();
    baslik.focus({ preventScroll: true });
  }

  function saatCiz() {
    const saat = tick();
    const sure = ekran.querySelector("[data-sure]");
    if (!sure) return;
    const blok = seri.bloklar[saat.faz];
    sure.textContent = sureYazi(saat.kalanMs);
    ekran.querySelector("[data-faz]").textContent = saat.bitti ? "3 saat doldu" : blok.ad;
    ekran.querySelector("[data-faz-yazi]").textContent = saat.bitti
      ? "Günün süresi bitti. Bitiş şartına bak."
      : blok.yazi;
    ekran.querySelector("[data-baslat]").textContent = saat.calisiyor ? "Duraklat" : "Başlat";
  }

  nav.addEventListener("click", (event) => {
    const git = event.target.closest("button")?.dataset.git;
    if (!git) return;
    if (git === "ders") {
      location.hash = `#/ders/${seciliNo()}`;
      return;
    }
    location.hash = `#/${git}`;
  });

  document.body.addEventListener("click", (event) => {
    const hedef = event.target.closest("[data-eylem]");
    if (!hedef) return;
    const eylem = hedef.dataset.eylem;
    if (eylem === "gun") {
      location.hash = `#/ders/${hedef.dataset.n}`;
      return;
    }
    if (eylem === "baslat") {
      const saat = tick();
      if (saat.bitti) return;
      if (saat.calisiyor) {
        saatYaz({
          faz: saat.faz,
          kalanMs: Math.max(0, saat.bitis - Date.now()),
          calisiyor: false,
          bitis: null,
          bitti: false,
        });
      } else {
        saatYaz({
          faz: saat.faz,
          kalanMs: saat.kalanMs,
          calisiyor: true,
          bitis: Date.now() + saat.kalanMs,
          bitti: false,
        });
      }
      saatCiz();
      return;
    }
    if (eylem === "sifirla") {
      if (!window.confirm("Süreyi başa almak istiyor musun?")) return;
      saatYaz(saatBaslangic());
      saatCiz();
      return;
    }
    if (eylem === "bitti") {
      const map = bittiOku();
      const n = String(hedef.dataset.n);
      if (map[n]) delete map[n];
      else map[n] = bugun();
      bittiYaz(map);
      ciz();
      return;
    }
    if (eylem === "tema") {
      document.documentElement.dataset.tema = hedef.dataset.tema;
      localStorage.setItem(TEMA, hedef.dataset.tema);
      ciz();
    }
  });

  window.addEventListener("hashchange", () => {
    ciz();
    window.scrollTo(0, 0);
  });

  if (!location.hash) location.hash = "#/bugun";
  ciz();
  setInterval(saatCiz, 400);
})();
