/**
 * E2E Docs API v2.1 — Navegador Estructural
 *
 * Basada en la propuesta de Gemini (leer_seccion / reescribir_bloque /
 * agregar_vineta / actualizar_tabla) + los candados que ya teníamos en
 * la versión anterior en producción:
 *   - Token de autenticación (Script Property E2E_API_TOKEN, ya existe: no hay que recrearla)
 *   - Nada de crear documentos como efecto secundario: crear_doc es una acción explícita
 *   - Parámetro opcional "tab" para desambiguar títulos repetidos entre pestañas
 *   - LockService para que dos llamadas simultáneas no dupliquen documentos
 *   - ping / listar_tabs / listar_secciones para diagnóstico sin escribir nada
 *
 * Novedades v2.1:
 *   - reescribir_bloque: las líneas que empiezan con "- " se insertan como
 *     viñetas NATIVAS (clonadas de una semilla real). Indentación de 2 espacios
 *     por nivel de anidación ("  - " = subnivel). Las demás líneas son párrafos.
 *   - agregar_vineta: si la sección no tiene viñeta semilla propia, clona una
 *     de la misma pestaña o de cualquier pestaña del documento (fallback global).
 *
 * Reglas de contenido:
 *   - Nada de "•", "●" ni numeración manual: el script clona viñetas nativas.
 *   - Único markdown permitido: **negrita** y el prefijo "- " en reescribir_bloque.
 *   - Los títulos ancla deben ser headings exactos del documento.
 */

var ID_PLANTILLA = '1pw2H33wc4jGrHRFNLdyl6U4M7sXu76FLzkIlhQX9DZg';
var ID_CARPETA_RAIZ = '0AOkYLQNX3eU8Uk9PVA';
var VERSION = 'v2.1.2-navegador-estructural';

function doGet(e) {
  var accion = e && e.parameter ? e.parameter.accion : '';
  if (accion === 'ping') return json_({ status: 'ok', version: VERSION });
  return json_({ status: 'error', message: 'Usa POST con JSON (o GET ?accion=ping para healthcheck)' });
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    checkToken_(payload.token);
    var accion = payload.accion;
    if (!accion) throw new Error('Falta el campo "accion"');
    if (accion === 'ping') return json_({ status: 'ok', version: VERSION });

    var docData = resolverDoc_(payload, accion === 'crear_doc');
    var doc = docData.doc;
    var respuesta = { status: 'ok', url: docData.url, documentId: doc.getId() };

    if (accion === 'crear_doc') {
      respuesta.mensaje = docData.creado ? 'Documento creado desde la plantilla' : 'El documento ya existía, no se creó nada';
      return json_(respuesta);
    }

    var tabs = tabsFiltradas_(doc, payload.tab);

    if (accion === 'listar_tabs') {
      respuesta.tabs = getAllTabsFlat_(doc).map(function (t) { return t.getTitle(); });
    } else if (accion === 'listar_secciones') {
      respuesta.secciones = listarSecciones_(tabs);
    } else if (accion === 'leer_seccion') {
      respuesta.texto = leerSeccion_(tabs, payload.titulo_ancla);
    } else if (accion === 'reescribir_bloque') {
      reescribirBloque_(tabs, payload.titulo_ancla, payload.contenido);
      respuesta.mensaje = 'Sección reescrita con éxito';
    } else if (accion === 'agregar_vineta') {
      agregarVineta_(tabs, payload.titulo_ancla, payload.contenido);
      respuesta.mensaje = 'Viñeta agregada con éxito';
    } else if (accion === 'actualizar_tabla') {
      actualizarTabla_(tabs, payload.campo, payload.contenido);
      respuesta.mensaje = 'Tabla actualizada con éxito';
    } else {
      throw new Error('Acción desconocida: ' + accion);
    }

    doc.saveAndClose();
    return json_(respuesta);
  } catch (err) {
    return json_({ status: 'error', message: err.toString() });
  }
}

/** ================= SEGURIDAD Y RESOLUCIÓN DEL DOC ================= */

