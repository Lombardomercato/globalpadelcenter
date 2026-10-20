/* Borrador. Empty identifiers/destination must stay empty until verified.
   Never place secrets, access tokens or private keys in browser configuration. */
window.GPC_CONFIG = {
  review: !["globalpadelcenter.com", "www.globalpadelcenter.com"].includes(location.hostname),
  forms: { endpoint: "", timeoutMs: 12000 },
  measurement: { gtmId: "", ga4Id: "", metaPixelId: "", allowOnPreview: false }
};
if (window.GPC_CONFIG.review) {
  const robots = document.querySelector('meta[name="robots"]') || document.head.appendChild(document.createElement("meta"));
  robots.name = "robots";
  robots.content = "noindex, nofollow";
  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("is-review");
    const banner = document.createElement("div");
    banner.className = "review-banner";
    banner.append("Borrador para revisión · ");
    const link = document.createElement("a");
    link.href = "./revision.html";
    link.textContent = "Ver estado de las correcciones";
    banner.append(link);
    document.body.prepend(banner);
  });
}
