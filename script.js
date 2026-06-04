document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
const progress = document.querySelector("[data-progress]");
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

const revealTargets = document.querySelectorAll(
  ".scene-inner > *, .gpc-marquee, .story-intro, .story-chapter-inner, .bar-content > *, .events-grid > *, .sponsors-head, .sponsor-marquee, .location-grid > *, .contact-grid > *"
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

const storySection = document.querySelector("[data-story-section]");
const storySteps = document.querySelectorAll("[data-story-step]");
const storyCurrent = document.querySelector("[data-story-current]");

if (storySection && storySteps.length) {
  const setStory = (step) => {
    storySteps.forEach((item) => item.classList.toggle("is-active", item === step));
    storySection.dataset.activeStory = step.dataset.storyStep;
    if (storyCurrent) storyCurrent.textContent = step.dataset.storyNumber || "01";
  };

  const updateStory = () => {
    const anchor = window.innerHeight * 0.52;
    let activeStep = storySteps[0];
    let activeDistance = Number.POSITIVE_INFINITY;

    storySteps.forEach((step) => {
      const rect = step.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height * 0.5 - anchor);
      if (distance < activeDistance) {
        activeStep = step;
        activeDistance = distance;
      }
    });

    const storyRect = storySection.getBoundingClientRect();
    const shift = Math.max(-120, Math.min(120, storyRect.top * -0.08));
    storySection.style.setProperty("--story-shift", `${shift.toFixed(1)}px`);
    setStory(activeStep);
  };

  updateStory();
  window.addEventListener("scroll", updateStory, { passive: true });
  window.addEventListener("resize", updateStory);
}