function checkToken_(token) {
  var esperado = PropertiesService.getScriptProperties().getProperty('E2E_API_TOKEN');
  if (!esperado) throw new Error('Configura la Script Property E2E_API_TOKEN antes de usar la API');
  if (token !== esperado) throw new Error('Token inválido o ausente');
}

/**
 * Prioridad: si viene documentId se abre directo (sin navegar carpetas).
 * Si viene celula+proyecto se busca el doc existente. Solo crear_doc puede crear.
 * Así un typo en el nombre del proyecto da error en vez de crear un doc fantasma.
 */
function resolverDoc_(payload, permitirCrear) {
  if (payload.documentId) {
    var doc = DocumentApp.openById(payload.documentId);
    return { doc: doc, url: doc.getUrl(), creado: false };
  }
  if (!payload.proyecto || !payload.celula) {
    throw new Error('Falta documentId, o el par proyecto + celula');
  }
  var carpetaRaiz = DriveApp.getFolderById(ID_CARPETA_RAIZ);
  var nombreDoc = 'E2E - ' + payload.proyecto;

  if (!permitirCrear) {
    var carpetaCelulaExistente = buscarCarpeta_(carpetaRaiz, payload.celula);
    var carpetaProyectoExistente = carpetaCelulaExistente ? buscarCarpeta_(carpetaCelulaExistente, payload.proyecto) : null;
    var archivos = carpetaProyectoExistente ? carpetaProyectoExistente.getFilesByName(nombreDoc) : null;
    if (!archivos || !archivos.hasNext()) {
      throw new Error('No existe "' + nombreDoc + '" en ' + payload.celula + '/' + payload.proyecto +
        '. Si es un proyecto nuevo, usa la acción crear_doc. Revisa también typos en los nombres.');
    }
    var file = archivos.next();
    return { doc: DocumentApp.openById(file.getId()), url: file.getUrl(), creado: false };
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var carpetaCelula = obtenerOCrearCarpeta_(carpetaRaiz, payload.celula);
    var carpetaProyecto = obtenerOCrearCarpeta_(carpetaCelula, payload.proyecto);
    var existentes = carpetaProyecto.getFilesByName(nombreDoc);
    if (existentes.hasNext()) {
      var ya = existentes.next();
      return { doc: DocumentApp.openById(ya.getId()), url: ya.getUrl(), creado: false };
    }
    var copia = DriveApp.getFileById(ID_PLANTILLA).makeCopy(nombreDoc, carpetaProyecto);
    return { doc: DocumentApp.openById(copia.getId()), url: copia.getUrl(), creado: true };
  } finally {
    lock.releaseLock();
  }
}

function buscarCarpeta_(padre, nombre) {
  var carpetas = padre.getFoldersByName(nombre);
  return carpetas.hasNext() ? carpetas.next() : null;
}

function obtenerOCrearCarpeta_(padre, nombre) {
  return buscarCarpeta_(padre, nombre) || padre.createFolder(nombre);
}

/** ================= NAVEGACIÓN DE TABS Y ANCLAS ================= */

function getAllTabsFlat_(doc) {
  var all = [];
  function walk(tab) {
    all.push(tab);
    var children = tab.getChildTabs();
    for (var i = 0; i < children.length; i++) walk(children[i]);
  }
  var topTabs = doc.getTabs();
  for (var i = 0; i < topTabs.length; i++) walk(topTabs[i]);
  return all;
}

function tabsFiltradas_(doc, nombreTab) {
  var todas = getAllTabsFlat_(doc);
  if (!nombreTab) return todas;
  var normalizado = String(nombreTab).toLowerCase().trim();
  var filtradas = todas.filter(function (t) { return t.getTitle().toLowerCase().trim() === normalizado; });
  if (!filtradas.length) {
    throw new Error('No existe la pestaña "' + nombreTab + '". Pestañas: ' +
      todas.map(function (t) { return t.getTitle(); }).join(' | '));
  }
  return filtradas;
}

function esHeading_(el) {
  return el.getType() === DocumentApp.ElementType.PARAGRAPH &&
    el.asParagraph().getHeading() !== DocumentApp.ParagraphHeading.NORMAL;
}

