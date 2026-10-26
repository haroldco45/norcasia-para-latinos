/* =========================================================
   Norcasia para Latinos — Vibras Positivas HM
   PWA bilingüe (ES/EN) para latinos recién llegados a Norcasia, Caldas, Colombia.
   Sin emojis ni íconos: fotos reales de Wikipedia / Wikimedia Commons.
   ========================================================= */
'use strict';

/* ---------- Utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const store = {
  get(k, d) { try { const v = localStorage.getItem('nor_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('nor_' + k, JSON.stringify(v)); } catch (e) {} }
};
let LANG = store.get('lang', (navigator.language || 'es').slice(0, 2) === 'en' ? 'en' : 'es');
const L = o => (o == null ? '' : typeof o === 'string' ? o : (o[LANG] ?? o.es ?? ''));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n, d = 2) => new Intl.NumberFormat(LANG === 'es' ? 'es-CO' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
const cop = n => (n < 0 ? '-$' : '$') + fmt(Math.abs(Math.round(n)), 0);
async function getJSON(url) { const r = await fetch(url); if (!r.ok) throw new Error(r.status); return r.json(); }
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2400); }
const gmaps = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
const ZONE = 'America/Bogota', ZONE_VE = 'America/Caracas';
const PALETTE = ['#0E7C86', '#2FB59A', '#E8566C', '#2D7FF9', '#F28C28', '#4E8F3A', '#8E5CD9'];
const num = (b, i) => `<b style="color:var(--red);font-family:'Barlow Condensed';font-size:1.3rem;margin-right:8px">${String(i + 1).padStart(2, '0')}</b>${b}`;

/* ---------- Textos de interfaz ---------- */
const T = {
  appName: { es: 'Norcasia para Latinos', en: 'Norcasia for Latinos' },
  tagline: { es: 'Tu guía para empezar en Norcasia, Caldas', en: 'Your guide to starting out in Norcasia, Caldas' },
  nHome: { es: 'Inicio', en: 'Home' }, nPapers: { es: 'Papeles', en: 'Papers' }, nMap: { es: 'Mapa', en: 'Map' }, nTalk: { es: 'Hablar', en: 'Talk' },
  cxT: { es: 'Otras ciudades para latinos', en: 'More cities for Latinos' },
  cxS: { es: 'La misma guía en otras ciudades del mundo. Toca una para abrirla.', en: 'The same guide in other cities around the world. Tap one to open it.' },
  footNote: {
    es: 'Información de referencia, no es asesoría legal. Verifica trámites en migracioncolombia.gov.co y cancilleria.gov.co, y las actividades del río y del embalse con la Alcaldía de Norcasia y operadores turísticos autorizados. Algunas ubicaciones del mapa son aproximadas. Mapa © colaboradores de OpenStreetMap, © CARTO. Fotos: Wikipedia / Wikimedia Commons. Clima: Open-Meteo.',
    en: 'Reference information, not legal advice. Check procedures at migracioncolombia.gov.co and cancilleria.gov.co, and river and reservoir activities with the Norcasia town hall and authorised tour operators. Some map locations are approximate. Map © OpenStreetMap contributors, © CARTO. Photos: Wikipedia / Wikimedia Commons. Weather: Open-Meteo.'
  },
  updated: { es: 'Información verificada', en: 'Information checked' },
  installT: { es: 'Instala la app en tu celular para usarla sin internet.', en: 'Install the app on your phone to use it offline.' },
  install: { es: 'Instalar', en: 'Install' },
  tapClose: { es: '(Toca para cerrar)', en: '(Tap to close)' },
  back: { es: '‹ Volver al inicio', en: '‹ Back to home' }
};
const VERIFIED = '26 oct 2026';

/* ---------- Fotos reales (Wikipedia / Commons) ---------- */
// key: [título en en.wikipedia, búsquedas de respaldo en Commons en orden]
const PH = {
  pueblo: ['Norcasia, Caldas', 'Norcasia Caldas', 'Norcasia', 'Caldas Colombia pueblo iglesia parque'],
  embalse: ['Miel I Dam', 'Embalse Amani', 'Miel I Colombia', 'reservoir Caldas Colombia', 'reservoir Colombia mountains'],
  presa: ['', 'Miel I presa', 'Represa Miel I', 'Miel I hydroelectric', 'concrete dam Colombia', 'dam spillway'],
  mirador: ['', 'Embalse Amani mirador', 'Norcasia embalse', 'lake mountains Colombia viewpoint', 'reservoir Antioquia Colombia'],
  rio: ['', 'Rio La Miel Caldas', 'Río La Miel', 'Rio La Miel', 'clear river Colombia', 'river Caldas Colombia'],
  rafting: ['', 'body rafting', 'rafting Colombia river', 'rafting San Gil', 'whitewater rafting'],
  lancha: ['', 'lancha embalse Colombia', 'boat reservoir Colombia', 'motorboat lake Colombia', 'boat lake Guatape'],
  kayak: ['', 'kayak Colombia', 'kayak river', 'kayaking lake'],
  cielo: ['', 'cascada Rio La Miel', 'waterfall into river Colombia', 'waterfall river jungle', 'waterfall Colombia'],
  manso: ['', 'Rio Manso Caldas', 'Río Manso Colombia', 'river rocks clear water Colombia', 'jungle river Colombia'],
  pavas: ['', 'Quebrada Las Pavas Norcasia', 'cascada Caldas Colombia', 'waterfall natural pool Colombia', 'natural pool waterfall'],
  clara: ['', 'Cascada La Clara Norcasia', 'cascada Samana Caldas', 'waterfall jungle Colombia', 'waterfall forest Colombia'],
  jagual: ['', 'Norcasia El Jagual', 'whirlpool river Colombia', 'river pool Colombia', 'river rocks Colombia'],
  guacharos: ['Oilbird', 'Steatornis caripensis'],
  marmol: ['', 'cueva marmol Colombia', 'marble cave', 'cave Colombia', 'limestone cave'],
  torito: ['White-mantled barbet', 'Capito hypoleucus'],
  aullador: ['Colombian red howler', 'Alouatta seniculus'],
  martin: ['Ringed kingfisher', 'Megaceryle torquata'],
  aguila: ['Osprey', 'Pandion haliaetus'],
  titi: ['', 'Saguinus leucopus', 'white-footed tamarin', 'tamarin monkey'],
  aguacate: ['Avocado', 'avocado tree fruit'],
  cacao: ['Theobroma cacao', 'cacao pod Colombia'],
  ganado: ['', 'ganado Colombia potrero', 'cattle Colombia', 'cattle pasture tropical'],
  dorada: ['La Dorada, Caldas', 'La Dorada Caldas'],
  magdalena: ['Magdalena River', 'Rio Magdalena'],
  bus: ['', 'bus intermunicipal Colombia', 'buseta Colombia', 'Colombia bus road mountains'],
  hospital: ['', 'hospital Caldas Colombia', 'puesto de salud Colombia', 'hospital Colombia'],
  peso: ['Colombian peso', 'billetes pesos colombianos'],
  caldas: ['Caldas Department', 'Caldas Colombia landscape'],
  tejo: ['Tejo (sport)', 'tejo Colombia'],
  fiestas: ['', 'cabalgata Caldas', 'desfile fiestas Caldas', 'fiestas pueblo Colombia desfile', 'Colombia festival parade'],
  bandeja: ['Bandeja paisa', 'bandeja paisa'],
  sancocho: ['Sancocho', 'sancocho colombiano'],
  mercado: ['', 'mercado campesino Colombia', 'plaza de mercado Colombia', 'farmers market Colombia'],
  selva: ['', 'Selva de Florencia', 'bosque Samana Caldas', 'cloud forest Caldas', 'Andean forest Colombia'],
  sunset: ['', 'atardecer embalse Colombia', 'sunset lake Colombia mountains', 'sunset Andes Colombia'],
  finca: ['', 'finca Caldas Colombia', 'farm house Colombia mountains', 'Colombian farm']
};
const PHOTO_CACHE = store.get('photos1', {});
function fbColor(key) { let h = 0; for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0; return PALETTE[h % PALETTE.length]; }
const photo = key => `data-ph="${key}" style="--fb:${fbColor(key)}"`;

async function wikiBatch(titles) {
  const out = {};
  for (let i = 0; i < titles.length; i += 40) {
    const chunk = titles.slice(i, i + 40);
    const url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=900&titles=' + encodeURIComponent(chunk.join('|'));
    try {
      const j = await getJSON(url);
      const back = {};
      (j.query.normalized || []).forEach(n => back[n.to] = n.from);
      (j.query.redirects || []).forEach(r => back[r.to] = back[r.from] || r.from);
      (j.query.pages || []).forEach(p => { if (p.thumbnail) out[back[p.title] || p.title] = p.thumbnail.source; });
    } catch (e) {}
  }
  return out;
}
async function commonsSearch(q) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&origin=*&generator=search&gsrnamespace=6&gsrlimit=4&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap') + '&prop=imageinfo&iiprop=url&iiurlwidth=900';
  try {
    const j = await getJSON(url);
    const pages = (j.query && j.query.pages || []).sort((a, b) => (a.index || 0) - (b.index || 0));
    for (const p of pages) { const ii = p.imageinfo && p.imageinfo[0]; if (ii && (ii.thumburl || ii.url)) return ii.thumburl || ii.url; }
  } catch (e) {}
  return null;
}
let photosLoading = null;
async function loadPhotos() {
  if (photosLoading) return photosLoading;
  photosLoading = (async () => {
    const need = Object.keys(PH).filter(k => !PHOTO_CACHE[k]);
    const titles = need.map(k => PH[k][0]).filter(Boolean);
    if (titles.length) {
      const got = await wikiBatch(titles);
      need.forEach(k => { if (PH[k][0] && got[PH[k][0]]) PHOTO_CACHE[k] = got[PH[k][0]]; });
      paintPhotos();
    }
    const rest = Object.keys(PH).filter(k => !PHOTO_CACHE[k]);
    const firsts = rest.filter(k => PH[k].length <= 2), multi = rest.filter(k => PH[k].length > 2);
    await Promise.all(firsts.map(async k => { const u = await commonsSearch(PH[k][1]); if (u) PHOTO_CACHE[k] = u; }));
    paintPhotos();
    // Varias búsquedas en paralelo por foto, quedándonos con la primera que no esté repetida
    await Promise.all(multi.map(async k => {
      const found = await Promise.all(PH[k].slice(1).map(q => commonsSearch(q)));
      const pick = found.find(u => u && !Object.values(PHOTO_CACHE).includes(u)) || found.find(Boolean);
      if (pick) PHOTO_CACHE[k] = pick;
    }));
    store.set('photos1', PHOTO_CACHE);
  })();
  return photosLoading;
}
function paintPhotos(root = document) {
  $$('[data-ph]', root).forEach(el => {
    const u = PHOTO_CACHE[el.dataset.ph];
    if (u && !el._painted) {
      const img = new Image();
      img.onload = () => { el.style.backgroundImage = `url("${u}")`; el._painted = true; };
      img.src = u;
    }
  });
  heroSetup();
}

/* ---------- Plazos con cuenta regresiva (verificados el 26 oct 2026) ---------- */
const DEADLINES = [
  { end: new Date('2026-11-04T23:59:59-05:00'), k: 'PPT',
    t: { es: 'Último plazo para reclamar tu PPT aprobado: miércoles 4 de noviembre', en: 'Last day to collect your approved PPT: Wednesday 4 November' },
    s: { es: 'Si Migración ya aprobó tu PPT y no lo has retirado, después de esa fecha lo destruyen y el trámite queda como desistido. Toca para ver cómo.', en: 'If Migración already approved your PPT and you haven\'t collected it, after that date it is destroyed and the application is dropped. Tap to see how.' },
    tk: { es: 'para reclamar tu PPT', en: 'to collect your PPT' } },
  { end: new Date('2026-12-31T23:59:59-05:00'), k: 'PEP Tutor',
    t: { es: 'PEP Tutor: puedes pedirlo hasta el jueves 31 de diciembre', en: 'PEP Tutor: apply by Thursday 31 December' },
    s: { es: 'Para papás, tutores o cuidadores de niños venezolanos que tuvieron PPT. Toca para ver requisitos.', en: 'For parents, guardians or carers of Venezuelan children who held a PPT. Tap to see requirements.' },
    tk: { es: 'para pedir el PEP Tutor', en: 'to apply for PEP Tutor' } }
];
const activeDeadline = () => DEADLINES.find(d => d.end - Date.now() > 0) || null;

/* ---------- Datos de Norcasia ---------- */
// ap: true = ubicación aproximada
const PLACES = [
  { id: 'pueblo', cat: 'town', lat: 5.5742, lon: -74.8889, free: true,
    n: { es: 'Parque principal de Norcasia', en: 'Norcasia main square' },
    d: { es: 'El Parque de Bolívar con la iglesia de Nuestra Señora del Carmen, las letras del pueblo para la foto y la escultura Pujanza. Aquí se mueve todo: buses, tiendas, misa y fiestas.', en: 'Bolívar Park with Our Lady of Carmen church, the town-name letters for photos and the Pujanza sculpture. Everything happens here: buses, shops, mass and festivities.' } },
  { id: 'mirador', cat: 'water', lat: 5.5655, lon: -74.8905, free: true, ap: true,
    n: { es: 'Mirador del Embalse Amaní', en: 'Amaní Reservoir viewpoint' },
    d: { es: 'La foto más famosa de Norcasia: el agua verde del embalse entre montañas. Ve al amanecer o al atardecer.', en: 'Norcasia\'s most famous photo: the reservoir\'s green water between mountains. Go at sunrise or sunset.' } },
  { id: 'embalse', cat: 'water', lat: 5.5420, lon: -74.9010, free: false, ap: true,
    n: { es: 'Embalse Amaní', en: 'Amaní Reservoir' },
    d: { es: 'Un lago de 1.220 hectáreas que guarda 571 millones de metros cúbicos de agua de los ríos La Miel y Manso. Paseos en lancha con operadores del pueblo. Tiene su propia sección en la app.', en: 'A 1,220-hectare lake holding 571 million cubic metres of water from the La Miel and Manso rivers. Boat trips with local operators. It has its own section in the app.' } },
  { id: 'presa', cat: 'water', lat: 5.5606, lon: -74.8867, free: true,
    n: { es: 'Presa Miel I (Pantágoras)', en: 'Miel I Dam (Pantágoras)' },
    d: { es: 'La pared de concreto de 188 metros que forma el embalse, de la central hidroeléctrica Miel I de ISAGEN (396 MW, terminada en 2002). Se ve desde afuera; la central no es zona de visita libre.', en: 'The 188-metre concrete wall that forms the reservoir, part of ISAGEN\'s Miel I hydro plant (396 MW, finished 2002). Seen from outside; the plant isn\'t open to walk in.' } },
  { id: 'rio', cat: 'water', lat: 5.5820, lon: -74.8580, free: false, ap: true,
    n: { es: 'Río La Miel', en: 'La Miel River' },
    d: { es: 'Agua verde esmeralda tan clara que ves el fondo a unos 5 metros. Body rafting, tubing, kayak, snorkel y cascadas a las que se llega en lancha. Tiene su propia sección en la app.', en: 'Emerald water so clear you can see about 5 metres down. Body rafting, tubing, kayaking, snorkelling and waterfalls reached by boat. It has its own section in the app.' } },
  { id: 'pavas', cat: 'nature', lat: 5.5880, lon: -74.8780, free: true, ap: true,
    n: { es: 'Salto de las Pavas', en: 'Las Pavas Falls' },
    d: { es: 'En la quebrada Las Pavas, a unos 15 minutos del pueblo: senderos, caídas de agua y piscinas naturales. Con suerte ves pavas y monos tití.', en: 'On Las Pavas creek, about 15 minutes from town: trails, small falls and natural pools. With luck you\'ll see guans and tamarin monkeys.' } },
  { id: 'manso', cat: 'nature', lat: 5.6250, lon: -74.9450, free: true, ap: true,
    n: { es: 'Río Manso', en: 'Manso River' },
    d: { es: 'A cerca de una hora del pueblo. Aguas cristalinas para el paseo de olla, pozos como La Punta y El Remolino, y piedras para tirarse al agua.', en: 'About an hour from town. Crystal-clear water for a picnic day, pools like La Punta and El Remolino, and rocks to jump from.' } },
  { id: 'clara', cat: 'nature', lat: 5.6010, lon: -74.8500, free: false, ap: true,
    n: { es: 'Cascada La Clara', en: 'La Clara Waterfall' },
    d: { es: 'Una de las cascadas más visitadas del municipio. Ve con guía local: los caminos cambian con las lluvias.', en: 'One of the most visited waterfalls in the area. Go with a local guide: trails change with the rain.' } },
  { id: 'jagual', cat: 'nature', lat: 5.6100, lon: -74.9050, free: true, ap: true,
    n: { es: 'El Jagual', en: 'El Jagual' },
    d: { es: 'Vereda con un remolino y charcos en el río, buen plan de caminata y fotos.', en: 'Rural area with a river whirlpool and pools, a good hike and photo spot.' } },
  { id: 'guacharos', cat: 'nature', lat: 5.5350, lon: -74.9550, free: false, ap: true,
    n: { es: 'Cuevas de los Guácharos y cavernas de mármol', en: 'Oilbird Caves and marble caverns' },
    d: { es: 'En la vereda Manizalitos, cuevas de mármol donde viven los guácharos, aves que salen de noche. Solo con guía, linterna y casco.', en: 'In Manizalitos, marble caves home to oilbirds, birds that come out at night. Only with a guide, torch and helmet.' } },
  { id: 'dorada', cat: 'town', lat: 5.4517, lon: -74.6647, free: true,
    n: { es: 'La Dorada', en: 'La Dorada' },
    d: { es: 'La ciudad grande más cercana, a 47,8 km, a orillas del río Magdalena. Allí llegan los buses de Bogotá y Medellín, y está el Hospital San Félix.', en: 'The nearest big town, 47.8 km away on the Magdalena River. Buses from Bogotá and Medellín arrive here, and it has San Félix Hospital.' } }
];

