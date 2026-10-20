# Versión completa de corrección — Global Padel Center

Estado: BORRADOR. Trabajar únicamente en revision/borrador-correcciones-global.
No fusionar con main, promover despliegues ni modificar dominio/DNS.
La revisión visual está en revision.html y el PR de borrador es #3.
Los ajustes publicados anteriormente siguen en producción; este trabajo no los modifica ni revierte.

## Matriz de cobertura del documento
| Pedido | Solución preparada | Dependencia para cerrar |
|---|---|---|
| Formulario arriba | Nombre, WhatsApp y servicio; visible en inicio desktop y móvil | Ninguna en modo WhatsApp |
| Formulario al final | Nombre, WhatsApp, email opcional, servicio y mensaje | Ninguna en modo WhatsApp |
| Consulta inmediata + dejar datos | WhatsApp operativo; transporte de recepción directa implementado con validación, timeout, bloqueo de doble envío y confirmación explícita | Endpoint aprobado para captura; sin él no se ofrece recepción automática |
| Eventos: desarrollo comercial | Sección, foto real del lounge, FAQ y slots para todos los datos solicitados | Datos de negocio, paquetes y material real |
| Formulario eventos | Tipo, personas, fecha, horario, gastronomía, nombre, teléfono y mensaje | Capacidad mínima/máxima real para filtrar por política del club |
| Viandas | Sección propia y CTA; plantilla para oferta, menú, precios, packs, pedido, días, anticipación, retiro/envío, zonas, costo y pagos | Confirmación del servicio, datos y fotos |
| Bar | Bloque ampliado, CTA, slots para oferta, menú, horarios, reservas, capacidad y acceso público | Confirmación de esos datos |
| Destinos diferenciados | #eventos, #viandas, #bar, #torneos | Cumple la opción de secciones del documento; landings separadas opcionales |
| Medición | GTM o GA4/Meta directos, permiso previo, categorías por servicio, lead únicamente al recibir recibo positivo | IDs, accesos y validación en cuentas |
| Material | commercial-content.js enumera todos los campos; vacíos no se publican | Global entrega información y fotos/videos |

## Datos que debe entregar Global
Eventos: tipos que ofrece, capacidad mínima/máxima, días y horarios, modalidad de reserva, seña y cancelación, servicios incluidos, gastronomía/bebidas, posibilidad de pádel, precios o paquetes y fotos/videos reales.
Viandas: servicio activo, tipo de viandas, menú, precios, packs, días, modalidad de pedido, anticipación, retiro/envío, zonas y costo, medios de pago y fotos.
Bar: oferta/productos, menú, horarios, reservas, capacidad si corresponde, confirmar ingreso sin jugar pádel y fotos de platos, bebidas y espacio.
Completar commercial-content.js con texto real (strings), números para capacidad y booleano para abiertoPublico. null y [] permanecen ocultos. Imágenes requieren src y alt; videos se enlazan sin carga automática.

## Recepción directa: contrato pendiente
Configurar GPC_CONFIG.forms.endpoint únicamente con una URL HTTPS aprobada.
POST JSON: {form,nombre,telefono,servicio,email?,mensaje?,tipo_evento?,personas?,fecha?,horario?,gastronomia?}.
El servidor debe validar, limitar abuso y guardar/entregar efectivamente la consulta.
Respuesta de éxito: HTTP 2xx con {"received":true}. Un HTTP 200 vacío no confirma una consulta.
No se implementó un receptor ficticio ni se envían datos a terceros sin un destino definido.
Por defecto el destino está vacío: los tres formularios preparan WhatsApp y la persona debe enviar el mensaje.

## Medición
site-config.js contiene IDs públicos vacíos de GTM, GA4 y Meta; nunca poner secretos allí.
GTM tiene precedencia: si se completa gtmId, GA4 y Meta deben configurarse dentro del contenedor, sin cargar etiquetas directas duplicadas.
Sin GTM, completar ga4Id y/o metaPixelId para carga directa.
No se carga ningún proveedor antes de permitir la medición. Elección recordada hasta 180 días.
Previews no envían medición por defecto (allowOnPreview:false).
Eventos: inquiry_form_start, inquiry_whatsapp_open, whatsapp_click, inquiry_form_received.
Parámetros: service y form_location (categorías controladas).
Solo inquiry_form_received se mapea a generate_lead de GA4 y Lead de Meta en modo directo.
En GTM, configurar esos eventos y exigir consentimiento en todas las etiquetas.
No enviar campos, mensajes, URLs de WhatsApp ni datos de contacto en parámetros. Desactivar la captura automática de formularios y clics salientes que pueda recoger URL/mensajes personales al configurar la propiedad/contendor. Revisar los informes de DebugView, Tag Assistant y Test Events después de activar.
No hay medición real en las cuentas ni atribución verificada mientras no existan los IDs/accesos.
Search Console sigue requiriendo acceso a la propiedad; canonical y sitemap usan el dominio propio.

## Validación
tests/formularios.html prueba las tres estructuras reales cargadas desde index.html, con datos ficticios.
Modo recepción: respuesta explícita, HTTP 200 sin recibo, conservación ante error, timeout y doble envío.
Modo WhatsApp (?modo=whatsapp): mensajes y precalificación, sin captación automática ni lead recibido.
En ambos: campos personales ausentes de medición; ningún proveedor sin IDs.
Estas pruebas simulan el receptor. No certifican un backend real todavía no definido.

## Antes de una publicación aprobada
Revisar textos, contenido y diseño en el enlace de preview.
Completar información comercial y confirmar destino de formularios/medición.
Mantener borrador hasta aprobación explícita. Esta versión no modifica producción.
