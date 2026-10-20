/* Only controlled categories enter measurement. Never send form values or WhatsApp URLs.
   GTM mode takes precedence over direct GA4/Meta to prevent double counting.
   No identifier = no external tag. Previews are disabled unless explicitly allowed. */
(() => {
 const cfg = window.GPC_CONFIG?.measurement || {};
 const previewAllowed = !window.GPC_CONFIG?.review || cfg.allowOnPreview === true;
 const gtm = /^GTM-[A-Z0-9]+$/.test(cfg.gtmId || "") ? cfg.gtmId : "";
 const ga = /^G-[A-Z0-9]+$/.test(cfg.ga4Id || "") ? cfg.ga4Id : "";
 const pixel = /^\d{5,25}$/.test(cfg.metaPixelId || "") ? cfg.metaPixelId : "";
 const configured = previewAllowed && Boolean(gtm || ga || pixel);
 const events = new Set(["inquiry_form_start","inquiry_whatsapp_open","whatsapp_click","inquiry_form_received"]);
 const locations = new Set(["hero-inquiry","event-inquiry","footer-inquiry"]);
 const normalize = value => {
  const s = String(value).toLowerCase();
  if (s.includes("evento")) return "eventos";
  if (s.includes("vianda")) return "viandas";
  if (s.includes("gastronom") || s.includes("bar")) return "bar";
  if (s.includes("torneo")) return "torneos";
  if (s.includes("clase")) return "clases";
  if (s.includes("pádel") || s.includes("padel") || s.includes("cancha")) return "padel";
  return "general";
 };
 window.dataLayer = window.dataLayer || [];
 const gtag = function(){window.dataLayer.push(arguments);};
 const load = src => {const s=document.createElement("script");s.async=true;s.src=src;document.head.append(s);};
 const consentKey = "gpc-measurement-consent-v1";
 let choice = null, loaded = false, active = false;
 try {
  const stored = JSON.parse(localStorage.getItem(consentKey) || "null");
  if (stored && ["granted","denied"].includes(stored.value) && Date.now()-stored.at < 180*86400000) choice=stored.value;
 } catch {}
 const applyConsent = granted => gtag("consent","update",{
  analytics_storage:granted?"granted":"denied",ad_storage:granted?"granted":"denied",
  ad_user_data:granted?"granted":"denied",ad_personalization:granted?"granted":"denied"
 });
 if (configured) gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});
 const start = () => {
  if (!configured || loaded) return;
  loaded=true;active=true;
  applyConsent(true);
  if (gtm) {
   window.dataLayer.push({"gtm.start":Date.now(),event:"gtm.js"});
   load("https://www.googletagmanager.com/gtm.js?id="+gtm);
  } else {
   if (ga) {
    window.gtag=gtag;
    gtag("js",new Date());
    gtag("config",ga,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});
    let referrer="";
    try {referrer=new URL(document.referrer).origin;} catch {}
    gtag("event","page_view",{page_location:location.origin+location.pathname,page_referrer:referrer});
    load("https://www.googletagmanager.com/gtag/js?id="+ga);
   }
   if (pixel) {
    const fbq = window.fbq = function(){fbq.callMethod ? fbq.callMethod.apply(fbq,arguments) : fbq.queue.push(arguments);};
    fbq.queue=[];fbq.loaded=true;fbq.version="2.0";fbq.push=fbq;
    fbq("consent","grant");fbq("set","autoConfig",false,pixel);fbq("init",pixel);fbq("track","PageView");
    load("https://connect.facebook.net/en_US/fbevents.js");
   }
  }
 };
 window.gpcMeasure = (event, params = {}) => {
  if (!events.has(event)) return;
  const safe={service:normalize(params.service),form_location:locations.has(params.form_location)?params.form_location:"direct"};
  // Local categories support QA even with no configured account. No history is replayed after consent.
  if (!active) { if (!configured) window.dataLayer.push({event,...safe}); return; }
  if (gtm) {window.dataLayer.push({event,...safe});return;}
  if (ga) gtag("event",event === "inquiry_form_received" ? "generate_lead" : event,safe);
  if (pixel) {
   if (event === "inquiry_form_received") window.fbq("track","Lead",safe);
   else window.fbq("trackCustom",event,safe);
  }
 };
 document.addEventListener("click", event => {
  const link=event.target.closest("a[href]");
  if (!link) return;
  let url;try {url=new URL(link.href);} catch {return;}
  if (url.hostname !== "wa.me") return;
  window.gpcMeasure("whatsapp_click",{service:link.dataset.service||link.textContent,form_location:link.closest("[data-inquiry-form]")?.dataset.formLocation});
 });
 if (!configured) return;
 const banner=document.createElement("section");
 banner.className="measurement-consent";banner.setAttribute("aria-label","Preferencias de medición");
 banner.innerHTML='<p>¿Nos permitís medir las visitas y consultas para mejorar la web y nuestras campañas?</p><p>Es opcional. No enviamos los campos de tus formularios como datos de medición. <a href="./privacidad.html">Ver privacidad</a></p><div><button type="button" data-choice="denied">Continuar sin medición</button><button type="button" data-choice="granted">Permitir medición</button></div>';
 banner.hidden=choice!==null;
 document.body.append(banner);
 document.querySelectorAll("[data-measurement-settings]").forEach(button=>{
  button.hidden=false;
  button.addEventListener("click",()=>{banner.hidden=false;banner.querySelector("button").focus();});
 });
 banner.addEventListener("click",event=>{
  const button=event.target.closest("[data-choice]");
  if (!button) return;
  choice=button.dataset.choice;
  try {localStorage.setItem(consentKey,JSON.stringify({value:choice,at:Date.now()}));} catch {}
  banner.hidden=true;
  if (choice==="granted") {active=true;start();}
  else {
   active=false;applyConsent(false);
   if (window.fbq) window.fbq("consent","revoke");
   if (loaded) location.reload();
  }
 });
 if (choice==="granted") start();
})();