const MAP_EXTRA = [
  { id: 'hosp', cat: 'help', lat: 5.5752, lon: -74.8872, ap: true, n: { es: 'Hospital de Norcasia', en: 'Norcasia hospital' }, d: { es: 'Atención básica y urgencias del pueblo. Para casos complejos remiten a La Dorada o Manizales.', en: 'Basic care and the town ER. Complex cases are referred to La Dorada or Manizales.' } },
  { id: 'alcaldia', cat: 'help', lat: 5.5745, lon: -74.8884, ap: true, n: { es: 'Alcaldía de Norcasia', en: 'Norcasia town hall' }, d: { es: 'Junto al parque principal. SISBEN, Unidad de Turismo y Personería.', en: 'By the main square. SISBEN, Tourism Unit and Ombudsman\'s office.' } },
  { id: 'sanfelix', cat: 'help', lat: 5.4560, lon: -74.6650, ap: true, n: { es: 'ESE Hospital San Félix (La Dorada)', en: 'San Félix Hospital (La Dorada)' }, d: { es: 'El hospital de referencia más cercano, con urgencias.', en: 'The nearest referral hospital, with an ER.' } },
  { id: 'terminal', cat: 'help', lat: 5.4480, lon: -74.6680, ap: true, n: { es: 'Terminal de buses de La Dorada', en: 'La Dorada bus terminal' }, d: { es: 'De aquí salen los buses directos a Norcasia y llegan los de Bogotá, Medellín y Manizales.', en: 'Direct buses to Norcasia leave from here; buses from Bogotá, Medellín and Manizales arrive here.' } }
];

const OFFICES = [
  { n: { es: 'Migración Colombia (línea nacional)', en: 'Migración Colombia (national line)' }, a: 'Migración Colombia, Manizales', tel: '+576016055454', telS: '+57 601 605 5454', h: { es: 'Norcasia no tiene oficina de Migración: pide cita por migracioncolombia.gov.co y te dicen cuál centro te queda más cerca (en Caldas, el de Manizales).', en: 'Norcasia has no Migración office: book at migracioncolombia.gov.co and they\'ll tell you the nearest centre (in Caldas, Manizales).' } },
  { n: { es: 'Cancillería de Colombia (visas, incluida la Visa V)', en: 'Colombian Foreign Ministry (visas, including Visa V)' }, a: 'Cancillería de Colombia, Bogotá', tel: '+576013814000', telS: '+57 601 381 4000', h: { es: 'Las visas se piden en línea en cancilleria.gov.co', en: 'Visas are applied for online at cancilleria.gov.co' } },
  { n: { es: 'Alcaldía de Norcasia y Personería municipal', en: 'Norcasia town hall and Ombudsman\'s office' }, a: 'Alcaldía de Norcasia, Caldas', tel: '', telS: '', h: { es: 'En el parque principal. SISBEN, colegios, Unidad de Turismo; la Personería te orienta gratis si te vulneran derechos.', en: 'On the main square. SISBEN, schools, Tourism Unit; the Personería advises you for free if your rights are violated.' } }
];

const EMERG = [
  { n: '123', cls: '', t: { es: 'Línea única de emergencias', en: 'Emergency line' }, s: { es: 'Policía, ambulancia, bomberos', en: 'Police, ambulance, fire' } },
  { n: '132', cls: 'ink', t: { es: 'Cruz Roja', en: 'Red Cross' }, s: { es: 'Ambulancia y rescate', en: 'Ambulance and rescue' } },
  { n: '119', cls: 'sea', t: { es: 'Bomberos', en: 'Fire brigade' }, s: { es: 'Incendios y rescates', en: 'Fires and rescues' } },
  { n: '155', cls: 'sky', t: { es: 'Línea para mujeres', en: 'Women\'s line' }, s: { es: 'Orientación ante violencia', en: 'Help against violence' } },
  { n: '141', cls: 'ink', t: { es: 'ICBF (niños)', en: 'ICBF (children)' }, s: { es: 'Protección de niños y niñas', en: 'Child protection' } },
  { n: '165', cls: 'sea', t: { es: 'Gaula', en: 'Gaula' }, s: { es: 'Extorsión, secuestro y "gota a gota"', en: 'Extortion, kidnapping and loan sharks' } }
];

// Festivos de Colombia 2026 y 2027 (Ley Emiliani)
const HOLIDAYS = [
  ['2026-01-01', { es: 'Año Nuevo', en: 'New Year\'s Day' }], ['2026-01-12', { es: 'Reyes Magos', en: 'Epiphany' }],
  ['2026-03-23', { es: 'San José', en: 'Saint Joseph' }], ['2026-04-02', { es: 'Jueves Santo', en: 'Holy Thursday' }],
  ['2026-04-03', { es: 'Viernes Santo', en: 'Good Friday' }], ['2026-05-01', { es: 'Día del Trabajo', en: 'Labour Day' }],
  ['2026-05-18', { es: 'Ascensión', en: 'Ascension' }], ['2026-06-08', { es: 'Corpus Christi', en: 'Corpus Christi' }],
  ['2026-06-15', { es: 'Sagrado Corazón', en: 'Sacred Heart' }], ['2026-06-29', { es: 'San Pedro y San Pablo', en: 'Saints Peter and Paul' }],
  ['2026-07-20', { es: 'Independencia de Colombia', en: 'Colombian Independence' }], ['2026-08-07', { es: 'Batalla de Boyacá', en: 'Battle of Boyacá' }],
  ['2026-08-17', { es: 'Asunción de la Virgen', en: 'Assumption' }], ['2026-10-12', { es: 'Día de la Raza', en: 'Columbus Day' }],
  ['2026-11-02', { es: 'Todos los Santos', en: 'All Saints\' Day' }], ['2026-11-16', { es: 'Independencia de Cartagena', en: 'Cartagena Independence' }],
  ['2026-12-08', { es: 'Inmaculada Concepción', en: 'Immaculate Conception' }], ['2026-12-25', { es: 'Navidad', en: 'Christmas Day' }],
  ['2027-01-01', { es: 'Año Nuevo', en: 'New Year\'s Day' }], ['2027-01-11', { es: 'Reyes Magos', en: 'Epiphany' }],
  ['2027-03-22', { es: 'San José', en: 'Saint Joseph' }], ['2027-03-25', { es: 'Jueves Santo', en: 'Holy Thursday' }],
  ['2027-03-26', { es: 'Viernes Santo', en: 'Good Friday' }], ['2027-05-01', { es: 'Día del Trabajo', en: 'Labour Day' }],
  ['2027-05-10', { es: 'Ascensión', en: 'Ascension' }], ['2027-05-31', { es: 'Corpus Christi', en: 'Corpus Christi' }],
  ['2027-06-07', { es: 'Sagrado Corazón', en: 'Sacred Heart' }], ['2027-07-05', { es: 'San Pedro y San Pablo', en: 'Saints Peter and Paul' }],
  ['2027-07-20', { es: 'Independencia de Colombia', en: 'Colombian Independence' }], ['2027-08-07', { es: 'Batalla de Boyacá', en: 'Battle of Boyacá' }],
  ['2027-08-16', { es: 'Asunción de la Virgen', en: 'Assumption' }], ['2027-10-18', { es: 'Día de la Raza', en: 'Columbus Day' }],
  ['2027-11-01', { es: 'Todos los Santos', en: 'All Saints\' Day' }], ['2027-11-15', { es: 'Independencia de Cartagena', en: 'Cartagena Independence' }],
  ['2027-12-08', { es: 'Inmaculada Concepción', en: 'Immaculate Conception' }], ['2027-12-25', { es: 'Navidad', en: 'Christmas Day' }]
];

// Salario mínimo 2026: Decreto 1469 de 2025 (vigente; el Consejo de Estado levantó la suspensión en julio de 2026).
// Jornada de 42 horas semanales desde el 15 de julio de 2026 (Ley 2101): hora = salario / 210.
const WAGE = { month: 1750905, aux: 249095, total: 2000000, hour: 1750905 / 210, weekH: 42,
  night: .35, extraDay: .25, extraNight: .75, sunday: .90 };
// Bus La Dorada – Norcasia: valor de referencia (Las2orillas, nov 2024). Confírmalo en la terminal.
const BUS_LD = 15000;

// Agenda del pueblo. type: 'annual' (mes-día fijo) o 'fixed' (fecha exacta)
const AGENDA = [
  { type: 'fixed', d: '2026-06-04', e: '2026-06-08', t: { es: 'Ferias y Fiestas del Aguacate y el Turismo', en: 'Avocado and Tourism Fair & Festival' }, s: { es: 'Alborada, desfiles de caballitos de palo, comparsas y carrozas, mercado campesino, vaquería, reinado, cabalgata y conciertos en el parque. En 2027 vuelven en junio.', en: 'Dawn parade, hobby-horse parades, troupes and floats, farmers\' market, rodeo, pageant, horse parade and concerts in the square. Back in June 2027.' }, ph: 'aguacate' },
  { type: 'annual', md: '07-16', t: { es: 'Fiesta de la Virgen del Carmen', en: 'Feast of Our Lady of Carmen' }, s: { es: 'La patrona del pueblo: misas, procesión y novenas. Es la fiesta religiosa más querida, junto con la Semana Santa.', en: 'The town\'s patron saint: masses, procession and novenas. The best-loved religious feast, along with Holy Week.' }, ph: 'pueblo' },
  { type: 'annual', md: '08-15', t: { es: 'Aniversario de Norcasia', en: 'Norcasia anniversary' }, s: { es: 'El 15 de agosto de 1999 el pueblo votó en referendo para dejar de ser corregimiento de Samaná y volverse municipio: por eso le dicen "La Niña de Caldas".', en: 'On 15 August 1999 the town voted in a referendum to stop being part of Samaná and become a municipality: that\'s why it\'s called "Caldas\'s little girl".' }, ph: 'caldas' },
  { type: 'month', md: '09', t: { es: 'Semana cultural de los colegios', en: 'Schools\' cultural week' }, s: { es: 'En septiembre: danzas, música y muestras de los estudiantes.', en: 'In September: student dance, music and shows.' }, ph: 'fiestas' }
];

const FIRST = [
  { es: ['Llena el formulario Check-MIG antes de viajar', 'Lo piden a los extranjeros al entrar y salir de Colombia. Es gratis en el sitio de Migración Colombia.'], en: ['Fill in the Check-MIG form before travelling', 'Foreigners must complete it when entering and leaving Colombia. It\'s free on Migración Colombia\'s site.'] },
  { es: ['Guarda tus documentos y una foto de cada uno', 'Pasaporte, cédula, PPT. Copias en el celular y en el correo. Nunca entregues tu documento a un "patrón".'], en: ['Keep your documents safe and a photo of each', 'Passport, ID, PPT. Copies on your phone and email. Never hand your document to a "boss".'] },
  { es: ['Aprende la ruta La Dorada – Norcasia', 'Los buses directos salen de la terminal de La Dorada; el viaje es de hora y media a dos horas.'], en: ['Learn the La Dorada – Norcasia route', 'Direct buses leave La Dorada terminal; the trip takes 1.5 to 2 hours.'] },
  { es: ['Compra una SIM y prueba la señal', 'En el pueblo hay señal; en algunas veredas y en el embalse se pierde. Avisa a tu familia antes de salir al río.'], en: ['Get a SIM and test the signal', 'There\'s signal in town; in some rural areas and on the reservoir it drops. Tell your family before heading to the river.'] },
  { es: ['Anota tu dirección en esta app', 'En el pueblo las casas tienen calle y número; en el campo te ubican por vereda y nombre de la finca.'], en: ['Save your address in this app', 'In town houses have a street and number; in the countryside you\'re located by vereda and farm name.'] },
  { es: ['Si eres venezolano, revisa el estado de tu PPT', 'Si ya está aprobado, recógelo antes del 4 de noviembre de 2026.'], en: ['If you\'re Venezuelan, check your PPT status', 'If it\'s approved, collect it before 4 November 2026.'] },
  { es: ['Pide la encuesta del SISBEN en la Alcaldía', 'Con PPT o documento colombiano te pueden afiliar a salud subsidiada.'], en: ['Request the SISBEN survey at the town hall', 'With a PPT or Colombian ID you can join subsidised health care.'] },
  { es: ['Abre una billetera digital o cuenta', 'Nequi, Daviplata y los bancos abren cuentas con PPT. En el pueblo hay pocos cajeros: no dependas solo del efectivo.'], en: ['Open a digital wallet or account', 'Nequi, Daviplata and banks open accounts with a PPT. There are few cash machines in town: don\'t rely only on cash.'] },
  { es: ['Ubica el hospital del pueblo', 'Y recuerda que el hospital grande más cercano está en La Dorada.'], en: ['Find the town hospital', 'And remember the nearest big hospital is in La Dorada.'] },
  { es: ['Registra los números de emergencia', '123 para todo: policía, ambulancia y bomberos.'], en: ['Save the emergency numbers', '123 for everything: police, ambulance and fire.'] },
  { es: ['Nunca te metas al río sin guía', 'El nivel del río La Miel cambia según las turbinas de la represa. Usa siempre chaleco salvavidas.'], en: ['Never go into the river without a guide', 'The La Miel river level changes with the dam\'s turbines. Always wear a life jacket.'] }
];

// Hablar caldense / paisa: [palabra, significado ES, significado EN, ejemplo]
const COSTENO = [
  ['¿Qué más pues?', 'Saludo: ¿cómo estás?', 'Greeting: how are you?', '¿Qué más pues, cómo le ha ido?'],
  ['Pues', 'Muletilla para todo, al final de la frase', 'All-purpose filler word, at the end of sentences', 'Venga pues, lo espero.'],
  ['Hágale pues', 'Dale, adelante, de acuerdo', 'Go ahead, sure, deal', 'Hágale pues, mañana arrancamos.'],
  ['Parce / Parcero', 'Amigo, compañero', 'Mate, buddy', 'Gracias, parce.'],
  ['Berraco', 'Muy bueno o valiente; también muy difícil o bravo', 'Great or brave; also very hard or angry', 'Ese guía es un berraco.'],
  ['Mijo / Mija', 'Forma cariñosa de llamar a alguien', 'Affectionate way to address someone', 'Siéntese, mijo.'],
  ['De una', 'Sí, ya mismo', 'Yes, right away', '¿Vamos al río? De una.'],
  ['Camellar', 'Trabajar', 'To work', 'Mañana me toca camellar en la finca.'],
  ['Jornal', 'Pago por un día de trabajo en el campo', 'A day\'s pay for farm work', '¿A cómo está el jornal?'],
  ['Mecato', 'Pasabocas, dulces, algo para picar', 'Snacks', 'Lleve mecato para el paseo.'],
  ['Tinto', 'Café negro pequeño (no es vino)', 'Small black coffee (not red wine)', 'Regáleme un tinto.'],
  ['Regálame…', 'Forma amable de pedir algo, aunque lo pagues', 'Polite way to ask for something, even when paying', 'Regáleme una gaseosa, por favor.'],
  ['Ñapa', 'Lo que te regalan de más al comprar', 'A little extra thrown in for free', '¿Me da la ñapa?'],
  ['Ahorita', 'En un rato (puede ser mucho rato)', 'In a while (could be a long while)', 'Ahorita le paso la plata.'],
  ['Paseo de olla', 'Ir al río con la familia a cocinar sancocho', 'Family river day cooking a stew', 'El domingo hacemos paseo de olla en el Manso.'],
  ['Lanchero', 'Quien maneja la lancha', 'Boatman', 'El lanchero nos lleva a la cascada.'],
  ['Vereda', 'Zona rural del municipio', 'Rural district of the municipality', 'Vivo en la vereda La Estrella.'],
  ['Guayabo', 'Resaca, malestar del día después', 'Hangover', 'Amanecí con un guayabo...']
];
// Venezuela → Colombia
const VECO = [
  ['Cambur', 'Banano / guineo', 'Banana'], ['Caraota', 'Fríjol', 'Bean'], ['Cotufas', 'Crispetas', 'Popcorn'],
  ['Chamo', 'Muchacho / pelado', 'Young guy'], ['Pana', 'Parce / parcero', 'Buddy'], ['Jojoto', 'Mazorca', 'Corn on the cob'],
  ['Lechosa', 'Papaya', 'Papaya'], ['Autobús / camionetica', 'Bus / buseta', 'Bus'], ['Ratón (resaca)', 'Guayabo', 'Hangover'],
  ['Cédula venezolana', 'Pasaporte o PPT para trámites', 'Passport or PPT for paperwork']
];
// Inglés para trabajar en turismo de naturaleza: [inglés, español, pronunciación aproximada]
const ENG = [
  ['Welcome to Norcasia!', '¡Bienvenido a Norcasia!', 'uél-com tu nor-CÁ-sia'],
  ['Please put on your life jacket.', 'Por favor póngase el chaleco salvavidas.', 'plis put on yor láif YÁ-ket'],
  ['Can you swim?', '¿Sabe nadar?', 'can yu suím'],
  ['Feet up, and point them downstream.', 'Pies arriba y apuntando hacia donde va el río.', 'fit ap, and póint dem dáun-strim'],
  ['Follow the guide, please.', 'Siga al guía, por favor.', 'FÓ-lou de gáid, plis'],
  ['The boat tour takes two hours.', 'El paseo en lancha dura dos horas.', 'de bout tur teiks tu áu-ers'],
  ['Look, a howler monkey!', '¡Mire, un mono aullador!', 'luk, a JÁU-ler MÓN-ki'],
  ['Please don\'t touch the animals.', 'Por favor no toque los animales.', 'plis dount tach di Á-ni-mals'],
  ['Wear sunscreen and drink water.', 'Use bloqueador y tome agua.', 'uér SÁN-scrin and drink UÓ-ter'],
  ['It costs fifty thousand pesos.', 'Cuesta cincuenta mil pesos.', 'it costs FÍF-ti THÁU-sand PÉ-sos'],
  ['We accept cash and bank transfer.', 'Aceptamos efectivo y transferencia.', 'ui ak-SÉPT cash and bank TRANS-fer'],
  ['Sorry, can you repeat that?', 'Perdón, ¿puede repetir?', 'SÓ-ri, can yu ri-PÍT dat'],
  ['Have a nice day!', '¡Que tenga un buen día!', 'jav a náis dei']
];
const DIALOGS = [
  { t: { es: 'En la terminal de La Dorada', en: 'At La Dorada bus terminal' }, l: [
    ['a', 'Buenas. ¿De dónde sale el bus para Norcasia?', 'Hi. Where does the bus to Norcasia leave from?'],
    ['b', 'De aquel lado, mijo. Pregunte en la taquilla a qué hora sale el próximo.', 'Over there, son. Ask at the ticket office when the next one leaves.'],
    ['a', '¿Y cuánto dura el viaje?', 'And how long is the trip?'],
    ['b', 'Hora y media, dos horas. Hágale pues que ya casi sale.', 'An hour and a half, two hours. Go on, it\'s about to leave.']] },
  { t: { es: 'En la tienda del pueblo', en: 'At the village shop' }, l: [
    ['a', 'Buenas tardes. ¿A cómo está la libra de arroz?', 'Good afternoon. How much is a pound of rice?'],
    ['b', 'A tanto, mija. ¿Qué más le doy?', 'It\'s so much, dear. What else can I get you?'],
    ['a', 'Regáleme también cuatro aguacates y un mecato. ¿Y la ñapa?', 'Also four avocados and a snack, please. And the little extra?'],
    ['b', 'De una, tome su ñapa.', 'Sure, here\'s your extra.']] },
  { t: { es: 'Buscando trabajo', en: 'Looking for work' }, l: [
    ['a', 'Buenos días. Supe que necesitan gente para el turismo. Aquí está mi hoja de vida.', 'Good morning. I heard you need people for tourism. Here\'s my CV.'],
    ['b', '¿Tiene PPT o documento al día? ¿Sabe nadar?', 'Do you have a PPT or valid ID? Can you swim?'],
    ['a', 'Sí, tengo PPT, nado bien y hablo un poco de inglés.', 'Yes, I have a PPT, I swim well and I speak some English.'],
    ['b', 'Berraco. Hay un curso de guías con el SENA; vaya a la Alcaldía y pregunte.', 'Great. There\'s a guide course with SENA; go to the town hall and ask.']] },
  { t: { es: 'En urgencias', en: 'At the ER' }, l: [
    ['a', 'Buenas noches. Mi hija tiene fiebre alta desde ayer.', 'Good evening. My daughter has had a high fever since yesterday.'],
    ['b', '¿Tienen EPS?', 'Are you with a health insurer (EPS)?'],
    ['a', 'Todavía no, estamos haciendo el SISBEN.', 'Not yet, we\'re doing the SISBEN.'],
    ['b', 'Igual la atendemos. Siéntese, ya la llaman.', 'We\'ll see her anyway. Have a seat, they\'ll call you.']] }
];

