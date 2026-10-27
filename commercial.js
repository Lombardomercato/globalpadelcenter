(() => {
  const config = window.GPC_CONFIG || {};
  const allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid'];
  const params = new URLSearchParams(location.search);
  let attribution = {};
  try { attribution = JSON.parse(sessionStorage.getItem('gpc-attribution') || '{}'); } catch (_) {}
  if (!attribution || typeof attribution !== 'object' || Array.isArray(attribution)) attribution = {};
  if (allowed.some(key => params.has(key))) {
    attribution = Object.fromEntries(allowed.filter(key => params.has(key)).map(key => [key, params.get(key).slice(0, 250)]));
    try { sessionStorage.setItem('gpc-attribution', JSON.stringify(attribution)); } catch (_) {}
  }
  document.querySelectorAll('[data-wa-service]').forEach(link => {
    const service = link.dataset.waService;
    const phone = config.phones?.[service] || config.phones?.general;
    const messages = { eventos: 'Quiero organizar un evento en Global. ¿Podemos ver las opciones?', viandas: 'Quiero consultar el menú de viandas y cómo pedir.', bar: 'Quiero consultar el menú, los horarios y las reservas del bar.', padel: 'Quiero consultar por canchas, clases o torneos en Global.', general: 'Quiero recibir información de Global Padel Center.' };
    if (phone) link.href = `https://wa.me/${phone}?text=${encodeURIComponent(messages[service] || messages.general)}`;
    link.target = '_blank'; link.rel = 'noopener noreferrer';
    link.addEventListener('click', () => window.GPCTrack?.('click_whatsapp', { service, placement: 'commercial', page_path: location.pathname }));
  });
  document.querySelectorAll('[data-newsletter-form]').forEach(form => {
    const status = form.querySelector('.newsletter-status');
    const button = form.querySelector('[type=submit]');
    const ready = config.newsletterEnabled === true && typeof config.newsletterEndpoint === 'string' && config.newsletterEndpoint.startsWith('/') && !config.newsletterEndpoint.startsWith('//');
    form.querySelector('[data-newsletter-notice]').textContent = ready ? '' : 'Suscripción en modo de prueba.';
    let sending = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending || !form.reportValidity()) return;
      if (!ready) { status.textContent = 'Prueba completada. No guardamos tu email ni activamos una suscripción.'; return; }
      sending = true; button.disabled = true; status.textContent = 'Enviando…';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(config.newsletterEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.elements.email.value.trim(), marketingConsent: form.elements.marketingConsent.checked, consentVersion: 'newsletter-v1', page: location.pathname }), signal: controller.signal });
        const result = await response.json();
        if (!response.ok || result.ok !== true || !result.receiptId) throw new Error('not_received');
        status.textContent = 'Recibimos tu solicitud. Revisá tu email para continuar.';
        form.reset();
      } catch (_) { status.textContent = 'No pudimos confirmar la suscripción. Intentá nuevamente más tarde.'; }
      finally { clearTimeout(timeout); sending = false; button.disabled = false; }
    });
  });
  document.querySelectorAll('[data-lead-form]').forEach(form => {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('[type=submit]');
    const notice = form.querySelector('[data-form-notice]');
    const ready = config.formsEnabled === true;
    notice.textContent = ready ? '' : 'Versión de prueba: este formulario permite revisar el recorrido. No envía ni guarda tus datos.';
    if (!ready) button.textContent = 'Probar formulario';
    const date = form.querySelector('[name=date]');
    if (date) { const today = new Date(); date.min = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`; }
    let sending = false;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (sending || !form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form));
      if (data.website) return;
      if (!ready) { status.textContent = 'Prueba completada. No se envió ninguna consulta. Falta conectar la recepción de formularios.'; return; }
      sending = true; button.disabled = true; status.textContent = 'Enviando tu consulta…';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(config.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, consent: data.consent === 'on', attribution, page: location.pathname }), signal: controller.signal });
        const result = await response.json();
        if (!response.ok || result.ok !== true || !result.receiptId) throw new Error('not_received');
        status.textContent = 'Recibimos tu consulta. El equipo de Global se pondrá en contacto con vos.';
        window.GPCTrack?.('generate_lead', { service: data.service, form_type: date ? 'event' : 'general', page_path: location.pathname });
        form.reset();
      } catch (_) { status.textContent = 'No pudimos confirmar la recepción. Podés consultar por WhatsApp o volver a intentarlo.'; }
      finally { clearTimeout(timeout); sending = false; button.disabled = false; }
    });
  });
})();
