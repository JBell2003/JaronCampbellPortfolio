// Handle sticky header state on scroll
const header = document.querySelector(".site-header");
const onScroll = () => {
  if (!header) return;
  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
};
window.addEventListener("scroll", onScroll);
onScroll();

// Smooth scroll for CTA button using data-scroll-to
document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const targetSelector = btn.getAttribute("data-scroll-to");
    const target = targetSelector && document.querySelector(targetSelector);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Mobile navigation toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

// Intersection Observer for fade-in sections and cards
const observed = document.querySelectorAll(".observe");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      }
    },
    {
      threshold: 0.18,
    }
  );

  observed.forEach((el) => io.observe(el));
} else {
  // Fallback: show all immediately
  observed.forEach((el) => el.classList.add("in-view"));
}

// Current year in footer
const yearSpan = document.getElementById("current-year");
if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

// Video modal for embedded media
const videoModal = document.getElementById("video-modal");
const videoIframe = videoModal?.querySelector("iframe");
const modalCloseEls = videoModal?.querySelectorAll("[data-video-close]") ?? [];

function openVideoModal(src) {
  if (!videoModal || !videoIframe) return;
  videoIframe.src = src;
  videoModal.classList.add("open");
  videoModal.setAttribute("aria-hidden", "false");
}

function closeVideoModal() {
  if (!videoModal || !videoIframe) return;
  videoIframe.src = "";
  videoModal.classList.remove("open");
  videoModal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".card-cta[data-video-src]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-video-src");
    if (!src) return;
    openVideoModal(src);
  });
});

modalCloseEls.forEach((el) => {
  el.addEventListener("click", () => {
    closeVideoModal();
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeVideoModal();
  }
});