const LIFE = {
  housing: { t: { es: 'Vivienda', en: 'Housing' }, ph: 'finca', items: [
    { es: 'Norcasia es un pueblo de unos 6.000 habitantes: hay poca oferta de arriendo y casi todo se consigue por voz a voz. Pregunta en tiendas, en la iglesia y en grupos de WhatsApp del pueblo.', en: 'Norcasia is a town of about 6,000 people: there are few rentals and most are found by word of mouth. Ask in shops, at church and in town WhatsApp groups.' },
    { es: 'En el casco urbano tienes todo a la mano; en las veredas el arriendo es más barato pero dependes de moto o de la línea de transporte.', en: 'In town everything is close by; in rural areas rent is cheaper but you depend on a motorbike or the rural transport line.' },
    { es: 'Mucha gente que trabaja en fincas recibe vivienda en la misma finca: deja por escrito qué incluye y cuánto te descuentan.', en: 'Many farm workers get housing on the farm: put in writing what\'s included and what\'s deducted.' },
    { es: 'Los servicios: la luz es de la CHEC (grupo EPM) y el agua de Aguas de la Miel. Pide los recibos para saber cuánto pagarás.', en: 'Utilities: power is from CHEC (EPM group) and water from Aguas de la Miel. Ask for past bills to know what you\'ll pay.' },
    { es: 'En temporada alta (Semana Santa, junio y diciembre) los dueños prefieren arrendar por días a turistas: busca contrato mensual antes.', en: 'In high season (Holy Week, June and December) owners prefer daily lets to tourists: secure a monthly contract beforehand.' }] },
  food: { t: { es: 'Comida', en: 'Food' }, ph: 'sancocho', items: [
    { es: 'Aquí se come paisa: bandeja con fríjoles, chicharrón, arepa y huevo; y el sancocho del paseo de olla en el río.', en: 'Food here is paisa-style: bandeja with beans, pork crackling, arepa and egg; and the river-day sancocho stew.' },
    { es: 'Pescado de río frito con patacón en los restaurantes cerca del embalse.', en: 'Fried river fish with plantain at restaurants near the reservoir.' },
    { es: 'El aguacate es el orgullo del pueblo: tiene hasta sus propias fiestas en junio. También se cultiva cacao, cítricos, mango y guanábana.', en: 'Avocado is the town\'s pride: it even has its own festival in June. Cacao, citrus, mango and soursop are grown too.' },
    { es: 'Aguapanela, tinto y arepa a toda hora. Las arepas y empanadas venezolanas tienen buena acogida.', en: 'Aguapanela, black coffee and arepas any time. Venezuelan arepas and empanadas go down well.' },
    { es: 'El domingo es día de mercado: llegan campesinos de las veredas y todo sale más fresco y barato.', en: 'Sunday is market day: farmers come in from the countryside and everything is fresher and cheaper.' }] },
  culture: { t: { es: 'Costumbres', en: 'Customs' }, ph: 'tejo', items: [
    { es: 'Se saluda siempre: "Buenas" al entrar a la tienda, al bus o a la finca. En el pueblo todos se conocen, y la confianza se gana con respeto.', en: 'Always greet: "Buenas" when entering a shop, bus or farm. Everyone knows each other in town, and trust is earned with respect.' },
    { es: 'El tejo es el deporte de las tardes: lanzar un disco de metal a una caja con mecha que explota. Si te invitan, ve.', en: 'Tejo is the afternoon sport: throwing a metal puck at a clay box with a fuse that pops. If you\'re invited, go.' },
    { es: 'Semana Santa y la Virgen del Carmen se viven con procesiones; el segundo lunes de cada mes hay feria ganadera.', en: 'Holy Week and Our Lady of Carmen are celebrated with processions; on the second Monday of every month there\'s a cattle fair.' },
    { es: 'El ave símbolo del municipio es el torito dorsiblanco, que solo vive en Colombia. Cuidar el bosque es cuidar el turismo, que da trabajo a cientos de familias.', en: 'The town\'s emblem bird is the white-mantled barbet, found only in Colombia. Caring for the forest is caring for tourism, which supports hundreds of families.' },
    { es: 'En oficinas públicas ve bien presentado: nada de chanclas ni esqueleto.', en: 'Dress smartly for government offices: no flip-flops or tank tops.' }] },
  safety: { t: { es: 'Seguridad', en: 'Safety' }, ph: 'rio', items: [
    { es: 'El río es lo más peligroso: el nivel del La Miel sube y baja según las turbinas de la represa. Solo entra con operadores autorizados, chaleco y guía.', en: 'The river is the biggest danger: the La Miel level rises and falls with the dam\'s turbines. Only go in with authorised operators, a life jacket and a guide.' },
    { es: 'Nunca saques préstamos "gota a gota": cobran intereses ilegales y amenazan. Si te presionan, llama al 165 (Gaula) o al 123.', en: 'Never take "gota a gota" street loans: they charge illegal interest and threaten people. If pressured, call 165 (Gaula) or 123.' },
    { es: 'Desconfía de ofertas de trabajo que piden plata, tu documento o viajar a otro país "con todo pago": puede ser trata de personas.', en: 'Distrust job offers that ask for money, your ID or travel abroad "all paid": it may be human trafficking.' },
    { es: 'En las veredas no camines de noche por la carretera sin linterna; las motos van rápido y hay poca luz.', en: 'In rural areas don\'t walk the road at night without a torch; motorbikes go fast and there\'s little light.' },
    { es: 'Los trámites migratorios no necesitan tramitadores: paga solo en canales oficiales de Migración Colombia o Cancillería.', en: 'Immigration procedures need no middlemen: pay only through official Migración Colombia or Foreign Ministry channels.' }] }
};

const EM = {
  what: [
    { es: 'El Embalse Amaní es el lago que se formó al represar el río La Miel para la central hidroeléctrica Miel I, de ISAGEN, terminada en 2002.', en: 'Amaní Reservoir is the lake formed by damming the La Miel River for ISAGEN\'s Miel I hydro plant, finished in 2002.' },
    { es: 'Lo alimentan los ríos La Miel y Manso y la quebrada Santa Bárbara. Cubre unas 1.220 hectáreas y guarda 571 millones de metros cúbicos de agua.', en: 'It\'s fed by the La Miel and Manso rivers and Santa Bárbara creek. It covers some 1,220 hectares and holds 571 million cubic metres of water.' },
    { es: 'La presa, también llamada Pantágoras, mide 188 metros de alto y está hecha de concreto compactado con rodillo; cuando se terminó era de las más altas del mundo en su tipo.', en: 'The dam, also called Pantágoras, is 188 metres high and built of roller-compacted concrete; when finished it was among the tallest of its kind in the world.' },
    { es: 'La central tiene tres turbinas de 132 MW: 396 MW en total, energía para buena parte del país.', en: 'The plant has three 132 MW turbines: 396 MW in all, power for a good part of the country.' }
  ],
  doit: [
    [{ es: 'Paseo en lancha', en: 'Boat trip' }, { es: 'Recorridos por el embalse con paradas para nadar y conocer la historia de la represa. Se contratan con operadores del pueblo.', en: 'Trips around the reservoir with swimming stops and the dam\'s history. Booked with local operators.' }, 'lancha'],
    [{ es: 'El mirador', en: 'The viewpoint' }, { es: 'La vista del agua verde entre montañas. Al amanecer hay neblina sobre el lago.', en: 'The view of green water between mountains. At sunrise there\'s mist over the lake.' }, 'mirador'],
    [{ es: 'Kayak y nado', en: 'Kayak and swim' }, { es: 'Algunos operadores alquilan kayak en zonas tranquilas. Siempre con chaleco.', en: 'Some operators rent kayaks in calm areas. Always with a life jacket.' }, 'kayak'],
    [{ es: 'Ver aves', en: 'Birdwatching' }, { es: 'Águilas pescadoras, martín pescador y garzas sobre el agua.', en: 'Ospreys, kingfishers and herons over the water.' }, 'aguila']
  ],
  tips: [
    { es: 'Contrata la lancha con operadores autorizados por la Alcaldía: la Unidad de Turismo tiene el listado.', en: 'Hire boats from operators authorised by the town hall: the Tourism Unit has the list.' },
    { es: 'Pregunta qué incluye el plan (chaleco, paradas, tiempo, refrigerio) y acuerda el precio antes de subir.', en: 'Ask what the trip includes (life jacket, stops, time, snack) and agree the price before boarding.' },
    { es: 'La central hidroeléctrica no es zona de visita libre: respeta las señales y las zonas restringidas de ISAGEN.', en: 'The hydro plant isn\'t open to the public: respect signs and ISAGEN\'s restricted areas.' },
    { es: 'Sol fuerte sobre el agua: gorra, bloqueador y agua aunque el cielo esté nublado.', en: 'Strong sun on the water: cap, sunscreen and water even if it\'s cloudy.' },
    { es: 'Lancheros, guías, cocineras y hospedajes: el embalse da trabajo a muchas familias. Si tienes papeles, ofrece tu ayuda en temporada alta.', en: 'Boatmen, guides, cooks and lodgings: the reservoir employs many families. If you have papers, offer to help in high season.' }
  ]
};

const RI = {
  what: [
    { es: 'El río La Miel nace en Marulanda (Caldas) y, después del embalse, vuelve a su cauce y baja hasta el río Magdalena.', en: 'The La Miel River rises in Marulanda (Caldas) and, after the reservoir, returns to its bed and flows down to the Magdalena.' },
    { es: 'Sus aguas son verde esmeralda y tan claras que se ve el fondo a unos cinco metros.', en: 'Its water is emerald green and so clear you can see about five metres down.' },
    { es: 'La Unidad de Turismo de Norcasia reporta 47 agencias autorizadas para senderismo, avistamiento de aves y body rafting.', en: 'Norcasia\'s Tourism Unit reports 47 authorised agencies for hiking, birdwatching and body rafting.' },
    { es: 'Entrar al río no cuesta; las actividades guiadas se pagan a los operadores.', en: 'Getting into the river is free; guided activities are paid to the operators.' }
  ],
  doit: [
    [{ es: 'Body rafting', en: 'Body rafting' }, { es: 'Bajas por los rápidos solo con chaleco salvavidas, casco y guías a tu lado. Tramos tranquilos y tramos de adrenalina.', en: 'You ride the rapids with just a life jacket, helmet and guides beside you. Calm stretches and adrenaline stretches.' }, 'rafting'],
    [{ es: 'Tubing y kayak', en: 'Tubing and kayak' }, { es: 'Flotar en neumático o remar por las partes mansas del río.', en: 'Float on an inner tube or paddle the calm parts of the river.' }, 'kayak'],
    [{ es: 'Cascada El Cielo', en: 'El Cielo Waterfall' }, { es: 'Se llega en lancha y luego caminando. Si ha llovido, otras cascadas caen directo al río.', en: 'Reached by boat and then on foot. After rain, other falls drop straight into the river.' }, 'cielo'],
    [{ es: 'Snorkel y monos aulladores', en: 'Snorkelling and howler monkeys' }, { es: 'Peces bajo el agua cristalina y monos aulladores en los árboles de la orilla.', en: 'Fish under the clear water and howler monkeys in the riverside trees.' }, 'aullador']
  ],
  tips: [
    { es: 'El nivel del río cambia según las turbinas de la represa: los operadores programan las salidas con eso. Nunca te metas solo.', en: 'The river level changes with the dam\'s turbines: operators schedule trips around it. Never go in alone.' },
    { es: 'Lleva ropa ligera, vestido de baño y zapato cerrado para el agua sin cordones.', en: 'Bring light clothes, a swimsuit and closed water shoes without laces.' },
    { es: 'Bloqueador, agua y celular en bolsa seca. Haz caso a los guías en todo momento.', en: 'Sunscreen, water and your phone in a dry bag. Follow the guides at all times.' },
    { es: 'La caminata es de dificultad moderada: basta una condición física básica.', en: 'The hike is moderate: basic fitness is enough.' },
    { es: 'Trabajo: la Alcaldía y el SENA forman guías turísticos locales. Si sabes nadar y hablas algo de inglés, pregunta por el próximo curso.', en: 'Work: the town hall and SENA train local tour guides. If you can swim and speak some English, ask about the next course.' }
  ]
};

const PU = {
  what: [
    { es: 'Norcasia queda en el oriente de Caldas, a 700 metros de altura, con 25 °C de promedio. Es un pueblo de unos 6.000 habitantes; a quien nace aquí le dicen norcaseño o norcaseña.', en: 'Norcasia lies in eastern Caldas, 700 metres up, averaging 25 °C. It\'s a town of about 6,000 people; locals are called norcaseños.' },
    { es: 'Lo fundaron colonos en 1895 y el nombre llegó en 1924: "Nor-casia", porque quedaba al norte de San Agustín.', en: 'Settlers founded it in 1895 and the name came in 1924: "Nor-casia", because it lay north of San Agustín.' },
    { es: 'Fue corregimiento de Samaná desde 1938 hasta 1999, cuando se volvió municipio: es el más joven de Caldas, "La Niña de Caldas".', en: 'It was part of Samaná from 1938 to 1999, when it became a municipality: the youngest in Caldas, "Caldas\'s little girl".' },
    { es: 'Vivió años duros por el conflicto armado. Hoy se está redescubriendo: en 2026 Colombia lo postuló a Best Tourism Villages de ONU Turismo por su turismo de río.', en: 'It lived hard years of armed conflict. Today it\'s being rediscovered: in 2026 Colombia nominated it for UN Tourism\'s Best Tourism Villages for its river tourism.' }
  ],
  doit: [
    [{ es: 'Parque principal', en: 'Main square' }, { es: 'Iglesia de Nuestra Señora del Carmen, letras del pueblo y la escultura Pujanza de Olmer Rojas Lozano.', en: 'Our Lady of Carmen church, the town letters and the Pujanza sculpture by Olmer Rojas Lozano.' }, 'pueblo'],
    [{ es: 'Buscar al torito dorsiblanco', en: 'Spot the white-mantled barbet' }, { es: 'El ave símbolo del municipio, que solo vive en Colombia. Pregunta por guías de aviturismo.', en: 'The town\'s emblem bird, found only in Colombia. Ask for birdwatching guides.' }, 'torito'],
    [{ es: 'Domingo de mercado', en: 'Sunday market' }, { es: 'Campesinos de las 17 veredas bajan a vender aguacate, cacao, plátano y frutas.', en: 'Farmers from the 17 rural districts come down to sell avocado, cacao, plantain and fruit.' }, 'mercado'],
    [{ es: 'Feria ganadera', en: 'Cattle fair' }, { es: 'El segundo lunes de cada mes. La ganadería es uno de los sectores que más crece.', en: 'The second Monday of every month. Cattle farming is one of the fastest-growing sectors.' }, 'ganado']
  ],
  tips: [
    { es: 'La economía es campo: aguacate, cacao, caña panelera, cítricos, plátano, ganado y madera. Ahí está buena parte del trabajo.', en: 'The economy is farming: avocado, cacao, panela cane, citrus, plantain, cattle and timber. That\'s where much of the work is.' },
    { es: 'El turismo comunitario mueve a unas 300 familias y recibió más de 20.000 visitantes en 2023.', en: 'Community tourism supports some 300 families and drew over 20,000 visitors in 2023.' },
    { es: 'Para trámites grandes (Migración, notarías especiales, hospital de alta complejidad) toca ir a La Dorada o Manizales.', en: 'For big errands (Migración, specialist services, major hospital) you\'ll go to La Dorada or Manizales.' },
    { es: 'Saluda, preséntate y di de dónde vienes: en un pueblo pequeño la buena reputación abre puertas de trabajo.', en: 'Greet, introduce yourself and say where you\'re from: in a small town a good reputation opens job doors.' }
  ]
};

