document.documentElement.classList.add("js");

const fontVariant = new URLSearchParams(window.location.search).get("font");
document.documentElement.classList.toggle("font-test-bounded", fontVariant === "bounded");

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
const progress = document.querySelector("[data-progress]");
const mapEnableButton = document.querySelector("[data-map-enable]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateScrollState = () => {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const ratio = window.scrollY / max;

  header?.classList.toggle("is-scrolled", window.scrollY > 18);
  progress?.style.setProperty("transform", `scaleX(${ratio})`);

  if (!reducedMotion) {
    document.querySelectorAll("[data-parallax]").forEach((element) => {
      const rect = element.parentElement.getBoundingClientRect();
      const offset = (rect.top - window.innerHeight * 0.5) * -0.045;
      element.style.setProperty("--parallax", `${offset.toFixed(2)}px`);
    });
  }
};

updateScrollState();
window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);

menuButton?.addEventListener("click", () => {
  const isOpen = menu?.classList.toggle("is-open") ?? false;
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

mapEnableButton?.addEventListener("click", () => {
  mapEnableButton.closest(".map-wrap")?.classList.add("is-map-active");
});

const lazyBackgroundTargets = document.querySelectorAll(
  ".story-chapter, .bar-story, .events-tournaments, .gallery-photo, .scene-final"
);

if ("IntersectionObserver" in window) {
  const backgroundObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-bg-loaded");
        backgroundObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "700px 0px" }
  );

  lazyBackgroundTargets.forEach((element) => backgroundObserver.observe(element));
} else {
  lazyBackgroundTargets.forEach((element) => element.classList.add("is-bg-loaded"));
}

const revealTargets = document.querySelectorAll(
  ".scene-inner > *, .gpc-marquee, .story-intro, .story-chapter-inner, .gallery-head, .gallery-photo, .bar-content > *, .events-grid > *, .sponsors-head, .sponsor-marquee, .location-grid > *, .contact-grid > *"
);

revealTargets.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty("--delay", `${Math.min(index * 55, 330)}ms`);
});

if (reducedMotion) {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((element) => observer.observe(element));
}
