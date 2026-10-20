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


// WhatsApp is the current transport. Callback capture requires an approved endpoint.
// A received lead is recorded only after an explicit {received:true} server response.
const inquiryLabels = {nombre:"Nombre",telefono:"WhatsApp",servicio:"Interés",email:"Email",tipo_evento:"Tipo de evento",personas:"Personas aproximadas",fecha:"Fecha estimada",horario:"Horario",gastronomia:"Gastronomía",mensaje:"Mensaje"};
const localToday = () => {const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");};
const configuredEndpoint = () => {
 const value=window.GPC_CONFIG?.forms?.endpoint;
 if (!value) return null;
 try {const u=new URL(value,location.href);return u.protocol==="https:" ? u.href : null;} catch {return null;}
};
document.querySelectorAll("[data-inquiry-form]").forEach(form=>{
 const status=form.querySelector(".form-status"), fields=form.querySelector("fieldset"), button=form.querySelector('button[type="submit"]');
 const phone=form.elements.namedItem("telefono"), name=form.elements.namedItem("nombre"), date=form.elements.namedItem("fecha");
 const endpoint=configuredEndpoint();
 const normalLabel=endpoint ? (form.id==="event-inquiry"?"Solicitar cotización":"Quiero recibir información") : "Continuar en WhatsApp ↗";
 button.textContent=normalLabel;
 if (endpoint) {
  form.querySelector(".form-note").textContent="Enviaremos estos datos a Global para responder tu consulta. El envío no confirma una reserva.";
 }
 if (date) date.min=localToday();
 let started=false, submitting=false;
 form.addEventListener("input",()=>{
  if (!started) {started=true;window.gpcMeasure?.("inquiry_form_start",{form_location:form.dataset.formLocation,service:form.elements.namedItem("servicio")?.value});}
  phone.setCustomValidity("");name.setCustomValidity("");status.replaceChildren();
 });
 form.addEventListener("submit",async event=>{
  event.preventDefault();
  if (submitting) return;
  if (date) date.min=localToday();
  const digits=phone.value.replace(/\D/g,"");
  phone.setCustomValidity(digits.length<6||digits.length>15?"Ingresá un teléfono válido con código de área.":"");
  name.setCustomValidity(name.value.trim().length<2?"Ingresá tu nombre.":"");
  if (!form.reportValidity()) return;
  const data=new FormData(form), payload={};
  for (const [key,value] of data) if (inquiryLabels[key]) payload[key]=String(value).trim();
  const lines=["Hola Global Padel Center, quiero hacer una consulta.",...Object.entries(payload).filter(([,v])=>v).map(([k,v])=>inquiryLabels[k]+": "+v)];
  const url="https://wa.me/543417560704?text="+encodeURIComponent(lines.join("\n"));
  const fallback = text => {
   const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.textContent=text;
   return a;
  };
  status.replaceChildren();
  if (!endpoint) {
   status.append("Tu consulta está preparada. Revisala y enviala en WhatsApp. Si no se abre, ",fallback("abrí tu consulta desde acá"),".");
   window.gpcMeasure?.("inquiry_whatsapp_open",{form_location:form.dataset.formLocation,service:payload.servicio});
   window.open(url,"_blank","noopener,noreferrer");
   return;
  }
  submitting=true;fields.disabled=true;button.textContent="Enviando…";form.setAttribute("aria-busy","true");
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),window.GPC_CONFIG?.forms?.timeoutMs||12000);
  try {
   const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({form:form.dataset.formLocation,...payload}),signal:controller.signal,credentials:"omit",referrerPolicy:"no-referrer"});
   if (!response.ok) throw Error("not-received");
   const receipt=await response.json();
   if (receipt.received!==true) throw Error("not-received");
   status.textContent="Recibimos tu consulta. El equipo de Global se pondrá en contacto con vos. Esto no confirma una reserva.";
   window.gpcMeasure?.("inquiry_form_received",{form_location:form.dataset.formLocation,service:payload.servicio});
   form.reset();started=false;
  } catch {
   status.append("No pudimos confirmar la recepción. Conservamos tus datos en este formulario para que puedas reintentar o ",fallback("continuar por WhatsApp"),".");
  } finally {
   clearTimeout(timeout);submitting=false;fields.disabled=false;button.textContent=normalLabel;form.removeAttribute("aria-busy");
  }
 });
 fields.disabled=false;
});