const VIDEOS = [
  [{ es: 'Norcasia, el santuario del agua de Caldas', en: 'Norcasia, Caldas\'s water sanctuary' }, 'Norcasia Caldas turismo', 'pueblo'],
  [{ es: 'Body rafting en el río La Miel', en: 'Body rafting on the La Miel River' }, 'body rafting río La Miel Norcasia', 'rafting'],
  [{ es: 'Paseo en lancha por el Embalse Amaní', en: 'Boat trip on Amaní Reservoir' }, 'Embalse Amaní Norcasia lancha', 'embalse'],
  [{ es: 'Río Manso y Salto de las Pavas', en: 'Manso River and Las Pavas Falls' }, 'Río Manso Salto de las Pavas Norcasia', 'manso'],
  [{ es: 'Fiestas del Aguacate y el Turismo', en: 'Avocado and Tourism Festival' }, 'Fiestas del Aguacate Norcasia', 'aguacate'],
  [{ es: 'El torito dorsiblanco', en: 'The white-mantled barbet' }, 'torito dorsiblanco Capito hypoleucus', 'torito'],
  [{ es: 'Vivir en Caldas siendo venezolano', en: 'Living in Caldas as a Venezuelan' }, 'venezolano viviendo en Caldas Colombia', 'caldas']
];

/* ---------- Agencia de turismo local (datos públicos de su perfil) ---------- */
const AGENCY = { name: 'Norcasia Travel', rnt: '56344', ig: 'https://www.instagram.com/norcasia.travel/', web: 'https://www.norcasia.travel', wa: '573127089655', tel: '312 708 9655', fb: 'https://www.facebook.com/search/top?q=Norcasia%20Travel' };
const waLink = (msg) => `https://wa.me/${AGENCY.wa}?text=${encodeURIComponent(msg)}`;
function agencyCard() {
  return `<div class="card dark mt2 reveal">
    <div class="small" style="opacity:.75">${L({ es: 'Planea tu paseo con una agencia registrada', en: 'Plan your trip with a registered agency' })}</div>
    <h3 style="font-size:1.6rem;text-transform:uppercase;margin-top:4px">${AGENCY.name}</h3>
    <p class="small" style="opacity:.9">${L({ es: 'Agencia de turismo de Norcasia con Registro Nacional de Turismo ' + AGENCY.rnt + '. Lanchas por el Embalse Amaní, body rafting, cascadas y recorridos por el pueblo. Reservas e información: ' + AGENCY.tel + '.', en: 'Norcasia tour agency with National Tourism Registry no. ' + AGENCY.rnt + '. Boat trips on Amaní Reservoir, body rafting, waterfalls and town tours. Bookings and info: ' + AGENCY.tel + '.' })}</p>
    <div class="btns">
      <a class="btn red" href="${waLink(L({ es: 'Hola, vi Norcasia para Latinos y quiero información para pasear en Norcasia.', en: 'Hi, I saw Norcasia for Latinos and would like information about visiting Norcasia.' }))}" target="_blank" rel="noopener">WhatsApp</a>
      <a class="btn ghost" href="${AGENCY.ig}" target="_blank" rel="noopener">Instagram @norcasia.travel</a>
      <a class="btn ghost" href="${AGENCY.web}" target="_blank" rel="noopener">norcasia.travel</a>
    </div>
    <p class="small" style="opacity:.6;margin-top:8px">${L({ es: 'Antes de pagar, confirma siempre el RNT del operador en el Registro Nacional de Turismo.', en: 'Before paying, always confirm the operator\'s RNT in the National Tourism Registry.' })}</p>
  </div>`;
}

/* ---------- Secciones (vistas) ---------- */
const SECTIONS = [
  { id: 'papers', ph: 'pueblo', badge: { es: 'Urgente', en: 'Urgent' }, t: { es: 'Papeles, PPT y visas', en: 'Papers, PPT & visas' }, s: { es: 'PPT, PEP Tutor, Visa V, Check-MIG', en: 'PPT, PEP Tutor, Visa V, Check-MIG' } },
  { id: 'embalse', ph: 'embalse', badge: { es: 'La joya', en: 'The gem' }, t: { es: 'Embalse Amaní', en: 'Amaní Reservoir' }, s: { es: 'Lanchas, mirador y la presa de 188 m', en: 'Boats, viewpoint and the 188 m dam' } },
  { id: 'rio', ph: 'rafting', badge: { es: 'Aventura', en: 'Adventure' }, t: { es: 'Río La Miel', en: 'La Miel River' }, s: { es: 'Body rafting, cascadas y agua esmeralda', en: 'Body rafting, waterfalls, emerald water' } },
  { id: 'work', ph: 'aguacate', t: { es: 'Trabajo y salario', en: 'Work & wages' }, s: { es: 'Mínimo 2026, campo y turismo', en: '2026 minimum, farming and tourism' } },
  { id: 'pueblo', ph: 'torito', badge: { es: 'La Niña de Caldas', en: 'Little girl of Caldas' }, t: { es: 'El pueblo', en: 'The town' }, s: { es: 'Historia, gente, mercado y feria', en: 'History, people, market and fair' } },
  { id: 'agenda', ph: 'fiestas', t: { es: 'Fiestas y agenda', en: 'Festivities & calendar' }, s: { es: 'Aguacate, Virgen del Carmen, feria', en: 'Avocado, Our Lady of Carmen, fair' } },
  { id: 'places', ph: 'pavas', t: { es: 'Lugares', en: 'Places' }, s: { es: 'Cascadas, ríos y cuevas', en: 'Waterfalls, rivers and caves' } },
  { id: 'move', ph: 'bus', t: { es: 'Cómo llegar y moverse', en: 'Getting here & around' }, s: { es: 'Bus desde La Dorada', en: 'Bus from La Dorada' } },
  { id: 'health', ph: 'hospital', t: { es: 'Salud', en: 'Health' }, s: { es: 'Urgencias, SISBEN, EPS', en: 'ER, SISBEN, insurers' } },
  { id: 'money', ph: 'peso', t: { es: 'Peso y cambio', en: 'Peso & exchange' }, s: { es: 'Dólar, euro y bolívar en vivo', en: 'Dollar, euro and bolívar live' } },
  { id: 'talk', ph: 'tejo', t: { es: 'Hablar caldense', en: 'Speak like Caldas' }, s: { es: 'Palabras, conversaciones e inglés', en: 'Words, dialogues and English' } },
  { id: 'life', ph: 'finca', t: { es: 'Vivir aquí', en: 'Living here' }, s: { es: 'Vivienda, comida, seguridad', en: 'Housing, food, safety' } },
  { id: 'weather', ph: 'sunset', t: { es: 'Clima y festivos', en: 'Weather & holidays' }, s: { es: 'Pronóstico y feriados', en: 'Forecast and holidays' } },
  { id: 'first', ph: 'dorada', t: { es: 'Primeros días', en: 'First days' }, s: { es: 'Lista paso a paso', en: 'Step-by-step list' } },
  { id: 'map', ph: 'mirador', t: { es: 'Mapa', en: 'Map' }, s: { es: 'Lugares, hospital, La Dorada', en: 'Places, hospital, La Dorada' } },
  { id: 'media', ph: 'aullador', t: { es: 'Fotos y videos', en: 'Photos & videos' }, s: { es: 'Conoce el pueblo antes de ir', en: 'See the town before you go' } }
];
const WIDE = ['papers', 'embalse', 'rio', 'pueblo', 'media'];

function head(id, title, sub) {
  return `<button class="back" onclick="go('home')">${L(T.back)}</button>
  <div class="sec-head" style="margin-top:0"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div></div>`;
}
const linkBtn = (href, txt, cls = '') => `<a class="btn ${cls}" href="${href}" target="_blank" rel="noopener">${txt}</a>`;

const V = {};

V.home = () => `
  <div class="hero" id="hero">
    <div class="dots" id="hero-dots"></div>
    <span class="cap" id="hero-cap"></span>
    <div class="in">
      <span class="kicker">${L({ es: 'Recién llegado a Norcasia', en: 'Just arrived in Norcasia' })}</span>
      <h1>${L({ es: 'Bienvenido al santuario del agua de Caldas', en: 'Welcome to Caldas\'s water sanctuary' })}</h1>
      <p>${L({ es: 'Papeles, trabajo, cómo llegar, salud, cómo hablar caldense y la magia del Embalse Amaní y el río La Miel, en un solo lugar y en tu idioma.', en: 'Papers, work, getting here, health, how to talk like a local and the magic of Amaní Reservoir and the La Miel River, all in one place and in your language.' })}</p>
    </div>
  </div>
  <div id="alert"></div>
  <div class="live">
    <div class="lc dark"><div class="lab">${L({ es: 'Clima ahora', en: 'Weather now' })}</div><div class="big" id="wx-now"><span class="spin"></span></div><div class="sub" id="wx-sub"></div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Hora en Norcasia', en: 'Time in Norcasia' })}</div><div class="big" id="clk-co">--:--</div><div class="sub" id="clk-ve"></div></div>
    <div class="lc c3"><div class="lab">${L({ es: '1 dólar hoy', en: '1 US dollar today' })}</div><div class="big" id="fx-usd"><span class="spin"></span></div><div class="sub muted" id="fx-sub"></div></div>
  </div>
  <div id="agenda-strip"></div>
  <div class="ptiles">
    ${SECTIONS.map(s => `<button class="pt ${s.badge ? 'hot' : ''} ${WIDE.includes(s.id) ? 'wide' : ''}" ${s.badge ? `data-badge="${esc(L(s.badge))}"` : ''} ${photo(s.ph)} onclick="go('${s.id}')"><b>${L(s.t)}</b><small>${L(s.s)}</small></button>`).join('')}
  </div>
  ${agencyCard()}
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Mi dirección en Norcasia', en: 'My address in Norcasia' })}</h3>
    <p class="small muted">${L({ es: 'Guárdala aquí. Si te pierdes, la app te lleva de vuelta o se la muestras a alguien. Solo queda en tu celular.', en: 'Save it here. If you get lost, the app takes you back or you show it to someone. It stays on your phone only.' })}</p>
    <div class="row mt"><input id="my-addr" placeholder="${L({ es: 'Ej: Calle 5 # 4-20, o finca El Roble, vereda La Estrella', en: 'E.g. Calle 5 # 4-20, or El Roble farm, La Estrella' })}" value="${esc(store.get('addr', ''))}"><button class="btn red" onclick="saveAddr()">${L({ es: 'Guardar', en: 'Save' })}</button></div>
    <div class="btns"><button class="btn sm" onclick="routeHome()">${L({ es: 'Llévame a casa', en: 'Take me home' })}</button><button class="btn sm ghost" onclick="openShow()">${L({ es: 'Mostrar a alguien', en: 'Show someone' })}</button></div>
  </div>`;

V.papers = () => `
  ${head('papers', L({ es: 'Papeles, PPT y visas', en: 'Papers, PPT & visas' }), L({ es: 'Entrar, quedarte y trabajar de forma legal en Colombia.', en: 'Entering, staying and working legally in Colombia.' }))}
  <div id="alert2"></div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Si eres venezolano: las tres vías vigentes', en: 'If you\'re Venezuelan: the three current routes' })}</h3>
    <p class="small">${L({ es: 'Migración Colombia actualizó en septiembre de 2026 las opciones de regularización. La inscripción al PPT para adultos está cerrada.', en: 'Migración Colombia updated the regularization options in September 2026. PPT registration for adults is closed.' })}</p>
    <div class="status-list mt">
      <div class="sl"><div><b>1. PPT — ${L({ es: 'Permiso por Protección Temporal', en: 'Temporary Protection Permit' })}</b><small>${L({ es: 'Sigue abierto solo para niños y adolescentes venezolanos inscritos en un colegio o en programas del ICBF. Si tu PPT ya fue aprobado y no lo has recogido, el plazo para reclamarlo vence el <b>4 de noviembre de 2026</b>; después lo destruyen y el trámite queda desistido.', en: 'Still open only for Venezuelan children and teens enrolled in school or ICBF programmes. If your PPT was approved and you haven\'t collected it, the deadline is <b>4 November 2026</b>; after that it is destroyed and the application is dropped.' })}</small></div></div>
      <div class="sl"><div><b>2. PEP Tutor</b><small>${L({ es: 'Para papás, tutores o cuidadores de menores venezolanos que tenían PPT vigente al 31 de diciembre de 2023. Se pide hasta el <b>31 de diciembre de 2026</b>.', en: 'For parents, guardians or carers of Venezuelan minors who held a valid PPT on 31 December 2023. Apply by <b>31 December 2026</b>.' })}</small></div></div>
      <div class="sl"><div><b>3. Visa V — ${L({ es: 'Visitante Especial', en: 'Special Visitor' })}</b><small>${L({ es: 'Para venezolanos que entraron a Colombia antes del 4 de diciembre de 2024 y cumplen las condiciones de Cancillería. Dura dos años e incluye permiso abierto de trabajo. Requiere verificación previa de Migración.', en: 'For Venezuelans who entered Colombia before 4 December 2024 and meet the Foreign Ministry\'s conditions. Valid two years with an open work permit. Requires prior verification by Migración.' })}</small></div></div>
    </div>
    <div class="note red mt">${L({ es: 'No pueden acceder quienes tienen antecedentes penales, órdenes de expulsión o deportación vigentes, o están privados de la libertad. Migración insiste: no se necesitan intermediarios.', en: 'People with criminal records, active expulsion or deportation orders, or in custody are excluded. Migración insists: no middlemen are needed.' })}</div>
    <div class="btns">${linkBtn('https://www.migracioncolombia.gov.co/', 'Migración Colombia', 'red')}${linkBtn('https://www.cancilleria.gov.co/tramites_servicios/visa', L({ es: 'Visas en Cancillería', en: 'Foreign Ministry visas' }))}${linkBtn('https://help.unhcr.org/colombia/regularizacion-para-personas-venezolanas/', L({ es: 'Guía de ACNUR', en: 'UNHCR guide' }), 'ghost')}</div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Cómo pedir el PEP Tutor paso a paso', en: 'How to apply for PEP Tutor step by step' })}</h3>
    <ol class="small mt">
      <li>${L({ es: 'Llena el Formulario Único de Trámites (FUT) en el sitio de Migración.', en: 'Fill in the Single Procedures Form (FUT) on Migración\'s site.' })}</li>
      <li>${L({ es: 'Responde la encuesta socioeconómica. Te llega un número de caso al correo.', en: 'Answer the socio-economic survey. You get a case number by email.' })}</li>
      <li>${L({ es: 'Agenda la cita presencial en el sistema de Migración.', en: 'Book the in-person appointment in Migración\'s system.' })}</li>
      <li>${L({ es: 'Lleva tu documento y la prueba del vínculo: registro de nacimiento apostillado si eres papá o mamá; sentencia, escritura o acta si eres tutor o cuidador.', en: 'Bring your ID and proof of the relationship: apostilled birth certificate if you\'re the parent; court ruling, deed or record if you\'re a guardian or carer.' })}</li>
      <li>${L({ es: 'Migración tiene 30 días para responder. Si lo aprueban, recoge el permiso a tiempo.', en: 'Migración has 30 days to reply. If approved, collect the permit on time.' })}</li>
    </ol>
  </div>
  <div class="grid g2 stack mt2">
    <div class="card reveal">
      <h3>${L({ es: 'Si vienes de visita', en: 'If you\'re visiting' })}</h3>
      <ul class="small">
        <li>${L({ es: 'La mayoría de latinoamericanos entra sin visa como turista por 90 días, prorrogables hasta 180 días en el año. Confirma tu caso en Cancillería.', en: 'Most Latin Americans enter visa-free as tourists for 90 days, extendable to 180 days a year. Confirm your case with the Foreign Ministry.' })}</li>
        <li>${L({ es: '<b>Check-MIG:</b> formulario gratuito de Migración que debes llenar antes de entrar y salir del país.', en: '<b>Check-MIG:</b> free Migración form you must fill in before entering and leaving the country.' })}</li>
        <li>${L({ es: 'Como turista <b>no puedes trabajar</b>, ni siquiera "por días".', en: 'As a tourist you <b>cannot work</b>, not even casual day jobs.' })}</li>
      </ul>
      <div class="btns">${linkBtn('https://www.migracioncolombia.gov.co/', 'Check-MIG', 'sm')}</div>
    </div>
    <div class="card reveal">
      <h3>${L({ es: 'Lo que te abre tener papeles', en: 'What papers open up for you' })}</h3>
      <ul class="small">
        <li>${L({ es: 'Trabajo formal con contrato, prima, vacaciones y cesantías.', en: 'Formal work with a contract, bonuses, holidays and severance.' })}</li>
        <li>${L({ es: 'Salud: SISBEN y afiliación a una EPS.', en: 'Health: SISBEN and joining an EPS insurer.' })}</li>
        <li>${L({ es: 'Cuenta bancaria, Nequi o Daviplata.', en: 'Bank account, Nequi or Daviplata.' })}</li>
        <li>${L({ es: 'Estudiar, convalidar títulos y hacer cursos gratis del SENA.', en: 'Study, validate diplomas and take free SENA courses.' })}</li>
        <li>${L({ es: 'Si tu hijo nació en Colombia, pregunta en la Registraduría por su registro civil y nacionalidad.', en: 'If your child was born in Colombia, ask the Registry about their birth record and nationality.' })}</li>
      </ul>
    </div>
  </div>
  <div class="sec-head"><div><h2>${L({ es: 'Oficinas', en: 'Offices' })}</h2></div></div>
  <div class="status-list">${OFFICES.map(o => `<div class="sl reveal"><div><b>${L(o.n)}</b><small>${esc(o.a)} · ${L(o.h)}</small><small><a href="${gmaps(o.a)}" target="_blank" rel="noopener">${L({ es: 'Ver en el mapa', en: 'See on map' })}</a></small></div>${o.telS ? `<a class="call ink" href="tel:${o.tel}">${L({ es: 'Llamar', en: 'Call' })}</a>` : ''}</div>`).join('')}</div>`;


