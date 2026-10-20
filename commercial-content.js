/* Datos a completar por Global. null/[] = sin confirmar, no publicar.
   No completar con supuestos. El renderizador omite los datos vacíos. */
window.GPC_CONTENT = {
 eventos: {
  tipos: [], minPersonas: null, maxPersonas: null, horarios: null,
  reserva: null, senia: null, cancelacion: null, incluye: null,
  gastronomia: null, padel: null, precios: null, media: []
 },
 viandas: {
  tipo: null, menu: null, precios: null, packs: null, dias: null,
  pedidos: null, anticipacion: null, retiro: null, envio: null,
  zonas: null, costoEnvio: null, pagos: null, media: []
 },
 bar: {
  oferta: null, menu: null, horarios: null, reservas: null,
  capacidad: null, abiertoPublico: null, media: []
 }
};
(() => {
 const labels = {
  eventos: {tipos:"Tipos de eventos",minPersonas:"Personas mínimas",maxPersonas:"Personas máximas",horarios:"Días y horarios",reserva:"Cómo reservar",senia:"Seña",cancelacion:"Cancelaciones",incluye:"Qué incluye",gastronomia:"Gastronomía y bebidas",padel:"Canchas y actividades",precios:"Precios y paquetes"},
  viandas: {tipo:"Propuesta de viandas",menu:"Menú",precios:"Precios",packs:"Packs",dias:"Días disponibles",pedidos:"Cómo pedir",anticipacion:"Anticipación",retiro:"Retiro",envio:"Envíos",zonas:"Zonas de entrega",costoEnvio:"Costo de envío",pagos:"Medios de pago"},
  bar: {oferta:"Propuesta gastronómica",menu:"Menú",horarios:"Horarios",reservas:"Reservas",capacidad:"Capacidad"}
 };
 const populated = value => value !== null && value !== undefined && String(value).trim() !== "" && (!Array.isArray(value) || value.length > 0);
 const safeMedia = value => {
  try {const url = new URL(value,location.href); return url.protocol === "https:" || (url.origin === location.origin && ["http:","https:"].includes(url.protocol)) ? url.href : null;} catch {return null;}
 };
 for (const [service, fields] of Object.entries(labels)) {
  const target = document.querySelector('[data-commercial-details="' + service + '"]');
  if (!target) continue;
  const data = window.GPC_CONTENT[service];
  const list = document.createElement("dl");
  list.className = "commercial-facts";
  for (const [key,label] of Object.entries(fields)) {
   if (!populated(data[key])) continue;
   const term = document.createElement("dt"); term.textContent = label;
   const detail = document.createElement("dd"); detail.textContent = Array.isArray(data[key]) ? data[key].join(", ") : String(data[key]);
   list.append(term,detail);
  }
  if (service === "bar" && typeof data.abiertoPublico === "boolean") {
   const term = document.createElement("dt"); term.textContent = "Acceso al bar";
   const detail = document.createElement("dd"); detail.textContent = data.abiertoPublico ? "Abierto al público: no necesitás jugar al pádel para venir al bar." : "Consultá con el club las condiciones de acceso al bar.";
   list.append(term,detail);
  }
  if (list.childElementCount) {target.append(list);target.hidden=false;}
  for (const item of data.media) {
   const url = safeMedia(item.src);
   if (!url || !populated(item.alt)) continue;
   if (item.type === "video") {
    const a = document.createElement("a"); a.href=url;a.textContent=item.alt;a.target="_blank";a.rel="noopener noreferrer";a.className="gpc-button";target.append(a);
   } else {
    const img=document.createElement("img");img.src=url;img.alt=item.alt;img.loading="lazy";img.className="commercial-photo";target.append(img);
   }
   target.hidden=false;
  }
 }
 const min = window.GPC_CONTENT.eventos.minPersonas, max = window.GPC_CONTENT.eventos.maxPersonas;
 const people = document.querySelector('#event-inquiry-people');
 if (people && Number.isInteger(min) && min > 0) people.min = String(min);
 if (people && Number.isInteger(max) && max > 0 && (!Number.isInteger(min)||max>=min)) people.max = String(max);
})();
