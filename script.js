/* =========================================
   CURRENT YEAR
========================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* =========================================
   GOOGLE APPS SCRIPT URL
========================================= */

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwixSoZPN0pXI3TlN3Ss4VRSWpnmAPAd3lZG1VvDhFt1WWrbibUAPQeudLtayxJckhAoA/exec";


/* =========================================
   MOBILE SIDE NAVIGATION
========================================= */

const menuToggle = document.querySelector(".menu-toggle");
const menuClose = document.querySelector(".menu-close");
const navigation = document.querySelector(".nav-links");
const navOverlay = document.querySelector(".nav-overlay");
const navigationLinks = document.querySelectorAll(".nav-links a");


function openMobileMenu() {
  if (!navigation) {
    return;
  }

  navigation.classList.add("open");
  document.body.classList.add("nav-open");

  if (navOverlay) {
    navOverlay.classList.add("visible");
  }

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "true");
  }
}


function closeMobileMenu() {
  if (!navigation) {
    return;
  }

  navigation.classList.remove("open");
  document.body.classList.remove("nav-open");

  if (navOverlay) {
    navOverlay.classList.remove("visible");
  }

  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
  }
}


if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navigation?.classList.contains("open");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}


if (menuClose) {
  menuClose.addEventListener("click", closeMobileMenu);
}


if (navOverlay) {
  navOverlay.addEventListener("click", closeMobileMenu);
}


navigationLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});


document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});


window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMobileMenu();
  }
});


/* =========================================
   SMOOTH SCROLLING
========================================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const targetElement = document.querySelector(targetId);

    if (!targetElement) {
      return;
    }

    event.preventDefault();

    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.offsetHeight : 0;

    const targetPosition =
      targetElement.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      12;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  });
});


/* =========================================
   LANGUAGE SWITCHER
========================================= */

let currentLanguage =
  localStorage.getItem("preferredLanguage") || "en";

const languageButtons = document.querySelectorAll(".lang-btn");


function updateLanguage(language) {
  currentLanguage = language;

  document.documentElement.lang =
    language === "th" ? "th" : "en";

  localStorage.setItem(
    "preferredLanguage",
    language
  );

  document.querySelectorAll("[data-en][data-th]").forEach((element) => {
    const translatedText = element.dataset[language];

    if (translatedText !== undefined) {
      element.textContent = translatedText;
    }
  });

  document
    .querySelectorAll("[data-placeholder-en][data-placeholder-th]")
    .forEach((element) => {
      const translatedPlaceholder =
        language === "th"
          ? element.dataset.placeholderTh
          : element.dataset.placeholderEn;

      if (translatedPlaceholder !== undefined) {
        element.placeholder = translatedPlaceholder;
      }
    });

  languageButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.lang === language
    );
  });
}


languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateLanguage(button.dataset.lang);
  });
});


/* =========================================
   ROTATING HERO WORD
========================================= */

const rotatingWord =
  document.getElementById("rotatingWord");

const rotatingWords = {
  en: [
    "real life.",
    "university.",
    "your career.",
    "more confidence."
  ],

  th: [
    "ชีวิตจริง",
    "มหาวิทยาลัย",
    "การทำงาน",
    "ความมั่นใจ"
  ]
};

let wordIndex = 0;


function changeRotatingWord() {
  if (!rotatingWord) {
    return;
  }

  const availableWords =
    rotatingWords[currentLanguage] || rotatingWords.en;

  wordIndex =
    (wordIndex + 1) % availableWords.length;

  rotatingWord.animate(
    [
      {
        opacity: 0,
        transform: "translateY(8px)"
      },
      {
        opacity: 1,
        transform: "translateY(0)"
      }
    ],
    {
      duration: 400
    }
  );

  rotatingWord.textContent =
    availableWords[wordIndex];
}


if (rotatingWord) {
  setInterval(changeRotatingWord, 2500);
}


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
  document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {
  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}


/* =========================================
   PROFILE CARD TILT
========================================= */

const tiltCard =
  document.querySelector(".tilt-card");


