/* No external tags are activated. Map these intent events in the client's
approved GTM/GA4/Meta setup only after consent configuration and account IDs.
Never send form values, outgoing WhatsApp URLs or personal data to analytics.
*/
(() => {
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
 const events = new Set(["inquiry_form_start","inquiry_whatsapp_open","whatsapp_click"]);
 const locations = new Set(["hero-inquiry","event-inquiry","footer-inquiry"]);
 window.gpcMeasure = (event, params = {}) => {
  if (!events.has(event)) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, service: normalize(params.service), form_location: locations.has(params.form_location) ? params.form_location : "direct" });
 };
 document.addEventListener("click", event => {
  const link = event.target.closest("a[href]");
  if (!link) return;
  let url;
  try { url = new URL(link.href); } catch { return; }
  if (url.hostname !== "wa.me") return;
  window.gpcMeasure("whatsapp_click", { service: link.dataset.service || link.textContent, form_location: link.closest("[data-inquiry-form]")?.dataset.formLocation });
 });
})();
