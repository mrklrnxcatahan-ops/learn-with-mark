/* ============================================
   LEARN WITH MARK — JAVASCRIPT
   ============================================ */

/* --- Year --- */
document.getElementById("year").textContent = new Date().getFullYear();

/* --- Google Apps Script --- */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwixSoZPN0pXI3TlN3Ss4VRSWpnmAPAd3lZG1VvDhFt1WWrbibUAPQeudLtayxJckhAoA/exec";

/* --- Mobile Nav --- */
const toggle = document.querySelector(".menu-toggle"),
      nav = document.querySelector(".nav-links"),
      navOverlay = document.querySelector(".nav-overlay");

function openNav() {
  nav.classList.add("open");
  navOverlay.classList.add("active");
  toggle.setAttribute("aria-expanded", "true");
  toggle.setAttribute("aria-label", "Close menu");
  document.body.style.overflow = "hidden";
}

function closeNav() {
  nav.classList.remove("open");
  navOverlay.classList.remove("active");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open menu");
  document.body.style.overflow = "";
}

toggle.addEventListener("click", function () {
  nav.classList.contains("open") ? closeNav() : openNav();
});

document.querySelectorAll(".nav-links a").forEach(function (a) {
  a.addEventListener("click", closeNav);
});

navOverlay.addEventListener("click", closeNav);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && nav.classList.contains("open")) closeNav();
});

/* --- Language Switch --- */
var currentLanguage = localStorage.getItem("preferredLanguage") || "en";
var langButtons = document.querySelectorAll(".lang-btn");

function updateLanguage(lang) {
  currentLanguage = lang;
  document.documentElement.lang = lang;
  localStorage.setItem("preferredLanguage", lang);
  document.querySelectorAll("[data-en][data-th]").forEach(function (el) {
    var text = el.dataset[lang];
    if (text) el.textContent = text;
  });
  langButtons.forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

langButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    updateLanguage(btn.dataset.lang);
  });
});

/* --- Rotating Word --- */
var rotatingWord = document.getElementById("rotatingWord");
var words = {
  en: ["real life.", "university.", "your career.", "more confidence."],
  th: ["ชีวิตจริง", "มหาวิทยาลัย", "การทำงาน", "ความมั่นใจ"]
};
var wordIndex = 0;

setInterval(function () {
  if (!rotatingWord) return;
  wordIndex = (wordIndex + 1) % words[currentLanguage].length;
  rotatingWord.animate(
    [
      { opacity: 0, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    { duration: 400 }
  );
  rotatingWord.textContent = words[currentLanguage][wordIndex];
}, 2500);

/* --- Scroll Reveal --- */
var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(function (el) {
  observer.observe(el);
});

/* --- Tilt Card (desktop only) --- */
var tiltCard = document.querySelector(".tilt-card");
if (tiltCard && matchMedia("(pointer:fine)").matches) {
  tiltCard.addEventListener("mousemove", function (e) {
    var rect = tiltCard.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width - 0.5;
    var y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltCard.style.transform = "perspective(900px) rotateX(" + (-8 * y) + "deg) rotateY(" + (8 * x) + "deg)";
  });
  tiltCard.addEventListener("mouseleave", function () {
    tiltCard.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
  });
}

/* --- Form Submission --- */
var lessonForm = document.getElementById("lessonForm");
var submitButton = lessonForm.querySelector('button[type="submit"]');

lessonForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  var originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent =
    currentLanguage === "th" ? "กำลังส่ง..." : "Sending inquiry...";

  var formData = Object.fromEntries(new FormData(lessonForm).entries());
  formData.websiteLanguage = currentLanguage;

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(formData)
    });
    lessonForm.reset();
    alert(
      currentLanguage === "th"
        ? "ส่งข้อมูลเรียบร้อยแล้ว จะติดต่อกลับโดยเร็วที่สุดครับ"
        : "Thank you! Your learning inquiry has been submitted."
    );
  } catch (err) {
    console.error(err);
    alert(
      currentLanguage === "th"
        ? "ไม่สามารถส่งข้อมูลได้ กรุณาลองอีกครั้ง"
        : "The inquiry could not be submitted. Please try again."
    );
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});

/* --- Init Language --- */
updateLanguage(currentLanguage);
