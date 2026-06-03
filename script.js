document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
const progress = document.querySelector("[data-progress]");
const contactForm = document.querySelector("[data-contact-form]");
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
  ".scene-inner > *, .story-sticky, .story-steps article, .experience-head, .gallery-shot, .manifest-sticky, .manifest-copy p, .manifest-codes, .bar-content > *, .events-grid > *, .sponsors-head, .sponsor-marquee, .location-grid > *, .contact-grid > *"
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

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 3}deg`);
    card.style.setProperty("--tilt-x", `${(0.5 - y) * 3}deg`);
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const nombre = String(data.get("nombre") || "").trim();
  const motivo = String(data.get("motivo") || "").trim();
  const mensaje = String(data.get("mensaje") || "").trim();
  const text = [
    "Hola Global Padel Center, quiero hacer una consulta.",
    nombre ? `Nombre: ${nombre}` : "",
    motivo ? `Motivo: ${motivo}` : "",
    mensaje ? `Mensaje: ${mensaje}` : ""
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/543417560704?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
});