if (
  tiltCard &&
  window.matchMedia("(pointer: fine)").matches
) {
  tiltCard.addEventListener("mousemove", (event) => {
    const cardRect =
      tiltCard.getBoundingClientRect();

    const horizontalPosition =
      (event.clientX - cardRect.left) /
        cardRect.width -
      0.5;

    const verticalPosition =
      (event.clientY - cardRect.top) /
        cardRect.height -
      0.5;

    const rotateX =
      verticalPosition * -8;

    const rotateY =
      horizontalPosition * 8;

    tiltCard.style.transform =
      `perspective(900px)
       rotateX(${rotateX}deg)
       rotateY(${rotateY}deg)`;
  });

  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
}


/* =========================================
   FAQ ACCORDION
========================================= */

document
  .querySelectorAll(".faq-question")
  .forEach((questionButton) => {
    questionButton.addEventListener("click", () => {
      const faqItem =
        questionButton.closest(".faq-item");

      if (!faqItem) {
        return;
      }

      const faqAnswer =
        faqItem.querySelector(".faq-answer");

      const faqIcon =
        questionButton.querySelector(".faq-icon");

      const isOpen =
        questionButton.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".faq-item").forEach((item) => {
        if (item === faqItem) {
          return;
        }

        const otherButton =
          item.querySelector(".faq-question");

        const otherAnswer =
          item.querySelector(".faq-answer");

        const otherIcon =
          item.querySelector(".faq-icon");

        if (otherButton) {
          otherButton.setAttribute(
            "aria-expanded",
            "false"
          );
        }

        if (otherAnswer) {
          otherAnswer.style.maxHeight = null;
        }

        if (otherIcon) {
          otherIcon.textContent = "+";
        }

        item.classList.remove("open");
      });

      questionButton.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      faqItem.classList.toggle(
        "open",
        !isOpen
      );

      if (faqAnswer) {
        faqAnswer.style.maxHeight =
          !isOpen
            ? `${faqAnswer.scrollHeight}px`
            : null;
      }

      if (faqIcon) {
        faqIcon.textContent =
          !isOpen ? "−" : "+";
      }
    });
  });


/* =========================================
   FORM SUBMISSION
========================================= */

const lessonForm =
  document.getElementById("lessonForm") ||
  document.getElementById("inquiryForm");


if (lessonForm) {
  const submitButton =
    lessonForm.querySelector(
      'button[type="submit"]'
    );

  lessonForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      if (!submitButton) {
        return;
      }

      const originalButtonText =
        submitButton.textContent;

      submitButton.disabled = true;

      submitButton.textContent =
        currentLanguage === "th"
          ? "กำลังส่ง..."
          : "Sending inquiry...";

      const formData =
        new FormData(lessonForm);

      const submissionData = {};

      formData.forEach((value, key) => {
        if (submissionData[key]) {
          submissionData[key] =
            `${submissionData[key]}, ${value}`;
        } else {
          submissionData[key] = value;
        }
      });

      submissionData.websiteLanguage =
        currentLanguage;

      submissionData.submittedAt =
        new Date().toISOString();

      try {
        await fetch(
          GOOGLE_SCRIPT_URL,
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type":
                "text/plain;charset=utf-8"
            },
            body: JSON.stringify(
              submissionData
            )
          }
        );

        lessonForm.reset();

        alert(
          currentLanguage === "th"
            ? "ส่งข้อมูลเรียบร้อยแล้ว มาร์คจะติดต่อกลับโดยเร็วที่สุดครับ"
            : "Thank you! Your learning inquiry has been submitted."
        );
      } catch (error) {
        console.error(
          "Form submission error:",
          error
        );

        alert(
          currentLanguage === "th"
            ? "ไม่สามารถส่งข้อมูลได้ กรุณาลองอีกครั้ง"
            : "The inquiry could not be submitted. Please try again."
        );
      } finally {
        submitButton.disabled = false;
        submitButton.textContent =
          originalButtonText;
      }
    }
  );
}


/* =========================================
   INITIAL PAGE LANGUAGE
========================================= */

updateLanguage(currentLanguage);