/**
 * Busca el título ancla (heading exacto) en todas las tabs dadas.
 * Si aparece en más de un lugar, exige el parámetro "tab" en vez de editar el primero que encuentre.
 */
function buscarTitulo_(tabs, tituloAncla) {
  if (!tituloAncla) throw new Error('Falta el campo "titulo_ancla"');
  var normalizado = String(tituloAncla).toLowerCase().trim();
  var hallazgos = [];
  for (var t = 0; t < tabs.length; t++) {
    var body = tabs[t].asDocumentTab().getBody();
    for (var i = 0; i < body.getNumChildren(); i++) {
      var child = body.getChild(i);
      if (esHeading_(child) && child.asParagraph().getText().toLowerCase().trim() === normalizado) {
        hallazgos.push({ body: body, index: i, tab: tabs[t].getTitle() });
      }
    }
  }
  if (!hallazgos.length) {
    throw new Error('No se encontró el heading "' + tituloAncla + '". Usa listar_secciones para ver los títulos exactos.');
  }
  if (hallazgos.length > 1) {
    throw new Error('El título "' + tituloAncla + '" aparece en varias pestañas (' +
      hallazgos.map(function (h) { return h.tab; }).join(', ') + '). Agrega el campo "tab" al payload.');
  }
  return hallazgos[0];
}

function finDeBloque_(body, indiceTitulo) {
  var fin = indiceTitulo + 1;
  while (fin < body.getNumChildren() && !esHeading_(body.getChild(fin))) fin++;
  return fin;
}

function listarSecciones_(tabs) {
  var resultado = [];
  for (var t = 0; t < tabs.length; t++) {
    var body = tabs[t].asDocumentTab().getBody();
    var secciones = [];
    for (var i = 0; i < body.getNumChildren(); i++) {
      var child = body.getChild(i);
      if (esHeading_(child) && child.asParagraph().getText().trim()) {
        secciones.push(child.asParagraph().getText().trim());
      }
    }
    resultado.push({ tab: tabs[t].getTitle(), secciones: secciones });
  }
  return resultado;
}

/**
 * Encuentra una viñeta nativa para clonar: primero dentro de la sección,
 * luego en el resto del documento (todas las tabs), prefiriendo glyphs de
 * viñeta (●/○/■) sobre listas numeradas o checklists.
 */
function buscarSemillaVineta_(tabs, bodySeccion, iniSeccion, finSeccion) {
  for (var j = iniSeccion; j < finSeccion; j++) {
    if (bodySeccion.getChild(j).getType() === DocumentApp.ElementType.LIST_ITEM) {
      return bodySeccion.getChild(j).asListItem();
    }
  }
  var preferida = null;
  var cualquiera = null;
  var bodies = [bodySeccion];
  for (var t = 0; t < tabs.length; t++) bodies.push(tabs[t].asDocumentTab().getBody());

  for (var b = 0; b < bodies.length && !preferida; b++) {
    var body = bodies[b];
    for (var x = 0; x < body.getNumChildren() && !preferida; x++) {
      if (body.getChild(x).getType() !== DocumentApp.ElementType.LIST_ITEM) continue;
      var li = body.getChild(x).asListItem();
      if (!cualquiera) cualquiera = li;
      try {
        var g = li.getGlyphType();
        if (g === DocumentApp.GlyphType.BULLET || g === DocumentApp.GlyphType.HOLLOW_BULLET || g === DocumentApp.GlyphType.SQUARE_BULLET) {
          preferida = li;
        }
      } catch (errGlyph) { /* algunos glyphs (checklists) no exponen tipo: se ignoran como preferidas */ }
    }
  }
  var semilla = preferida || cualquiera;
  if (!semilla) {
    throw new Error('No hay ninguna viñeta nativa en el documento para clonar. Agrega una a mano en cualquier sección y reintenta.');
  }
  return semilla;
}

/** ================= ACCIONES DE LECTURA ================= */

function leerSeccion_(tabs, tituloAncla) {
  var loc = buscarTitulo_(tabs, tituloAncla);
  var fin = finDeBloque_(loc.body, loc.index);
  var texto = '';
  for (var i = loc.index + 1; i < fin; i++) {
    texto += loc.body.getChild(i).editAsText().getText() + '\n';
  }
  texto = texto.trim();
  return texto || '(la sección existe pero está vacía)';
}

