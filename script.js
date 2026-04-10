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

function isIOS() {
  // iPadOS can identify as Mac; touch points help distinguish.
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/** Build a /view link from a Drive /preview URL so embed failures still have a working fallback. */
function driveViewUrlFromPreview(previewUrl) {
  if (!previewUrl || !previewUrl.includes("drive.google.com")) return null;
  const match = previewUrl.match(/\/file\/d\/([^/]+)/);
  if (!match) return null;
  return `https://drive.google.com/file/d/${match[1]}/view?usp=sharing`;
}

function openVideoModal(src, options = {}) {
  if (!videoModal || !videoIframe) return;
  videoIframe.src = src;

  const driveFooter = document.getElementById("video-modal-drive-footer");
  const driveLink = document.getElementById("video-modal-external");
  const driveExternalUrl = options.driveExternalUrl || null;

  if (driveFooter && driveLink && driveExternalUrl) {
    driveLink.href = driveExternalUrl;
    driveFooter.hidden = false;
  } else if (driveFooter) {
    driveFooter.hidden = true;
  }

  videoModal.classList.add("open");
  videoModal.setAttribute("aria-hidden", "false");
}

function closeVideoModal() {
  if (!videoModal || !videoIframe) return;
  videoIframe.src = "";
  const driveFooter = document.getElementById("video-modal-drive-footer");
  if (driveFooter) driveFooter.hidden = true;
  videoModal.classList.remove("open");
  videoModal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".card-cta[data-video-src]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-video-src");
    if (!src) return;
    const fallbackHref = btn.getAttribute("data-fallback-href");

    const isDriveEmbed = src.includes("drive.google.com");
    const driveViewUrl =
      fallbackHref || (isDriveEmbed ? driveViewUrlFromPreview(src) : null);

    // Mobile Safari often blocks cross-site iframe embeds (Google Drive preview),
    // which can produce a Google 400 error. In that case, open the Drive viewer instead.
    if (isIOS() && isDriveEmbed && driveViewUrl) {
      window.location.href = driveViewUrl;
      return;
    }

    // For Google Drive: always pass a view URL so the modal can show "Open in Google Drive"
    // when the embedded player fails (network, permissions, or browser blocking).
    openVideoModal(src, {
      driveExternalUrl: isDriveEmbed ? driveViewUrl : null,
    });
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