V.work = () => `
  ${head('work', L({ es: 'Trabajo y salario', en: 'Work & wages' }), L({ es: 'Salario mínimo 2026 (Decreto 1469 de 2025, vigente) y jornada de 42 horas desde el 15 de julio de 2026.', en: '2026 minimum wage (Decree 1469 of 2025, in force) and 42-hour week since 15 July 2026.' }))}
  <div class="live" style="margin-top:0">
    <div class="lc dark"><div class="lab">${L({ es: 'Salario mínimo', en: 'Minimum wage' })}</div><div class="big">${cop(WAGE.month)}</div><div class="sub">${L({ es: 'Mensual, antes de descuentos', en: 'Monthly, before deductions' })}</div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Con auxilio de transporte', en: 'With transport allowance' })}</div><div class="big">${cop(WAGE.total)}</div><div class="sub">${L({ es: 'Auxilio: ', en: 'Allowance: ' })}${cop(WAGE.aux)}</div></div>
    <div class="lc c3"><div class="lab">${L({ es: 'Hora ordinaria', en: 'Ordinary hour' })}</div><div class="big">${cop(WAGE.hour)}</div><div class="sub muted" id="wage-usd">${L({ es: 'Salario ÷ 210 horas', en: 'Wage ÷ 210 hours' })}</div></div>
  </div>
  <div class="sec-head"><div><h2>${L({ es: 'Dónde hay trabajo', en: 'Where the work is' })}</h2><p>${L({ es: 'Desliza para ver más.', en: 'Swipe for more.' })}</p></div></div>
  <div class="rail">${[
    ['rafting', { es: 'Turismo de río', en: 'River tourism' }, { es: 'Guías, lancheros, cocina, hospedajes y transporte. Unas 300 familias viven del turismo comunitario. El SENA y la Alcaldía forman guías.', en: 'Guides, boatmen, cooking, lodging and transport. Some 300 families live off community tourism. SENA and the town hall train guides.' }],
    ['aguacate', { es: 'Aguacate y frutales', en: 'Avocado and fruit' }, { es: 'Siembra, abono y cosecha de aguacate, cítricos, mango y guanábana. Pago por jornal o por contrato.', en: 'Planting, fertilising and harvesting avocado, citrus, mango and soursop. Paid by the day or by contract.' }],
    ['cacao', { es: 'Cacao y caña', en: 'Cacao and cane' }, { es: 'Cosecha de cacao y trabajo en trapiches de caña panelera.', en: 'Cacao harvest and work at panela cane mills.' }],
    ['ganado', { es: 'Ganadería', en: 'Cattle farming' }, { es: 'Ordeño, cercas y potreros. Es uno de los sectores que más crece en el municipio.', en: 'Milking, fencing and pastures. One of the fastest-growing sectors here.' }]
  ].map(d => `<article class="place"><div class="ph" ${photo(d[0])}></div><div class="bd"><h3>${L(d[1])}</h3><p>${L(d[2])}</p></div></article>`).join('')}</div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Recargos (sobre la hora ordinaria)', en: 'Surcharges (on the ordinary hour)' })}</h3>
    <table class="t mt"><tr><th>${L({ es: 'Concepto', en: 'Item' })}</th><th>%</th><th>${L({ es: 'Valor hora', en: 'Hourly' })}</th></tr>
      ${[[{ es: 'Hora nocturna (7 p. m. a 6 a. m.)', en: 'Night hour (7 pm to 6 am)' }, 35], [{ es: 'Hora extra diurna', en: 'Daytime overtime' }, 25], [{ es: 'Hora extra nocturna', en: 'Night overtime' }, 75], [{ es: 'Domingo o festivo', en: 'Sunday or holiday' }, 90], [{ es: 'Extra diurna en domingo o festivo', en: 'Daytime overtime, Sunday/holiday' }, 115], [{ es: 'Extra nocturna en domingo o festivo', en: 'Night overtime, Sunday/holiday' }, 165]].map(r => `<tr><td>${L(r[0])}</td><td class="n">+${r[1]}%</td><td class="n">${cop(WAGE.hour * (1 + r[1] / 100))}</td></tr>`).join('')}
    </table>
    <p class="small muted mt">${L({ es: 'El recargo por domingo y festivo subió al 90% el 1 de julio de 2026 (Ley 2466). En turismo se trabaja mucho fin de semana y festivo: esos días se pagan con recargo.', en: 'The Sunday/holiday surcharge rose to 90% on 1 July 2026 (Law 2466). Tourism means lots of weekend and holiday work: those days carry the surcharge.' })}</p>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Calculadora de sueldo', en: 'Pay calculator' })}</h3>
    <div class="grid g3">
      <div><label class="f">${L({ es: 'Horas por semana', en: 'Hours per week' })}</label><input id="w-h" type="number" min="1" max="42" value="42" oninput="calcWage()"></div>
      <div><label class="f">${L({ es: 'Horas nocturnas por semana', en: 'Night hours per week' })}</label><input id="w-n" type="number" min="0" max="42" value="0" oninput="calcWage()"></div>
      <div><label class="f">${L({ es: 'Domingos o festivos al mes', en: 'Sundays/holidays per month' })}</label><input id="w-d" type="number" min="0" max="10" value="0" oninput="calcWage()"></div>
    </div>
    <div id="w-out" class="mt"></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Tus derechos', en: 'Your rights' })}</h3>
    <ul class="small">
      <li>${L({ es: 'Con PPT, visa o documento colombiano tienes los mismos derechos laborales que cualquier trabajador en Colombia, también en el campo.', en: 'With a PPT, visa or Colombian ID you have the same labour rights as any worker in Colombia, on farms too.' })}</li>
      <li>${L({ es: 'Si trabajas por jornal, acuerda antes el valor, la hora de salida y si incluye comida. Anota los días trabajados.', en: 'If paid by the day, agree the rate, finishing time and whether meals are included beforehand. Note your days worked.' })}</li>
      <li>${L({ es: 'Te descuentan 4% para salud y 4% para pensión; el empleador paga su parte y te afilia a riesgos laborales (ARL). En el río y el campo la ARL es clave.', en: '4% for health and 4% for pension come off your pay; the employer pays its share and enrols you in workplace-risk insurance (ARL). On the river and farms the ARL is key.' })}</li>
      <li>${L({ es: 'Pide contrato por escrito y desprendible de pago. Guarda fotos de todo.', en: 'Ask for a written contract and payslips. Keep photos of everything.' })}</li>
      <li>${L({ es: 'Si te niegan el pago, la Personería de Norcasia te orienta gratis, y la inspección del Ministerio del Trabajo atiende quejas.', en: 'If you\'re refused pay, the Norcasia Personería advises you for free, and the Labour Ministry inspectorate takes complaints.' })}</li>
    </ul>
    <div class="btns">${linkBtn('https://www.serviciodeempleo.gov.co/', L({ es: 'Servicio de Empleo', en: 'Employment Service' }), 'sm red')}${linkBtn('https://agenciapublicadeempleo.sena.edu.co/', L({ es: 'Agencia de Empleo SENA', en: 'SENA Jobs Agency' }), 'sm')}</div>
  </div>`;

function featureView(id, data, o) {
  return `${head(id, L(o.title), L(o.sub))}
  <div class="hero" style="min-height:260px" ${photo(o.ph)}><div class="in"><span class="kicker">${L(o.kicker)}</span><h1 style="font-size:2.3rem">${L(o.h1)}</h1><p>${L(o.p)}</p></div></div>
  <div class="card reveal"><h3>${L({ es: 'Qué es', en: 'What it is' })}</h3><ul class="small">${data.what.map(x => `<li>${L(x)}</li>`).join('')}</ul></div>
  ${o.extra || ''}
  <div class="sec-head"><div><h2>${L({ es: 'Qué hacer', en: 'What to do' })}</h2><p>${L({ es: 'Desliza para ver más.', en: 'Swipe for more.' })}</p></div></div>
  <div class="rail">${data.doit.map(d => `<article class="place"><div class="ph" ${photo(d[2])}></div><div class="bd"><h3>${L(d[0])}</h3><p>${L(d[1])}</p></div></article>`).join('')}</div>
  <div class="sec-head"><div><h2>${L(o.tipsT)}</h2></div></div>
  <div class="status-list">${data.tips.map((t, i) => `<div class="sl reveal"><div>${num(L(t), i)}</div></div>`).join('')}</div>
  ${o.agency ? agencyCard() : ''}
  <div class="btns mt2"><button class="btn red" onclick="showOnMap('${o.mapId}')">${L({ es: 'Ver en el mapa', en: 'See on map' })}</button><a class="btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent(o.yt)}" target="_blank" rel="noopener">${L({ es: 'Videos', en: 'Videos' })}</a></div>`;
}
V.embalse = () => featureView('embalse', EM, {
  title: { es: 'Embalse Amaní', en: 'Amaní Reservoir' }, sub: { es: 'El lago verde entre montañas que hizo famoso a Norcasia.', en: 'The green lake between mountains that made Norcasia famous.' },
  ph: 'embalse', kicker: { es: 'La joya de Norcasia', en: 'Norcasia\'s gem' }, h1: { es: 'Embalse Amaní', en: 'Amaní Reservoir' },
  p: { es: '571 millones de metros cúbicos de agua y una presa de 188 metros.', en: '571 million cubic metres of water and a 188-metre dam.' },
  tipsT: { es: 'Antes de subir a la lancha', en: 'Before boarding' }, mapId: 'embalse', yt: 'Embalse Amaní Norcasia', agency: true
});
V.rio = () => featureView('rio', RI, {
  title: { es: 'Río La Miel', en: 'La Miel River' }, sub: { es: 'Aventura en agua verde esmeralda.', en: 'Adventure in emerald-green water.' },
  ph: 'rafting', kicker: { es: 'Aventura', en: 'Adventure' }, h1: { es: 'Río La Miel', en: 'La Miel River' },
  p: { es: 'Body rafting, tubing, kayak, snorkel y cascadas que caen al río.', en: 'Body rafting, tubing, kayak, snorkelling and waterfalls dropping into the river.' },
  tipsT: { es: 'Para ir seguro', en: 'Stay safe' }, mapId: 'rio', yt: 'body rafting río La Miel Norcasia', agency: true
});
V.pueblo = () => featureView('pueblo', PU, {
  title: { es: 'El pueblo', en: 'The town' }, sub: { es: 'La Niña de Caldas: el municipio más joven del departamento.', en: 'Caldas\'s little girl: the department\'s youngest municipality.' },
  ph: 'pueblo', kicker: { es: 'Norcasia, Caldas', en: 'Norcasia, Caldas' }, h1: { es: 'La Niña de Caldas', en: 'Caldas\'s little girl' },
  p: { es: 'Pueblo de aguacate, ríos y gente que volvió a creer en su tierra.', en: 'A town of avocados, rivers and people who believe in their land again.' },
  tipsT: { es: 'Consejos de latino a latino', en: 'Tips from Latinos to Latinos' }, mapId: 'pueblo', yt: 'Norcasia Caldas pueblo'
});

/* ---------- Agenda ---------- */
function nthWeekday(y, m, wd, n) { const d = new Date(Date.UTC(y, m, 1)); const shift = (wd - d.getUTCDay() + 7) % 7; return new Date(Date.UTC(y, m, 1 + shift + 7 * (n - 1))); }
const isoOf = d => d.toISOString().slice(0, 10);
function nextCattleFair() {
  const t = todayISO(); const [y, m] = t.split('-').map(Number);
  for (let k = 0; k < 3; k++) { const yy = y + Math.floor((m - 1 + k) / 12), mm = (m - 1 + k) % 12; const iso = isoOf(nthWeekday(yy, mm, 1, 2)); if (iso >= t) return iso; }
  return null;
}
function nextSunday() { const t = new Date(todayISO() + 'T00:00:00Z'); const add = (7 - t.getUTCDay()) % 7; t.setUTCDate(t.getUTCDate() + add); return isoOf(t); }
function agendaItems() {
  const t = todayISO(), y = +t.slice(0, 4);
  const out = [];
  AGENDA.forEach(a => {
    if (a.type === 'fixed') {
      if (a.e >= t) out.push({ iso: a.d, end: a.e, a });
      else out.push({ iso: (y + 1) + '-06-01', a, approx: { es: 'Junio de ' + (y + 1) + ' (fechas por confirmar)', en: 'June ' + (y + 1) + ' (dates TBC)' } });
    } else if (a.type === 'annual') {
      const iso = (y + '-' + a.md) >= t ? y + '-' + a.md : (y + 1) + '-' + a.md; out.push({ iso, a });
    } else if (a.type === 'month') {
      const iso = (y + '-' + a.md + '-30') >= t ? y + '-' + a.md + '-01' : (y + 1) + '-' + a.md + '-01';
      out.push({ iso, a, approx: { es: 'Septiembre de ' + iso.slice(0, 4), en: 'September ' + iso.slice(0, 4) } });
    }
  });
  const cf = nextCattleFair();
  if (cf) out.push({ iso: cf, a: { t: { es: 'Feria ganadera', en: 'Cattle fair' }, s: { es: 'Cada segundo lunes del mes.', en: 'Every second Monday of the month.' }, ph: 'ganado' } });
  out.push({ iso: nextSunday(), a: { t: { es: 'Día de mercado', en: 'Market day' }, s: { es: 'Todos los domingos en el pueblo.', en: 'Every Sunday in town.' }, ph: 'mercado' } });
  return out.sort((p, q) => p.iso < q.iso ? -1 : 1);
}
const capD = iso => { const t = dateLabel(iso); return t.charAt(0).toUpperCase() + t.slice(1); };
const inDays = n => n === 0 ? L({ es: 'hoy', en: 'today' }) : n === 1 ? L({ es: 'mañana', en: 'tomorrow' }) : L({ es: 'en ' + n + ' días', en: 'in ' + n + ' days' });
V.agenda = () => `
  ${head('agenda', L({ es: 'Fiestas y agenda de Norcasia', en: 'Norcasia festivities & calendar' }), L({ es: 'Lo que viene en el pueblo, ordenado por fecha y con los días que faltan.', en: 'What\'s coming up in town, in date order with a countdown.' }))}
  <div class="hero" style="min-height:240px" ${photo('aguacate')}><div class="in"><span class="kicker">${L({ es: 'Junio en Norcasia', en: 'June in Norcasia' })}</span><h1 style="font-size:2.3rem">${L({ es: 'Fiestas del Aguacate y el Turismo', en: 'Avocado and Tourism Festival' })}</h1><p id="agenda-next"></p></div></div>
  <div class="status-list" id="agenda-list"></div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Así fueron las Fiestas del Aguacate 2026 (4 al 8 de junio)', en: 'How the 2026 Avocado Festival went (4 to 8 June)' })}</h3><ul class="small">
    <li>${L({ es: 'Jueves: eucaristía y procesión.', en: 'Thursday: mass and procession.' })}</li>
    <li>${L({ es: 'Viernes: alborada, torneos de fútbol, billar y parqués, caballitos de palo, almuerzo comunitario y conciertos.', en: 'Friday: dawn parade, football, billiards and parchís tournaments, hobby horses, community lunch and concerts.' })}</li>
    <li>${L({ es: 'Sábado: carrera popular, mercado campesino, comparsas y delegaciones invitadas.', en: 'Saturday: fun run, farmers\' market, troupes and visiting delegations.' })}</li>
    <li>${L({ es: 'Domingo: carrozas, vaquería y coronación de las reinas.', en: 'Sunday: floats, rodeo and pageant crowning.' })}</li>
    <li>${L({ es: 'Lunes festivo: cabalgata y cierre musical.', en: 'Holiday Monday: horse parade and closing concerts.' })}</li>
  </ul><p class="small muted mt">${L({ es: 'En fiestas hay mucho trabajo temporal en ventas de comida, eventos y hospedajes.', en: 'During the festival there\'s lots of temporary work in food stalls, events and lodging.' })}</p></div>`;
function renderAgenda() {
  const items = agendaItems();
  const box = $('#agenda-list');
  if (box) box.innerHTML = items.map(x => {
    const dt = daysTo(x.iso);
    const ongoing = x.end && x.iso <= todayISO() && x.end >= todayISO();
    const when = x.approx ? L(x.approx) : capD(x.iso);
    const pill = ongoing ? `<span class="pill free">${L({ es: 'Ahora', en: 'Now' })}</span>` : x.approx ? `<span class="pill">${L({ es: 'Próximo año', en: 'Next year' })}</span>` : `<span class="pill${dt === 0 ? ' free' : ''}">${dt === 0 ? L({ es: 'Hoy', en: 'Today' }) : L({ es: 'En ' + dt + ' d', en: 'In ' + dt + ' d' })}</span>`;
    return `<div class="sl"><div><b>${L(x.a.t)}</b><small>${when}</small><small>${L(x.a.s)}</small></div>${pill}</div>`;
  }).join('');
  const nx = items.find(x => !x.approx && (x.a.t.es !== 'Día de mercado'));
  const p = $('#agenda-next'); if (p) p.textContent = nx ? L({ es: 'Lo que sigue en el pueblo: ', en: 'Up next in town: ' }) + L(nx.a.t) + ' (' + inDays(daysTo(nx.iso)) + ')' : '';
  const s = $('#agenda-strip');
  if (s && nx) s.innerHTML = `<div class="card dark mt2" style="cursor:pointer" onclick="go('agenda')"><div class="small" style="opacity:.75">${L({ es: 'Agenda de Norcasia', en: 'Norcasia calendar' })}</div><b style="font-family:'Barlow Condensed';font-size:1.45rem;text-transform:uppercase">${L(nx.a.t)}</b><div class="small" style="opacity:.85">${capD(nx.iso)} · ${inDays(daysTo(nx.iso))}</div></div>`;
}