/** ================= ACCIONES DE ESCRITURA ================= */

/**
 * Reemplaza TODO el bloque entre el título y el siguiente heading.
 * Cada línea de "contenido" (separada por \n) es un elemento:
 *   - Línea que empieza con "- ": viñeta NATIVA clonada de una semilla real.
 *     La indentación (2 espacios por nivel: "  - ", "    - ") anida la viñeta.
 *   - Cualquier otra línea: párrafo normal, clonando el formato del primer
 *     párrafo existente del bloque para heredar el estilo de la plantilla.
 * Inserta primero y borra después: nunca deja el bloque vacío en un estado
 * intermedio (límite conocido de la Tabs API).
 */
function reescribirBloque_(tabs, tituloAncla, contenido) {
  var crudas = String(contenido || '').split('\n');
  var lineas = [];
  for (var c = 0; c < crudas.length; c++) {
    var linea = crudas[c].replace(/\s+$/, '');
    if (!linea.trim()) continue;
    var mBullet = linea.match(/^(\s*)- (.*)$/);
    if (mBullet && mBullet[2].trim()) {
      lineas.push({ vineta: true, nivel: Math.min(Math.floor(mBullet[1].length / 2), 8), texto: mBullet[2].trim() });
    } else {
      lineas.push({ vineta: false, texto: linea.trim() });
    }
  }
  if (!lineas.length) throw new Error('El campo "contenido" está vacío');

  var loc = buscarTitulo_(tabs, tituloAncla);
  var body = loc.body;
  var i = loc.index;
  var fin = finDeBloque_(body, i);
  var totalAntes = body.getNumChildren();

  var plantillaParrafo = null;
  for (var j = i + 1; j < fin; j++) {
    if (body.getChild(j).getType() === DocumentApp.ElementType.PARAGRAPH &&
      body.getChild(j).asParagraph().getText().trim()) {
      plantillaParrafo = body.getChild(j).asParagraph();
      break;
    }
  }
  var necesitaVinetas = lineas.some(function (l) { return l.vineta; });
  var semillaVineta = necesitaVinetas ? buscarSemillaVineta_(tabs, body, i + 1, fin) : null;

  for (var k = 0; k < lineas.length; k++) {
    var nuevo;
    if (lineas[k].vineta) {
      var clon = semillaVineta.copy();
      clon.setText(lineas[k].texto);
      nuevo = body.insertListItem(i + 1 + k, clon);
      try { nuevo.setNestingLevel(lineas[k].nivel); } catch (errNivel) { /* nivel no soportado: queda en el de la semilla */ }
    } else if (plantillaParrafo) {
      var clonP = plantillaParrafo.copy();
      clonP.setText(lineas[k].texto);
      nuevo = body.insertParagraph(i + 1 + k, clonP);
    } else {
      nuevo = body.insertParagraph(i + 1 + k, lineas[k].texto);
    }
    normalizarNegritas_(nuevo);
    processBoldsInElement_(nuevo);
  }

  // Si el bloque llega hasta el final del body, Google no permite borrar su
  // último párrafo. Se agrega un párrafo de resguardo al final para que el
  // borrado del contenido viejo sí pueda completarse.
  if (fin === totalAntes) {
    try { body.appendParagraph(''); } catch (errGuard) { body.appendParagraph(' '); }
  }

  var n = lineas.length;
  for (var v = fin - 1 + n; v >= i + 1 + n; v--) {
    body.removeChild(body.getChild(v));
  }
}

/**
 * Agrega una viñeta nativa al final de la lista de la sección.
 * Si la sección tiene viñetas, clona la última (formato idéntico garantizado).
 * Si no tiene, clona una semilla de otra parte del documento (fallback global)
 * y la inserta al final del bloque.
 */
