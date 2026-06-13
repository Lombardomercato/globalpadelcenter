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

const storyData = [
  {
    id: "torneos",
    media: "story-media-torneos",
    category: "Torneos",
    title: "Competir nos motiva.",
    description: "Torneos internos, abiertos y especiales que hacen latir nuestra comunidad.",
    points: ["Torneos durante todo el a\u00f1o", "Distintos niveles", "Comunidad activa"],
  },
  {
    id: "clases",
    media: "story-media-clases",
    category: "Clases",
    title: "Entrenar es vivir Global.",
    description: "Clases y entrenamientos para mejorar el juego en un entorno profesional y cercano.",
    points: ["Profesores especializados", "Todos los niveles", "Evoluci\u00f3n punto por punto"],
  },
  {
    id: "after",
    media: "story-media-after",
    category: "After p\u00e1del",
    title: "Lo mejor empieza despu\u00e9s.",
    description: "Gastronom\u00eda, caf\u00e9 de especialidad y momentos que extienden el partido.",
    points: ["Bar lounge", "Caf\u00e9 de especialidad", "Tercer tiempo con amigos"],
  },
  {
    id: "comunidad",
    media: "story-media-comunidad",
    category: "Comunidad",
    title: "Personas que hacen club.",
    description: "Global se vive en la cancha, en el bar y en cada encuentro entre jugadores.",
    points: ["Ambiente social", "Encuentros y partidos", "Historias compartidas"],
  },
  {
    id: "eventos",
    media: "story-media-eventos",
    category: "Eventos",
    title: "Experiencias para quedarse.",
    description: "Activaciones, encuentros y momentos especiales pensados para vivir el club completo.",
    points: ["Eventos deportivos", "Experiencias de marca", "Agenda activa"],
  },
  {
    id: "club",
    media: "story-media-club",
    category: "El club",
    title: "Dise\u00f1ado para otro ritmo.",
    description: "Arquitectura, luz y espacios que acompa\u00f1an la experiencia dentro y fuera de la cancha.",
    points: ["Canchas indoor", "Bar y coworking", "Detalles premium"],
  },
];

const storiesViewer = document.querySelector("[data-stories-viewer]");
const storiesMedia = document.querySelector("[data-stories-media]");
const storiesCategory = document.querySelector("[data-stories-category]");
const storiesTitle = document.querySelector("[data-stories-title]");
const storiesDescription = document.querySelector("[data-stories-description]");
const storiesPoints = document.querySelector("[data-stories-points]");
const storiesThumbs = document.querySelector("[data-stories-thumbs]");
const storiesClose = document.querySelector("[data-stories-close]");
const storiesPrev = document.querySelector("[data-stories-prev]");
const storiesNext = document.querySelector("[data-stories-next]");
let activeStoryIndex = 0;
let storyTouchStart = 0;

const renderStory = (index) => {
  if (!storiesViewer || !storiesMedia) return;
  activeStoryIndex = (index + storyData.length) % storyData.length;
  const story = storyData[activeStoryIndex];

  storiesViewer.classList.add("is-changing");
  window.setTimeout(() => storiesViewer.classList.remove("is-changing"), 160);

  storiesMedia.className = `stories-media ${story.media}`;
  if (storiesCategory) storiesCategory.textContent = story.category;
  if (storiesTitle) storiesTitle.textContent = story.title;
  if (storiesDescription) storiesDescription.textContent = story.description;
  if (storiesPoints) {
    storiesPoints.innerHTML = "";
    story.points.forEach((point) => {
      const item = document.createElement("li");
      item.textContent = point;
      storiesPoints.appendChild(item);
    });
  }

  storiesThumbs?.querySelectorAll("button").forEach((button, thumbIndex) => {
    button.classList.toggle("is-active", thumbIndex === activeStoryIndex);
  });
};

if (storiesViewer && storiesThumbs) {
  storyData.forEach((story, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `Ver ${story.category}`);
    button.addEventListener("click", () => renderStory(index));
    storiesThumbs.appendChild(button);
  });

  document.querySelectorAll("[data-story-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = storyData.findIndex((story) => story.id === button.getAttribute("data-story-open"));
      renderStory(index >= 0 ? index : 0);
      storiesViewer.classList.add("is-open");
      storiesViewer.setAttribute("aria-hidden", "false");
      document.body.classList.add("stories-open");
      storiesClose?.focus();
    });
  });

  const closeStories = () => {
    storiesViewer.classList.remove("is-open");
    storiesViewer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("stories-open");
  };

  storiesClose?.addEventListener("click", closeStories);
  storiesViewer.addEventListener("click", (event) => {
    if (event.target === storiesViewer) closeStories();
  });
  storiesPrev?.addEventListener("click", () => renderStory(activeStoryIndex - 1));
  storiesNext?.addEventListener("click", () => renderStory(activeStoryIndex + 1));
  storiesViewer.addEventListener("touchstart", (event) => {
    storyTouchStart = event.changedTouches[0]?.clientX ?? 0;
  }, { passive: true });
  storiesViewer.addEventListener("touchend", (event) => {
    const delta = (event.changedTouches[0]?.clientX ?? 0) - storyTouchStart;
    if (Math.abs(delta) < 48) return;
    renderStory(activeStoryIndex + (delta < 0 ? 1 : -1));
  }, { passive: true });

  window.addEventListener("keydown", (event) => {
    if (!storiesViewer.classList.contains("is-open")) return;
    if (event.key === "Escape") closeStories();
    if (event.key === "ArrowLeft") renderStory(activeStoryIndex - 1);
    if (event.key === "ArrowRight") renderStory(activeStoryIndex + 1);
  });
}

const lazyBackgroundTargets = document.querySelectorAll(
  ".story-chapter, .bar-story, .events-tournaments, .story-card, .scene-final"
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
  ".scene-inner > *, .gpc-marquee, .story-intro, .story-chapter-inner, .gallery-head, .story-card, .bar-content > *, .events-grid > *, .sponsors-head, .sponsor-marquee, .location-grid > *, .contact-grid > *"
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