V.places = () => {
  const cats = [['water', { es: 'Agua: embalse y río', en: 'Water: reservoir and river' }], ['nature', { es: 'Cascadas, ríos y cuevas', en: 'Waterfalls, rivers and caves' }], ['town', { es: 'Pueblo y alrededores', en: 'Town and around' }]];
  return `${head('places', L({ es: 'Lugares para conocer', en: 'Places to see' }), L({ es: 'Desliza para ver más. Para cascadas y cuevas, ve con guía local.', en: 'Swipe for more. For waterfalls and caves, go with a local guide.' }))}
  ${cats.map(c => `<h3 class="mt2" style="text-transform:uppercase">${L(c[1])}</h3><div class="rail mt">${PLACES.filter(p => p.cat === c[0]).map(p => `
    <article class="place"><div class="ph" ${photo(p.id)}><span class="pill ${p.free ? 'free' : 'paid'}">${p.free ? L({ es: 'Gratis', en: 'Free' }) : L({ es: 'Con guía o costo', en: 'Guide or fee' })}</span></div>
      <div class="bd"><h3>${L(p.n)}</h3><p>${L(p.d)}</p>
      <div class="btns"><a class="btn sm red" href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}" target="_blank" rel="noopener">${L({ es: 'Cómo llegar', en: 'Directions' })}</a><button class="btn sm ghost" onclick="showOnMap('${p.id}')">${L({ es: 'En el mapa', en: 'On map' })}</button>${['embalse', 'mirador', 'presa'].includes(p.id) ? `<button class="btn sm" onclick="go('embalse')">${L({ es: 'Ver embalse', en: 'See reservoir' })}</button>` : ''}${p.id === 'rio' ? `<button class="btn sm" onclick="go('rio')">${L({ es: 'Ver río', en: 'See river' })}</button>` : ''}${p.id === 'pueblo' ? `<button class="btn sm" onclick="go('pueblo')">${L({ es: 'Ver pueblo', en: 'See town' })}</button>` : ''}</div></div></article>`).join('')}</div>`).join('')}
  ${agencyCard()}`;
};

V.move = () => `
  ${head('move', L({ es: 'Cómo llegar y moverse', en: 'Getting here & around' }), L({ es: 'Norcasia queda en el oriente de Caldas; la puerta de entrada es La Dorada.', en: 'Norcasia is in eastern Caldas; the gateway is La Dorada.' }))}
  <div class="live" style="margin-top:0">
    <div class="lc dark"><div class="lab">La Dorada → Norcasia</div><div class="big">≈ ${cop(BUS_LD)}</div><div class="sub">${L({ es: '1,5 a 2 horas en bus directo', en: '1.5 to 2 hours by direct bus' })}</div></div>
    <div class="lc sea"><div class="lab">${L({ es: 'Distancia a La Dorada', en: 'Distance to La Dorada' })}</div><div class="big">47,8 km</div><div class="sub">${L({ es: 'Vía pavimentada', en: 'Paved road' })}</div></div>
    <div class="lc c3"><div class="lab">${L({ es: 'Distancia a Manizales', en: 'Distance to Manizales' })}</div><div class="big">207 km</div><div class="sub muted">${L({ es: 'La capital de Caldas', en: 'The capital of Caldas' })}</div></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Cómo llegar paso a paso', en: 'How to get here step by step' })}</h3>
    <ol class="small">
      <li>${L({ es: 'Toma un bus intermunicipal hasta La Dorada: unas 4 horas desde Bogotá. Desde Medellín o Manizales el viaje total hasta Norcasia es de unas 5 a 7 horas.', en: 'Take an intercity bus to La Dorada: about 4 hours from Bogotá. From Medellín or Manizales the whole trip to Norcasia takes about 5 to 7 hours.' })}</li>
      <li>${L({ es: 'En la terminal de La Dorada toma el bus directo a Norcasia (hora y media a dos horas).', en: 'At La Dorada terminal take the direct bus to Norcasia (1.5 to 2 hours).' })}</li>
      <li>${L({ es: 'Pregunta en la taquilla los horarios del último bus: en la tarde-noche hay pocas salidas.', en: 'Ask at the ticket office when the last bus leaves: there are few departures in the evening.' })}</li>
    </ol>
    <p class="small muted mt">${L({ es: 'El pasaje La Dorada – Norcasia es un valor de referencia (Las2orillas, nov 2024). Confírmalo en la terminal.', en: 'The La Dorada – Norcasia fare is a reference figure (Las2orillas, Nov 2024). Confirm it at the terminal.' })}</p>
  </div>
  <div class="grid g2 stack mt2">
    <div class="card reveal"><h3>${L({ es: 'En el pueblo', en: 'In town' })}</h3><p class="small">${L({ es: 'El casco urbano se camina en pocos minutos. Para el mirador, Las Pavas o el río se usa moto, carro de los operadores o transporte contratado.', en: 'The town centre is walkable in minutes. For the viewpoint, Las Pavas or the river people use motorbikes, operator vehicles or hired transport.' })}</p></div>
    <div class="card reveal"><h3>${L({ es: 'A las veredas', en: 'To rural areas' })}</h3><p class="small">${L({ es: 'Hay líneas y camperos que salen del parque a horas fijas, sobre todo en la mañana y el día de mercado. Pregunta el horario de regreso.', en: 'Rural jeeps and lines leave the square at set times, mostly in the morning and on market day. Ask when they come back.' })}</p></div>
    <div class="card reveal"><h3>${L({ es: 'Mototaxi', en: 'Moto-taxi' })}</h3><p class="small">${L({ es: 'Muy común pero informal: exige casco y acuerda el precio antes.', en: 'Very common but informal: insist on a helmet and agree the price first.' })}</p></div>
    <div class="card reveal"><h3>${L({ es: 'Lanchas', en: 'Boats' })}</h3><p class="small">${L({ es: 'Por el embalse y el río solo con operadores autorizados y chaleco salvavidas.', en: 'On the reservoir and river only with authorised operators and a life jacket.' })}</p></div>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: '¿Cómo llego?', en: 'How do I get there?' })}</h3>
    <label class="f">${L({ es: 'Destino', en: 'Destination' })}</label>
    <div class="row"><input id="j-to" placeholder="${L({ es: 'Ej: Terminal de La Dorada, Manizales, Medellín', en: 'E.g. La Dorada terminal, Manizales, Medellín' })}"><button class="btn red" onclick="planTrip()">${L({ es: 'Buscar', en: 'Go' })}</button></div>
    <p class="small muted mt">${L({ es: 'Abre Google Maps con la ruta desde donde estás.', en: 'Opens Google Maps with a route from where you are.' })}</p>
  </div>`;

V.health = () => `
  ${head('health', L({ es: 'Salud', en: 'Health' }), L({ es: 'Dónde ir según lo que te pase.', en: 'Where to go depending on what happens.' }))}
  <div class="sosgrid">
    <a class="sosbtn" href="tel:123"><strong>123</strong><span>${L({ es: 'Emergencias', en: 'Emergencies' })}</span><small>${L({ es: 'Si es grave, llama ya', en: 'If serious, call now' })}</small></a>
    <a class="sosbtn ink" href="tel:132"><strong>132</strong><span>${L({ es: 'Cruz Roja', en: 'Red Cross' })}</span><small>${L({ es: 'Ambulancia', en: 'Ambulance' })}</small></a>
  </div>
  <div class="note red mt2">${L({ es: '<b>En urgencias te tienen que atender</b>, aunque no tengas papeles, EPS ni plata. La atención inicial de urgencias es obligatoria en Colombia.', en: '<b>The ER must treat you</b>, even without papers, insurance or money. Initial emergency care is mandatory in Colombia.' })}</div>
  <div class="status-list mt2">
    <div class="sl reveal"><div><b>${L({ es: 'Hospital de Norcasia', en: 'Norcasia hospital' })}</b><small>${L({ es: 'Atención básica, consulta, vacunas y urgencias del pueblo. De aquí remiten los casos complejos.', en: 'Basic care, check-ups, vaccines and the town ER. Complex cases are referred from here.' })}</small></div><a class="call" href="${gmaps('Hospital Norcasia Caldas')}" target="_blank" rel="noopener">${L({ es: 'Mapa', en: 'Map' })}</a></div>
    <div class="sl reveal"><div><b>ESE Hospital San Félix — La Dorada</b><small>${L({ es: 'El hospital de referencia más cercano, a unos 48 km.', en: 'The nearest referral hospital, about 48 km away.' })}</small></div><a class="call ink" href="${gmaps('ESE Hospital San Félix La Dorada Caldas')}" target="_blank" rel="noopener">${L({ es: 'Mapa', en: 'Map' })}</a></div>
    <div class="sl reveal"><div><b>${L({ es: 'Hospitales de Manizales', en: 'Manizales hospitals' })}</b><small>${L({ es: 'Alta complejidad, a unos 207 km.', en: 'Major hospitals, about 207 km away.' })}</small></div><a class="call ink" href="${gmaps('hospital Manizales')}" target="_blank" rel="noopener">${L({ es: 'Mapa', en: 'Map' })}</a></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Cómo afiliarte a salud', en: 'How to get health cover' })}</h3>
    <ol class="small">
      <li>${L({ es: 'Con PPT, visa o cédula pide la <b>encuesta del SISBEN</b> en la Alcaldía de Norcasia.', en: 'With a PPT, visa or Colombian ID, request the <b>SISBEN survey</b> at Norcasia town hall.' })}</li>
      <li>${L({ es: 'Si quedas clasificado, te afilias a una EPS del régimen subsidiado sin pagar.', en: 'If you qualify, you join a subsidised EPS insurer at no cost.' })}</li>
      <li>${L({ es: 'Si tienes contrato de trabajo, el empleador te afilia a una EPS del régimen contributivo.', en: 'If you have a job contract, your employer enrols you in a contributory EPS.' })}</li>
      <li>${L({ es: 'Las vacunas del esquema nacional son gratis para todos los niños, tengan o no papeles.', en: 'National-schedule vaccines are free for all children, with or without papers.' })}</li>
    </ol>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Clima cálido y lluvioso: ojo con el dengue', en: 'Hot and rainy: watch out for dengue' })}</h3><p class="small">${L({ es: 'Norcasia es de selva húmeda y llueve mucho, sobre todo en octubre. Elimina agua estancada, usa repelente y, si tienes fiebre alta con dolor de cuerpo, ve al médico y no tomes ibuprofeno ni aspirina sin indicación. En el campo usa botas: hay serpientes.', en: 'Norcasia is humid rainforest and it rains a lot, especially in October. Get rid of standing water, use repellent and, with high fever and body aches, see a doctor and don\'t take ibuprofen or aspirin unless told to. On farms wear boots: there are snakes.' })}</p></div>`;

V.sos = () => `
  ${head('sos', 'SOS', L({ es: 'Toca un número para llamar.', en: 'Tap a number to call.' }))}
  <div class="sosgrid">${EMERG.map(e => `<a class="sosbtn ${e.cls}" href="tel:${e.n}"><strong>${e.n}</strong><span>${L(e.t)}</span><small>${L(e.s)}</small></a>`).join('')}</div>
  <div class="sec-head"><div><h2>${L({ es: 'Ayuda y oficinas', en: 'Help & offices' })}</h2></div></div>
  <div class="status-list">${OFFICES.filter(o => o.telS).map(o => `<div class="sl"><div><b>${L(o.n)}</b><small>${esc(o.telS)}</small></div><a class="call ink" href="tel:${o.tel}">${L({ es: 'Llamar', en: 'Call' })}</a></div>`).join('')}
    <div class="sl"><div><b>${L({ es: 'Fiscalía (denuncias)', en: 'Attorney General (crime reports)' })}</b><small>122</small></div><a class="call ink" href="tel:122">${L({ es: 'Llamar', en: 'Call' })}</a></div>
  </div>
  <div class="note mt2">${L({ es: 'Si estás en el río o el embalse y alguien está en peligro, grita al guía o al lanchero más cercano y llama al 123. Si eres de otro país, guarda el número de tu consulado en Colombia.', en: 'If you\'re on the river or reservoir and someone is in danger, shout to the nearest guide or boatman and call 123. If you\'re from another country, save your consulate\'s number in Colombia.' })}</div>
  <div class="btns"><button class="btn red block" onclick="openShow()">${L({ es: 'Me perdí: mostrar mi dirección', en: 'I\'m lost: show my address' })}</button></div>`;

let talkTab = 'cos';
V.talk = () => `
  ${head('talk', L({ es: 'Hablar caldense', en: 'Speak like Caldas' }), L({ es: 'En Norcasia se habla español con acento paisa y caldense. Y para trabajar en turismo, el inglés vale oro. Toca "Oír" para escuchar.', en: 'Norcasia speaks Spanish with a paisa, Caldas accent. And for tourism jobs, English is gold. Tap "Hear" to listen.' }))}
  <div class="tabsx" id="talk-tabs">
    <button data-k="cos" onclick="setTalk('cos')">${L({ es: 'Caldense', en: 'Local words' })}</button>
    <button data-k="dlg" onclick="setTalk('dlg')">${L({ es: 'Conversaciones', en: 'Dialogues' })}</button>
    <button data-k="ve" onclick="setTalk('ve')">${L({ es: 'De Venezuela a Colombia', en: 'Venezuela to Colombia' })}</button>
    <button data-k="en" onclick="setTalk('en')">${L({ es: 'Inglés para guías', en: 'English for guides' })}</button>
  </div>
  <div id="talk-body"></div>`;
