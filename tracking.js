(() => {
  const config = window.GPC_CONFIG || {};
  const production = ['globalpadelcenter.com', 'www.globalpadelcenter.com'].includes(location.hostname);
  let granted = false;
  try { granted = localStorage.getItem('gpc-measurement') === 'accepted'; } catch (_) {}
  let started = false;
  const load = src => { const script = document.createElement('script'); script.async = true; script.src = src; document.head.appendChild(script); };
  function start() {
    if (started || !production || !config.trackingEnabled || !granted) return;
    started = true;
    window.dataLayer = window.dataLayer || [];
    if (/^GTM-[A-Z0-9]+$/.test(config.gtmId || '')) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      load(`https://www.googletagmanager.com/gtm.js?id=${config.gtmId}`);
    } else {
      if (/^G-[A-Z0-9]+$/.test(config.ga4Id || '')) {
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        // Do not send URL query strings (which may contain personal data).
        window.gtag('config', config.ga4Id, { page_location: location.origin + location.pathname, page_referrer: '' });
        load(`https://www.googletagmanager.com/gtag/js?id=${config.ga4Id}`);
      }
      if (/^\d+$/.test(config.metaPixelId || '')) {
        const pixel = function () { pixel.callMethod ? pixel.callMethod.apply(pixel, arguments) : pixel.queue.push(arguments); };
        pixel.queue = []; pixel.loaded = true; pixel.version = '2.0'; window.fbq = pixel; window._fbq = pixel;
        load('https://connect.facebook.net/en_US/fbevents.js');
        pixel('init', config.metaPixelId); pixel('track', 'PageView');
      }
    }
  }
  window.GPCTrack = (name, data = {}) => {
    if (!production || !config.trackingEnabled || !granted) return;
    const payload = Object.fromEntries(['service','placement','form_type','page_path','whatsapp_action'].filter(key => typeof data[key] === 'string').map(key => [key, data[key].slice(0,100)]));
    if (config.gtmId) window.dataLayer?.push({ event: name, ...payload });
    else { window.gtag?.('event', name, payload); if (name === 'generate_lead') window.fbq?.('track', 'Lead', { content_category: payload.service }); }
  };
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-tracking-preferences]').forEach(button => button.addEventListener('click', () => {
      const dialog = document.createElement('dialog'); dialog.className = 'measurement-dialog';
      dialog.innerHTML = '<h2>Preferencias de medición</h2><p>Podés permitir la medición de visitas y consultas para ayudarnos a mejorar las campañas. El sitio funciona sin aceptarla.</p><div class="gpc-actions"><button type="button" data-choice="accepted" class="gpc-button gpc-button-primary">Permitir medición</button><button type="button" data-choice="rejected" class="gpc-button">No permitir</button><button type="button" data-close class="gpc-button">Cerrar</button></div>';
      document.body.appendChild(dialog); dialog.showModal();
      dialog.querySelectorAll('[data-choice]').forEach(choice => choice.addEventListener('click', () => {
        try { localStorage.setItem('gpc-measurement', choice.dataset.choice); } catch (_) {}
        granted = choice.dataset.choice === 'accepted';
        if (!granted && started) { location.reload(); return; }
        start(); dialog.close();
      }));
      dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
      dialog.addEventListener('close', () => { dialog.remove(); button.focus(); }, { once: true });
    }));
  });
  start();
})();
