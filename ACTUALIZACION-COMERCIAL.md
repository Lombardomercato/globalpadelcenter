# Actualización comercial — Global Padel Center

## Implementado
Una página con destinos #eventos, #viandas, #bar y #torneos.
Formulario inicial y final, y formulario precalificado de eventos.
Los tres preparan un mensaje para el WhatsApp existente: no registran consultas automáticamente.
Preguntas frecuentes y CTAs sin prometer precios, capacidad, envíos o disponibilidad no confirmados.
Una foto real del lounge ya presente: no representa un evento ni una vianda específicos.
Privacidad acorde al funcionamiento real.
Se reemplaza la suscripción por mailto con una consulta por WhatsApp.

## Información pendiente del cliente
Eventos: tipos ofrecidos, capacidad mínima/máxima, días/horarios, anticipación, seña, cancelaciones, servicios incluidos, gastronomía, pádel, precios/paquetes y fotos/videos reales.
Viandas: confirmar servicio activo, menú, precios/packs, días, anticipación, retiro/envío, zonas, costos, medios de pago y fotos.
Bar: menú, horarios, reservas, capacidad si corresponde y acceso sin jugar al pádel.

## Medición pendiente de activación
Faltan propiedad/accesos de GA4, contenedor GTM y Pixel de Meta.
measurement.js no carga servicios externos. No afirmar que hay informes o conversiones activos.
Eventos: inquiry_form_start, inquiry_whatsapp_open, whatsapp_click.
Parámetros permitidos: service y form_location; valores controlados.
No mapear aperturas/clics a WhatsApp como Lead recibido o reserva confirmada.
Configurar consentimiento y evitar capturas automáticas de campos o URLs de WhatsApp al instalar los tags reales. Verificar en DebugView/Preview/Test Events.
Search Console requiere acceso a la propiedad. Sitemap y canonical ya usan globalpadelcenter.com.

## Alcance posterior
La captación automática para dejar datos, CRM, email o backend requiere destino e integración acordados.
Las secciones cubren el pedido de destinos diferenciados. Landings independientes opcionales según campaña.
