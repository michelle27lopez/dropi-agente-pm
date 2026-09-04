# 💎 DICCIONARIO MAESTRO: ATRIBUTOS Y EVENTOS DROPI
> **Fuente:** `Atributos y eventos Dropi.xlsx` (Documento Canónico de Tracking, Userpilot, Intercom, Customer.io y Eventos de Plataforma Dropi)

**Fecha de procesamiento:** 2026-08-05

## 📑 Índice de Hojas Procesadas

- [📌 Indice](#sheet-📌-indice)
- [TASKS](#sheet-tasks)
- [Matriz de decision rapida](#sheet-matriz-de-decision-rapida)
- [Atributos System Properties](#sheet-atributos-system-properties)
- [Goals Drops](#sheet-goals-drops)
- [Eventos Codigo](#sheet-eventos-codigo)
- [Eventos Tag](#sheet-eventos-tag)
- [Diccionario y bibliografia](#sheet-diccionario-y-bibliografia)
- [📄 Pages](#sheet--pages)
- [📍Paises](#sheet-paises)
- [Analisis Estado actual](#sheet-analisis-estado-actual)
- [ 🧐 Comparativo funcionalidades](#sheet---comparativo-funcionalidades)
- [👤 Comparativo atributos](#sheet--comparativo-atributos)
- [Eventos de activacion base](#sheet-eventos-de-activacion-base)

---

<a id="sheet-📌-indice"></a>
## Sheet: 📌 Indice

| Col_1 | Hoja | Contenido | Acceso | Col_5 | Col_6 | Col_7 | Col_8 | Col_9 | Col_10 | Col_11 | Col_12 | Col_13 | Col_14 | Col_15 | Col_16 | Col_17 | Col_18 | Col_19 | Col_20 | Col_21 | Col_22 | Col_23 | Col_24 | Col_25 | Col_26 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | 📋 Índice | Este índice y leyenda de colores | Ir |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | TASKS | Tareas y notas de los pasos a seguir en la implementacion | Ir |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Matriz de decision rapida | Matriz con la explicacion de los sourse de los eventos | Ir |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Atributos System Properties | Propiedades del sistema, que significan y donde estan ubicados | Ir |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Goals Drops | Goals JTBD de Dropshippers | Ir |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Eventos codigo | Listado de eventos que se ejecutan desde el codigo | Ir |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Eventos tag | Listado de eventos que se ejecutan desde la funcionalidad de labelel | Ir |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Diccionario y bibliografia | Listado de recursos relacionados y terminos | Ir |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | 📄 Pages | Paginas tageadas en Userpilot | Ir |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | 📍Paises | Mapeo por paises | Ir |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | 🧐 Comparativo funcionalidades | Qué hace cada plataforma y cómo se configura | Ir |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | 👤 Comparativo atributos | Cuales son los atributos en cada plataforma y como se relacionan | Ir |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Leyenda de estados |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | ✅ Implementado | Configurado y activo en producción |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | ⚠️ Parcial | Existe pero incompleto o con limitaciones |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | ❌ No implementado | No existe o no está configurado |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | 🔄 Pendiente | Definido pero aún no implementado |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | ➡️ Migrar a UP | Existía en Customer.io — migrar a Userpilot |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | 🔵 Solo UP | Funcionalidad exclusiva de Userpilot |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | N/A | No aplica para esta plataforma |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

---

<a id="sheet-tasks"></a>
## Sheet: TASKS

| Plantaformas | Tipo | Columna 1 | V1 | V2 - El listade de atrobutos v.2 y eventos como fuente de verdad | DOCUMENTACION | Col_7 | Col_8 | Col_9 | Col_10 | Col_11 | Col_12 | Col_13 | Col_14 | Col_15 | Col_16 | Col_17 | Col_18 | Col_19 | Col_20 | Col_21 | Col_22 | Col_23 | Col_24 | Col_25 | Col_26 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  | https://dropi-it.atlassian.net/wiki/spaces/PD/whiteboard/1225490444?atl_f=PAGETREE |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| User pilot |  | * Data<br>* comunicacion | Lograr que este en todos los paises con la v.1 de atributos y eventos | * unificacion de nombres de atributos. (que pasa cuando se cambia el nombre d ueun atributo o un evento).<br>* Como conectamos con Agentes AI. Tienen MCP? base de datos propia con mcp? |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Post hog |  | * data |  | Instalarlo |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Clarity |  | * Comportamiento, mapas de calor y grabaciones |  | Revision del aplicativo, vmiremos si podemos usar user pilot o pothog para hace rlo que hace clarity. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Intercom | Comunicaciones de servicio al cliente. | * tour guiados<br>* poptups<br>* encuestas<br>* correos |  | Pedir los atributos de intercom para clasificarlos y ver que hay y que no |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  | DEfinir los primeros |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  | Formato de nomenclatura de eventos |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | Activacion bruta | Primera orden creada |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | activacion neta | Primer aorden entregada |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | Evento | Comportamiento |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | Atributo | Segmentación |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | Nosotros tenemos user propierties? |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | Lecturas recomendadas | "The Data Taxonomy Playbook" (Amplitude): |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  | Competing Against Luck" (Competir contra la suerte) de Clayton Christensen |  |  | Estado d eplataformas |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  | Intercom on Jobs-to-be-Done" (Intercom) |  |  | tareas |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  | primeros atributos y medicion | que queremos medir primero |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | Jobs to be done |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | 1. Define el "Job" (El trabajo) | Ejemplo de Job: "Quiero conciliar las facturas de mi empresa rápidamente para poder cerrar el mes sin errores contables". |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | 2. Divide el Job en Fases (El Funnel de Valor) | Todo "Trabajo" tiene un ciclo de vida. Vas a agrupar tus eventos (usando el modelo Customer-Relationship-Object) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  | A. Setup (Preparación): ¿Qué tiene que hacer el usuario para empezar el trabajo?<br><br>Evento: import_started (Object: invoice_list). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  | B. Execution (Ejecución): El proceso activo de hacer el trabajo.<br><br>Evento: invoice_matched (Object: bank_transaction). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  | C. Resolution (Finalización/Éxito): El momento en que el usuario logra el valor esperado. Este es el evento más importante de toda tu plataforma.<br><br>Evento: reconciliation_completed (Object: monthly_period). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  | 3. Trackea la "Fricción" (Los eventos negativos) | En JTBD, saber por qué alguien no pudo terminar el trabajo es igual de importante. Debes mapear eventos que te indiquen errores o bloqueos.<br><br>Eventos de fricción: error_encountered (con un atributo error_type: "format_invalid"), o reconciliation_abandoned. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

---

<a id="sheet-matriz-de-decision-rapida"></a>
## Sheet: Matriz de decision rapida

| Tipo de Acción | Ejemplos | Source Recomendado | Herramienta |
| --- | --- | --- | --- |
| Interacción con la interfaz (Clics, scroll, navegación) | checkout_step_viewed, feature_clicked | Client-Side (Web/Mobile) | Userpilot |
| Transacciones y Estado de cuenta (Compras, registros exitosos) | purchase_completed, user_signed_up | Server-Side (Back-end) | Userpilot |
| Eventos fuera de tu plataforma (Emails, Soporte, Pagos externos) | email_bounced, payment_disputed | Cloud / Third-Party | Segun necesidad |

---

<a id="sheet-atributos-system-properties"></a>
## Sheet: Atributos System Properties

| Atributo base de datos | Name User pilot | Name posthog | Name Intercom | Posisible Value | Customer, Object or relation ship | Attribute Name | Data Type | Source | Destinaction | Status | Description |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| country_code |  |  |  |  |  |  | String | Server-Side |  |  | Codigo del pais |
| id | id, user id, user_id |  | User ID |  |  | user_id | String | Server-Side |  |  | Codigo unico del usuario |
| name | name, first_name |  | Name |  |  | name | String | Server-Side |  |  | Primer nombre del usuario |
| surname | last_name |  |  |  |  | last_name | String | Server-Side |  |  | Segundo nombre del usuario |
| email | email |  | Email , CORREO USUARIO |  |  | email | String | Server-Side |  |  | Correo electronico del usuario |
| phone | phone |  | Phone |  |  | phone | Number | Server-Side |  |  | Numero de telefono del usuario |
| dni |  |  |  |  |  |  | String | Server-Side |  |  | Numero de documento de identidad |
| birthday |  |  |  |  |  |  | Timestamp / Date | Server-Side |  |  | Fecha de nacimiento del usuario |
| status |  |  |  |  |  |  | Boolean | Server-Side |  |  | Estado en la plataforma |
| role_id |  |  |  |  |  |  | String | Server-Side |  |  | Codigo del rol (Tipoo de usuario) del usuario |
| parent_seller_id | parent |  | Cuenta padre |  |  | parent_id | String | Server-Side |  |  | Codigo del usuario padre |
| referred_by | referred_by |  | Pertenece a comunidad |  |  | referred_by | String | Server-Side |  |  | Codigo de usuario de la persona que refiere al usuario |
| created_by |  |  |  |  |  |  | String | Server-Side |  |  | Codigo de usuario que creo la cuenta (cuando se crea desde admin) |
| white_brand_id | id |  |  |  |  | white_brand_id | String | Server-Side |  |  | Codigo de la marca blanca |
| subscription_plan_id |  |  |  |  |  |  | String | Server-Side |  |  | Codigo de la suscripcion en Dropi |
| store_name |  |  |  |  |  |  | String | Server-Side |  |  | Nombre de la tienda |
| store_url |  |  |  |  |  |  | String | Server-Side |  |  | Url de la tienda (Referral) |
| store_phone |  |  |  |  |  |  | Number | Server-Side |  |  | Numero de telefono de la tienda |
| store_email |  |  |  |  |  |  | String | Server-Side |  |  | Correo de la tienda |
| url |  |  |  |  |  |  | String | Server-Side |  |  | ?? |
| register_approved |  |  |  |  |  |  | Boolean | Server-Side |  |  | ?? |
| banned |  |  |  |  |  |  | Boolean | Server-Side |  |  | El usuario esta baneado (True o false) |
| approve_product |  |  |  |  |  |  | Boolean | Server-Side |  |  | Aplica para proveedores, se marca que el proveedor tiene aprobacion de los productos por tanto estos se mostraran en el catalogo publico |
| can_create_products_and_edit_stock |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| verified_user |  |  |  |  |  |  | Boolean | Server-Side |  |  | El usuario verifico sus datos personales |
| created_at | signed_up, signed up, created_at |  | signed_up ,  Signed up |  |  | signed_up | Timestamp / Date | Server-Side |  |  | Fecha de creacion del usuario |
| updated_at |  |  |  |  |  |  | Timestamp / Date | Server-Side |  |  | Fecha de actualizacion de los datos del usuario |
| deleted_at |  |  |  |  |  |  | Timestamp / Date | Server-Side |  |  | Fecha de eliminacion del usuario (No se elimina se guarda en otro lado) |
| last_login | last_seen |  | Last seen |  |  | last_seen | Timestamp / Date | Server-Side |  |  | Ultimo ingreso a la plataforma |
| notes |  |  |  |  |  |  | String | Server-Side |  |  | ?? |
| where_do_you_come_from |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| make_rotulo_dropi |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| pts_st |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| whatsapp_company_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| whatsapp_default_project |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| warranty_policies |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| merchant_registration |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| type_liability_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| type_regime_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| municipality_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| type_organization_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| tax_detail_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| type_document_identification_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| file_dni |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| file_rut |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| default_order_state |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| cobrar_orden_con_recaudo |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| comercial_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| send_email_notification_orders |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| failed_login_count |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| email_to_guide |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| name_by_default_in_guide |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| email_to_invoice |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| name_to_invoice |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| cod_area_phone |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| cod_area_phone_otp |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| external_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| urlS3_logo |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| urlS3_dni |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| urlS3_rut |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| billing_type | billing_information |  |  |  |  | billing_information | String | Server-Side |  |  | Nos permite identificar que persona tiene la información de facturación diligenciada en su perfil |
| is_address_normalization_activated |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| dni_type |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| category_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| checked_files |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| last_password_updated_at |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| password_expiration_days |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| password_expired |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| invoice_customer_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| login_otp |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| second_name |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| last_second_name |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| nationality |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| area_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| dni_personal |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| email_contact |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| require_validation_identity |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| dni_invoice |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| type_document_invoice_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| municipality_invoice_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| country_invoice_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| municipality_invoice_name |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| type_organization_invoice_id |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| direccion_invoice |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| phone_invoice |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| pending_freight |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| real_weight_shipping |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| ban_stage |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| banned_until |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| email_account_verified |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| date_personal_data |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| first_order_date |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
| first_order_discount_ds_date |  |  |  |  |  |  |  | Server-Side |  |  | ?? |
|  | full_name |  |  |  |  |  | String | Cloud / Third-Party |  |  | Nombre completo del usuario |
|  | owner_of_comunity |  | Comunidad ID |  |  |  | String | Cloud / Third-Party |  |  | Nombre del dueño de la comunidad |
|  | belong_to_comunity, |  | Owner name |  |  |  | String | Cloud / Third-Party |  |  | id o nombre de la comunidad |
|  | role |  |  |  |  |  | String | Cloud / Third-Party |  |  | Nombre del rol (Tipo de usuario) del usuario |
|  | verified |  |  |  |  |  | String | Cloud / Third-Party |  |  | ?? |
|  | web_sessions |  |  |  |  |  | Number | Cloud / Third-Party |  |  | Cantidad de sesiones del usuario |
|  | browser_language |  |  |  |  |  | String | Cloud / Third-Party |  |  | Lenguaje del navegador usado por el usuario |
|  | user_agent |  |  |  |  |  | String | Cloud / Third-Party |  |  | This property indicates the user-agent a user used to access your site or app |
|  | device_type |  |  |  |  |  | String | Cloud / Third-Party |  |  | Tipo de dispositivo usado por el usuario |
|  | os |  |  |  |  |  | String | Cloud / Third-Party |  |  | Sistema operativo del usuario |
|  | viewport_width |  |  |  |  |  | String | Cloud / Third-Party |  |  | This property indicates the width of the browser window a user viewed your site or app on. |
|  | viewport_height |  |  |  |  |  | String | Cloud / Third-Party |  |  | This property indicates the height of the browser window a user viewed your site or app on. |
|  | browser |  |  |  |  |  | String | Cloud / Third-Party |  |  | This property indicates the browser a user viewed your site or app on. |
|  | name |  |  |  |  |  | String | Cloud / Third-Party |  |  | Nombre de la marca blanca (compañia) |
|  | country |  |  |  |  |  | String | Cloud / Third-Party |  |  | This property indicates the country a user resides in. |
|  | category |  | Lead category |  |  |  | String | Cloud / Third-Party |  |  | nombre del proveedor |
|  |  |  | Owner |  |  |  | String |  |  |  |  |
|  |  |  | Conversation Rating |  |  |  | String |  |  |  |  |
|  |  |  | Email domain |  |  |  | String |  |  |  |  |
|  |  |  | First Seen |  |  |  | Timestamp / Date |  |  |  |  |
|  |  |  | Last contacted |  |  |  | Timestamp / Date |  |  |  |  |
|  |  |  | Last heard from |  |  |  |  |  |  |  |  |
|  |  |  | Tipo de cliente |  |  |  | String |  |  |  |  |
|  |  |  | VIP |  |  |  | String |  |  |  |  |
|  |  |  | origin |  |  |  | String |  |  |  |  |

---

<a id="sheet-goals-drops"></a>
## Sheet: Goals Drops

| Type | Goals: Questions and Jobs-to-be-Done (JTBD) | Setup (Preparación): | Execution (Ejecución) | Resolution (Finalización/Éxito) | Category | Why is this important? | Metrica Output | Role |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Question | ¿El usuario se activa exitosamente? |  |  |  | Activacion |  |  | Dropshipper |
| JTBD | Cuando quiero empezar a vender por internet pero no tengo capital para comprar inventario ni espacio para una bodega , Quiero encontrar un catalogo de productos ganadores y proveedores que encargen de la logistica, Para poder generar ingresos rapidos, automatizar mi logistica y tener mi propio negocio | El registro<br>onboarding:account_created | Busqueda de productos:  product:product_searched | Validacion de identidad exitosa: personal_data:user_verified | Activacion | Porque permite identificar los usuarios activos se la plataforma | Activacion Neta | Dropshipper |
|  |  |  | Agregar el producto a favoritos: product:favorite_added | Primer retiro exitoso: withdrawals:withdrawal_requested | Activacion |  |  | Dropshipper |
|  |  |  | Primera orden entregada: orders:first_order_delivered |  | Activacion |  |  | Dropshipper |
| Question | ¿El usuario se activa parcialmente con exito? |  |  |  | Activacion |  |  | Dropshipper |
| JTBD | Cuando quiero empezar a vender por internet, pero no tengo capital para comprar inventario ni espacio para una bodega, Quiero vender facilmente buscando productos, para pode generar ingresos adicionales | El registro<br>onboarding:account_created | Busqueda de productos:  product:product_searched | Primera orden creada: <br>orders:first_order_created | Activacion | Porque permite identificar los usuarios que crearon su primera orden dentro de la plataforma | Activacion bruta | Dropshipper |
|  |  |  | Agregar el producto a favoritos: product:favorite_added |  | Activacion |  |  | Dropshipper |

---

<a id="sheet-eventos-codigo"></a>
## Sheet: Eventos Codigo

| Modulo | Event name | Event attributes | Event attributes BD | Event atributtes possible value | Description | Type | Source | Destination | Status | Trigger | Col_12 | Col_13 | Col_14 | Col_15 | Col_16 | Col_17 | Col_18 | Col_19 | Col_20 | Col_21 | Col_22 | Col_23 | Col_24 | Col_25 | Col_26 | Col_27 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Registro | onboarding:account_created | user_id | id | "818136" | Codigo unico del usuario | String | Client-Side | Userpilot | Pending | El usuario se registra en la plataforma exitosamente |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | email | email | producto+prov@dropi.co | Correo del usuario | String | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | name | name | "Maria" | Nombre del usuario agregado en el campo de nombre en el registro | String | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | lastname | surname | "Ossa" | Apellido del usuario ingresado en el campo apellido | String | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | phone | phone | "3225903618" | Número de telefono | Number | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | role_id | role_id | 3.0 | codigo unico del rol del usuario | String | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | role |  | "supplier" | Nombre del role | Object / Dictionary | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | parent_seller_id | parent_seller_id |  | Codigo del usuario padre (principal) al que esta asociado este usuario seller | Number | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | referred_by | referred_by |  | Persona normal que refirió al usuario | String | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | comunity_id |  | 1.0 | Codigo de referido por una comunidad | String | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | comunity_name |  | IVAN CAICEDO | Nombre de la comunidad que refirio al usuario | String | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | white_brand_id | white_brand_id | "1" | Codigo unico de la marca blanca.<br>Dropi en la BD esta como una marca blanca, y se identifica con el codigo 1 | String | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | company |  | Dropi | Nombre de la marca blanca | Object / Dictionary | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | country_code | country_code | CO | Codigo del pais | String | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | terms_and_conditions |  | "TRUE" | Terminos y condiciones chequeado | Boolean | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | first_login |  | 2026-03-05 - 07:32 PM | primer logueo | Timestamp / Date | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Registro |  | sign_up | created_at | 2026-03-05 - 07:32 PM | Fecha de creacion del usuario | Timestamp / Date | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Productos | product:product_searched | type_search |  | "clasica" | Tipo de buscador usado para la busqueda | String | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Productos | product:product_filtered | filters_applied |  | "TRUE" | Se aplico el filtro exitosamente | Boolean | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Productos | product:favorite_added | product_id |  | "2014760" | Codigo unico del producto | String | Server-Side | Userpilot | Pending | Agregar el producto a favoritos |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Productos |  | supplier_id |  | "245055" | Codigo unico del proveedor | String | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Productos |  | supplier |  | "Adma" | Nombre del proveedor |  | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Productos |  | screen |  | "catalogo" ; "detalle producto" | pantalla desde el cual se realizo la creacion de la orden | String | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos | orders:first_order_delivered | user_id | id | "818136" | Codigo unico del usuario | String | Server-Side | Userpilot | Pending | La primera orden fue entregada con exito |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | order_date | first_order_date | 2026-03-05 - 07:32 PM | Fecha de creacion de la orden | Timestamp / Date | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | order_type |  | "FINAL_ORDER" | tipo de orden ingresada por integracion o por plataforma | String | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | shop |  | "SHOPIFY-PRODUCTSHOP" | tienda de integracion | String | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | supplier_id |  | "245055" |  | String | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | supplier_category_id | category_id | 1.0 | Codigo del tipo de proveedor | String | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | supplier_category_name |  | "premium" | nombre de la categoria del proveedor | Object / Dictionary | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | product_id |  | "12345" | Codigo unico del producto | String | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | delivery_type |  | "CON RECAUDO" | Metodo de pago | String | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | order_total |  | "52,500" | valor total de la orden | Number | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | carrier |  | "Envia" | transportadora que traslada el producto | String | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  | Por definir | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos | product:product_filtered | supplier_type |  | premium exclusivo | Tipo de proveedor, nivel del proveedor en Dropi | Object / Dictionary | Client-Side | Userpilot | Pending | Buscar el producto ganador |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | price_range |  | "1;1,000,000" |  | Object / Dictionary | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | quantity_range |  | "Menos de 100 unidades" | cantidad de stock disponible | String | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | category_select |  | "Bisuteria" | Categoria del producto | Array / List | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | city_select |  | "Cali" | ciudad de la bodega | Array / List | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | type_search-selector-options |  | "simple" | tipo de producto | String | Client-Side | Userpilot | Pending | Primera orden entregada |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Pedidos |  | filters_applied |  | "TRUE" | Se aplico el filtro exitosamente | Boolean | Client-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Configuraciones | personal_data:verification_data_completed | user_id | id | "818136" | codigo unico del usuario | String | Server-Side | Userpilot | Pending | Se cambia el estado del usuario a verificado |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Configuraciones |  | has_first_name |  | "TRUE" | El primer nombre fue completado | Boolean | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Configuraciones |  | has_last_name |  | "TRUE" | El primer apellido fue completado | Boolean | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Configuraciones |  | has_address |  | "TRUE" | La direccion fue completada | Boolean |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Configuraciones |  | validation_identity | verified_user | "TRUE" | ¿El usuario esta validado? | Boolean | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Configuraciones |  | validation_identity_date | date_personal_data | 2026-03-05 - 07:32 PM | fecha de validacion de identidad | Timestamp / Date | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Configuraciones |  | phone_authentication | phone | "3225903618" | Numero de telefono agregado en los datos de autenticacion | Number | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Configuraciones |  | birthday | birthday | 2026-03-05 00:00:00 | Fecha de nacimiento del usuario | Timestamp / Date | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Configuraciones |  | nationality |  | "CO" "Colombiano" | nacionalidad del usuario | String | Server-Side | Userpilot | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Financiero |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Financiero | withdrawals:withdrawal_requested | user_id | id | "818136" | codigo unico del usuario | String | Server-Side | Por definir | Pending | Se realiza retiro exitoso de la plataforma |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Financiero |  | date_withdrawal_request |  | 2026-03-05 - 07:32 PM | fecha de la solicitud de retiro | Timestamp / Date | Server-Side | Por definir | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Financiero |  | withdrawal_method |  | "Transfer between wallets" | Metodo de retiro de dinero | String | Server-Side | Por definir | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Financiero |  | withdrawals_concept |  | "Envio de ganancias" | Concepto/descripcion de motivo de retiro | String | Server-Side | Por definir | Pending |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

---

<a id="sheet-eventos-tag"></a>
## Sheet: Eventos Tag

| Modulo | Event name | Event attributes | Event atributtes possible value | Type | Source | Destination | Status | Trigger |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Registro | onboarding:account_created | id, user id, user_id | "818136" | String | Cloud / Third-Party | Userpilot | Pending | El usuario se registra en la plataforma exitosamente |
| Registro |  | email | producto+prov@dropi.co | String | Cloud / Third-Party | Userpilot | Pending |  |
| Registro |  | name, first_name | "Producto" | String | Cloud / Third-Party | Userpilot | Pending |  |
| Registro |  | last_name | "Pruebas" | String | Cloud / Third-Party | Userpilot | Pending |  |
| Registro |  | role | PROVEEDOR | String | Cloud / Third-Party | Userpilot | Pending |  |
| Registro |  | parent |  | Number | Cloud / Third-Party | Userpilot | Pending |  |
| Registro |  | category | NO VERIFICADO | String | Cloud / Third-Party | Userpilot | Pending |  |
| Registro |  | belong_to_comunity, | IVAN CAICEDO | String | Cloud / Third-Party | Userpilot | Pending |  |
| Registro |  | id | "1" | String | Cloud / Third-Party | Userpilot | Pending |  |
| Registro |  | company name | dropi | String | Cloud / Third-Party | Userpilot | Pending |  |
| Registro |  | country | Colombia | String | Cloud / Third-Party | Userpilot | Pending |  |
| Registro |  | billing_information | False | Boolean | Cloud / Third-Party | Userpilot | Pending |  |
| Registro |  | signed_up, signed up, created_at | 2026-03-05 - 07:32 PM | Timestamp / Date | Cloud / Third-Party | Userpilot | Pending |  |
| Pedidos | orders:order_canceled | canceled_type=datos_incompletos |  |  |  | Userpilot |  |  |
| Productos | providers:profile_provider_contacted | profile_contact_button=whatsapp | whatsapp | String | Client-Side | Userpilot |  |  |
|  |  | profile_contact_button=contact=CAS | cas | String | Client-Side | Userpilot |  |  |
| Inicio | general:finger_print_used | fingerprint=button_opened |  |  |  | Userpilot |  | El usuario ingreso al boton flotante de huella digital |
|  |  | fingerprint=buyer_details_todas |  |  |  |  |  |  |
|  |  | fingerprint=buyer_details_su tienda |  |  |  |  |  |  |
|  |  | fingerprint=buyer_details_otras tiendas |  |  |  |  |  |  |
|  |  | fingerprint=buyer_details_close button |  |  |  |  |  |  |
|  |  | tilter_type | ultimo ano, ultimo mes, 90 dias | String | Server-Side | Userpilot |  |  |
|  |  | create_order=fingerprint |  |  |  | Userpilot |  |  |
|  |  | orders_edition=fingerprint |  |  |  | Userpilot |  |  |

---

<a id="sheet-diccionario-y-bibliografia"></a>
## Sheet: Diccionario y bibliografia

| Objeto | Descripcion | Ejemplos | Col_4 | Col_5 | Col_6 | Col_7 | Col_8 | Col_9 | Col_10 | Col_11 | Col_12 | Col_13 | Col_14 | Col_15 | Col_16 | Col_17 | Col_18 | Col_19 | Col_20 | Col_21 | Col_22 | Col_23 | Col_24 | Col_25 | Col_26 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Client-Side | Lado del Cliente / Front-end<br>-el evento se dispara directamente desde el dispositivo que el usuario está sosteniendo en sus manos o mirando en su pantalla. El código de tracking se ejecuta en su navegador o en su aplicación móvil | Javascript: button_clicked |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Server-Side | Lado del Servidor / Back-end<br>el evento no sale del teléfono o computadora del usuario, sino que se dispara desde los propios servidores de tu empresa (donde vive la base de datos y la lógica de negocio). | Node.js, Python, Java, Go :<br>order_completed |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Cloud / Third-Party Applications | A veces, la acción que se quiere medir no ocurre ni en el dispositivo del usuario ni en tu propio servidor, sino en la plataforma de un proveedor que tu empresa utiliza. | Intercom: support_ticket_created |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Customer | (El Actor o Sujeto)<br>Es quién realiza la acción. Representa a la entidad que tiene la iniciativa. | Todo lo que lo describe. Ej: customer_id, role (Admin, Viewer), email |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Object | El Objeto, Entidad o Sustantivo)<br>Es sobre qué recae la acción. Es el producto, recurso, contenido o elemento virtual dentro de tu plataforma con el que el "Customer" está interactuando. | En un E-commerce: El Object es el Producto (unos zapatos, un reloj). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Relationship | Es el evento en sí mismo. Es el conector que explica cómo el Customer y el Object interactuaron en un momento exacto en el tiempo. La relación es la acción que une a las dos entidades. | Son los Atributos de Evento, que describen el contexto de esa interacción específica. Ej: timestamp (cuándo ocurrió), source (desde dónde, ej. Server-side), time_spent (cuánto tiempo le tomó). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Atributos y eventos Dropi | Documento con el mapeo inicial de atributos de las diferentes plataformas | Atributos y eventos Dropi |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Eventos Dropi | Documento creado por Harry Hernandez de los eventos en customer IO y Posthog | Eventos Dropi |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Analisis de herramientas de medicion | Documento creado por Miguel Gutierrez con el diagnostico completo del sistema | Analisis de herramientas actuales de monitoreo - dropi web app |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Product Discovery space | Espacio en Confluence en el cual se consolidara el discovery | Atlassian |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Flujo roles dropi | Analisis de los flujos segun cada rol en Dropi | https://lucid.app/lucidchart/52ea0695-9dda-42f6-a2e7-5b3487d2fe61/edit?invitationId=inv_bdb2814b-26a5-49c1-aabd-9cf20ad31f6f&page=TsGguq4OkUu7g# |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Setup Tecnico Kickoff | Documento inicial de setup tecnico planteado en el 2025 | 1. kickoff Setup Tecnico Comunicaciones Dropi |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Eventos de user pilot | si es un atributo: atributte=valor<br>Si es un evento: module:snake_case |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Eventos de backend | module:snake_case | product:product_searched |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Eventos front de user pilot |  | Estructura de datos Userpilot |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Plantilla de eventos |  | https://docs.google.com/spreadsheets/d/1LnY-h5U-x5gTnPY-CvG7-RSZ6pM194vul4IO9kioIZ4/edit?gid=925003682#gid=925003682 |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Eventos dropi app |  | Eventos Dropi app |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Carpeta de Product OPS | Carpeta con la documentacion de OPS | https://drive.google.com/drive/folders/1biSMHbu_IqZiXk4IdewFvC1xnt264hN-?usp=drive_link |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

---

<a id="sheet--pages"></a>
## Sheet: 📄 Pages

| PERFIL | MÓDULO | PANTALLA | URL | Nomenclatura nueva | NOMENCLATURA | CLASIFICACIÓN | IMAGEN PÁGINA | CONFIGURADO | Notas | CR | Arg |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dropshiper/Proveedor/Marca | Home | Botón Intercome |  |  | Botón Intercome_Inicio [Drops/emp/prov] | Evento | Botón Intercome_Inicio [Drops/emp/prov].png | True |  | False | False |
| Dropshiper/Proveedor/Marca | Home | Botón Torre logística |  |  | Botón Torre logística_Inicio [Drops/emp/prov] | Evento | Botón Torre logística_Inicio [Drops/emp/prov].png | True |  | False | False |
| Dropshiper/Proveedor/Marca | Login | Login | /auth/login | login |  |  |  | False |  | False | False |
| Dropshiper/Proveedor/Marca | Inicio | Inicio | /dashboard/home | home | Inicio [Drops/emp/prov] [Dropi] | Página | Inicio [Drops/emp/prov] [Dropi].png | True |  | True | True |
| Dropshiper/Proveedor/Marca | Dashboard | Dashboard | /dashboard/resume | dashboard | Dashboard_Dashboard [Drops/emp/prov] [Dropi] | Página | Dashboard [Drops/emp/prov] [Dropi].png | True |  | True | True |
| Dropshipper | Productos | Catálogo | /dashboard/search | products:search | Catalogo_Productos [Drops] [Dropi] | Página | Productos _ catálogo [Drops/emp/prov] [Dropi].png | True |  | True | True |
| Dropshipper | Productos | Detalle producto | /dashboard/product-details/ |  |  |  |  | False |  | False | False |
| Dropshipper | Productos | Proveedores | /dashboard/providers | products:providers | Proveedores_Productos [Drops] [Dropi] | Página | Productos _ Proveedores [Drops/emp/prov] [Dropi].png | True |  | True | True |
| Proveedor/Marca | Productos | Productos | /dashboard/products | products:products | Productos_Productos [Emp/prov] [Dropi] | Página | Productos [Emp/prov] [Dropi].png | True |  | True | False |
| Dropshipper | Productos | Proveedores |  |  | Negociaciones_Productos [Emp/prov]  [Dropi] | Página |  | False |  | False | False |
| Dropshipper | Productos | Caza Productos |  |  | Caza productos_Productos [Drops] [Dropi] | Página |  | True |  | False | False |
| Proveedor/Marca | Productos | Negociaciones |  |  | Caza productos_Productos [Drops] [Dropi] |  |  | False |  | False | False |
| Dropshipper | Mis pedidos | Mis pedidos | /dashboard/orders | orders:orders | Mis pedidos_Mis pedidos/Órdenes [Drops/emp/prov] [Dropi] | Página | Mis pedidos/Órdenes _ Mis pedidos [Drops/emp/prov] [Dropi].png | True |  | True | True |
| Proveedor/Marca | Ordenes | Ordenes | /dashboard/orders/supplier | orders:supplier |  |  |  | False |  | False | False |
| Dropshiper/Proveedor/Marca | Mis pedidos | Novedades | /dashboard/novelties | orders:novelties | Novedades_Mis pedidos/Órdenes [Drops/emp/prov] [Dropi] | Página | Mis pedidos/Órdenes _ novedades [Drops/emp/prov] [Dropi].png | True |  | True | True |
| Dropshipper | Mis pedidos | Carritos Abandonados |  |  | Carritos abandonados_Mis pedidos/Órdenes [Drops] [Dropi] | Página | Mis pedidos/Órdenes _ carritos abandonados [Drops/emp/prov] [Dropi].png | True |  | False | False |
| Dropshiper/Proveedor/Marca | Mis pedidos | Etiquetas | /dashboard/orders/tags | orders:tags | Etiquetas_Mis pedidos/Órdenes [Drops/emp/prov] [Dropi] | Página | Mis pedidos/Órdenes _ etiquetas [Drops/emp/prov] [Dropi].png | True |  | True | True |
| Proveedor/Marca | Mis pedidos | Manifiesto |  |  | Manifiesto _Mis pedidos/Órdenes [Emp/prov] [Dropi] | Página | Mis pedidos/Órdenes _ Manifiesto [Emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Mis pedidos | Configuración de pedidos | dashboard/orders/orders-setting | orders:settings | Configuración de pedidos_Mis pedidos/Órdenes [Drops/emp/prov] [Dropi] | Página | Mis pedidos/Órdenes _ configuración de pedidos [Drops/emp/prov] [Dropi].png | True |  | False | True |
| Dropshiper/Proveedor/Marca | Mis garantías | Garantías | /dashboard/warranties | warranties:warranties | Garantías_Mis garantías [Drops/emp/prov] [Dropi] | Página | Mis garantías _ garantías [Drops/emp/prov] [Dropi].png | True |  | True | True |
| Dropshiper/Proveedor/Marca | Mis garantías | Ordenes de despacho | /dashboard/orders-dispatch | warranties:orders-dispatch | Ordenes de despacho_Mis garantías [Drops/emp/prov] [Dropi] | Página | Mis garantías _ ordenes de despacho [Drops/emp/prov] [Dropi].png | True |  | True | True |
| Dropshiper/Proveedor/Marca | Mis garantías | Garantías recolecciones | /dashboard/warranties-recollection | warranties:warranties-recollection | Garantías recolecciones_Mis garantías [Drops/emp/prov] [Dropi] | Página | Mis garantías _ garantías recolecciones [Drops/emp/prov] [Dropi].png | True |  | True | True |
| Proveedor/Marca | Logistic | Devoluciones |  |  | Devoluciones_Logistic [Emp/prov] [Dropi] | Página | Logistic_Devoluciones [Emp/prov] [Dropi].png | True | No está en el overview | False | False |
| Proveedor/Marca | Logistic | Salidas |  |  | Salidas_Logistic [Emp/prov] [Dropi] | Página | Logistic_Salidas [Emp/prov] [Dropi].png | True | No está en el overview | False | False |
| Proveedor/Marca | Logistic | Recaudo |  |  | Recaudo_Logistic [Emp/prov] [Dropi] | Página | Logistic_Recaudo [Emp/prov] [Dropi].png | True | No está en el overview | False | False |
| Proveedor/Marca | Logistic | Logistic Management |  |  | Logistic Management_Logistic [Emp/prov] [Dropi] | Página | Logistic_Logistic Management [Emp/prov] [Dropi].png | True | No está en el overview | False | False |
| Dropshiper/Proveedor/Marca | Clientes | Clientes | /dashboard/customers | customers | Clientes_Clientes [Drops/emp/prov] [Dropi] | Página | Clientes [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Clientes | Agregar clientes | /dashboard/customers/add-customer | customers:add-customer |  |  |  | False |  | False | False |
| Dropshiper/Proveedor/Marca | Mis Integraciones | Mis Integraciones | /dashboard/shop | integrations | Mis integraciones_Mis integraciones [Drops/emp/prov] [Dropi] | Página | Mis integraciones [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Mis Integraciones | Agregar integracion | /dashboard/shop/edit?id=* | integrations:edit |  |  |  | False |  | False | False |
| Dropshiper/Proveedor/Marca | Mis Integraciones | Editar integracion | /dashboard/shop/add | integrations:add |  |  |  | False |  | False | False |
| Dropshiper/Proveedor/Marca | Historial de cartera | Historial de cartera | /dashboard/historywallet | historywallet | Historial de cartera_Historial de cartera [Drops/emp/prov] [Dropi] | Página | Historial de cartera [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Mis usuarios | Listado de vendedores | /dashboard/config/sellers | config:sellers | Listado de vendedores _Mis usuarios[Drops] [Dropi] | Página | Mis usuarios _ Listado de vendedores [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Mis usuarios | Agregar vendedor | /dashboard/config/sellers/add | config:sellers_add |  |  |  | False |  | False | False |
| Proveedor/Marca | Mis usuarios | Usuarios logisticos |  |  | Usuarios logpisticos_Mis usuarios [Emp/prov] [Dropi] | Página | Mis usuarios _ Usuarios logisticos [Emp/prov] [Dropi].png | True | No está en el overview | False | False |
| Dropshiper/Proveedor/Marca | Mis referidos | Mis referidos | /dashboard/config/my-referrals | config:my-referrals | Mis referidos_Mis referidos [Drops/emp/prov] [Dropi] | Página | Mis Referidos [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Proveedor/Marca | Bodegas | Bodegas |  |  | Bodegas_Bodegas [Emp/prov] [Dropi] | Página | Bodegas [Emp/prov] [Dropi] | True | No está en el overview | False | False |
| Dropshiper/Proveedor/Marca | Configuraciones | Datos bancarios | /dashboard/settings/bank-data | settings:bank-data | Datos bancarios_Configuraciones [Drops/emp/prov] [Dropi] | Página | Configuraciones _ datos bancarios [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Configuraciones | Planes | /dashboard/settings/plans | settings:plans | Planes_Configuraciones [Drops/emp/prov] [Dropi] | Página | Configuraciones _ planes [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Configuraciones | Configuración de tienda | /dashboard/settings/account | settings:account | Configuración de tienda_Configuraciones [Drops/emp/prov] [Dropi] | Página | Configuraciones _ configuración de tienda [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Configuraciones | Datos personales | /dashboard/settings/personal-data-v1/personal-data-user | settings:personal-data-v1_personal-data-user | Datos personales_Configuraciones [Drops/emp/prov] [Dropi] | Página | Configuraciones _ datos personales[Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Configuraciones | Retiros de saldo | /dashboard/settings/withdrawals | settings:withdrawals | Retiros de saldo_Configuraciones [Drops/emp/prov] [Dropi] | Página | Configuraciones _ retiros de saldo [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Configuraciones | Mis sesiones | /dashboard/settings/my-sessions | settings:my-sessions | Mis sesiones_Configuraciones [Drops/emp/prov] [Dropi] | Página | Configuraciones _ mis sesiones [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Calendario | Calendario | /dashboard/calendar | calendar | Calendario_Calendario [Drops/emp/prov] [Dropi] | Página | Calendario [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Marketing | Campañas |  |  | Campañas_Marketing [Drops/emp/prov] [Dropi] | Página | Marketing _ Campañas [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Marketing | Automatizaciones |  |  | Automatizaciones_Marketing [Drops/emp/prov] [Dropi] | Página | Marketing _ automatizaciones [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Marketing | Configuraciones |  |  | Configuraciones_Marketing [Drops/emp/prov] [Dropi] | Página | Marketing _ Configuraciones [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Reportes | Descargas |  |  | Descargas_Reportes [Drops/emp/prov] [Dropi] | Página | Reportes _ Descargas [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Proveedor/Marca | Reportes | Desempeño Proveeduría |  |  | Desempeño Proveeduría_Reportes [Emp/prov] [Dropi] | Página |  | True | No está en el overview | False | False |
| Dropshipper | Reportes | Productos Vendidos |  |  | Productos vendidos_Reportes [Drops] [Dropi] | Página | Reportes _ Productos vendidos [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshipper | Reportes | Torre logística |  |  | Torre logística_Reportes [Drops/emp/prov] [Dropi] | Página | Reportes _ Torre logística [Drops/emp/prov] [Dropi].png | True |  | False | False |
| Dropshipper | Reportes | Profit Pro |  |  | Profit Pro_Reportes [Drops/emp/prov] [Dropi] | Página | Reportes _ Profit Pro [Drops/emp/prov] [Dropi].png | True |  | False | False |
| Dropshiper/Proveedor/Marca | Reportes | Roax |  |  | Roax_Reportes [Drops/emp/prov] [Dropi] | Página |  | True |  | False | False |
| Dropshiper/Proveedor/Marca | Facturas | Facturas |  |  | Facturas _ Facturas [Drops/emp/prov] [Dropi] | Página | Facturas _ Facturas [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Facturas | Notas de credito |  |  | Notas de crédito_Facturas [Drops/emp/prov] [Dropi] | Página | Facturas _ Notas de crédito[Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | Transportadora | Preferencias |  |  | Preferencias_Transportadora [Drops/emp/prov] [Dropi] | Página | Transportadora _ preferencias [Drops/emp/prov] [Dropi].png | True |  | False | False |
| Proveedor/Marca | Transportadora | Recolecciones |  |  | Recolecciones_Transportadora [Emp/prov] [Dropi] | Página | Transportadora _ Recolecciones [Emp/prov] [Dropi].png | True | No está en el overview | False | False |
| Dropshiper/Proveedor/Marca | Dropi card | Cards |  |  | Cards_Dropi card [Drops/emp/prov] [Dropi] | Página | Dropi card _ Cards [Drops/emp/prov] [Dropi].png | True |  | True | False |
| Dropshiper/Proveedor/Marca | CAS | Bandeja |  |  | Bandeja_CAS [Drops/emp/prov] [Dropi] | Página | CAS _ Bandeja [Drops/emp/prov] [Dropi].png | True |  | False | False |
| Dropshiper/Proveedor/Marca | CAS | Tickets |  |  | Tickets_CAS [Drops/emp/prov] [Dropi] | Página | CAS _ Tickets [Drops/emp/prov] [Dropi].png | True |  | False | False |
|  | Academy | Academy |  |  | Academy _ Academy [Drops/emp/prov] [Dropi] | Página |  |  |  | True | False |
|  | Botón huella digital | Academy |  |  | Botón huella digital_ Huella digital [Drops/emp/prov] [Dropi] | Página |  |  |  | False | False |

---

<a id="sheet-paises"></a>
## Sheet: 📍Paises

| Col_1 | Cobertura por País — Userpilot · Intercom · Customer.io | Col_3 | Col_4 | Col_5 | Col_6 | Col_7 | Col_8 | Col_9 | Col_10 | Col_11 | Col_12 | Col_13 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | País | Código | Userpilot |  |  |  | Intercom | Customer.io<br>(a migrar) | SMTP (Userpilot) | SMTP (Zeptomail) | Staging | Observaciones |
|  |  |  | Front-end activo | Label events | Tracked events Frontend | Tracked events Backend |  |  |  |  |  |  |
|  | Colombia | CO | ✅ Implementado | 732 | 53 | 0.0 | 🔄 Pendiente | ➡️ Migrar a UP | ✅ Implementado | ✅ Implementado | ✅ Implementado | País piloto. Mayor madurez de configuración. Staging activo. 90%+ de los eventos configurados. |
|  | Perú | PE | ✅ Implementado | 37 | 8 | 0.0 | 🔄 Pendiente | ➡️ Migrar a UP | ⚠️ Parcial | ✅ Implementado | N/A | Dominio SMTP caído — requiere verificación en panel Userpilot Email. |
|  | Ecuador | EC | ✅ Implementado | 34 | 18 | 0.0 | 🔄 Pendiente | ➡️ Migrar a UP | ✅ Implementado | ✅ Implementado | N/A | Sin problemas reportados. |
|  | México | MX | ✅ Implementado | 22 | 3 | 0.0 | 🔄 Pendiente | ➡️ Migrar a UP | ✅ Implementado | ✅ Implementado | N/A | Datos con atraso histórico por bug de identify() — ya resuelto. |
|  | Chile | CL | ✅ Implementado | 16 | 2 | 0.0 | 🔄 Pendiente | ➡️ Migrar a UP | ✅ Implementado | ✅ Implementado | N/A | Sin problemas reportados. |
|  | Paraguay | PY | ⚠️ Parcial | 28 | 1 | 0.0 | 🔄 Pendiente | ➡️ Migrar a UP | ✅ Implementado | ✅ Implementado | N/A | Solo datos de usuarios finales, no del equipo de prueba. Pendiente verificación con usuario nuevo. |
|  | Panamá | PA | ⚠️ Parcial | 16 | 1 | 0.0 | 🔄 Pendiente | ➡️ Migrar a UP | ✅ Implementado | ✅ Implementado | N/A | Datos mezclados con usuarios 'John Do' históricos. Crear usuario nuevo y verificar trazabilidad. |
|  | Guatemala | GT | ✅ Implementado | 2 | 1 | 0.0 | 🔄 Pendiente | 🔄 Pendiente | ✅ Implementado | ✅ Implementado | N/A | Datos confirmados pero volumen muy bajo. Sin eventos tracked aún. |
|  | Argentina | AR | ✅ Implementado | 2 | 1 | 0.0 | 🔄 Pendiente | 🔄 Pendiente | 🔄 Pendiente | 🔄 Pendiente | N/A | Instalación activa pero sin configuración de eventos. Pendiente verificación. |
|  | Costa Rica | CR | ✅ Implementado | 1 | 1 | 0.0 | 🔄 Pendiente | 🔄 Pendiente | 🔄 Pendiente | 🔄 Pendiente | N/A | Datos mínimos. Pendiente verificación completa. |
|  | Venezuela | VE | 🔄 Pendiente | — | — | — | 🔄 Pendiente | 🔄 Pendiente | 🔄 Pendiente | 🔄 Pendiente | N/A | Sin datos confirmados de instalación Userpilot. Pendiente verificación. |
|  | España | ES | 🔄 Pendiente | — | — | — | 🔄 Pendiente | 🔄 Pendiente | 🔄 Pendiente | 🔄 Pendiente | N/A | Sin datos confirmados de instalación Userpilot. Pendiente verificación. |

---

<a id="sheet-analisis-estado-actual"></a>
## Sheet: Analisis Estado actual

| Informacion | Detalle | Notas | Herramienta | Sourse | Colombia, | Chile, | México, | Paraguay, | Ecuador, | Perú, | Panamá, | Guatemala, | Argentina, | Costa Rica | Venezuela | España | Col_18 | Col_19 | Col_20 | Col_21 | Col_22 | Col_23 | Col_24 | Col_25 | Col_26 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Metodo de instalacion | wrapToThirdParty | Userpilot usa el mismo método wrapToThirdParty que Customer.io, por lo que comparten la misma<br>estructura de datos.<br><br>app.component.ts:462 <br>user.service.ts:1513 | Userpilot |  | x | x | x | x | x | x | x | x | x | x |  |  |  |  |  |  |  |  |  |  |  |
| Staging |  |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Email SMTP | Envio de correos personalizados | *Dominio de Perú caido<br>*roaxai.com este dominio aparece configurado | Userpilot |  | x | x | x | x | x | x | x | x | x | x |  |  |  |  |  |  |  |  |  |  |  |
| Eventos "label event visually" | Eventos creados desde la herramienta visual |  | Userpilot |  | 732.0 | 16.0 | 22.0 | 28.0 | 34.0 | 37.0 | 16.0 | 2.0 | 2.0 | 1.0 |  |  |  |  |  |  |  |  |  |  |  |
| Eventos "tracked event" de Flujos | Eventos creados desde el tageo de un evento de un flujo |  | Userpilot |  | 53.0 | 2.0 | 3.0 | 1.0 | 18.0 | 8.0 | 1.0 | 1.0 | 1.0 | 1.0 |  |  |  |  |  |  |  |  |  |  |  |
| Eventos "tracked event" backend | Eventos creados desde el codigo |  | Userpilot |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Funcionalidades |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Dashboards |  |  | Userpilot |  | 11.0 | 3.0 | 3.0 | 4.0 | 3.0 | 3.0 | 3.0 | 1.0 | 1.0 | 1.0 |  |  |  |  |  |  |  |  |  |  |  |
| People | Users |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Companies |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Segmentos |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Data | Events |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Explore row events |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Visual labeler |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Pages |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Data managment |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Data Sync |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Analitycs | Trends |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Funnels |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Patchs |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Retention |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Saved Reports |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Sessions | Session replay |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Playlist |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Workflows |  |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Engagement | Flow |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Spotlights |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Embends |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Checklist |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Resource Center |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Mobile |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Email |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Feedback | NPS |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | Surveys |  | Userpilot |  | x |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| Ideas |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
| La idea de empezar aprovechar la función de data sync que nos habilito el equipo de userpilot en su momento para realizar una replica de la data en un big query, cosa que permitiría tener la data recolectada bajo la administración del equipo de producto sin tener que depender de tanto de TI, permitiendo tener una etl para cada celula y automatizando la actualización de los reportes que ellos necesiten (también entendiendo algunas de las limitaciones de los dashboard de userpilot como el no poder múltiples países si no es desde la consola administrativa y desde hay solo se puede filtrar por fecha), ademas de permitir realizar consultas de forma autogestionada y que big query tiene mcp, así lo manejan de momento en estrellas. Ya si no es posible seria bueno que TI nos habilite el espacio en el datalake (que se solicito hace rato) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

---

<a id="sheet---comparativo-funcionalidades"></a>
## Sheet:  🧐 Comparativo funcionalidades

| Col_1 | Comparativo de Funcionalidades por Plataforma | Col_3 | Col_4 | Col_5 | Col_6 | Col_7 |
| --- | --- | --- | --- | --- | --- | --- |
|  | Categoría | Funcionalidad | Intercom | Userpilot | Customer.io | Notas / Decisión |
|  | Comunicación in-app | Tours guiados / onboarding flows | ✅ Implementado | ✅ Implementado | ❌ No implementado | Ambas completamente configuradas. Intercom solo para SAC. Userpilot es la plataforma principal de onboarding. |
|  |  | Pop-ups y banners | ✅ Implementado | ✅ Implementado | ❌ No implementado | Userpilot es la plataforma preferida para comunicación in-app de producto. Intercom para soporte. |
|  |  | Checklists de onboarding | ❌ No implementado | ✅ Implementado | ❌ No implementado | Exclusivo de Userpilot. Útil para guiar al usuario en sus primeros pasos. |
|  |  | Resource Center | ❌ No implementado | ✅ Implementado | ❌ No implementado | Centro de recursos in-app disponible en Userpilot. |
|  |  | Spotlights / tooltips | ⚠️ Parcial | ✅ Implementado | ❌ No implementado | Userpilot tiene Spotlights nativos. Intercom tiene tooltips básicos. |
|  |  | Notificaciones push web | ⚠️ Parcial | ⚠️ Parcial | ✅ Implementado | Customer.io tenía push web como canal nativo. Al migrar, evaluar si Userpilot o el centralizador de Dropi cubre esto. |
|  |  | Notificaciones push mobile | ❌ No implementado | ❌ No implementado | ✅ Implementado | Userpilot tiene módulo Mobile activo. Customer.io también tenía push mobile — migrar triggers a Userpilot. |
|  | Email | Correos transaccionales (vía SMTP) | ❌ No implementado | ✅ Implementado | ✅ Implementado | Customer.io era el trigger de correos transaccionales. Migrar a Userpilot Flows. SMTP (Zeptomail) se mantiene como canal. |
|  |  | Correos de campañas / marketing | ✅ Implementado | ✅ Implementado | ⚠️ Parcial | Intercom y Userpilot cubren correos de campaña. Customer.io se descontinúa. |
|  |  | Segmentación para envío de correos | ✅ Implementado | ✅ Implementado | ⚠️ Parcial | Customer.io tenía problema de unicidad de correo por marca blanca. Userpilot resuelve con workspaces por país. |
|  | Feedback | Encuestas in-app (Surveys) | ✅ Implementado | ✅ Implementado | ❌ No implementado | Ambas en uso activo. Intercom para SAC. Userpilot para feedback de producto y NPS. |
|  |  | NPS | ✅ Implementado | ✅ Implementado | ❌ No implementado | Userpilot NPS activo. Intercom también tiene NPS. Definir cuál es la fuente de verdad. |
|  | SAC y soporte | Chat en vivo con usuarios | ✅ Implementado | ❌ No implementado | ❌ No implementado | Exclusivo de Intercom. Es su función principal en el stack objetivo. |
|  |  | Ticketing / bandeja de casos | ✅ Implementado | ❌ No implementado | ❌ No implementado | CAS de Dropi usa Intercom. Exclusivo de Intercom. |
|  |  | Inbox compartido de equipo | ✅ Implementado | ❌ No implementado | ❌ No implementado | Intercom es la herramienta de SAC. No aplica para las otras plataformas. |
|  | Analytics | Dashboard de usuarios y sesiones | ⚠️ Parcial | ✅ Implementado | ❌ No implementado | Userpilot tiene 11 dashboards en Colombia, 3-4 en otros países. |
|  |  | Funnels de conversión | ❌ No implementado | ✅ Implementado | ❌ No implementado | Userpilot Funnels activo. Será más robusto al recibir eventos backend migrados de Customer.io. |
|  |  | Rutas de usuario (Paths) | ❌ No implementado | ✅ Implementado | ❌ No implementado | Userpilot Paths disponible. |
|  |  | Retención | ❌ No implementado | ✅ Implementado | ❌ No implementado | Userpilot Retention activo. |
|  |  | Tendencias de eventos (Trends) | ❌ No implementado | ✅ Implementado | ❌ No implementado | Userpilot Trends activo. |
|  |  | Análisis de comportamiento (segmentos) | ✅ Implementado | ✅ Implementado | ⚠️ Parcial | Userpilot y Intercom permiten segmentación avanzada. Customer.io tenía segmentación básica. |
|  | Comportamiento | Session Recordings | ❌ No implementado | ✅ Implementado | ❌ No implementado | Userpilot Session Replay activo (5,000 sesiones gratuitas/mes). Candidato a reemplazar Clarity. |
|  |  | Heatmaps | ❌ No implementado | ✅ Implementado | ❌ No implementado | Userpilot Heatmaps disponible. Evaluar reemplazo de Clarity. |
|  |  | Visual Labeler (tag sin código) | ❌ No implementado | ✅ Implementado | ❌ No implementado | Exclusivo de Userpilot. Laura Torres lo usa activamente para crear eventos front-end sin desarrollo. |
|  | Automatizaciones | Flows / Workflows | ✅ Implementado | ✅ Implementado | ✅ Implementado | Customer.io tenía workflows de backend. Migran a Userpilot Flows. Intercom mantiene workflows de SAC. |
|  |  | Triggers por evento de backend | ❌ No implementado | 🔄 Pendiente | ✅ Implementado | Customer.io era el motor de triggers de backend (órdenes, retiros, validaciones). Debe migrar a Userpilot — tarea crítica. |
|  |  | Data Sync → BigQuery | ❌ No implementado | ✅ Implementado | ❌ No implementado | Userpilot habilitó Data Sync. Permite replicar datos a BigQuery. Pendiente implementación por Product Ops + TI. |
|  | Datos | Exportación de datos | ⚠️ Parcial | ✅ Implementado | ⚠️ Parcial | Userpilot tiene Data Management y exportación. Intercom tiene exportaciones limitadas. |
|  |  | Gestión de atributos de usuario | ✅ Implementado | ✅ Implementado | ⚠️ Parcial | Userpilot y Intercom tienen atributos completos. Ver hoja Atributos para detalle. |
|  |  | Sincronización con CRM externo | ✅ Implementado | ⚠️ Parcial | ❌ No implementado | Intercom tiene integraciones con CRM. Userpilot tiene webhooks básicos. |

---

<a id="sheet--comparativo-atributos"></a>
## Sheet: 👤 Comparativo atributos

| Col_1 | Comparativo de Atributos de Usuario — Intercom · Userpilot · Customer.io | Col_3 | Col_4 | Col_5 | Col_6 | Col_7 | Col_8 | Col_9 | Col_10 | Col_11 | Col_12 | Col_13 | Col_14 | Col_15 | Col_16 | Col_17 | Col_18 | Col_19 | Col_20 | Col_21 | Col_22 | Col_23 | Col_24 | Col_25 | Col_26 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | Campo BD | Nombre Userpilot | Nombre Intercom | Nombre Customer.io | Tipo dato | Source | Estado<br>Intercom | Estado<br>Userpilot | Estado<br>Customer.io | Descripción / Notas | Tipo de relación |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | IDENTIFICACIÓN |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | id / user_id | id / user_id | User ID | — | String | Server-Side | ✅ Implementado | ✅ Implementado | ➡️ Migrar a UP | Identificador único del usuario. En Userpilot es el campo principal de identify(). Customer.io lo usaba concatenado con white_brand_id. | Mismo campo. Ambas usan user.id como identificador principal. CRÍTICO mantener consistencia. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | email | email | Email / CORREO USUARIO | email | String | Server-Side | ✅ Implementado | ✅ Implementado | ➡️ Migrar a UP | No único globalmente — mismo correo puede repetirse en distintas marcas blancas. UP resuelve con workspaces por país. | Mismo campo. No único globalmente — el workspace por país en UP y los roles activos en Intercom resuelven esto. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | name | first_name / name | Name | — | String | Server-Side | ✅ Implementado | ✅ Implementado | ➡️ Migrar a UP | Primer nombre del usuario. | Intercom concatena en full_name. Userpilot separa first_name y last_name. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | surname | last_name | — | — | String | Server-Side | ⚠️ Parcial | ✅ Implementado | ➡️ Migrar a UP | Apellido. Intercom usa full_name concatenado. | Intercom concatena en full_name. Userpilot separa first_name y last_name. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | full_name / name | Name | — | String | Cloud / Third-Party | ✅ Implementado | ✅ Implementado | N/A | Nombre completo. Generado automáticamente por Userpilot. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | created_at | signed_up / created_at | signed_up / Signed up | — | Timestamp | Server-Side | ✅ Implementado | ✅ Implementado | ➡️ Migrar a UP | Fecha de creación de la cuenta. | Mismo campo con nombres distintos. Fecha de registro del usuario. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | last_login | last_seen | Last seen | — | Timestamp | Server-Side | ✅ Implementado | ✅ Implementado | ➡️ Migrar a UP | Último ingreso a la plataforma. | Mismo campo. Último ingreso a la plataforma. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | PERFIL DEL USUARIO |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | role_id | role | Tipo de cliente | — | String | Server-Side | ✅ Implementado | ✅ Implementado | ➡️ Migrar a UP | Tipo de usuario: Dropshipper, Proveedor (Supplier), Seller, Marca. Intercom lo llama 'Tipo de cliente'. | Mismo dato, nombres distintos. Intercom: 'Tipo de cliente'. Userpilot: 'role'. Valores: Dropshipper, Supplier, Seller, Marca. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | phone | phone | WhatsApp number | — | Number | Server-Side | ✅ Implementado | ✅ Implementado | ➡️ Migrar a UP | Número de teléfono. Intercom lo expone como WhatsApp number. | Mismo número. Intercom lo etiqueta como 'WhatsApp number'. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | verified_user | verified | Proveedor verificado | — | Boolean | Server-Side | ✅ Implementado | ✅ Implementado | ➡️ Migrar a UP | Si el usuario verificó su identidad. Intercom: 'SI'/'NO'. Userpilot: boolean. | Mismo estado. Intercom: 'SI'/'NO'. Userpilot: boolean. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | billing_type | billing_information | — | — | Boolean/String | Server-Side | ❌ No implementado | ✅ Implementado | N/A | Datos de facturación completos. Solo en Userpilot. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | white_brand_id | company → id | — | — | String | Server-Side | ❌ No implementado | ✅ Implementado | ➡️ Migrar a UP | ID de marca blanca. Dropi = 1. En Customer.io se concatenaba al email como workaround. | Solo en Userpilot. Intercom no tiene este campo. Era el campo problemático en Customer.io (concatenación con email). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | company → name | — | — | String | Cloud / Third-Party | ❌ No implementado | ✅ Implementado | N/A | Nombre de la marca blanca. Generado automáticamente por Userpilot. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | category | Lead category | — | String | Cloud / Third-Party | ✅ Implementado | ✅ Implementado | N/A | Categoría del usuario (NO VERIFICADO, VERIFICADO, etc.). Intercom: 'Lead category'. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | comercial_id | — | VIP | — | Boolean | Server-Side | ✅ Implementado | ❌ No implementado | N/A | Intercom marca VIP si comercial_id === 5647. No existe en Userpilot — pendiente implementar si se necesita. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | PLAN Y SUSCRIPCIÓN |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | subscription_plan_id | — | Para SELLER: _plan.type | — | String | Server-Side | ✅ Implementado | 🔄 Pendiente | ➡️ Migrar a UP | Plan del usuario. Intercom lo incluye en Tipo de cliente para SELLER. Userpilot pendiente de implementar. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | — | — | — | — | — | N/A | 🔄 Pendiente | N/A | Atributos de plan (plan_type, plan_start_date, plan_expiration) aún no están definidos en Userpilot. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | COMUNIDAD Y JERARQUÍA |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | referred_by | referred_by | — | — | String | Server-Side | ❌ No implementado | ✅ Implementado | ➡️ Migrar a UP | ID del usuario o código que refirió al usuario. | Mismo concepto, granularidad distinta. Intercom: 'SI'/'NO' + ID + nombre del dueño. Userpilot: objeto {id, name}. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | belong_to_comunity → id/name | Pertenece a comunidad / Comunidad ID | — | Object | Server-Side | ✅ Implementado | ✅ Implementado | ➡️ Migrar a UP | Si el usuario pertenece a una comunidad. Intercom: 'SI'/'NO' + Comunidad ID. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | owner_of_comunity → id/name | Comunidad (nombre dueño) | — | Object | Server-Side | ✅ Implementado | ✅ Implementado | N/A | Si el usuario es dueño de una comunidad. Intercom lo llama 'Comunidad'. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | parent_seller_id | parent → id/role | Cuenta padre | — | Object | Server-Side | ✅ Implementado | ✅ Implementado | ➡️ Migrar a UP | Cuenta padre para usuarios SELLER. Intercom: email del parent_seller. Userpilot: {id, role}. | Mismo concepto, formato distinto. Intercom envía el email del parent_seller. Userpilot envía objeto {id, role}. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | country_code | — | — | — | String | Server-Side | N/A | 🔄 Pendiente | ➡️ Migrar a UP | Código de país. Pendiente implementar en Userpilot como atributo explícito (aunque el workspace separa por país). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | AUTOMÁTICOS — Userpilot (Cloud/Third-Party) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | web_sessions | — | — | Number | Cloud/Third-Party | N/A | ✅ Implementado | N/A | Cantidad de sesiones. Generado automáticamente por Userpilot. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | browser_language | — | — | String | Cloud/Third-Party | N/A | ✅ Implementado | N/A | Lenguaje del navegador. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | device_type | — | — | String | Cloud/Third-Party | N/A | ✅ Implementado | N/A | Tipo de dispositivo (mobile, desktop). |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | os | — | — | String | Cloud/Third-Party | N/A | ✅ Implementado | N/A | Sistema operativo. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | browser | — | — | String | Cloud/Third-Party | N/A | ✅ Implementado | N/A | Navegador del usuario. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | country | — | — | String | Cloud/Third-Party | N/A | ✅ Implementado | N/A | País detectado por IP. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | viewport_width / viewport_height | — | — | String | Cloud/Third-Party | N/A | ✅ Implementado | N/A | Dimensiones del viewport. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | user_agent | — | — | String | Cloud/Third-Party | N/A | ✅ Implementado | N/A | User-agent del dispositivo. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | EXCLUSIVOS INTERCOM |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | — | Conversation Rating | — | String | Cloud/Third-Party | ✅ Implementado | N/A | N/A | Calificación de conversaciones de soporte. Solo relevante para SAC. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | — | Email domain | — | String | Cloud/Third-Party | ✅ Implementado | N/A | N/A | Dominio del correo del usuario. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | — | First Seen / Last contacted / Last heard from | — | Timestamp | Cloud/Third-Party | ✅ Implementado | N/A | N/A | Fechas de interacción de soporte. Exclusivas de Intercom SAC. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | — | Tipo de cliente / VIP / origin | — | String | Cloud/Third-Party | ✅ Implementado | N/A | N/A | Atributos de clasificación internos de Intercom. VIP basado en comercial_id === 5647. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | SIN IMPLEMENTAR — Userpilot (campos nulos) |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | is_chatea_enabled (null) | — | — | Boolean | Server-Side | N/A | 🔄 Pendiente | N/A | Campo null en Userpilot — pendiente implementar si Chatea Pro se integra. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | have_dropi_card (null) | — | — | Boolean | Server-Side | N/A | 🔄 Pendiente | N/A | Campo null — pendiente implementar para segmentar usuarios con Dropicard. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | cas_requests_quantity (null) | — | — | Number | Server-Side | N/A | 🔄 Pendiente | N/A | Campo null — cantidad de solicitudes CAS del usuario. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
|  | — | orders_quantity (null) | — | — | Number | Server-Side | N/A | 🔄 Pendiente | N/A | Campo null — total de órdenes del usuario. Crítico para segmentar usuarios activos. |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

---

<a id="sheet-eventos-de-activacion-base"></a>
## Sheet: Eventos de activacion base

| Col_1 | Pagina | Sub pagina | Rol | Evento de activación de flujo | Metrica de valor de usuario | Tipo de cliente | Intervalo de tiempo | Descripción técnica del evento | Objetivo estratégico | Fuente | Columna 1 | Columna 2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  | Home | No aplica | Dropshipper / Supplier | Duración de la sesión en pantalla | Adopción, Retención, Satisfacción | Usuario avanzado, Usuario intermedio | Diario | Métrica de tiempo de permanencia del usuario para consumo de contenido informativo de banners. | Captar la atención del usuario e informar sobre aspectos relevantes de la plataforma o redirigir a funcionalidades específicas. | Frontend |  |  |
|  | Home | No aplica | Dropshipper / Supplier | Interacción con elementos en pantalla (carruceles, botones, enlaces, etc...) | Adopción, Retención, Satisfacción | Usuario inicial, Usuario intermedio | Diario | Registro de clics o interacciones del usuario con elementos gráficos (banners) u otros elementos que esten en la pantalla (carruceles, botones, enlaces, etc...) que contienen información o enlaces de redirección. |  | Frontend |  |  |
|  | Dashboard | No aplica | Dropshipper / Supplier | Duración de la sesión en pantalla | Adopción, Retención, Satisfacción | Usuario avanzado, Usuario intermedio | Semanal | Métrica de tiempo de permanencia del usuario para análisis de métricas e indicadores de rendimiento del negocio. |  | Frontend y backend |  |  |
|  | Dashboard | No aplica | Dropshipper / Supplier | Interacción con filtro de fechas o de tienda | Adopción, Retención, Satisfacción | Usuario avanzado, Usuario intermedio | Semanal | Activación del control para modificar el rango temporal de los datos visualizados o activación del control para seleccionar una tienda específica para el análisis de datos. |  | Frontend |  |  |
|  | Productos | Catálogo | Dropshipper | Interacción con botón enviar producto > enviar producto (venta manual) | Adopción, Retención, Satisfacción | Usuario inicial, Usuario intermedio | Diario | Ejecución de la acción de confirmación para el envío de un producto a un cliente mediante el proceso de venta manual. | Optimizar la búsqueda y selección de productos según criterios específicos (filtros) con alto potencial de venta para la tienda del usuario. | Frontend | jehiden jimenez<br><br>815457 | 48811.0 |
|  | Productos | Catálogo | Dropshipper | Interacción con botón agregar a favoritos (venta integración) | Adopción, Retención, Satisfacción | Usuario inicial, Usuario intermedio, Usuario avanzado | Diario | Almacenamiento de un producto en una lista personalizada para acceso rápido y posterior gestión. |  | Frontend y backend |  |  |
|  | Productos | Catálogo | Dropshipper | Interacción con botón aplicar filtros (buscador) | Adopción, Retención, Satisfacción | Usuario inicial, Usuario intermedio, Usuario avanzado | Diario | Ejecución de la consulta con la aplicación de filtros seleccionados: tipo de proveedor, rango de precio, stock, categorías y ubicación geográfica (ciudad). |  | Frontend |  |  |
|  | Productos | Catálogo | Dropshipper | Copiar id de producto (detalle de producto) |  | Usuario inicial |  |  |  |  |  |  |
|  | Productos | Proveedores | Dropshipper | Interacción con botón agregar a Favoritos | Adopción, Retención, Satisfacción | Usuario inicial, Usuario intermedio, Usuario avanzado | Diario | Almacenamiento de un proveedor en una lista personalizada para acceso rápido. | Facilitar la identificación y el acceso a proveedores estratégicos según criterios específicos (filtros) para el modelo de negocio. | Frontend y backend |  |  |
|  | Productos | Proveedores | Dropshipper | Interacción con botón aplicar filtros (buscador) | Adopción, Retención, Satisfacción | Usuario inicial, Usuario intermedio, Usuario avanzado | Diario | Ejecución de la consulta con la aplicación de filtros seleccionados: tipo de proveedor, ubicación geográfica (ciudad) y categoría. | Explora y filtra proveedores estratégicos según criterios de negocio. Identifica rápidamente los mejores proveedores para tu modelo de dropshipping. | Frontend |  |  |
|  | Productos | Caza productos | Dropshipper | Interacción con botón crear publicación > publicar | Satisfacción | Usuario avanzado | Unico | Activación del proceso de creación y difusión de una solicitud de producto a la red de proveedores. | Permitir al usuario solicitar de manera colectiva a los proveedores el suministro de productos no disponibles actualmente en el catálogo. | Frontend |  |  |
|  | Productos | Productos | Supplier | Interacción con botón agregar > guardar | Adopción, Retención, Satisfacción | Usuario inicial, Usuario intermedio, Usuario avanzado | Semanal | Activación del proceso de registro de nuevos productos que estarán disponibles para la comercialización por parte de los dropshippers. | Integrar el inventario del proveedor al catálogo de dropi para generar oportunidades de venta a través de los dropshippers. | Frontend |  |  |
|  | Mis pedidos | Órdenes | Dropshipper / Supplier | Posibles Múltiples Eventos PENDIENTE POR USUARIO ADMIN | Adopción, Retención, Satisfacción |  | Diario | PENDIENTE DE DEFINICIÓN | Permite a dropshippers y proveedores coordinar eficientemente el ciclo completo de una venta: desde que un cliente compra en la tienda del dropshipper hasta que el proveedor entrega el producto. Centraliza seguimiento en tiempo real, gestión de estados, comunicación entre partes y resolución de problemas logísticos. | PENDIENTE DE FUENTE |  |  |
|  | Mis pedidos | Novedades | Dropshipper / Supplier | Posibles Múltiples Eventos PENDIENTE POR USUARIO ADMIN | Adopción, Retención, Satisfacción |  | Diario | PENDIENTE DE DEFINICIÓN | Centraliza las novedades de órdenes en un panel único. Gestiona problemas según plazos de transportadora para evitar devoluciones automáticas. | PENDIENTE DE FUENTE |  |  |
|  | Mis pedidos | Etiquetas | Dropshipper / Supplier | Interacción con botón nueva etiqueta > agregar | Satisfacción |  | Unico | Ejecución de la creación de un identificador categórico (etiqueta) que puede ser asignado a cada pedido. | Modulo de creacion y gestion de etiquetas para organizar y categorizar tus órdenes. Facilita búsqueda rápida y segmentación de inventario en la plataforma. | Frontend |  |  |
|  | Mis pedidos | Configuración de Pedidos (Validación de Direcciones) | Dropshipper / Supplier | Interacción con Interruptor de verificación de direcciones > guardar | Satisfacción |  | Unico | Activación del registro de la configuración predeterminada para la normalización automática de direcciones. | Implementar el ajuste automático del formato de dirección proporcionado por el cliente al estándar DANE requerido por las transportadoras. | Frontend |  |  |
|  | Logistic | Devoluciones | Supplier | Posibles Múltiples Eventos PENDIENTE POR USUARIO | Adopción, Retención, Satisfacción |  | Diario | PENDIENTE DE DEFINICIÓN |  | PENDIENTE DE FUENTE |  |  |
|  | Logistic | Salidas | Supplier | Posibles Múltiples Eventos PENDIENTE POR USUARIO | Adopción, Retención, Satisfacción |  | Diario | PENDIENTE DE DEFINICIÓN |  | PENDIENTE DE FUENTE |  |  |
|  | Logistic | Recaudo | Supplier | Posibles Múltiples Eventos PENDIENTE POR USUARIO | Adopción, Retención, Satisfacción |  | Diario | PENDIENTE DE DEFINICIÓN |  | PENDIENTE DE FUENTE |  |  |
|  | Logistic | Logistic management | Supplier | Posibles Múltiples Eventos PENDIENTE POR USUARIO | Adopción, Retención, Satisfacción |  | Diario | PENDIENTE DE DEFINICIÓN |  | PENDIENTE DE FUENTE |  |  |
|  | Mis Garantías | Garantías | Dropshipper / Supplier | Interacción menú desplegable acciones > descargar en excel | Adopción, Retención, Satisfacción |  | Diario | Activación de la descarga de la información de garantías en formato de hoja de cálculo (Excel). | El módulo de Garantías permite a dropshippers gestionar reclamos de clientes por productos defectuosos, incorrectos o dañados, coordinando la resolución con proveedores de manera transparente y rastreable. Centraliza el ciclo completo: solicitud, evaluación, aprobación, reembolso/reenvío y cierre, protegiendo la reputación del dropshipper y asegurando responsabilidad del proveedor. | Frontend |  |  |
|  | Mis Garantías | Garantías | Dropshipper / Supplier | Interacción botón filtro > aceptar | Adopción, Retención, Satisfacción |  | Diario | Aplicación de los criterios de filtrado seleccionados a la visualización de garantías. |  | Frontend |  |  |
|  | Mis Garantías | Órdenes despachos | Dropshipper / Supplier | PENDIENTE DE DEFINICIÓN | Adopción, Retención, Satisfacción |  | Diario | PENDIENTE DE DEFINICIÓN |  | PENDIENTE DE FUENTE |  |  |
|  | Mis Garantías | Garantías recolecciones | Dropshipper / Supplier | PENDIENTE DE DEFINICIÓN | Adopción, Retención, Satisfacción |  | Diario | PENDIENTE DE DEFINICIÓN |  | PENDIENTE DE FUENTE |  |  |
|  | Clientes | No aplica | Dropshipper | Interacción botón exportar | Satisfacción | Usuario avanzado | Unico | Activación de la exportación del listado de clientes. | Generar un archivo con la base de datos de clientes para uso externo y actualizar la base de datos de clientes mediante una importación masiva o registro manual. | Frontend |  |  |
|  | Clientes | No aplica | Dropshipper | Interacción botón importar > procesar | Satisfacción | Usuario avanzado | Unico | Activación de la carga y procesamiento de un archivo externo con datos de clientes. |  | Frontend |  |  |
|  | Clientes | No aplica | Dropshipper | Interacción botón agregar > guardar | Satisfacción | Usuario avanzado | Unico | Registro de un nuevo cliente de forma individual. |  | Frontend |  |  |
|  | Mis Integraciones | No aplica | Dropshipper / Supplier | Interacción botón agregar > guardar | Satisfacción | Usuario inicial, Usuario intermedio | Unico | Registro de una nueva configuración de integración con plataformas externas. | Establecer conectividad con otros sistemas (e-commerce, roax, chatea pro.). | Frontend |  |  |
|  | Historial de Cartera | No aplica | Dropshipper / Supplier | Interacción botón descargar en excel |  |  |  | Activación de la descarga del historial de transacciones de cartera en formato Excel. | Obtener un registro detallado de los movimientos de cartera y permitir la recarga y transferencia entre cuentas propias | Frontend |  |  |
|  | Historial de Cartera | No aplica | Dropshipper / Supplier | Respuesta positiva de recarga de cartera desde el servidor |  |  |  | Confirmación exitosa por parte del backend de una transacción de recarga de saldo en cartera. |  | Backend |  |  |
|  | Mis Usuarios | No aplica / listado de vendedores | Dropshipper / Supplier | Interacción con botón agregar > guardar | Satisfacción |  | Unico | Registro de un nuevo usuario o subcuenta dentro de la plataforma. | Administrar el acceso y los permisos de múltiples usuarios. | Frontend |  |  |
|  | Mis Usuarios | Usuarios logisticos | Supplier | Interacción con botón agregar > guardar | Satisfacción |  | Unico | Registro de un nuevo usuario o subcuenta dentro de la plataforma. |  | Frontend |  |  |
|  | Mis Referidos | No aplica | Dropshipper | Interacción con filtro de fecha | Satisfacción |  | Mensual | Activación del control para limitar la visualización de referidos a un período específico. | Generar un archivo de datos de referidos para análisis o visualizar rapidamente los nuevos referidos regsitrados. | Frontend |  |  |
|  | Mis Referidos | No aplica | Dropshipper | Interacción con el botón descargar | Satisfacción |  | Mensual | Activación de la exportación del listado de referidos. |  | Frontend |  |  |
|  | Configuraciones | Datos bancarios | Dropshipper / Supplier | Interacción con botón agregar cuenta > aceptar | Satisfacción |  | Unico | Registro de una nueva cuenta bancaria para la gestión de transacciones. | Facilitar la administración financiera y los procesos de pago/cobro y actualizar la información bancaria registrada. | Frontend |  |  |
|  | Configuraciones | Datos bancarios | Dropshipper / Supplier | Interacción con botón editar > aceptar | Satisfacción |  | Unico | Modificación y confirmación de los datos de una cuenta bancaria existente. |  | Frontend |  |  |
|  | Configuraciones | Planes | Dropshipper / Supplier | No aplica | Satisfacción |  | Unico | No aplica, esta pantalla es principalmente informativa. | Mostrar los diferentes planes de servicio disponibles. | No aplica |  |  |
|  | Configuraciones | Configuración de tienda | Dropshipper | Interacción con botón guardar | Satisfacción |  | Unico | Activación del registro de las modificaciones realizadas a la configuración de la tienda. | Persistir los ajustes de configuración específicos del dropshipper. | Frontend |  |  |
|  | Calendario | No aplica | Dropshipper / Supplier | Interacción con filtros de fecha, tienda y botón filtro | Adopción, Retención, Satisfacción | Usuario avanzado, Usuario intermedio |  | Aplicación de criterios de búsqueda (rango temporal, unidad de negocio) a la visualización del calendario. | Segmentar la información del calendario para un periodo específico u obtener una vista del rendimiento o eventos del ultimo período mensual. | Frontend |  |  |
|  | Calendario | No aplica | Dropshipper / Supplier |  |  |  |  |  |  |  |  |  |
|  | Calendario | No aplica | Dropshipper / Supplier | Interacción con botón resumen del Mes | Adopción, Retención, Satisfacción | Usuario avanzado, Usuario intermedio |  | Activación de un reporte consolidado o resumen de las actividades del mes. |  | Frontend |  |  |
|  | Marketing | Campañas | Dropshipper / Supplier | Posibles múltiples eventos PENDIENTE POR USUARIO ADMIN |  |  |  | PENDIENTE DE DEFINICIÓN | PENDIENTE DE DEFINICIÓN | PENDIENTE DE FUENTE |  |  |
|  | Marketing | Automatización | Dropshipper / Supplier | Posibles múltiples eventos PENDIENTE POR USUARIO ADMIN |  |  |  | PENDIENTE DE DEFINICIÓN | PENDIENTE DE DEFINICIÓN | PENDIENTE DE FUENTE |  |  |
|  | Marketing | Configuraciones | Dropshipper / Supplier | Posibles múltiples eventos PENDIENTE POR USUARIO ADMIN |  |  |  | PENDIENTE DE DEFINICIÓN | PENDIENTE DE DEFINICIÓN | PENDIENTE DE FUENTE |  |  |
|  | Reportes | Descargas | Dropshipper / Supplier | Posibles múltiples eventos PENDIENTE POR USUARIO ADMIN |  |  |  | PENDIENTE DE DEFINICIÓN | PENDIENTE DE DEFINICIÓN | PENDIENTE DE FUENTE |  |  |
|  | Reportes | Productos Vendidos | Dropshipper | Posibles múltiples eventos PENDIENTE POR USUARIO ADMIN |  |  |  | PENDIENTE DE DEFINICIÓN | PENDIENTE DE DEFINICIÓN | PENDIENTE DE FUENTE |  |  |
|  | Reportes | Torre Logística | Dropshipper | Posibles múltiples eventos PENDIENTE POR USUARIO ADMIN |  |  |  | PENDIENTE DE DEFINICIÓN | PENDIENTE DE DEFINICIÓN | PENDIENTE DE FUENTE |  |  |
|  | Reportes | Roax | Dropshipper | Posibles múltiples eventos PENDIENTE POR USUARIO ADMIN |  |  |  | PENDIENTE DE DEFINICIÓN | PENDIENTE DE DEFINICIÓN | PENDIENTE DE FUENTE |  |  |
|  | Reportes | Desempeño Proveeduría | Supplier | Posibles múltiples eventos PENDIENTE POR USUARIO ADMIN |  |  |  | PENDIENTE DE DEFINICIÓN | PENDIENTE DE DEFINICIÓN | PENDIENTE DE FUENTE |  |  |
|  | Facturas | Facturas | Dropshipper / Supplier | Interacción con botón buscar / filtro de Fechas | Retención, Adopción, Satisfacción |  | Semanal | Aplicación de criterios de búsqueda (rango temporal) para localizar facturas específicas. | Facilitar la localización y consulta de documentos fiscales y generar un registro detallado de las facturas emitidas. | Frontend |  |  |
|  | Facturas | Facturas | Dropshipper / Supplier | Interacción con botón exportar excel | Retención, Adopción, Satisfacción |  | Semanal | Activación de la descarga del listado de facturas en formato Excel. |  | Frontend |  |  |
|  | Facturas | Notas Crédito | Dropshipper / Supplier | Interacción con botón buscar / filtro de Fechas | Retención, Adopción, Satisfacción |  | Semanal | Aplicación de criterios de búsqueda (rango temporal) para localizar notas crédito específicas. | Facilitar la localización y consulta de notas crédito y generar un registro detallado de las notas crédito emitidas. | PENDIENTE DE FUENTE |  |  |
|  | Facturas | Notas Crédito | Dropshipper / Supplier | Interacción con botón exportar excel | Retención, Adopción, Satisfacción |  | Semanal | Activación de la descarga del listado de notas crédito en formato Excel. |  | PENDIENTE DE FUENTE |  |  |
|  | Transportadoras | Preferencias | Dropshipper | Cambio en el orden de prioridad de transportadora | Satisfacción |  | Unico | Modificación en el algoritmo o secuencia de selección preferencial de empresas de transporte. | Optimizar la asignación de transportadoras para el despacho de pedidos y personalizar la logística de envío en función de la cobertura por ciudad de las transportadoras. | Backend |  |  |
|  | Transportadoras | Preferencias | Dropshipper | Interacción con selector de transportadora por ciudad | Satisfacción |  | Unico | Definición de la empresa de transporte preferida según la ubicación geográfica de destino. |  | Backend |  |  |
|  | Dropicard | Tarjetas | Dropshipper / Supplier | Interacción paso 3 de ventana emergente botón solicitar tarjeta | Adopción, Satisfacción |  | Unico | Finalización del flujo de solicitud de la tarjeta de crédito o débito (dropicard). | Iniciar el proceso de emisión del instrumento financiero para el usuario. | Frontend |  |  |
|  | Dropicard | Tarjetas | Dropshipper / Supplier | Posibles múltiples eventos PENDIENTE POR USUARIO ADMIN |  |  |  | PENDIENTE DE DEFINICIÓN | PENDIENTE DE DEFINICIÓN | PENDIENTE DE FUENTE |  |  |
|  | Cas | Bandeja | Dropshipper / Supplier | Posibles múltiples eventos PENDIENTE POR USUARIO ADMIN | Adopción, Retención, Satisfacción |  | Diario | PENDIENTE DE DEFINICIÓN | PENDIENTE DE DEFINICIÓN | PENDIENTE DE FUENTE |  |  |
|  | Cas | Bandeja de Casos | Dropshipper | Posibles múltiples eventos PENDIENTE POR USUARIO ADMIN | Adopción, Retención, Satisfacción |  | Diario | PENDIENTE DE DEFINICIÓN | PENDIENTE DE DEFINICIÓN | PENDIENTE DE FUENTE |  |  |
|  | Cas | Tickets | Dropshipper / Supplier | Posibles múltiples eventos PENDIENTE POR USUARIO ADMIN | Adopción, Retención, Satisfacción |  | Diario | PENDIENTE DE DEFINICIÓN | PENDIENTE DE DEFINICIÓN | PENDIENTE DE FUENTE |  |  |
|  | Academy | No aplica | Dropshipper / Supplier | Interacción botón acceder a dropi academy | Adopción, Satisfacción |  | Unico | Activación de la redirección a la página externa de recursos de capacitación (linktree de dropi academy). | Proporcionar acceso a cursos de formación sobre el funcionamiento de dropi y el modelo dropshipping. | Frontend |  |  |
|  | Academy | No aplica | Dropshipper / Supplier | Interacción con banners de cursos | Adopción, Satisfacción |  | Unico | Activación de la redirección a la página de inscripción del curso seleccionado en el banner. |  | Frontend |  |  |
|  | Bodegas | No aplica | Supplier | Interacción botón agregar > Guardar | Satisfacción |  | Unico | Registro de una nueva ubicación física (bodega) para el almacenamiento de productos. | Establecer referencias de recolección para las transportadoras al generar órdenes de despacho. | Frontend |  |  |
|  | Ordenes | Mis pedidos | Supplier |  |  |  |  |  |  |  |  |  |
|  | Ordenes | Manifiesto | Supplier |  |  |  |  |  |  |  |  |  |

---
