/* ============================================================
   ✏️  PERSONALIZA ESTO (es lo único que necesitas cambiar aquí)
   ============================================================ */
const CONFIG = {
  esposa: "mi amor",           // Cómo le dices: "Maria", "mi vida", "mi amor"...
  firma: "Tu esposo, Ali Gerardo, tu coco!",          // Cómo firmas la carta
  fechaInicio: "2018-10-12",   // Fecha del aniversario (AAAA-MM-DD)
};

/* ============================================================
   Código de la página
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- Rellenar nombres ---
  document.querySelectorAll("[data-fill]").forEach((el) => {
    el.textContent = CONFIG[el.dataset.fill] || "";
  });

  // --- Fecha y contador de días ---
  const start = new Date(CONFIG.fechaInicio + "T00:00:00");
  const dateText = document.getElementById("startDateText");
  const daysEl = document.getElementById("daysCount");

  if (!isNaN(start)) {
    dateText.textContent = start.toLocaleDateString("es", {
      day: "numeric", month: "long", year: "numeric",
    });
  }

  function totalDays() {
    const diff = Date.now() - start.getTime();
    return isNaN(diff) ? 0 : Math.max(0, Math.floor(diff / 86400000));
  }

  // Años cumplidos + días sobrantes desde el último aniversario
  function yearsAndDays() {
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    const lastAnniv = new Date(start);
    lastAnniv.setFullYear(start.getFullYear() + years);
    if (lastAnniv > now) {
      years--;
      lastAnniv.setFullYear(start.getFullYear() + years);
    }
    const days = Math.floor((now - lastAnniv) / 86400000);
    return { years: Math.max(0, years), days: Math.max(0, days) };
  }

  if (!isNaN(start)) {
    const { years, days } = yearsAndDays();
    document.getElementById("yearsNum").textContent = years;
    document.getElementById("yearsWord").textContent = years === 1 ? "año" : "años";
    document.getElementById("yearsDaysText").textContent =
      "Es decir, " + years + (years === 1 ? " año" : " años") +
      (days > 0 ? " y " + days + (days === 1 ? " día" : " días") : "") + " de amor.";
  }

  function animateCounter(target) {
    if (reduceMotion || target === 0) {
      daysEl.textContent = target.toLocaleString("es");
      return;
    }
    const duration = 2200;
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      daysEl.textContent = Math.round(target * eased).toLocaleString("es");
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  // --- Corazones flotantes ---
  const heartsLayer = document.getElementById("hearts");

  function spawnHeart(x) {
    if (reduceMotion) return;
    const h = document.createElement("span");
    h.className = "heart";
    h.textContent = "♥";
    h.style.left = (x !== undefined ? x : Math.random() * 100) + "vw";
    h.style.fontSize = 34 + Math.random() * 46 + "px";
    const dur = 7 + Math.random() * 6;
    h.style.animationDuration = dur + "s";
    heartsLayer.appendChild(h);
    setTimeout(() => h.remove(), dur * 1000);
  }

  setInterval(spawnHeart, 900);

  // --- Abrir el sobre ---
  const envelope = document.getElementById("envelope");
  const intro = document.getElementById("intro");
  const letter = document.getElementById("letter");
  let opened = false;

  envelope.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    envelope.classList.add("is-open");
    for (let i = 0; i < 8; i++) setTimeout(() => spawnHeart(), i * 80);

    setTimeout(() => intro.classList.add("is-leaving"), 1300);

    setTimeout(() => {
      intro.hidden = true;
      letter.hidden = false;
      window.scrollTo(0, 0);
      setupReveal();
      animateCounter(totalDays());
    }, 2100);
  });

  // --- Aparecer al hacer scroll ---
  function setupReveal() {
    const items = letter.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach((el) => io.observe(el));
  }

  // --- Botón final: lluvia de corazones ---
  document.getElementById("burst").addEventListener("click", () => {
    for (let i = 0; i < 30; i++) setTimeout(() => spawnHeart(), i * 70);
  });
})();
