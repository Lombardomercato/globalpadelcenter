# Global Padel Center — Datos y conexiones para campañas

Borrador del 26 de octubre de 2026. Base aprobada: 1b6bd9a, con las seis historias. Rama de implementación: codex/mejoras-comerciales-historias. Producción no se modifica.

## Información a pedir al club

| Servicio | Información necesaria |
| --- | --- |
| Eventos | Tipos admitidos; capacidad mínima y máxima por espacio; días y horarios; anticipación; modalidad de reserva; seña; cancelaciones; servicios incluidos; gastronomía y bebidas; canchas/actividades opcionales; paquetes y precios o decisión de cotizar; fotos y videos reales autorizados. |
| Viandas | Confirmación del servicio y responsable; menú, ingredientes y restricciones; precios; packs x5/x10/semanales si existen; días; modalidad y anticipación de pedido; retiro/envío; zonas, costos y mínimos; medios de pago; fotos reales. |
| Bar | Carta y precios; horarios por día; reservas; capacidad; confirmar acceso sin jugar al pádel; platos/bebidas destacados; fotos reales del servicio y del espacio. |
| Pádel | Tarifas si se mostrarán; duración y condiciones de turnos; clases/niveles/horarios; agenda de torneos; cancelaciones; canal oficial de reserva. |
| Operación | Confirmar números 3417560704 (pádel/general) y 3417828537 (bar/eventos); destino de viandas; email de avisos; responsable por servicio; horario y plazo de respuesta; quién actualiza menú/precios; autorización para mostrar marcas y material. |

No se inventaron capacidades, precios, horarios, paquetes ni condiciones. Las páginas de prueba orientan a consultarlos. Viandas usa una composición tipográfica sin fotografía de comida hasta recibir material real. No lanzar campañas de viandas hasta completar la propuesta.

## Plataformas y accesos

| Plataforma | Estado observado y acción pendiente |
| --- | --- |
| GitHub | Repositorio conectado y rama aislada. No fusionar con main sin revisión. |
| Hosting Vercel | Proyecto existente. Borrador preparado para preview con API; GitHub Pages sirve HTML pero no ejecuta api/leads.js. Confirmar dónde se alojará la versión final antes de activar formularios. |
| Google Analytics 4 | ID G-1B64R6Q5KH existente en el código; falta comprobar propiedad, permisos y recepción de eventos. |
| Google Tag Manager | No hay contenedor identificado. Falta ID, permisos y configuración de etiquetas; si se usa GTM, no duplicar GA4 o Pixel directamente. |
| Google Ads | Falta verificar cuenta de Global, acceso, vinculación con GA4, etiquetado de campañas y conversiones principales/secundarias. Un clic a WhatsApp no equivale a una consulta recibida. |
| Meta Business / Ads / Pixel | Falta verificar cuenta publicitaria y activo de medición, ID Pixel, acceso, dominio y validación de eventos. No se implementó Conversions API sin datos ni infraestructura confirmados. |
| Recepción de formularios | Falta elegir destino propiedad de Global: CRM o registro durable con avisos al responsable. El endpoint admite un webhook HTTPS autenticado; no está conectado. El receptor debe guardar antes de responder 2xx y deduplicar por receiptId. |
| WhatsApp | Enlaces simples existentes. Confirmar responsables/números; no hace falta conectar WhatsApp API para estos enlaces. Viandas usa consulta general hasta confirmar destino propio. |
| Search Console | Falta comprobar propiedad y acceso. Recomendado para revisar indexación y sitemap al publicar; no bloquea el borrador. |

No pedir contraseñas por chat. Acceder por invitación o conexión oficial.

## Activación técnica pendiente

1. Configurar receptor durable y notificaciones; verificar que un fallo nunca produzca confirmación falsa. Añadir protección contra abuso/rate limiting en hosting o receptor antes de abrir captación.
2. Configurar variables privadas de Vercel: GPC_LEADS_ENABLED=true, GPC_LEAD_WEBHOOK_URL, GPC_ALLOWED_ORIGIN (origen exacto), y GPC_LEAD_WEBHOOK_SECRET si el receptor usa Bearer. No incluir secretos en JavaScript público.
3. Probar con registro controlado hasta recepción, aviso y asignación; revisar deduplicación, permisos y conservación de datos. Recién después activar formsEnabled en commercial-config.js. Preview actual: simulación, sin almacenamiento ni transmisión de formularios.
4. Verificar IDs y configurar etiquetas/conversiones. trackingEnabled está desactivado; las vistas previas nunca cargan publicidad/analítica real. La medición pública requiere permiso mediante el control del footer; esto debe contemplarse al interpretar resultados de campañas.
5. Registrar generate_lead solo tras respuesta satisfactoria del receptor; click_whatsapp como interacción separada. Atribución UTM/click IDs se conserva en la sesión para acompañar el formulario cuando se active. No se envían campos del formulario a Analytics.
6. Revisar textos de privacidad según las plataformas realmente elegidas y su conservación de datos. La revocación detiene cargas futuras; no es un borrado retroactivo de cookies externas.
7. Antes de producción: completar datos, revisar versión móvil, pruebas de recepción/medición y autorización. Retirar noindex de nuevas páginas y la cabecera X-Robots-Tag de vercel.json, actualizar sitemap y validar canonical/URLs finales. No retirar en preview.

## Cambios realizados

- Home conserva portada y seis historias; sin banner ni formulario superpuesto.
- Menú con acceso a los cuatro servicios; footer compacto con newsletter (email y consentimiento explícito de marketing). Los formularios comerciales permanecen en las páginas de servicio.
- Cuatro páginas comerciales con la identidad existente, propuesta, condiciones a consultar, preguntas frecuentes y CTA.
- Formulario de eventos con precalificación y formularios de consulta para otros servicios.
- Estados de simulación, envío, éxito y error; consentimiento de contacto, validación y alternativa WhatsApp.
- Endpoint con validación de servidor, origen explícito y secretos privados; no habilitado sin receptor.
- Infraestructura de medición con GA4/GTM/Meta configurable, sin duplicar carga directa cuando se usa GTM.
- Vista previa excluida de indexación; fotos existentes y estilos compartidos; sin nuevas dependencias.

## Alcance comercial

El documento no contiene el presupuesto ni el plan contratado. Falta contrastar páginas nuevas, integraciones y mantenimiento con el alcance pagado antes de prometer que todos están incluidos. No se contrataron plataformas ni se activó inversión publicitaria.

## Newsletter del footer

El footer común contiene únicamente email, autorización expresa para recibir novedades/promociones, acceso a Privacidad y botón Suscribirme. No hay campos comerciales ni consentimiento premarcado. La suscripción es independiente de las consultas. Falta elegir y conectar la plataforma de email marketing, registrar fecha/versión/origen del consentimiento y ofrecer baja en cada envío. Sigue en modo de prueba: no se guarda el email ni se suscribe al visitante. No activar newsletterEnabled hasta implementar y verificar su endpoint, confirmación de email, bajas y registro del consentimiento.