function talkBody() {
  const q = s => JSON.stringify(s).replace(/"/g, '&quot;');
  if (talkTab === 'cos') return `<div class="phr">${COSTENO.map(p => `<div class="ph1"><div><div class="o">${esc(p[0])}</div><div class="tr">${esc(LANG === 'es' ? p[1] : p[2])}</div><div class="say">"${esc(p[3])}"</div></div><button onclick="say(${q(p[3])},'es')">${L({ es: 'Oír', en: 'Hear' })}</button></div>`).join('')}</div>`;
  if (talkTab === 've') return `<p class="small muted mt">${L({ es: 'Palabras que cambian de un país a otro. Así te entienden más rápido.', en: 'Words that change from one country to the other. People will get you faster.' })}</p><div class="status-list mt">${VECO.map(p => `<div class="sl"><div><b>${esc(p[0])}</b><small>${L({ es: 'En Venezuela', en: 'In Venezuela' })}</small></div><div style="text-align:right"><b>${esc(p[1])}</b><small>${LANG === 'en' ? esc(p[2]) : L({ es: 'En Colombia', en: '' })}</small></div></div>`).join('')}</div>`;
  if (talkTab === 'en') return `<div class="phr">${ENG.map(p => `<div class="ph1"><div><div class="o">${esc(p[0])}</div><div class="tr">${esc(p[1])}</div><div class="say">${esc(p[2])}</div></div><button onclick="say(${q(p[0])},'en')">${L({ es: 'Oír', en: 'Hear' })}</button></div>`).join('')}</div><p class="small muted mt">${L({ es: 'La pronunciación es aproximada; la sílaba en mayúscula es la fuerte.', en: 'Pronunciation is approximate; the capitalised syllable is stressed.' })}</p>`;
  return DIALOGS.map(d => `<div class="card mt reveal in"><h3>${L(d.t)}</h3>${d.l.map(x => `<div class="dlg ${x[0]}">${esc(x[1])}${LANG === 'en' ? `<em>${esc(x[2])}</em>` : ''}</div>`).join('')}</div>`).join('');
}
function setTalk(k) { talkTab = k; const b = $('#talk-body'); if (b) b.innerHTML = talkBody(); $$('#talk-tabs button').forEach(x => x.classList.toggle('on', x.dataset.k === k)); }
function say(text, lang) {
  if (!('speechSynthesis' in window)) { toast(L({ es: 'Tu celular no tiene voz disponible', en: 'No voice available on this device' })); return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === 'en' ? 'en-US' : 'es-CO'; u.rate = .9;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}

V.money = () => `
  ${head('money', L({ es: 'Peso colombiano y cambio', en: 'Colombian peso & exchange' }), L({ es: 'En Colombia se paga en pesos (COP). Precios con punto de miles: $15.000 son quince mil pesos.', en: 'Colombia pays in pesos (COP). Prices use a dot for thousands: $15.000 means fifteen thousand pesos.' }))}
  <div class="live" style="margin-top:0">
    <div class="lc dark"><div class="lab">${L({ es: '1 dólar (USD)', en: '1 US dollar' })}</div><div class="big" id="fx-usd2"><span class="spin"></span></div><div class="sub" id="fx-sub2"></div></div>
    <div class="lc sea"><div class="lab">${L({ es: '1 euro (EUR)', en: '1 euro' })}</div><div class="big" id="fx-eur"><span class="spin"></span></div><div class="sub">${L({ es: 'Tasa del día', en: 'Today\'s rate' })}</div></div>
    <div class="lc c3"><div class="lab">${L({ es: '100 bolívares (VES)', en: '100 bolívars (VES)' })}</div><div class="big" id="fx-ves"><span class="spin"></span></div><div class="sub muted">${L({ es: 'Tasa de referencia', en: 'Reference rate' })}</div></div>
  </div>
  <div class="card mt2 reveal">
    <h3>${L({ es: 'Convertidor', en: 'Converter' })}</h3>
    <div class="grid g2"><div><label class="f">${L({ es: 'Cantidad', en: 'Amount' })}</label><input id="fx-amt" type="number" value="100000" min="0" oninput="convert()"></div>
    <div><label class="f">${L({ es: 'Moneda', en: 'Currency' })}</label><select id="fx-from" onchange="convert()"><option value="COP">${L({ es: 'Peso colombiano (COP)', en: 'Colombian peso (COP)' })}</option><option value="USD">${L({ es: 'Dólar (USD)', en: 'US dollar (USD)' })}</option><option value="EUR">Euro (EUR)</option><option value="VES">${L({ es: 'Bolívar (VES)', en: 'Bolívar (VES)' })}</option></select></div></div>
    <div id="fx-out" class="mt"></div>
  </div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Consejos', en: 'Tips' })}</h3><ul class="small">
    <li>${L({ es: 'En Norcasia no hay casas de cambio: cambia dólares o euros en La Dorada o en la ciudad de donde vengas, en bancos o casas autorizadas.', en: 'There are no exchange houses in Norcasia: change dollars or euros in La Dorada or wherever you come from, at banks or authorised houses.' })}</li>
    <li>${L({ es: 'Hay pocos cajeros en el pueblo y a veces se quedan sin plata en temporada alta: lleva efectivo en billetes pequeños.', en: 'There are few cash machines in town and they can run out in high season: bring cash in small notes.' })}</li>
    <li>${L({ es: 'Nequi y Daviplata abren cuenta con PPT desde el celular; muchas tiendas y operadores reciben transferencia.', en: 'Nequi and Daviplata open accounts with a PPT from your phone; many shops and operators accept transfers.' })}</li>
    <li>${L({ es: 'Revisa los billetes de $50.000 y $100.000: hay falsos. Mira la marca de agua y el hilo de seguridad.', en: 'Check COP 50,000 and 100,000 notes: fakes circulate. Look at the watermark and security thread.' })}</li>
    <li>${L({ es: 'Para enviar plata a tu país compara comisiones y tasa entre agencias de giros y apps antes de mandar.', en: 'To send money home, compare fees and rates between remittance agencies and apps first.' })}</li>
  </ul></div>`;

let lifeTab = 'housing';
V.life = () => `
  ${head('life', L({ es: 'Vivir en Norcasia', en: 'Living in Norcasia' }), L({ es: 'Lo que nadie te cuenta al llegar a un pueblo pequeño.', en: 'What nobody tells you when you arrive in a small town.' }))}
  <div class="tabsx" id="life-tabs">${Object.keys(LIFE).map(k => `<button data-k="${k}" onclick="setLife('${k}')">${L(LIFE[k].t)}</button>`).join('')}</div>
  <div id="life-body" class="mt"></div>`;
function lifeBody() {
  const x = LIFE[lifeTab];
  return `<div class="hero" style="min-height:190px" ${photo(x.ph)}><div class="in"><h1 style="font-size:2rem">${L(x.t)}</h1></div></div>
  <div class="status-list">${x.items.map((it, i) => `<div class="sl"><div>${num(L(it), i)}</div></div>`).join('')}</div>`;
}
function setLife(k) { lifeTab = k; const b = $('#life-body'); if (b) { b.innerHTML = lifeBody(); paintPhotos(b); } $$('#life-tabs button').forEach(x => x.classList.toggle('on', x.dataset.k === k)); }

V.weather = () => `
  ${head('weather', L({ es: 'Clima y festivos', en: 'Weather & holidays' }), L({ es: 'Cálido y húmedo todo el año: unos 21 °C en la madrugada y 29 °C al mediodía. Llueve mucho (casi 3.900 mm al año), sobre todo en octubre.', en: 'Warm and humid all year: about 21 °C at dawn and 29 °C at midday. Very rainy (nearly 3,900 mm a year), especially in October.' }))}
  <div class="card dark"><div class="small" style="opacity:.75">${L({ es: 'Pronóstico en Norcasia', en: 'Norcasia forecast' })}</div><div class="big" id="wx-now2" style="font-family:'Barlow Condensed';font-size:2.4rem;font-weight:800"><span class="spin"></span></div><div class="days" id="wx-days"></div></div>
  <div class="card mt2 reveal"><h3>${L({ es: 'Qué empacar', en: 'What to pack' })}</h3><ul class="small">
    <li>${L({ es: 'Ropa fresca y que seque rápido, vestido de baño y zapatos para el agua sin cordones.', en: 'Light quick-dry clothes, a swimsuit and lace-free water shoes.' })}</li>
    <li>${L({ es: 'Impermeable o capa: los aguaceros llegan de repente.', en: 'A raincoat or poncho: downpours arrive suddenly.' })}</li>
    <li>${L({ es: 'Repelente, bloqueador, gorra, linterna y bolsa seca para el celular.', en: 'Repellent, sunscreen, a cap, a torch and a dry bag for your phone.' })}</li>
    <li>${L({ es: 'Botas de caucho si vas a trabajar en finca.', en: 'Rubber boots if you\'ll work on a farm.' })}</li>
    <li>${L({ es: 'Documentos apostillados (nacimiento, antecedentes, títulos) si vas a hacer trámites.', en: 'Apostilled documents (birth, police record, diplomas) if you\'ll do paperwork.' })}</li>
  </ul></div>
  <div class="sec-head"><div><h2>${L({ es: 'Festivos', en: 'Public holidays' })}</h2><p id="next-hol"></p></div></div>
  <div class="status-list" id="hol-list"></div>
  <p class="small muted mt">${L({ es: 'En Colombia muchos festivos se pasan al lunes (Ley Emiliani). En los puentes festivos llegan más turistas: más trabajo y todo más lleno.', en: 'In Colombia many holidays move to Monday (Emiliani Law). Long weekends bring more tourists: more work and everything busier.' })}</p>`;

V.first = () => `
  ${head('first', L({ es: 'Primeros días', en: 'First days' }), L({ es: 'Marca cada paso. Tu avance se guarda en el celular.', en: 'Tick each step. Your progress is saved on your phone.' }))}
  <div class="progress"><i id="chk-bar"></i></div><p class="small muted mt" id="chk-txt"></p>
  <div class="status-list mt">${FIRST.map((f, i) => { const x = L(f); return `<label class="chk" id="chk-${i}"><input type="checkbox" onchange="tick(${i},this.checked)"><div><b>${esc(x[0])}</b><div class="small muted">${esc(x[1])}</div></div></label>`; }).join('')}</div>`;

V.map = () => `
  ${head('map', L({ es: 'Mapa de Norcasia', en: 'Map of Norcasia' }), L({ es: 'Toca un punto para ver detalles y la ruta. Los puntos marcados "aprox." son ubicaciones aproximadas.', en: 'Tap a point for details and directions. Points marked "approx." are approximate.' }))}
  <div class="chips" id="map-chips">
    ${[['all', { es: 'Todo', en: 'All' }], ['water', { es: 'Embalse y río', en: 'Reservoir & river' }], ['nature', { es: 'Naturaleza', en: 'Nature' }], ['town', { es: 'Pueblo', en: 'Town' }], ['help', { es: 'Salud y trámites', en: 'Health & offices' }]].map((c, i) => `<button data-c="${c[0]}" class="${i ? '' : 'on'}" onclick="mapFilter('${c[0]}')">${L(c[1])}</button>`).join('')}
  </div>
  <div id="map"></div>
  <div class="btns"><button class="btn red sm" onclick="locateMe()">${L({ es: 'Dónde estoy', en: 'Where am I' })}</button><a class="btn sm ghost" href="${gmaps('Norcasia, Caldas, Colombia')}" target="_blank" rel="noopener">${L({ es: 'Abrir en Google Maps', en: 'Open in Google Maps' })}</a></div>`;

V.media = () => `
  ${head('media', L({ es: 'Fotos y videos', en: 'Photos & videos' }), L({ es: 'Fotos reales de Wikimedia Commons. Toca una para ver ese lugar en el mapa.', en: 'Real photos from Wikimedia Commons. Tap one to see that place on the map.' }))}
  <div class="gal">${PLACES.map(p => `<figure ${photo(p.id)} onclick="showOnMap('${p.id}')"><figcaption>${L(p.n)}</figcaption></figure>`).join('')}
    <figure ${photo('torito')}><figcaption>${L({ es: 'Torito dorsiblanco', en: 'White-mantled barbet' })}</figcaption></figure>
    <figure ${photo('aullador')}><figcaption>${L({ es: 'Mono aullador', en: 'Howler monkey' })}</figcaption></figure>
    <figure ${photo('martin')}><figcaption>${L({ es: 'Martín pescador', en: 'Kingfisher' })}</figcaption></figure>
    <figure ${photo('aguacate')}><figcaption>${L({ es: 'Aguacate', en: 'Avocado' })}</figcaption></figure></div>
  <div class="sec-head"><div><h2>${L({ es: 'Videos', en: 'Videos' })}</h2><p>${L({ es: 'Abren YouTube con los videos más recientes de cada tema.', en: 'Open YouTube with the latest videos on each topic.' })}</p></div></div>
  <div class="vids">${VIDEOS.map(v => `<a class="vid" ${photo(v[2])} href="https://www.youtube.com/results?search_query=${encodeURIComponent(v[1])}" target="_blank" rel="noopener"><span class="playc"></span><div><b>${L(v[0])}</b><small>YouTube</small></div></a>`).join('')}
    <a class="vid" ${photo('mirador')} href="${AGENCY.ig}" target="_blank" rel="noopener"><span class="playc"></span><div><b>${L({ es: 'Reels de Norcasia Travel', en: 'Norcasia Travel reels' })}</b><small>Instagram @norcasia.travel</small></div></a></div>`;

/* ---------- Render y navegación ---------- */
const VIEWS = ['home', 'papers', 'embalse', 'rio', 'work', 'pueblo', 'agenda', 'places', 'move', 'health', 'sos', 'talk', 'money', 'life', 'weather', 'first', 'map', 'media'];
let current = 'home';
function render() {
  document.documentElement.lang = LANG;
  $$('[data-t]').forEach(el => { const k = el.dataset.t; if (T[k]) el.textContent = L(T[k]); });
  $('#lang-es').classList.toggle('on', LANG === 'es'); $('#lang-en').classList.toggle('on', LANG === 'en');
  $('#main').innerHTML = VIEWS.map(v => `<section class="view ${v === current ? 'on' : ''}" id="v-${v}">${V[v]()}</section>`).join('');
  $('#upd').textContent = VERIFIED + ' · ' + L({ es: 'hora Colombia', en: 'Colombia time' });
  setTalk(talkTab); setLife(lifeTab); renderAlert(); renderHolidays(); renderAgenda(); restoreChecks(); calcWage(); renderCities();
  if (WX) paintWeather(); paintFX();
  tickClock(); buildTicker(); observeReveal(); paintPhotos();
  map = null; if (current === 'map') setTimeout(initMap, 50);
}
function go(v) {
  if (!VIEWS.includes(v)) v = 'home';
  current = v;
  $$('section.view').forEach(s => s.classList.toggle('on', s.id === 'v-' + v));
  $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  if (location.hash.slice(1) !== v) history.replaceState(null, '', v === 'home' ? location.pathname : '#' + v);
  window.scrollTo(0, 0);
  if (v === 'map') setTimeout(initMap, 60);
  observeReveal();
}
function setLang(l) { LANG = l; store.set('lang', l); render(); }
function observeReveal() {
  const els = $$('.view.on .reveal:not(.in)');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .08 });
  els.forEach(e => io.observe(e));
}

/* ---------- Hero en movimiento ---------- */
const HERO = ['embalse', 'mirador', 'rio', 'pueblo', 'rafting', 'pavas', 'manso', 'torito'];
let heroI = 0, heroTimer = null;
function heroSetup() {
  const h = $('#hero'); if (!h) return;
  const ready = HERO.filter(k => PHOTO_CACHE[k]);
  if (!ready.length || h.dataset.n == ready.length) return;
  h.dataset.n = ready.length;
  $$('.slide', h).forEach(s => s.remove());
  ready.forEach((k, i) => { const s = document.createElement('div'); s.className = 'slide' + (i === 0 ? ' on' : ''); s.style.backgroundImage = `url("${PHOTO_CACHE[k]}")`; s.dataset.k = k; h.prepend(s); });
  $('#hero-dots').innerHTML = ready.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('');
  heroI = 0; heroCaption(ready[0]);
  clearInterval(heroTimer);
  if (ready.length > 1) heroTimer = setInterval(() => {
    const ss = $$('#hero .slide'); if (!ss.length) return;
    const order = ss.slice().reverse();
    order[heroI].classList.remove('on'); heroI = (heroI + 1) % order.length; order[heroI].classList.add('on');
    $$('#hero-dots i').forEach((d, i) => d.classList.toggle('on', i === heroI));
    heroCaption(order[heroI].dataset.k);
  }, 6000);
}
const HERO_CAP = { rafting: { es: 'Body rafting', en: 'Body rafting' }, torito: { es: 'Torito dorsiblanco, ave símbolo de Norcasia', en: 'White-mantled barbet, Norcasia\'s emblem bird' } };
function heroCaption(k) { const p = PLACES.find(x => x.id === k) || (HERO_CAP[k] ? { n: HERO_CAP[k] } : null); const c = $('#hero-cap'); if (c) c.textContent = (p ? L(p.n) + ' · ' : '') + L({ es: 'Foto: Wikimedia Commons', en: 'Photo: Wikimedia Commons' }); }

/* ---------- Plazos: cuenta regresiva ---------- */
function renderAlert() {
  const d0 = activeDeadline();
  const html = d0 ? (() => {
    const left = d0.end - Date.now();
    const d = Math.floor(left / 864e5), h = Math.floor(left / 36e5) % 24, m = Math.floor(left / 6e4) % 60;
    return `<div class="alert" onclick="go('papers')"><div><span class="kicker" style="background:#fff;color:var(--red)">${esc(d0.k)}</span><b>${L(d0.t)}</b><div class="small" style="opacity:.92;margin-top:4px">${L(d0.s)}</div></div>
      <div class="count"><div><strong>${d}</strong><small>${L({ es: 'días', en: 'days' })}</small></div><div><strong>${h}</strong><small>${L({ es: 'horas', en: 'hours' })}</small></div><div><strong>${m}</strong><small>min</small></div></div></div>`;
  })() : `<div class="alert closed" onclick="go('papers')"><div><span class="kicker">${L({ es: 'Papeles', en: 'Papers' })}</span><b>${L({ es: 'Revisa las vías vigentes de regularización', en: 'Check the current regularization routes' })}</b><div class="small" style="opacity:.9;margin-top:4px">${L({ es: 'Los plazos de 2026 ya vencieron. Consulta novedades en migracioncolombia.gov.co.', en: 'The 2026 deadlines have passed. Check for news at migracioncolombia.gov.co.' })}</div></div></div>`;
  ['#alert', '#alert2'].forEach(s => { const e = $(s); if (e) e.innerHTML = html; });
}

/* ---------- Relojes y franja "Hoy" ---------- */
function tzf(zone, o) { return new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { timeZone: zone, ...o }).format(new Date()); }
function tickClock() {
  const co = $('#clk-co'); if (co) co.textContent = tzf(ZONE, { hour: '2-digit', minute: '2-digit', hour12: false });
  const ve = $('#clk-ve'); if (ve) ve.textContent = L({ es: 'Caracas: ', en: 'Caracas: ' }) + tzf(ZONE_VE, { hour: '2-digit', minute: '2-digit', hour12: false }) + L({ es: ' · Venezuela va 1 hora adelante', en: ' · Venezuela is 1 hour ahead' });
}
const todayISO = () => new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(new Date());
function nextHoliday() { const iso = todayISO(); return HOLIDAYS.find(h => h[0] >= iso) || null; }
function dateLabel(iso) { const [y, m, d] = iso.split('-').map(Number); return new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, d)); }
function daysTo(iso) { const now = new Date(todayISO() + 'T00:00:00Z'); return Math.round((new Date(iso + 'T00:00:00Z') - now) / 864e5); }
function buildTicker() {
  const parts = [];
  parts.push(`<span><i class="dot"></i>${L({ es: 'Hoy en Norcasia', en: 'Today in Norcasia' })}: <b>${tzf(ZONE, { weekday: 'long', day: 'numeric', month: 'long' })}</b></span>`);
  const d0 = activeDeadline();
  if (d0) parts.push(`<span>${esc(d0.k)}: <b>${L({ es: 'quedan ' + Math.ceil((d0.end - Date.now()) / 864e5) + ' días ', en: Math.ceil((d0.end - Date.now()) / 864e5) + ' days left ' })}${L(d0.tk)}</b></span>`);
  if (WX) parts.push(`<span>${L({ es: 'Clima', en: 'Weather' })}: <b>${Math.round(WX.current.temperature_2m)} °C</b>, ${L({ es: 'sensación', en: 'feels' })} ${Math.round(WX.current.apparent_temperature)} °C</span>`);
  if (FX && FX.COP) parts.push(`<span>1 USD = <b>${cop(FX.COP)}</b></span>`);
  const ag = agendaItems().filter(x => !x.approx);
  ag.slice(0, 2).forEach(x => parts.push(`<span>${L(x.a.t)}: <b>${inDays(daysTo(x.iso))}</b></span>`));
  const nh = nextHoliday(); if (nh) parts.push(`<span>${L({ es: 'Próximo festivo', en: 'Next holiday' })}: <b>${L(nh[1])}</b> (${inDays(daysTo(nh[0]))})</span>`);
  parts.push(`<span>${L({ es: 'Orgullo', en: 'Pride' })}: <b>${L({ es: 'Norcasia, postulado por Colombia a Best Tourism Villages 2026 de ONU Turismo', en: 'Norcasia, Colombia\'s nominee for UN Tourism Best Tourism Villages 2026' })}</b></span>`);
  parts.push(`<span>${L({ es: 'Emergencias', en: 'Emergencies' })}: <b>123</b></span>`);
  parts.push(`<span>${L({ es: 'Bus La Dorada – Norcasia', en: 'Bus La Dorada – Norcasia' })}: <b>≈ ${cop(BUS_LD)}</b></span>`);
  parts.push(`<span>${L({ es: 'Salario mínimo 2026', en: '2026 minimum wage' })}: <b>${cop(WAGE.month)}</b></span>`);
  parts.push(`<span>${L({ es: 'Paseos', en: 'Trips' })}: <b>Norcasia Travel ${AGENCY.tel}</b></span>`);
  const t = $('#ticker'); if (t) t.innerHTML = parts.join('');
}