function agregarVineta_(tabs, tituloAncla, contenido) {
  if (!contenido || !String(contenido).trim()) throw new Error('El campo "contenido" está vacío');
  var loc = buscarTitulo_(tabs, tituloAncla);
  var body = loc.body;
  var fin = finDeBloque_(body, loc.index);

  var ultimaVineta = null;
  var indexUltima = -1;
  for (var j = loc.index + 1; j < fin; j++) {
    if (body.getChild(j).getType() === DocumentApp.ElementType.LIST_ITEM) {
      ultimaVineta = body.getChild(j).asListItem();
      indexUltima = j;
    }
  }

  var semilla = ultimaVineta || buscarSemillaVineta_(tabs, body, loc.index + 1, fin);
  var posicion = ultimaVineta ? indexUltima + 1 : fin;

  var clon = semilla.copy();
  clon.setText(String(contenido).trim());
  var insertada = body.insertListItem(posicion, clon);
  if (!ultimaVineta) {
    try { insertada.setNestingLevel(0); } catch (errNivel) { /* queda en el nivel de la semilla */ }
  }
  normalizarNegritas_(insertada);
  processBoldsInElement_(insertada);
}

/**
 * Busca el campo en la columna izquierda de todas las tablas de las tabs dadas.
 * Prefiere coincidencia exacta; si hay varias coincidencias parciales, falla
 * con la lista de candidatos en vez de editar la primera que encuentre
 * (evita que "Fecha" caiga en "Fecha inicio" cuando existía "Fecha fin").
 */
function actualizarTabla_(tabs, campoBusqueda, nuevoValor) {
  if (!campoBusqueda) throw new Error('Falta el campo "campo"');
  var normalizado = String(campoBusqueda).toLowerCase().trim();
  var exactas = [];
  var parciales = [];

  for (var t = 0; t < tabs.length; t++) {
    var body = tabs[t].asDocumentTab().getBody();
    var tables = body.getTables();
    for (var i = 0; i < tables.length; i++) {
      for (var r = 0; r < tables[i].getNumRows(); r++) {
        var row = tables[i].getRow(r);
        if (row.getNumCells() < 2) continue;
        var etiqueta = row.getCell(0).getText().toLowerCase().trim();
        if (etiqueta === normalizado) exactas.push({ celda: row.getCell(1), etiqueta: row.getCell(0).getText().trim() });
        else if (etiqueta.indexOf(normalizado) !== -1) parciales.push({ celda: row.getCell(1), etiqueta: row.getCell(0).getText().trim() });
      }
    }
  }

  var candidatas = exactas.length ? exactas : parciales;
  if (!candidatas.length) throw new Error('No se encontró el campo "' + campoBusqueda + '" en ninguna tabla.');
  if (candidatas.length > 1) {
    throw new Error('El campo "' + campoBusqueda + '" es ambiguo. Coincide con: ' +
      candidatas.map(function (c) { return c.etiqueta; }).join(' | ') +
      '. Usa el nombre exacto o agrega el campo "tab" al payload.');
  }

  candidatas[0].celda.setText(String(nuevoValor == null ? '' : nuevoValor));
  processBoldsInElement_(candidatas[0].celda);
}

/** ================= NEGRITAS **texto** ================= */

/**
 * Los elementos clonados heredan el formato de su semilla (a veces toda la
 * línea en negrita). Esto lo normaliza: quita la negrita completa y deja que
 * processBoldsInElement_ aplique solo la pedida con **asteriscos**.
 */
function normalizarNegritas_(element) {
  var textObj = element.editAsText();
  var len = textObj.getText().length;
  if (len > 0) textObj.setBold(0, len - 1, false);
}

function processBoldsInElement_(element) {
  var textObj = element.editAsText();
  var rawText = textObj.getText();
  if (rawText.indexOf('**') === -1) return;
  var regex = /\*\*(.*?)\*\*/g;
  var match;
  var matches = [];
  while ((match = regex.exec(rawText)) !== null) {
    matches.push({ start: match.index, end: match.index + match[0].length, innerLength: match[1].length });
  }
  for (var i = matches.length - 1; i >= 0; i--) {
    var m = matches[i];
    textObj.deleteText(m.end - 2, m.end - 1);
    if (m.innerLength > 0) textObj.setBold(m.start + 2, m.end - 3, true);
    textObj.deleteText(m.start, m.start + 1);
  }
}

/** ================= UTILIDADES ================= */

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
