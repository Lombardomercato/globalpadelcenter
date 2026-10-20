document.documentElement.classList.add("js");

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


// Prepare the message locally. Opening WhatsApp is not a received lead.
const inquiryLabels = { nombre: "Nombre", telefono: "WhatsApp", servicio: "Interés", email: "Email", tipo_evento: "Tipo de evento", personas: "Personas aproximadas", fecha: "Fecha estimada", horario: "Horario", gastronomia: "Gastronomía", mensaje: "Mensaje" };
const localToday = () => {
 const now = new Date();
 return [now.getFullYear(), String(now.getMonth()+1).padStart(2,"0"), String(now.getDate()).padStart(2,"0")].join("-");
};
document.querySelectorAll("[data-inquiry-form]").forEach(form => {
 const status = form.querySelector(".form-status");
 const phone = form.elements.namedItem("telefono");
 const date = form.elements.namedItem("fecha");
 if (date) date.min = localToday();
 let started = false;
 form.addEventListener("input", () => {
  if (!started) {
   started = true;
   window.gpcMeasure?.("inquiry_form_start", { form_location: form.dataset.formLocation, service: form.elements.namedItem("servicio")?.value || "general" });
  }
  phone.setCustomValidity("");
  status.replaceChildren();
 });
 form.addEventListener("submit", event => {
  event.preventDefault();
  if (date) date.min = localToday();
  const digits = phone.value.replace(/\D/g, "");
  phone.setCustomValidity(digits.length < 6 || digits.length > 15 ? "Ingresá un teléfono válido con código de área." : "");
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const lines = ["Hola Global Padel Center, quiero hacer una consulta."];
  for (const [name, value] of data) {
   const text = String(value).trim();
   if (text && inquiryLabels[name]) lines.push(inquiryLabels[name] + ": " + text);
  }
  const url = "https://wa.me/543417560704?text=" + encodeURIComponent(lines.join("\n"));
  const continuation = document.createElement("a");
  continuation.href = url;
  continuation.target = "_blank";
  continuation.rel = "noopener noreferrer";
  continuation.textContent = "Abrir mi consulta en WhatsApp";
  status.append("Se preparó tu consulta. Revisala y enviala en WhatsApp. Si no se abre, ", continuation, ".");
  window.gpcMeasure?.("inquiry_whatsapp_open", { form_location: form.dataset.formLocation, service: data.get("servicio") || "general" });
  const opened = window.open(url, "_blank");
  if (opened) opened.opener = null;
 });
 form.querySelector("fieldset").disabled = false;
});