/* ---------- Clima en vivo (Open-Meteo) ---------- */
let WX = store.get('wx', null);
const WCODE = c => c === 0 ? { es: 'Despejado', en: 'Clear' } : c <= 3 ? { es: 'Parcialmente nublado', en: 'Partly cloudy' } : c <= 48 ? { es: 'Neblina', en: 'Fog' } : c <= 67 ? { es: 'Lluvia', en: 'Rain' } : c <= 82 ? { es: 'Chubascos', en: 'Showers' } : { es: 'Tormenta', en: 'Thunderstorm' };
async function loadWeather() {
  try {
    WX = await getJSON('https://api.open-meteo.com/v1/forecast?latitude=5.5742&longitude=-74.8889&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=America%2FBogota&forecast_days=5');
    store.set('wx', WX); paintWeather(); buildTicker();
  } catch (e) { if (!WX) $$('#wx-now,#wx-now2').forEach(x => x.textContent = '--'); }
}
function paintWeather() {
  if (!WX || !WX.current) return;
  const c = WX.current, txt = Math.round(c.temperature_2m) + ' °C';
  const a = $('#wx-now'); if (a) a.textContent = txt;
  const s = $('#wx-sub'); if (s) s.textContent = L(WCODE(c.weather_code)) + ' · ' + L({ es: 'sensación ', en: 'feels ' }) + Math.round(c.apparent_temperature) + ' °C';
  const b = $('#wx-now2'); if (b) b.textContent = txt + ' · ' + L(WCODE(c.weather_code));
  const d = $('#wx-days'); if (d && WX.daily) d.innerHTML = WX.daily.time.map((t, i) => `<div>${new Intl.DateTimeFormat(LANG === 'es' ? 'es-CO' : 'en-GB', { weekday: 'short', timeZone: 'UTC' }).format(new Date(t + 'T12:00:00Z'))}<b>${Math.round(WX.daily.temperature_2m_max[i])}°</b>${Math.round(WX.daily.temperature_2m_min[i])}° · ${WX.daily.precipitation_probability_max[i] ?? 0}%</div>`).join('');
}

/* ---------- Cambio en vivo ---------- */
let FX = store.get('fx', null);
async function loadFX() {
  try {
    const j = await getJSON('https://open.er-api.com/v6/latest/USD');
    if (j && j.rates && j.rates.COP) { FX = { COP: j.rates.COP, EUR: j.rates.EUR, VES: j.rates.VES, t: j.time_last_update_utc }; store.set('fx', FX); }
  } catch (e) {}
  paintFX(); buildTicker();
}
function paintFX() {
  const ok = FX && FX.COP;
  ['#fx-usd', '#fx-usd2'].forEach(s => { const e = $(s); if (e) e.textContent = ok ? cop(FX.COP) : '--'; });
  const sub = ok ? L({ es: 'pesos colombianos · tasa del día', en: 'Colombian pesos · today\'s rate' }) : L({ es: 'Sin conexión: conecta para ver la tasa', en: 'Offline: connect to see the rate' });
  ['#fx-sub', '#fx-sub2'].forEach(s => { const e = $(s); if (e) e.textContent = sub; });
  const eu = $('#fx-eur'); if (eu) eu.textContent = ok && FX.EUR ? cop(FX.COP / FX.EUR) : '--';
  const vs = $('#fx-ves'); if (vs) vs.textContent = ok && FX.VES ? cop(100 * FX.COP / FX.VES) : '--';
  const wu = $('#wage-usd'); if (wu && ok) wu.textContent = L({ es: 'Salario ÷ 210 h · mínimo ≈ US$', en: 'Wage ÷ 210 h · minimum ≈ US$' }) + fmt(WAGE.month / FX.COP, 0);
  convert(); calcWage();
}
function convert() {
  const o = $('#fx-out'); if (!o) return;
  const amt = parseFloat($('#fx-amt').value) || 0, from = $('#fx-from').value;
  const perUSD = { USD: 1, COP: FX && FX.COP, EUR: FX && FX.EUR, VES: FX && FX.VES };
  if (!perUSD[from] || !(FX && FX.COP)) { o.innerHTML = `<div class="note">${L({ es: 'Necesitas conexión una vez para traer la tasa del día. Después funciona sin internet.', en: 'You need a connection once to get today\'s rate. Then it works offline.' })}</div>`; return; }
  const usd = amt / perUSD[from];
  const rows = ['COP', 'USD', 'EUR', 'VES'].filter(c => c !== from && perUSD[c]).map(c => `<div class="sl"><div><b>${c}</b></div><div style="font-family:'Barlow Condensed';font-size:1.5rem;font-weight:800">${fmt(usd * perUSD[c], c === 'COP' ? 0 : 2)}</div></div>`).join('');
  o.innerHTML = `<div class="status-list">${rows}</div>`;
}

/* ---------- Salario ---------- */
function calcWage() {
  const o = $('#w-out'); if (!o) return;
  const h = Math.max(0, Math.min(WAGE.weekH, parseFloat($('#w-h').value) || 0));
  const n = Math.max(0, Math.min(h, parseFloat($('#w-n').value) || 0));
  const d = Math.max(0, Math.min(10, parseFloat($('#w-d').value) || 0));
  const base = WAGE.month * h / WAGE.weekH;                       // proporcional a 42 h
  const night = n * 5 * WAGE.hour * WAGE.night;                    // ~5 semanas de 210 h al mes
  const sunday = d * (h / 6) * WAGE.hour * WAGE.sunday;            // horas de un día de trabajo
  const devengado = base + night + sunday;
  const aux = devengado <= 2 * WAGE.month ? WAGE.aux * Math.min(1, h / WAGE.weekH) : 0;
  const desc = devengado * 0.08;
  const neto = devengado + aux - desc;
  const row = (t, v, s = '') => `<div class="sl"><div><b>${t}</b>${s ? `<small>${s}</small>` : ''}</div><div style="font-family:'Barlow Condensed';font-size:1.4rem;font-weight:800">${cop(v)}</div></div>`;
  const usd = FX && FX.COP ? ' · ≈ US$' + fmt(neto / FX.COP, 0) : '';
  o.innerHTML = `<div class="status-list">${row(L({ es: 'Salario base', en: 'Base pay' }), base, L({ es: h + ' h por semana', en: h + ' h a week' }))}
    ${night ? row(L({ es: 'Recargo nocturno', en: 'Night surcharge' }), night) : ''}${sunday ? row(L({ es: 'Recargo dominical/festivo', en: 'Sunday/holiday surcharge' }), sunday) : ''}
    ${row(L({ es: 'Auxilio de transporte', en: 'Transport allowance' }), aux)}
    ${row(L({ es: 'Descuentos salud y pensión (8%)', en: 'Health & pension deductions (8%)' }), -desc)}
    ${row(L({ es: 'Te llega al mes (aprox.)', en: 'Take-home per month (approx.)' }), neto, L({ es: 'Cálculo de referencia', en: 'Reference estimate' }) + usd)}</div>`;
}

/* ---------- Festivos ---------- */
function renderHolidays() {
  const box = $('#hol-list'); if (!box) return;
  const iso = todayISO();
  const up = HOLIDAYS.filter(h => h[0] >= iso).slice(0, 10);
  box.innerHTML = up.map(h => `<div class="sl"><div><b>${L(h[1])}</b><small style="text-transform:capitalize">${dateLabel(h[0])}</small></div><span class="pill">${daysTo(h[0]) === 0 ? L({ es: 'Hoy', en: 'Today' }) : L({ es: 'En ' + daysTo(h[0]) + ' d', en: 'In ' + daysTo(h[0]) + ' d' })}</span></div>`).join('');
  const nh = nextHoliday(), n = $('#next-hol');
  if (n && nh) n.textContent = L({ es: 'Próximo: ', en: 'Next: ' }) + L(nh[1]);
}

/* ---------- Checklist ---------- */
function tick(i, v) { const s = store.get('chk', {}); s[i] = v; store.set('chk', s); restoreChecks(); }
function restoreChecks() {
  const s = store.get('chk', {}); let n = 0;
  FIRST.forEach((_, i) => { const el = $('#chk-' + i); if (!el) return; const on = !!s[i]; el.classList.toggle('done', on); $('input', el).checked = on; if (on) n++; });
  const bar = $('#chk-bar'); if (bar) bar.style.width = (n / FIRST.length * 100) + '%';
  const t = $('#chk-txt'); if (t) t.textContent = L({ es: `${n} de ${FIRST.length} listos`, en: `${n} of ${FIRST.length} done` });
}

/* ---------- Dirección ---------- */
function saveAddr() { const v = $('#my-addr').value.trim(); store.set('addr', v); toast(v ? L({ es: 'Dirección guardada', en: 'Address saved' }) : L({ es: 'Dirección borrada', en: 'Address cleared' })); }
function routeHome() { const a = store.get('addr', ''); if (!a) { toast(L({ es: 'Primero guarda tu dirección', en: 'Save your address first' })); go('home'); return; } open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(a + ', Norcasia, Caldas, Colombia'), '_blank', 'noopener'); }
function openShow() {
  const a = store.get('addr', '');
  if (!a) { toast(L({ es: 'Primero guarda tu dirección en Inicio', en: 'Save your address on Home first' })); go('home'); return; }
  $('#show-big').innerHTML = 'Buenas, disculpe. Soy nuevo en Norcasia y me perdí.<br>¿Me ayuda a llegar a esta dirección, por favor?<br><span class="small muted" style="font-family:Barlow">Hi, sorry. I\'m new in Norcasia and I\'m lost. Could you help me get to this address?</span>';
  $('#show-addr').textContent = a; $('#showcard').classList.add('on');
}
function planTrip() { const d = $('#j-to').value.trim(); if (!d) return; open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(d + ', Colombia'), '_blank', 'noopener'); }

/* ---------- Mapa (Leaflet) ---------- */
let map = null, layers = {};
const CAT_COLOR = { water: '#2D7FF9', nature: '#2FB59A', town: '#EB0A1E', help: '#0B0B0C' };
function initMap() {
  const el = $('#map'); if (!el || map || typeof window.L === 'undefined') return;
  const LF = window.L;
  map = LF.map(el, { zoomControl: true }).setView([5.565, -74.88], 12);
  LF.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap, © CARTO', subdomains: 'abcd', maxZoom: 19 }).addTo(map);
  layers = {};
  [...PLACES, ...MAP_EXTRA].forEach(p => {
    const icon = LF.divIcon({ className: '', html: `<div class="mk" style="background:${CAT_COLOR[p.cat]}"></div>`, iconSize: [16, 16], iconAnchor: [8, 8] });
    const img = PHOTO_CACHE[p.id] ? `<div style="width:220px;height:110px;border-radius:8px;background:url('${PHOTO_CACHE[p.id]}') center/cover;margin-bottom:6px"></div>` : '';
    const m = LF.marker([p.lat, p.lon], { icon }).bindPopup(`${img}<b>${esc(L(p.n))}</b>${p.ap ? ` <small>(${L({ es: 'aprox.', en: 'approx.' })})</small>` : ''}<br><span>${esc(L(p.d))}</span><br><a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}" target="_blank" rel="noopener">${L({ es: 'Cómo llegar', en: 'Directions' })}</a>`, { maxWidth: 240 });
    m._cat = p.cat; m.addTo(map); layers[p.id] = m;
  });
  setTimeout(() => map.invalidateSize(), 200);
  if (pendingPlace) { const id = pendingPlace; pendingPlace = null; setTimeout(() => focusPlace(id), 250); }
}
function mapFilter(c) {
  $$('#map-chips button').forEach(b => b.classList.toggle('on', b.dataset.c === c));
  if (!map) return;
  Object.values(layers).forEach(m => { const show = c === 'all' || m._cat === c; if (show && !map.hasLayer(m)) m.addTo(map); if (!show && map.hasLayer(m)) map.removeLayer(m); });
}
let pendingPlace = null;
function showOnMap(id) { pendingPlace = id; go('map'); if (map) { pendingPlace = null; setTimeout(() => focusPlace(id), 120); } }
function focusPlace(id) { const m = layers[id]; if (!m) return; mapFilter('all'); map.setView(m.getLatLng(), ['dorada', 'sanfelix', 'terminal'].includes(id) ? 13 : ['manso', 'guacharos', 'embalse'].includes(id) ? 13 : 15); m.openPopup(); }
function locateMe() {
  if (!navigator.geolocation) { toast(L({ es: 'Tu celular no permite ubicación', en: 'Location not available' })); return; }
  navigator.geolocation.getCurrentPosition(p => {
    if (!map) return; const ll = [p.coords.latitude, p.coords.longitude];
    window.L.circleMarker(ll, { radius: 9, color: '#fff', weight: 3, fillColor: '#2D7FF9', fillOpacity: 1 }).addTo(map).bindPopup(L({ es: 'Estás aquí', en: 'You are here' })).openPopup();
    map.setView(ll, 14);
  }, () => toast(L({ es: 'No pude obtener tu ubicación', en: 'Could not get your location' })), { enableHighAccuracy: true, timeout: 10000 });
}

/* ---------- Otras ciudades de la serie ---------- */
const HUB = 'https://haroldco45.github.io/latinos-por-el-mundo/ciudades.json';
const CITY_FALLBACK = [
  { id: 'londres', es: 'Londres', en: 'London', pais: { es: 'Reino Unido', en: 'United Kingdom' }, url: 'https://haroldco45.github.io/londres-para-latinos/' },
  { id: 'madrid', es: 'Madrid', en: 'Madrid', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/madrid-para-latinos/' },
  { id: 'bilbao', es: 'Bilbao', en: 'Bilbao', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/bilbao-para-latinos/' },
  { id: 'medellin', es: 'Medellín', en: 'Medellín', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/medellin-para-latinos/' },
  { id: 'miami', es: 'Miami', en: 'Miami', pais: { es: 'Estados Unidos', en: 'United States' }, url: 'https://haroldco45.github.io/miami-para-latinos/' },
  { id: 'nueva-york', es: 'Nueva York', en: 'New York', pais: { es: 'Estados Unidos', en: 'United States' }, url: 'https://haroldco45.github.io/nueva-york-para-latinos/' },
  { id: 'toledo', es: 'Toledo', en: 'Toledo', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/toledo-para-latinos/' },
  { id: 'leamington', es: 'Leamington', en: 'Leamington', pais: { es: 'Canadá', en: 'Canada' }, url: 'https://haroldco45.github.io/leamington-para-latinos/' },
  { id: 'hamamatsu', es: 'Hamamatsu', en: 'Hamamatsu', pais: { es: 'Japón', en: 'Japan' }, url: 'https://haroldco45.github.io/hamamatsu-para-latinos/' },
  { id: 'oizumi', es: 'Oizumi', en: 'Oizumi', pais: { es: 'Japón', en: 'Japan' }, url: 'https://haroldco45.github.io/oizumi-para-latinos/' },
  { id: 'getxo', es: 'Getxo', en: 'Getxo', pais: { es: 'España', en: 'Spain' }, url: 'https://haroldco45.github.io/getxo-para-latinos/' },
  { id: 'willemstad', es: 'Willemstad', en: 'Willemstad', pais: { es: 'Curazao', en: 'Curaçao' }, url: 'https://haroldco45.github.io/willemstad-para-latinos/' },
  { id: 'cartagena', es: 'Cartagena', en: 'Cartagena', pais: { es: 'Colombia', en: 'Colombia' }, url: 'https://haroldco45.github.io/cartagena-para-latinos/' }
];
const CITY_WIKI = { londres: 'London', madrid: 'Madrid', bilbao: 'Bilbao', medellin: 'Medellín', miami: 'Miami', 'nueva-york': 'New York City', toledo: 'Toledo, Spain', leamington: 'Leamington, Ontario', hamamatsu: 'Hamamatsu', oizumi: 'Ōizumi, Gunma', getxo: 'Getxo', willemstad: 'Willemstad', cartagena: 'Cartagena, Colombia', norcasia: 'Norcasia, Caldas' };
let CITIES = store.get('cities', CITY_FALLBACK);
const CITY_PH = store.get('cityph', {});
function renderCities() {
  const box = $('#cx'); if (!box) return;
  box.innerHTML = CITIES.filter(c => c.id !== 'norcasia').map(c => {
    const name = c[LANG] || c.es, pais = (c.pais && (c.pais[LANG] || c.pais.es)) || '';
    const bg = CITY_PH[c.id] ? `background-image:url('${CITY_PH[c.id]}');` : '';
    if (c.pronto) return `<div class="cxc soon" style="--fb:${fbColor(c.id)};${bg}"><b>${esc(name)}</b><small>${esc(pais)} · ${L({ es: 'Muy pronto', en: 'Coming soon' })}</small></div>`;
    return `<a class="cxc" style="--fb:${fbColor(c.id)};${bg}" href="${esc(c.url)}"><b>${esc(name)}</b><small>${esc(pais)}</small></a>`;
  }).join('');
}
async function loadCities() {
  try {
    const j = await getJSON(HUB + '?v=' + Date.now());
    if (j && j.ciudades && j.ciudades.length) {
      // Une la lista del hub con las ciudades conocidas que aún no estén publicadas allí
      const ids = new Set(j.ciudades.map(c => c.id));
      CITIES = j.ciudades.concat(CITY_FALLBACK.filter(c => !ids.has(c.id))); store.set('cities', CITIES);
    }
  } catch (e) {}
  renderCities();
  const need = CITIES.filter(c => !CITY_PH[c.id]);
  if (need.length) {
    const titles = need.map(c => CITY_WIKI[c.id] || c.en || c.es);
    const got = await wikiBatch(titles);
    need.forEach((c, i) => { if (got[titles[i]]) CITY_PH[c.id] = got[titles[i]]; });
    store.set('cityph', CITY_PH); renderCities();
  }
}

/* ---------- PWA ---------- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt = e; setTimeout(() => $('#install').classList.add('on'), 4000); });
$('#install-btn').addEventListener('click', async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; $('#install').classList.remove('on'); });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));

/* ---------- Arranque ---------- */
window.addEventListener('hashchange', () => go(location.hash.slice(1) || 'home'));
current = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home';
render();
$$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.v === current));
setTimeout(() => $('#splash').classList.add('off'), 900);
loadWeather(); loadFX(); loadCities();
loadPhotos().then(() => { paintPhotos(); if (map) { map.remove(); map = null; if (current === 'map') initMap(); } });
setInterval(() => { tickClock(); renderAlert(); }, 30000);
setInterval(() => { buildTicker(); renderAgenda(); }, 300000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) { tickClock(); renderAlert(); buildTicker(); renderAgenda(); loadWeather(); loadFX(); } });
